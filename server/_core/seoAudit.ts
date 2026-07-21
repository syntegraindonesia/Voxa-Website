// SEO/GEO audit engine: fetches VOXA pages, parses them, extracts signals,
// scores each page, and returns findings for the admin dashboard.
import * as cheerio from 'cheerio';
import { ENV } from './env';
import { getDb } from '../db';
import { pageOverrides } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const SITE_BASE = ENV.frontendUrl.replace(/\/$/, '') || 'https://voxa.co.id';

// The 8 top-level pages we audit
export const AUDITED_PAGES = [
  { path: '/',                 name: 'Home' },
  { path: '/sepeda-listrik',   name: 'Produk Kami' },
  { path: '/compare',          name: 'Bandingkan' },
  { path: '/pemerintah',       name: 'Distributor' },
  { path: '/showroom',         name: 'Showroom' },
  { path: '/tentang',          name: 'Tentang VOXA' },
  { path: '/artikel',          name: 'Artikel' },
  { path: '/bantuan',          name: 'Bantuan' },
] as const;

export type PageFinding = {
  id: string;                       // unique id per fix (path + type)
  path: string;
  category: 'SEO' | 'GEO';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  fixType: string;                  // e.g. "meta_description", "og_tags", "product_json_ld", "alt_text", "faq", "llms_txt"
  title: string;
  issue: string;
  currentValue: string | null;      // what the page has now (null = missing)
  suggestedValue: string | null;    // proposed replacement (filled in by AI phase)
  expectedImpact: string;
};

export type PageAudit = {
  path: string;
  name: string;
  fetchedAt: string;
  ok: boolean;                      // true if fetch succeeded
  status: number;                   // HTTP status
  seoScore: number;                 // 0..100
  geoScore: number;                 // 0..100
  breakdown: {
    // SEO components
    metaTags: number;               // title/description/canonical present + right length
    headings: number;               // one H1, proper hierarchy
    images: number;                 // % of imgs with alt text
    content: number;                // word count adequate
    structuredData: number;         // any JSON-LD present
    technical: number;              // robots meta, viewport, hreflang
    // GEO components
    explicitFacts: number;          // "X costs Y" statements
    jsonLdSchema: number;           // Product/FAQ/Org schemas
    faqSections: number;            // <details> or FAQ markers
    eeatSignals: number;            // author, byline, dates
    specTables: number;             // <table> presence
    llmsTxt: number;                // 100 if file exists at root, 0 otherwise
  };
  findings: PageFinding[];
};

export type SiteAudit = {
  seoScore: number;                 // avg across pages
  geoScore: number;                 // avg across pages
  pages: PageAudit[];
  siteFindings: PageFinding[];      // site-wide fixes (e.g. missing llms.txt)
  fetchedAt: string;
};

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function fetchHtml(url: string, timeoutMs = 15_000): Promise<{ status: number; html: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': 'VOXA-SEOAuditor/1.0 (+https://voxa.co.id/admin/seo)',
        'accept': 'text/html',
      },
      signal: ctrl.signal,
    });
    const html = await res.text();
    return { status: res.status, html };
  } finally {
    clearTimeout(t);
  }
}

// ── Per-page analysis ─────────────────────────────────────────────────────────

