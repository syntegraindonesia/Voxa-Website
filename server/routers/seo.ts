import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { seoAudits, pageOverrides, seoFixHistory, llmsTxt } from '../../drizzle/schema';
import { runSiteAudit, AUDITED_PAGES, type SiteAudit, type PageFinding } from '../_core/seoAudit';
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
        thin_content: `Return an HTML content block (400-600 words in Bahasa Indonesia) about the page topic for a footer SEO section.
Requirements:
- Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <li>, <a href="...">. No inline styles, no divs, no images.
- 1 <h2> for the section title. 2-3 <h3> subheadings. 4-6 short <p> paragraphs.
- Include a bulleted list (<ul>) with 4-6 items highlighting features.
- Include 3-5 internal links (<a href>) to related VOXA pages like /sepeda-listrik, /baterai, /artikel, /showroom, /tentang.
- Mention "VOXA" naturally 4-8 times.
- Reference the page's actual topic: for "/" mention overall brand; for "/sepeda-listrik" mention product range; for "/tentang" mention company history; etc.
- No promotional hype or fake urgency. Educational and factual tone.
Return raw HTML string.`,
        thin_content: 'Return "MANUAL" — content rewrites require human review.',
        alt_text: 'Return "AUTO" — alt text handled in a bulk pass.',
      };
      const rule = rules[input.fixType] || 'Return a specific fix in JSON or plain text.';

      const response = await invokeLLM({
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

      const content = response.choices[0]?.message?.content ?? '';
      if (!content) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'AI mengembalikan respons kosong' });
      }
      const raw = typeof content === 'string' ? content : JSON.stringify(content);
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // AI returned plain text without JSON wrapping — use it directly
        const trimmed = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
        return { suggestion: trimmed || '' };
      }
      const v = parsed?.value ?? parsed;
      if (v === undefined || v === null || v === '') {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'AI tidak menghasilkan saran — coba lagi atau isi manual' });
      }
      return { suggestion: typeof v === 'string' ? v : JSON.stringify(v, null, 2) };
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
      else if (input.fixType === 'canonical') updates.canonical = input.value;
      else if (input.fixType === 'robots') updates.robots = input.value;
      else if (input.fixType === 'h1' || input.fixType === 'multiple_h1') updates.h1Text = input.value;
      else if (input.fixType === 'thin_content') updates.bodyContent = input.value;
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
