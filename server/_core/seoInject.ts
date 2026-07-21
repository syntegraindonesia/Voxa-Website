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

// Given raw HTML and a request path, inject overrides into the <head>
// Also removes the original <title> and any tags that we're replacing to avoid duplicates.
export async function injectSeoOverrides(html: string, path: string): Promise<string> {
  const tags = await buildOverrideTags(path);
  if (!tags) return html;

  // Strip existing title/description if we're overriding them
  let out = html;
  if (tags.includes('<title')) out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/i, '');
  if (tags.includes('name="description"')) out = out.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
  if (tags.includes('rel="canonical"')) out = out.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
  if (tags.includes('property="og:title"')) out = out.replace(/<meta[^>]*property="og:title"[^>]*>/gi, '');
  if (tags.includes('property="og:description"')) out = out.replace(/<meta[^>]*property="og:description"[^>]*>/gi, '');
  if (tags.includes('property="og:image"')) out = out.replace(/<meta[^>]*property="og:image"[^>]*>/gi, '');

  return out.replace(/<\/head>/i, `${tags}\n</head>`);
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
