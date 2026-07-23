import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { seoAudits, pageOverrides, seoFixHistory, llmsTxt } from '../../drizzle/schema';
import { runSiteAudit, AUDITED_PAGES, PAGE_CONTEXT, type SiteAudit, type PageFinding } from '../_core/seoAudit';
import { verifyFixLive } from '../_core/seoInject';
import { invokeLLM } from '../_core/llm';

// ── AI fix suggestions ───────────────────────────────────────────────────────

async function enrichFindingsWithAi(audit: SiteAudit): Promise<SiteAudit> {
  const allFindings = [
    ...audit.siteFindings,
    ...audit.pages.flatMap(p => p.findings),
  ];
  if (allFindings.length === 0) return audit;

  // Batch prompt to DeepSeek/Claude to fill suggestedValue for each finding.
  const prompt = allFindings.map((f, i) => `${i + 1}. Path: ${f.path} | Type: ${f.fixType} | Issue: ${f.title}${f.currentValue ? ` | Current: ${f.currentValue.slice(0, 200)}` : ''}`).join('\n');

  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: `You are an SEO/GEO expert for VOXA, an Indonesian electric bicycle brand (voxa.co.id).
For each finding, generate a specific fix in Bahasa Indonesia (or bilingual where natural) that will be applied to the page.
Rules:
- meta_description: 120-160 characters, include brand "VOXA", mention product category, natural language
- title: 30-60 characters, unique per page, keyword-focused
- og_tags: return JSON with { title, description, image (use https://voxa.co.id/logo.png as default) }
- json_ld: return valid JSON-LD schema block appropriate for the page (Organization for /, Product for /sepeda-listrik, etc.)
- alt_text: for alt_text fixes, return "AUTO" (we handle this in a separate pass)
- faq: return a JSON array of {question, answer} pairs (5-8 items)
- llms_txt: return the full markdown-formatted llms.txt content
- thin_content: return "MANUAL" (needs human)
- h1, fetch_error: return "MANUAL"
Return JSON: {"fixes": [{"id": "<original finding id>", "suggestedValue": <string or object>}]}`,
      },
      {
        role: 'user',
        content: `Generate fixes for these ${allFindings.length} findings:\n\n${prompt}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  try {
    const content = response.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
    const byId = new Map<string, any>();
    for (const f of parsed.fixes ?? []) byId.set(f.id, f.suggestedValue);

    for (const f of audit.siteFindings) {
      const s = byId.get(f.id);
      if (s !== undefined) f.suggestedValue = typeof s === 'string' ? s : JSON.stringify(s);
    }
    for (const p of audit.pages) {
      for (const f of p.findings) {
        const s = byId.get(f.id);
        if (s !== undefined) f.suggestedValue = typeof s === 'string' ? s : JSON.stringify(s);
      }
    }
  } catch (_e) {
    // AI failed; findings still returned without suggestions
  }
  return audit;
}

// ── Router ──────────────────────────────────────────────────────────────────

export const seoRouter = router({
  // Read the latest cached audit
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await getDb();
    if (!db) return null;
    const [row] = await db.select().from(seoAudits).orderBy(desc(seoAudits.createdAt)).limit(1);
    if (!row) return null;
    return { ...row, data: JSON.parse(row.data) as SiteAudit };
  }),

  // Run a fresh full-site audit + AI fix generation. Caches result.
  runAudit: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });

    let audit = await runSiteAudit();
    try {
      audit = await enrichFindingsWithAi(audit);
    } catch (_e) { /* AI optional */ }

    await db.insert(seoAudits).values({
      seoScore: audit.seoScore,
      geoScore: audit.geoScore,
      data: JSON.stringify(audit),
    });
    return audit;
  }),

  // Lazy: generate an AI suggestion for a single finding on demand
  suggestFix: protectedProcedure
    .input(z.object({
      path: z.string(),
      fixType: z.string(),
      title: z.string(),
      issue: z.string(),
      currentValue: z.string().nullable(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });

      const rules: Record<string, string> = {
        meta_description: 'Return a meta description in Bahasa Indonesia, 120-160 characters, includes "VOXA", mentions product/category. Return just the plain text string.',
        title: 'Return a page <title> in Bahasa Indonesia, 30-60 characters, keyword-focused, includes "VOXA". Return just the plain text.',
        og_tags: 'Return a JSON object: {"title": "...", "description": "...", "image": "https://voxa.co.id/logo.png"}. Title max 60 chars, description max 160 chars.',
        json_ld: `Return a valid JSON-LD schema block appropriate for this page. For "/" use Organization. For "/sepeda-listrik" use ItemList of Products. For "/artikel" use Blog. For "/showroom" use LocalBusiness. Return the raw JSON object without wrapping in <script>.`,
        faq: 'Return a JSON-LD FAQPage schema with 5-8 realistic Q&A entries about VOXA electric bicycles in Bahasa Indonesia. Return the raw JSON object.',
        llms_txt: `Return the full markdown content for /llms.txt for voxa.co.id. Include sections: # VOXA, Overview, Products, Categories (with markdown links to /sepeda-listrik, /baterai, /sparepart, /artikel, /showroom, /tentang, /bantuan, /pemerintah, /compare, /distributor-voxa), Optional links.`,
        canonical: 'Return the canonical URL for this page (starts with https://voxa.co.id). Return just the URL.',
        robots: 'Return "index, follow" unless the page should be excluded.',
        h1: 'Return a short, keyword-rich H1 (30-70 chars) in Bahasa Indonesia for this page. Include the primary topic. Include "VOXA" naturally. Return just plain text.',
        multiple_h1: 'Return a single consolidated H1 (30-70 chars) to replace the multiple H1s on this page. Return just plain text.',
        organization_schema: `Return a JSON-LD Organization schema for VOXA. Include these REAL facts (do not invent ratings/reviews):
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VOXA",
  "legalName": "PT Voxa Indo Nusa",
  "url": "https://voxa.co.id",
  "logo": "https://voxa.co.id/logo.png",
  "description": "VOXA adalah brand sepeda listrik asli Indonesia sejak 2022, memproduksi kendaraan listrik berkualitas di Balaraja, Tangerang.",
  "foundingDate": "2022",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kawasan Industri Benua Permai Lestari",
    "addressLocality": "Balaraja",
    "addressRegion": "Banten",
    "addressCountry": "ID"
  },
  "sameAs": ["https://instagram.com/voxa.id", "https://facebook.com/voxa.id"],
  "areaServed": "Indonesia"
}
Return the full JSON object. Do NOT wrap in <script>.`,
        breadcrumb_schema: `Return a JSON-LD BreadcrumbList schema for this page. Path segments become list items. First item is always "Beranda" at https://voxa.co.id. For "/tentang" the breadcrumb is Beranda > Tentang VOXA. Structure:
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://voxa.co.id"},
    {"@type": "ListItem", "position": 2, "name": "<page name in Indonesian>", "item": "https://voxa.co.id<path>"}
  ]
}
Return the full JSON. Do NOT wrap in <script>.`,
        website_schema: `Return a JSON-LD WebSite schema for the VOXA homepage with a SearchAction. Structure:
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "VOXA",
  "alternateName": "VOXA Indonesia",
  "url": "https://voxa.co.id",
  "description": "Sepeda listrik asli Indonesia — commuter cerdas, hemat, dan ramah lingkungan.",
  "publisher": {"@type": "Organization", "name": "VOXA", "url": "https://voxa.co.id"},
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://voxa.co.id/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
Return the full JSON. Do NOT wrap in <script>.`,
        thin_content: 'DIRECT_WRITE_MODE',
        thin_content: 'Return "MANUAL" — content rewrites require human review.',
        alt_text: 'Return "AUTO" — alt text handled in a bulk pass.',
      };
      const rule = rules[input.fixType] || 'Return a specific fix in JSON or plain text.';

      // Special handling for thin_content: use a dedicated short prompt with a
      // concrete Bahasa Indonesia example so DeepSeek writes real content
      // instead of returning meta-instructions. Bypass json_object format because
      // it was making DeepSeek wrap responses in {fix_type,location,content}.
      let response;
      if (input.fixType === 'thin_content') {
        const ctx = PAGE_CONTEXT[input.path];
        if (!ctx) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Halaman ${input.path} tidak dikenal — konten SEO harus ditulis manual.` });
        }
        const otherPagePath = Object.keys(PAGE_CONTEXT).find(p => p !== input.path) ?? '/';
        response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `You are an Indonesian SEO copywriter. Your job: write UNIQUE Bahasa Indonesia HTML content for one specific page of voxa.co.id (VOXA — Indonesian electric bicycle brand).

CRITICAL — Output rules:
- Return a JSON object with exactly ONE field: {"value": "<h2>...</h2>..."}
- The "value" field contains raw HTML in Bahasa Indonesia — nothing else
- Allowed tags only: h2, h3, p, ul, li, a, strong, em
- FORBIDDEN: script, iframe, style, form, position:absolute, display:none, left:-9999px, hidden content tricks, English content
- FORBIDDEN: writing about what the code should do — you write the actual USER-FACING content
- The content will be shown to real users in a visible section on the page`,
            },
            {
              role: 'user',
              content: `Write UNIQUE Bahasa Indonesia SEO content for exactly this page: ${input.path}

Page context:
- Purpose: ${ctx.purpose}
- Topic: ${ctx.topic}
- Target keywords: ${ctx.targetKeywords.join(', ')}
- Content angle: ${ctx.contentAngle}
- Internal links to include (must appear as <a href="X">text</a>): ${ctx.linkTo.join(', ')}
- Topics to AVOID (they belong to other pages): ${ctx.avoidTopics.join('; ')}

Length: 400-500 words. Structure: 1 <h2> heading + 2-3 <h3> subheadings + <p> paragraphs + 1 <ul> bulleted list.

EXAMPLE of correct output format (for a different page — DO NOT copy this content):

{"value": "<h2>Contoh Heading Halaman Lain</h2><p>Ini adalah contoh paragraf pertama tentang topik halaman lain. Konten harus dalam Bahasa Indonesia dan spesifik untuk halaman terkait.</p><h3>Subheading Pertama</h3><p>Paragraf isi dengan link internal seperti <a href=\\"${otherPagePath}\\">nama halaman</a> yang natural.</p><ul><li>Poin pertama</li><li>Poin kedua</li></ul>"}

Now generate the ACTUAL Bahasa Indonesia content for ${input.path} following the same JSON format. Return ONLY the JSON object.`,
            },
          ],
          response_format: { type: 'json_object' },
        });
      } else {
        response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `You are an SEO/GEO expert for VOXA (voxa.co.id), an Indonesian electric bicycle brand. Generate specific, ready-to-apply fixes. Rule for ${input.fixType}: ${rule}`,
            },
            {
              role: 'user',
              content: `Page path: ${input.path}\nIssue: ${input.title}\nDetail: ${input.issue}${input.currentValue ? `\nCurrent value: ${input.currentValue}` : ''}\n\nGenerate the fix. Return JSON: {"value": <string or object>}`,
            },
          ],
          response_format: { type: 'json_object' },
        });
      }

      const content = response.choices[0]?.message?.content ?? '';
      if (!content) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'AI mengembalikan respons kosong' });
      }
      const raw = typeof content === 'string' ? content : JSON.stringify(content);

      // Robust extraction — DeepSeek sometimes wraps HTML fixes in meta JSON like
      // {fix_type,location,content} even when the prompt asks for {value}. Try in order:
      // 1. Parsed JSON with `value` field
      // 2. Parsed JSON with `content`, `html`, or `body` field (common wrapper shapes)
      // 3. Any HTML fragment embedded in the raw response text
      // 4. The raw response as-is
      let parsed: any = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Not JSON — try to strip code fences and use the text directly
        const stripped = raw.trim().replace(/^```(?:json|html)?/i, '').replace(/```$/, '').trim();
        return { suggestion: stripped || '' };
      }

      // For structured JSON responses (JSON-LD, og_tags), the whole parsed object is the fix.
      // For HTML fixes wrapped in a meta shape, dig into value/content/html/body fields.
      const jsonLdFixTypes = new Set(['json_ld', 'faq', 'organization_schema', 'breadcrumb_schema', 'website_schema']);
      const looksLikeJsonLd = jsonLdFixTypes.has(input.fixType);

      // Look for any string field that starts with '<' — that's very likely the HTML content
      const extractHtmlFromWrapper = (obj: any): string | null => {
        if (typeof obj !== 'object' || obj === null) return null;
        for (const key of ['value', 'content', 'html', 'body', 'seo_content']) {
          const v = obj[key];
          if (typeof v === 'string' && v.trim().startsWith('<')) return v;
        }
        // Fall back to first string field that looks like HTML
        for (const key of Object.keys(obj)) {
          const v = obj[key];
          if (typeof v === 'string' && /<[a-z][^>]*>/i.test(v) && !/^inject_|^index\.html/i.test(v)) return v;
        }
        return null;
      };

      if (looksLikeJsonLd) {
        // Return the whole JSON object as the suggestion (that IS the JSON-LD schema)
        const v = parsed?.value ?? parsed;
        return { suggestion: typeof v === 'string' ? v : JSON.stringify(v, null, 2) };
      }

      // For HTML fixes: prefer the value field, else look for HTML in wrapper fields
      const v = parsed?.value;
      let suggestion = typeof v === 'string' && v.trim() ? v : extractHtmlFromWrapper(parsed);

      if (!suggestion) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'AI mengembalikan format yang tidak dikenali. Coba klik "Buat Saran AI" lagi, atau isi manual.',
        });
      }

      // Quality sanity check specifically for thin_content — reject responses that
      // are English meta-instructions or use cloaking tricks. Force user to retry.
      if (input.fixType === 'thin_content') {
        const looksLikeCloaking = /left\s*:\s*-?\d{3,}px|position\s*:\s*absolute\s*;\s*left\s*:|display\s*:\s*none|visibility\s*:\s*hidden|aria-hidden\s*=\s*["']true/i.test(suggestion);
        if (looksLikeCloaking) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AI menyarankan hidden content (cloaking) yang bisa kena penalty Google. Coba klik "Buat Saran AI" lagi.',
          });
        }
        const looksLikeInstructions = /^(inject|the footer|should be|include:|example:|use css)/i.test(suggestion.trim());
        if (looksLikeInstructions) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AI mengembalikan instruksi bukan konten. Coba klik "Buat Saran AI" lagi.',
          });
        }
        // Must start with an HTML tag, not English prose
        if (!suggestion.trim().startsWith('<')) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AI tidak mengembalikan HTML valid. Coba klik "Buat Saran AI" lagi.',
          });
        }
        // Heuristic: too much English relative to length usually means AI wrote English by accident
        const englishWords = (suggestion.match(/\b(the|and|with|for|should|footer|hidden|include|content|example|inject|shell)\b/gi) || []).length;
        const totalWords = suggestion.replace(/<[^>]+>/g, '').split(/\s+/).length;
        if (totalWords > 20 && englishWords / totalWords > 0.1) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AI menulis dalam bahasa Inggris, bukan Indonesia. Coba klik "Buat Saran AI" lagi.',
          });
        }
      }

      return { suggestion };
    }),

  // Approve a single fix — writes to pageOverrides and logs history
  applyFix: protectedProcedure
    .input(z.object({
      findingId: z.string(),
      path: z.string(),
      fixType: z.string(),
      value: z.string(),           // final value (user may have edited from AI suggestion)
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });

      // Fetch existing override (for history diff)
      const [existing] = await db.select().from(pageOverrides).where(eq(pageOverrides.path, input.path)).limit(1);
      const before: Record<string, any> = existing ? { ...existing } : {};

      // Map fixType to override columns
      const updates: Record<string, any> = { path: input.path };
      if (input.fixType === 'meta_description') updates.description = input.value;
      else if (input.fixType === 'title') updates.title = input.value;
      else if (input.fixType === 'og_tags') {
        try {
          const og = JSON.parse(input.value);
          updates.ogTitle = og.title ?? og.ogTitle;
          updates.ogDescription = og.description ?? og.ogDescription;
          updates.ogImage = og.image ?? og.ogImage;
          if (!updates.ogTitle && !updates.ogDescription && !updates.ogImage) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'og_tags JSON harus punya minimal 1 dari: title, description, image' });
          }
        } catch (e) {
          if (e instanceof TRPCError) throw e;
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'og_tags value harus JSON valid: {"title":"...","description":"...","image":"..."}' });
        }
      }
      else if (input.fixType === 'json_ld' || input.fixType === 'faq') {
        // Validate JSON syntax so we don't inject broken schema into <head>
        try {
          const parsed = JSON.parse(input.value);
          // Re-stringify to normalize whitespace
          updates.jsonLd = JSON.stringify(parsed);
        } catch (_e) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'JSON-LD tidak valid — periksa syntax JSON kamu (kurung kurawal, koma, quote)' });
        }
      }
      else if (input.fixType === 'organization_schema') {
        try { updates.organizationSchema = JSON.stringify(JSON.parse(input.value)); }
        catch { throw new TRPCError({ code: 'BAD_REQUEST', message: 'Organization schema JSON tidak valid' }); }
      }
      else if (input.fixType === 'breadcrumb_schema') {
        try { updates.breadcrumbSchema = JSON.stringify(JSON.parse(input.value)); }
        catch { throw new TRPCError({ code: 'BAD_REQUEST', message: 'BreadcrumbList schema JSON tidak valid' }); }
      }
      else if (input.fixType === 'website_schema') {
        try { updates.websiteSchema = JSON.stringify(JSON.parse(input.value)); }
        catch { throw new TRPCError({ code: 'BAD_REQUEST', message: 'WebSite schema JSON tidak valid' }); }
      }
      else if (input.fixType === 'canonical') updates.canonical = input.value;
      else if (input.fixType === 'robots') updates.robots = input.value;
      else if (input.fixType === 'h1' || input.fixType === 'multiple_h1') updates.h1Text = input.value;
      else if (input.fixType === 'thin_content') {
        // Guard against wrapper JSON leaking through (AI sometimes returns
        // {fix_type,location,content} shape instead of raw HTML). Refuse if
        // the value looks like JSON rather than starting with an HTML tag.
        const trimmed = input.value.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Konten yang kamu kirim adalah JSON, bukan HTML. Klik "Buat Saran AI" lagi — sistem akan extract HTML-nya. Atau isi manual dengan tag <h2>, <p>, dll.',
          });
        }

        // Reject genuinely dangerous script-executing / form-submitting tags.
        // Note: we DO NOT block <body>, <html>, <head> here because AI-written
        // descriptive text can legitimately mention them. The injection middleware
        // wraps the content in a scoped <section> anyway so any structural tags
        // in the content wouldn't affect the document structure.
        const dangerous = /<(script|iframe|object|embed|form)\b/i;
        if (dangerous.test(input.value)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Konten SEO hanya boleh pakai tag: h2, h3, p, ul, li, a, strong, em, br. Tag script/iframe/form tidak diizinkan (bisa mengeksekusi kode berbahaya).',
          });
        }

        // Check for genuinely inline style attributes that could break layout.
        // But allow "style=" descriptive text as long as it's inside a <style> tag,
        // which we already block above.
        if (/<style\b/i.test(input.value)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Tag <style> tidak diizinkan — bisa mengganggu CSS global halaman.',
          });
        }
        // Check for reasonably balanced open/close tags on major blocks
        const opens = (input.value.match(/<(h2|h3|p|ul|li)\b/gi) || []).length;
        const closes = (input.value.match(/<\/(h2|h3|p|ul|li)>/gi) || []).length;
        if (Math.abs(opens - closes) > 2) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `HTML tidak seimbang (${opens} tag terbuka vs ${closes} tag tertutup). Setiap <h2>, <h3>, <p>, <ul>, <li> harus punya tag penutup.`,
          });
        }
        // Duplicate content safeguard — refuse if same value already applied on another path.
        // This prevents accidental copy-paste of identical footer text across pages, which
        // Google penalizes as duplicate content.
        const normalize = (s: string) => s.replace(/\s+/g, ' ').toLowerCase().slice(0, 500);
        const incomingNorm = normalize(input.value);
        const otherRows = await db.select().from(pageOverrides);
        for (const other of otherRows) {
          if (other.path === input.path) continue;
          if (other.bodyContent && normalize(other.bodyContent) === incomingNorm) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Konten identik sudah diterapkan di halaman "${other.path}". Google penalize duplicate content — tiap halaman harus punya konten UNIK. Klik "Buat Saran AI" untuk generate konten khusus untuk ${input.path}.`,
            });
          }
        }
        updates.bodyContent = input.value;
      }
      else if (input.fixType === 'llms_txt') {
        // Special case: writes to llmsTxt table, not pageOverrides
        await db.insert(llmsTxt).values({ id: 1, content: input.value }).onDuplicateKeyUpdate({ set: { content: input.value } });
        await db.insert(seoFixHistory).values({
          path: '/llms.txt', fixType: 'llms_txt',
          beforeValue: null, afterValue: input.value,
        });
        // Wait 1s for any propagation, then verify
        await new Promise(r => setTimeout(r, 1000));
        const v = await verifyFixLive('/llms.txt', 'llms_txt', input.value);
        return { success: true, verified: v.verified, verificationReason: v.reason };
      }

      if (existing) {
        await db.update(pageOverrides).set(updates).where(eq(pageOverrides.path, input.path));
      } else {
        await db.insert(pageOverrides).values(updates as any);
      }

      await db.insert(seoFixHistory).values({
        path: input.path,
        fixType: input.fixType,
        beforeValue: JSON.stringify(before),
        afterValue: input.value,
      });

      // Verify the fix is actually reaching visitors on the served HTML
      await new Promise(r => setTimeout(r, 1000));
      const v = await verifyFixLive(input.path, input.fixType, input.value);
      return { success: true, verified: v.verified, verificationReason: v.reason };
    }),

  // Batch re-verify all applied overrides against the live site
  verifyAllApplied: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });

    const rows = await db.select().from(pageOverrides);
    const results: Array<{ path: string; fixType: string; verified: boolean; reason?: string }> = [];

    for (const r of rows) {
      const checks: Array<{ fixType: string; value: string | null }> = [
        { fixType: 'title', value: r.title },
        { fixType: 'meta_description', value: r.description },
        { fixType: 'canonical', value: r.canonical },
        { fixType: 'robots', value: r.robots },
        { fixType: 'h1', value: r.h1Text },
        { fixType: 'thin_content', value: r.bodyContent },
        { fixType: 'og_tags', value: r.ogTitle || r.ogDescription || r.ogImage ? 'og' : null },
        { fixType: 'json_ld', value: r.jsonLd },
        { fixType: 'organization_schema', value: r.organizationSchema },
        { fixType: 'breadcrumb_schema', value: r.breadcrumbSchema },
        { fixType: 'website_schema', value: r.websiteSchema },
      ];
      for (const c of checks) {
        if (!c.value) continue;
        const v = await verifyFixLive(r.path, c.fixType, c.value);
        results.push({ path: r.path, fixType: c.fixType, verified: v.verified, reason: v.reason });
      }
    }

    // Also check llms.txt
    const [ltx] = await db.select().from(llmsTxt).where(eq(llmsTxt.id, 1)).limit(1);
    if (ltx?.content) {
      const v = await verifyFixLive('/llms.txt', 'llms_txt', ltx.content);
      results.push({ path: '/llms.txt', fixType: 'llms_txt', verified: v.verified, reason: v.reason });
    }

    return { results, checkedAt: new Date().toISOString() };
  }),

  // Revert an applied fix
  revertFix: protectedProcedure
    .input(z.object({ path: z.string(), fixType: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });

      if (input.fixType === 'llms_txt') {
        await db.delete(llmsTxt).where(eq(llmsTxt.id, 1));
        return { success: true };
      }

      // Clear the specific column
      const clear: Record<string, any> = {};
      if (input.fixType === 'meta_description') clear.description = null;
      else if (input.fixType === 'title') clear.title = null;
      else if (input.fixType === 'og_tags') { clear.ogTitle = null; clear.ogDescription = null; clear.ogImage = null; }
      else if (input.fixType === 'json_ld' || input.fixType === 'faq') clear.jsonLd = null;
      else if (input.fixType === 'canonical') clear.canonical = null;
      else if (input.fixType === 'robots') clear.robots = null;
      else if (input.fixType === 'h1' || input.fixType === 'multiple_h1') clear.h1Text = null;
      else if (input.fixType === 'thin_content') clear.bodyContent = null;
      else if (input.fixType === 'organization_schema') clear.organizationSchema = null;
      else if (input.fixType === 'breadcrumb_schema') clear.breadcrumbSchema = null;
      else if (input.fixType === 'website_schema') clear.websiteSchema = null;

      await db.update(pageOverrides).set(clear).where(eq(pageOverrides.path, input.path));
      return { success: true };
    }),

  // One-time cleanup: delete duplicate seoFixHistory rows for the same
  // (path, fixType, afterValue), keeping only the most recent entry.
  // Called automatically once on first load; safe to re-run.
  cleanupDuplicateHistory: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'DB unavailable' });

    const rows = await db.select().from(seoFixHistory).orderBy(desc(seoFixHistory.appliedAt));
    const seen = new Set<string>();
    let deleted = 0;
    for (const r of rows) {
      const key = `${r.path}::${r.fixType}::${r.afterValue ?? ''}`;
      if (seen.has(key)) {
        await db.delete(seoFixHistory).where(eq(seoFixHistory.id, r.id));
        deleted++;
      } else {
        seen.add(key);
      }
    }
    return { deleted };
  }),

  // Fix history log
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(200).default(50) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const db = await getDb();
      if (!db) return [];
      return db.select().from(seoFixHistory).orderBy(desc(seoFixHistory.appliedAt)).limit(input.limit);
    }),

  // Get current llms.txt content
  getLlmsTxt: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await getDb();
    if (!db) return { content: '' };
    const [row] = await db.select().from(llmsTxt).where(eq(llmsTxt.id, 1)).limit(1);
    return { content: row?.content ?? '' };
  }),

  // List every currently-active override across the site — powers the "Applied Fixes" section
  getAppliedOverrides: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(pageOverrides).orderBy(desc(pageOverrides.updatedAt));
    // Flatten to one entry per applied fix type (a single row may have multiple fields set)
    const out: Array<{
      path: string;
      fixType: string;
      label: string;
      value: string;
      updatedAt: Date;
    }> = [];
    for (const r of rows) {
      const pushIf = (v: string | null, fixType: string, label: string) => {
        if (v) out.push({ path: r.path, fixType, label, value: v, updatedAt: r.updatedAt });
      };
      pushIf(r.title, 'title', 'Page title');
      pushIf(r.description, 'meta_description', 'Meta description');
      pushIf(r.canonical, 'canonical', 'Canonical URL');
      pushIf(r.robots, 'robots', 'Robots meta');
      pushIf(r.h1Text, 'h1', 'H1 heading');
      pushIf(r.bodyContent, 'thin_content', 'SEO content block');
      pushIf(r.organizationSchema, 'organization_schema', 'Organization schema');
      pushIf(r.breadcrumbSchema, 'breadcrumb_schema', 'BreadcrumbList schema');
      pushIf(r.websiteSchema, 'website_schema', 'WebSite schema');
      if (r.ogTitle || r.ogDescription || r.ogImage) {
        pushIf(JSON.stringify({ title: r.ogTitle, description: r.ogDescription, image: r.ogImage }, null, 2), 'og_tags', 'OpenGraph tags');
      }
      pushIf(r.jsonLd, 'json_ld', 'JSON-LD schema');
    }
    return out;
  }),

  // Get override for a specific path
  getPageOverride: protectedProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(pageOverrides).where(eq(pageOverrides.path, input.path)).limit(1);
      return row ?? null;
    }),
});
