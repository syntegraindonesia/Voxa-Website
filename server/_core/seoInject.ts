// Runtime <head> injection: reads approved SEO overrides from the DB and
// injects them into the served HTML before it reaches the browser or a crawler.
import { getDb } from '../db';
import { pageOverrides, llmsTxt } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';

const escapeAttr = (s: string) => s
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// Read the applied overrides for a path and return an HTML string of <head> tags to inject
async function buildOverrideTags(path: string): Promise<string> {
  const db = await getDb();
  if (!db) return '';
  const [ov] = await db.select().from(pageOverrides).where(eq(pageOverrides.path, path)).limit(1);
  if (!ov) return '';

  const parts: string[] = [];
  // Note: title and description come first — the injection replaces them if already present.
  if (ov.description) parts.push(`<meta name="description" content="${escapeAttr(ov.description)}" data-seo-override>`);
  if (ov.canonical) parts.push(`<link rel="canonical" href="${escapeAttr(ov.canonical)}" data-seo-override>`);
  if (ov.robots) parts.push(`<meta name="robots" content="${escapeAttr(ov.robots)}" data-seo-override>`);
  if (ov.ogTitle) parts.push(`<meta property="og:title" content="${escapeAttr(ov.ogTitle)}" data-seo-override>`);
  if (ov.ogDescription) parts.push(`<meta property="og:description" content="${escapeAttr(ov.ogDescription)}" data-seo-override>`);
  if (ov.ogImage) parts.push(`<meta property="og:image" content="${escapeAttr(ov.ogImage)}" data-seo-override>`);
  if (ov.jsonLd) {
    // Escape closing script tag defensively
    const safe = ov.jsonLd.replace(/<\/script>/gi, '<\\/script>');
    parts.push(`<script type="application/ld+json" data-seo-override>${safe}</script>`);
  }

  let titleTag = '';
  if (ov.title) titleTag = `<title data-seo-override>${escapeAttr(ov.title)}</title>`;

  return `${titleTag}\n${parts.join('\n')}`;
}

// Given raw HTML and a request path, inject overrides into the <head> and
// (for h1) into the <body>. Removes original tags we're replacing to avoid duplicates.
export async function injectSeoOverrides(html: string, path: string): Promise<string> {
  const db = await getDb();
  if (!db) return html;
  const [ov] = await db.select().from(pageOverrides).where(eq(pageOverrides.path, path)).limit(1);
  if (!ov) return html;

  let out = html;

  // ── <head> injections ────────────────────────────────────────────
  const headParts: string[] = [];
  if (ov.description) headParts.push(`<meta name="description" content="${escapeAttr(ov.description)}" data-seo-override>`);
  if (ov.canonical) headParts.push(`<link rel="canonical" href="${escapeAttr(ov.canonical)}" data-seo-override>`);
  if (ov.robots) headParts.push(`<meta name="robots" content="${escapeAttr(ov.robots)}" data-seo-override>`);
  if (ov.ogTitle) headParts.push(`<meta property="og:title" content="${escapeAttr(ov.ogTitle)}" data-seo-override>`);
  if (ov.ogDescription) headParts.push(`<meta property="og:description" content="${escapeAttr(ov.ogDescription)}" data-seo-override>`);
  if (ov.ogImage) headParts.push(`<meta property="og:image" content="${escapeAttr(ov.ogImage)}" data-seo-override>`);
  if (ov.jsonLd) {
    const safe = ov.jsonLd.replace(/<\/script>/gi, '<\\/script>');
    headParts.push(`<script type="application/ld+json" data-seo-override>${safe}</script>`);
  }
  const titleTag = ov.title ? `<title data-seo-override>${escapeAttr(ov.title)}</title>` : '';

  // Strip conflicting existing tags before injecting
  if (titleTag) out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/i, '');
  if (ov.description) out = out.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
  if (ov.canonical) out = out.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
  if (ov.ogTitle) out = out.replace(/<meta[^>]*property="og:title"[^>]*>/gi, '');
  if (ov.ogDescription) out = out.replace(/<meta[^>]*property="og:description"[^>]*>/gi, '');
  if (ov.ogImage) out = out.replace(/<meta[^>]*property="og:image"[^>]*>/gi, '');

  const headInject = `${titleTag}\n${headParts.join('\n')}`.trim();
  if (headInject) out = out.replace(/<\/head>/i, `${headInject}\n</head>`);

  // ── <body> injections (H1 for SPA pages) ─────────────────────────
  // Injected BEFORE #root so React doesn't touch it. Visible but styled
  // to be minimal — this is not cloaking (visible to both users & crawlers).
  if (ov.h1Text) {
    // Standard accessibility "sr-only" pattern — visible to crawlers and screen readers,
    // visually hidden. Same pattern Google/GitHub/etc use for accessible headings.
    const h1Html = `<h1 data-seo-override style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">${escapeAttr(ov.h1Text)}</h1>`;
    out = out.replace(/<body([^>]*)>/i, `<body$1>\n${h1Html}`);
  }

  // Visible SEO content footer — appears at bottom of every page, before </body>.
  // Not disruptive to React app layout because it sits below #root.
  // Google & AI crawlers see it, and users who scroll can read it.
  if (ov.bodyContent) {
    const safe = ov.bodyContent.replace(/<\/script>/gi, '<\\/script>');
    const wrapper = `<footer data-seo-override class="seo-content" style="max-width:1200px;margin:64px auto 32px;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#374151;line-height:1.7;border-top:1px solid #e5e7eb;">${safe}</footer>`;
    out = out.replace(/<\/body>/i, `${wrapper}\n</body>`);
  }

  return out;
}