function analyzePage(path: string, name: string, html: string, status: number, llmsTxtExists: boolean): PageAudit {
  const $ = cheerio.load(html);
  const findings: PageFinding[] = [];

  // Extract signals
  const title = $('head > title').text().trim() || null;
  const desc = $('meta[name="description"]').attr('content')?.trim() || null;
  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || null;
  const robots = $('meta[name="robots"]').attr('content')?.trim() || null;
  const viewport = $('meta[name="viewport"]').attr('content')?.trim() || null;
  const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || null;
  const ogDesc = $('meta[property="og:description"]').attr('content')?.trim() || null;
  const ogImage = $('meta[property="og:image"]').attr('content')?.trim() || null;
  const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
  const h2s = $('h2').length;
  const h3s = $('h3').length;
  const imgs = $('img');
  const imgsWithAlt = imgs.filter((_, el) => !!$(el).attr('alt')?.trim()).length;
  const totalImgs = imgs.length;
  const jsonLdBlocks: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).contents().text());
      if (Array.isArray(parsed)) jsonLdBlocks.push(...parsed);
      else jsonLdBlocks.push(parsed);
    } catch { /* malformed schema */ }
  });
  const jsonLdTypes = new Set<string>(jsonLdBlocks.map(b => b['@type']).filter(Boolean));

  // Content signals
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText ? bodyText.split(' ').length : 0;
  const hasTable = $('table').length > 0;
  const hasFaq = jsonLdTypes.has('FAQPage') || $('details, summary').length >= 2;
  const hasAuthor = $('[rel="author"], .author, [itemprop="author"]').length > 0 || jsonLdTypes.has('Person');
  // Explicit facts heuristic: numbers / prices / km / kg
  const explicitFactMatches = (bodyText.match(/\b(rp|idr)\s?[\d.,]+|\b\d+\s?(km|kg|watt|volt|amp|hari|tahun|bulan)\b/gi) || []).length;

  // ── SEO scoring ─────────────────────────────────────────────────────
  const metaTagsScore =
    (title && title.length >= 20 && title.length <= 60 ? 40 : title ? 25 : 0) +
    (desc && desc.length >= 120 && desc.length <= 160 ? 40 : desc ? 20 : 0) +
    (canonical ? 20 : 0);

  const headingsScore =
    (h1s.length === 1 ? 60 : h1s.length === 0 ? 0 : 30) +
    (h2s > 0 ? 25 : 0) +
    (h3s > 0 ? 15 : 0);

  const imagesScore = totalImgs === 0 ? 100 : Math.round((imgsWithAlt / totalImgs) * 100);

  const contentScore =
    wordCount >= 600 ? 100 :
    wordCount >= 300 ? 70 :
    wordCount >= 100 ? 40 : 15;

  const structuredDataScore =
    (jsonLdBlocks.length > 0 ? 40 : 0) +
    (jsonLdTypes.has('Organization') || jsonLdTypes.has('WebSite') ? 30 : 0) +
    (jsonLdTypes.has('BreadcrumbList') ? 30 : 0);

  const technicalScore =
    (viewport ? 40 : 0) +
    (robots && !robots.includes('noindex') ? 30 : robots?.includes('noindex') ? 0 : 25) +
    (ogTitle && ogDesc && ogImage ? 30 : ogTitle ? 15 : 0);

  const seoScore = Math.round(
    (metaTagsScore + headingsScore + imagesScore + contentScore + structuredDataScore + technicalScore) / 6
  );

  // ── GEO scoring ─────────────────────────────────────────────────────
  const explicitFactsScore = Math.min(100, explicitFactMatches * 10);
  const jsonLdSchemaScore =
    (jsonLdTypes.has('Product') ? 40 : 0) +
    (jsonLdTypes.has('FAQPage') ? 30 : 0) +
    (jsonLdTypes.has('Organization') ? 30 : 0);
  const faqSectionsScore = hasFaq ? 100 : $('details').length >= 1 ? 50 : 0;
  const eeatScore = (hasAuthor ? 60 : 0) + ($('time, [itemprop="datePublished"]').length > 0 ? 40 : 0);
  const specTablesScore = hasTable ? 100 : $('dl').length > 0 ? 60 : 0;
  const llmsTxtScore = llmsTxtExists ? 100 : 0;

  const geoScore = Math.round(
    (explicitFactsScore + jsonLdSchemaScore + faqSectionsScore + eeatScore + specTablesScore + llmsTxtScore) / 6
  );

  // ── Findings (per-page fixes) ───────────────────────────────────────
  if (!desc) {
    findings.push({
      id: `${path}::meta_description`,
      path, category: 'SEO', severity: 'HIGH',
      fixType: 'meta_description',
      title: `Halaman ${name} tidak memiliki meta description`,
      issue: 'Google akan generate description sendiri, biasanya tidak optimal untuk CTR. Meta description yang baik meningkatkan click-through rate dari hasil pencarian.',
      currentValue: null,
      suggestedValue: null, // filled by AI phase
      expectedImpact: `Estimasi +8-15% CTR dari Google Search. Meningkatkan skor SEO halaman ${name} sebesar ~15 poin.`,
    });
  } else if (desc.length < 80 || desc.length > 170) {
    findings.push({
      id: `${path}::meta_description_length`,
      path, category: 'SEO', severity: 'MEDIUM',
      fixType: 'meta_description',
      title: `Meta description halaman ${name} panjangnya tidak optimal (${desc.length} karakter)`,
      issue: `Meta description saat ini ${desc.length} karakter. Ideal 120-160 karakter — pendek terpotong tampilan, panjang dipotong Google.`,
      currentValue: desc,
      suggestedValue: null,
      expectedImpact: 'Meningkatkan tampilan snippet di hasil Google.',
    });
  }

  if (!title) {
    findings.push({
      id: `${path}::title`,
      path, category: 'SEO', severity: 'HIGH',
      fixType: 'title',
      title: `Halaman ${name} tidak punya <title>`,
      issue: '<title> adalah faktor SEO paling penting. Tanpa title, Google akan tampilkan URL sebagai judul.',
      currentValue: null,
      suggestedValue: null,
      expectedImpact: 'Skor SEO naik ~20 poin.',
    });
  }

  if (h1s.length === 0) {
    findings.push({
      id: `${path}::h1`,
      path, category: 'SEO', severity: 'HIGH',
      fixType: 'h1',
      title: `Halaman ${name} tidak punya H1`,
      issue: 'H1 memberitahu Google topik utama halaman. Harus ada tepat satu H1 per halaman.',
      currentValue: null,
      suggestedValue: null,
      expectedImpact: 'Skor SEO naik ~10 poin.',
    });
  } else if (h1s.length > 1) {
    findings.push({
      id: `${path}::multiple_h1`,
      path, category: 'SEO', severity: 'MEDIUM',
      fixType: 'h1',
      title: `${h1s.length} H1 tag di halaman ${name}`,
      issue: 'Idealnya hanya ada satu H1 per halaman. Multiple H1 membingungkan search engine tentang topik utama.',
      currentValue: h1s.join(' | '),
      suggestedValue: null,
      expectedImpact: 'Skor SEO naik ~5 poin.',
    });
  }

  if (totalImgs > 0 && imgsWithAlt < totalImgs) {
    const missing = totalImgs - imgsWithAlt;
    findings.push({
      id: `${path}::alt_text`,
      path, category: 'SEO', severity: missing > 5 ? 'HIGH' : 'MEDIUM',
      fixType: 'alt_text',
      title: `${missing} gambar di halaman ${name} kekurangan alt text`,
      issue: 'Alt text penting untuk Google Image Search & aksesibilitas. Screen readers tidak bisa membaca gambar tanpa alt.',
      currentValue: `${imgsWithAlt}/${totalImgs} gambar punya alt`,
      suggestedValue: null,
      expectedImpact: `Skor Images naik dari ${imagesScore} → 100. Berpotensi traffic dari image search.`,
    });
  }

  if (!ogTitle || !ogDesc || !ogImage) {
    findings.push({
      id: `${path}::og_tags`,
      path, category: 'SEO', severity: 'MEDIUM',
      fixType: 'og_tags',
      title: `OpenGraph tags belum lengkap di halaman ${name}`,
      issue: 'Tanpa OpenGraph tags, link yang di-share di WhatsApp/Instagram/Facebook tidak tampil dengan thumbnail dan preview yang menarik.',
      currentValue: [ogTitle && 'og:title', ogDesc && 'og:description', ogImage && 'og:image'].filter(Boolean).join(', ') || 'kosong',
      suggestedValue: null,
      expectedImpact: 'Meningkatkan CTR ketika halaman dishare di sosial media.',
    });
  }

  if (jsonLdBlocks.length === 0) {
    findings.push({
      id: `${path}::json_ld`,
      path, category: 'GEO', severity: 'HIGH',
      fixType: 'json_ld',
      title: `Halaman ${name} tidak punya JSON-LD structured data`,
      issue: 'JSON-LD adalah cara AI assistants (ChatGPT, Claude, Perplexity) extract fakta dari halaman. Tanpa ini, halaman jarang jadi sumber jawaban AI.',
      currentValue: null,
      suggestedValue: null,
      expectedImpact: `Skor GEO ${name} naik dari ${geoScore} → ~85. Berpotensi muncul di AI chatbot answers.`,
    });
  }

  if (!hasFaq && (path === '/bantuan' || path === '/sepeda-listrik')) {
    findings.push({
      id: `${path}::faq`,
      path, category: 'GEO', severity: 'MEDIUM',
      fixType: 'faq',
      title: `Tambahkan FAQ section di halaman ${name}`,
      issue: 'AI assistants suka format Q&A. FAQPage JSON-LD schema membantu AI extract pertanyaan+jawaban.',
      currentValue: null,
      suggestedValue: null,
      expectedImpact: 'Skor GEO naik ~20 poin. Berpotensi muncul di Google People Also Ask.',
    });
  }

  if (wordCount < 300) {
    findings.push({
      id: `${path}::thin_content`,
      path, category: 'SEO', severity: 'MEDIUM',
      fixType: 'thin_content',
      title: `Halaman ${name} kontennya tipis (${wordCount} kata)`,
      issue: 'Halaman dengan konten kurang dari 300 kata sulit rank di Google. Konten pendek juga tidak dianggap otoritatif oleh AI.',
      currentValue: `${wordCount} kata`,
      suggestedValue: null,
      expectedImpact: 'Konten 600+ kata biasanya rank 2-3x lebih baik.',
    });
  }

  return {
    path,
    name,
    fetchedAt: new Date().toISOString(),
    ok: status >= 200 && status < 400,
    status,
    seoScore,
    geoScore,
    breakdown: {
      metaTags: metaTagsScore,
      headings: headingsScore,
      images: imagesScore,
      content: contentScore,
      structuredData: structuredDataScore,
      technical: technicalScore,
      explicitFacts: explicitFactsScore,
      jsonLdSchema: jsonLdSchemaScore,
      faqSections: faqSectionsScore,
      eeatSignals: eeatScore,
      specTables: specTablesScore,
      llmsTxt: llmsTxtScore,
    },
    findings,
  };
}

// ── Site-wide audit ──────────────────────────────────────────────────────────

export async function runSiteAudit(): Promise<SiteAudit> {
  // Check if /llms.txt exists
  let llmsTxtExists = false;
  try {
    const r = await fetch(`${SITE_BASE}/llms.txt`, { headers: { 'user-agent': 'VOXA-SEOAuditor/1.0' } });
    llmsTxtExists = r.ok && r.headers.get('content-type')?.includes('text') === true;
  } catch { /* not present */ }

  const pageAudits: PageAudit[] = [];
  for (const { path, name } of AUDITED_PAGES) {
    try {
      const { status, html } = await fetchHtml(`${SITE_BASE}${path}`);
      pageAudits.push(analyzePage(path, name, html, status, llmsTxtExists));
    } catch (e: any) {
      pageAudits.push({
        path, name,
        fetchedAt: new Date().toISOString(),
        ok: false, status: 0,
        seoScore: 0, geoScore: 0,
        breakdown: {
          metaTags: 0, headings: 0, images: 0, content: 0, structuredData: 0, technical: 0,
          explicitFacts: 0, jsonLdSchema: 0, faqSections: 0, eeatSignals: 0, specTables: 0, llmsTxt: 0,
        },
        findings: [{
          id: `${path}::fetch_error`,
          path, category: 'SEO', severity: 'HIGH',
          fixType: 'fetch_error',
          title: `Gagal fetch halaman ${name}`,
          issue: `Fetch error: ${e?.message ?? 'unknown'}`,
          currentValue: null, suggestedValue: null,
          expectedImpact: 'Perlu investigasi manual.',
        }],
      });
    }
  }

  // Site-wide findings
  const siteFindings: PageFinding[] = [];
  if (!llmsTxtExists) {
    siteFindings.push({
      id: `site::llms_txt`,
      path: '/llms.txt',
      category: 'GEO',
      severity: 'MEDIUM',
      fixType: 'llms_txt',
      title: 'Belum ada file /llms.txt di root domain',
      issue: 'llms.txt adalah standar baru (seperti robots.txt tapi untuk AI crawlers). Membantu ChatGPT, Claude, Perplexity memahami peta konten Anda.',
      currentValue: null,
      suggestedValue: null,
      expectedImpact: 'Skor GEO seluruh site naik ~10 poin. Meningkatkan visibility di AI search.',
    });
  }

  // Apply override state — if a fix has already been applied, remove it from findings
  const db = await getDb();
  const appliedByPath = new Map<string, any>();
  if (db) {
    const rows = await db.select().from(pageOverrides);
    for (const r of rows) appliedByPath.set(r.path, r);
  }
  for (const p of pageAudits) {
    const ov = appliedByPath.get(p.path);
    if (!ov) continue;
    p.findings = p.findings.filter(f => {
      if (f.fixType === 'meta_description' && ov.description) return false;
      if (f.fixType === 'title' && ov.title) return false;
      if (f.fixType === 'og_tags' && ov.ogTitle && ov.ogDescription && ov.ogImage) return false;
      if (f.fixType === 'json_ld' && ov.jsonLd) return false;
      return true;
    });
  }

  const seoScore = Math.round(pageAudits.reduce((s, p) => s + p.seoScore, 0) / pageAudits.length);
  const geoScore = Math.round(pageAudits.reduce((s, p) => s + p.geoScore, 0) / pageAudits.length);

  return {
    seoScore,
    geoScore,
    pages: pageAudits,
    siteFindings,
    fetchedAt: new Date().toISOString(),
  };
}