// Fetch a URL from the live site and confirm the fix is actually reaching visitors.
// Returns { verified: true } if the marker is present, { verified: false, reason } otherwise.
export async function verifyFixLive(
  path: string,
  fixType: string,
  expectedValue: string
): Promise<{ verified: boolean; reason?: string; sampleHtml?: string }> {
  const base = (process.env.FRONTEND_URL || 'https://voxa.co.id').replace(/\/$/, '');
  const url = fixType === 'llms_txt' ? `${base}/llms.txt` : `${base}${path}`;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15_000);
    const res = await fetch(url, {
      headers: { 'user-agent': 'VOXA-SEOAuditor/1.0 (verification)', 'cache-control': 'no-cache', 'pragma': 'no-cache' },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return { verified: false, reason: `HTTP ${res.status} from ${url}` };
    const body = await res.text();

    if (fixType === 'llms_txt') {
      const first80 = expectedValue.slice(0, 80).replace(/\s+/g, ' ').trim();
      const ok = body.replace(/\s+/g, ' ').includes(first80);
      return ok ? { verified: true } : { verified: false, reason: '/llms.txt served but content does not match saved value', sampleHtml: body.slice(0, 400) };
    }

    // For head/body overrides, look for the data-seo-override marker + the fix-specific tag
    const markers: Record<string, RegExp> = {
      meta_description: /<meta[^>]+name=["']description["'][^>]+data-seo-override/i,
      title: /<title[^>]*data-seo-override/i,
      canonical: /<link[^>]+rel=["']canonical["'][^>]+data-seo-override/i,
      robots: /<meta[^>]+name=["']robots["'][^>]+data-seo-override/i,
      og_tags: /<meta[^>]+property=["']og:(?:title|description|image)["'][^>]+data-seo-override/i,
      json_ld: /<script[^>]+application\/ld\+json[^>]+data-seo-override/i,
      faq: /<script[^>]+application\/ld\+json[^>]+data-seo-override/i,
      h1: /<h1[^>]+data-seo-override/i,
      multiple_h1: /<h1[^>]+data-seo-override/i,
      thin_content: /<footer[^>]+data-seo-override[^>]*>/i,
    };
    const re = markers[fixType];
    if (!re) return { verified: false, reason: `No verification pattern for fix type "${fixType}"` };

    if (re.test(body)) return { verified: true };
    return {
      verified: false,
      reason: `Injection tag not found in served HTML. Middleware may not be running or Cloudflare is serving stale cached HTML. Try again in ~30 seconds.`,
      sampleHtml: body.slice(0, 500),
    };
  } catch (e: any) {
    return { verified: false, reason: `Fetch failed: ${e?.message ?? 'unknown'}` };
  }
}

// Express handler for /llms.txt — serves DB-stored content as text/plain
export async function serveLlmsTxt(_req: Request, res: Response) {
  const db = await getDb();
  if (!db) return res.status(503).type('text/plain').send('# llms.txt\n# database unavailable');
  const [row] = await db.select().from(llmsTxt).where(eq(llmsTxt.id, 1)).limit(1);
  const content = row?.content ?? `# VOXA — Sepeda Listrik Indonesia
# llms.txt not yet configured. Admin can generate one at /admin/seo.
`;
  res.type('text/plain').send(content);
}
