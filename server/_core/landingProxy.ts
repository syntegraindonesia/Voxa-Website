import type { Express, Request, Response } from "express";

/**
 * Reverse-proxy for the SYNTEGRA-built Greenlife landing pages hosted on Railway.
 *
 * These pages are served live from their own Railway apps. We relay them
 * transparently under voxa.co.id article-style paths so the address bar shows
 * voxa.co.id while the HTML is fetched from Railway behind the scenes — not a
 * redirect and not a rebuilt copy.
 *
 * The landing pages reference all of their assets with RELATIVE paths
 * (e.g. src="img/hero.jpg", url('img/logos/tokopedia.svg')). Served under
 * /artikel/... those would resolve against voxa.co.id and break, so the HTML is
 * rewritten on the fly to point every img/ reference at the page's own Railway
 * origin. We also inject canonical / Open Graph metadata pointing at the
 * voxa.co.id path (the source pages ship none), so search engines and social
 * shares treat voxa.co.id as the authoritative URL.
 *
 * Mirrors the fetch-based proxy pattern already used in storageProxy.ts — no
 * extra dependency required (Node's global fetch).
 */

type ProxyTarget = {
  /** Path on voxa.co.id that should serve the proxied page. */
  path: string;
  /** Railway origin serving the real page (no trailing slash). */
  origin: string;
  /** Absolute canonical URL on voxa.co.id. */
  canonical: string;
  /** Absolute URL of the page's hero image, used for og:image. */
  ogImage: string;
};

const TARGETS: ProxyTarget[] = [
  {
    path: "/artikel/baterai-sepeda-listrik-greenlife-12v",
    origin: "https://lp-voxa-greenlife-b2c-production.up.railway.app",
    canonical: "https://voxa.co.id/artikel/baterai-sepeda-listrik-greenlife-12v",
    ogImage:
      "https://lp-voxa-greenlife-b2c-production.up.railway.app/img/hero-lifestyle.png?v=2",
  },
  {
    path: "/artikel/mitra-reseller-baterai-greenlife",
    origin: "https://lp-voxa-greenlife-b2b-production.up.railway.app",
    canonical: "https://voxa.co.id/artikel/mitra-reseller-baterai-greenlife",
    ogImage: "https://lp-voxa-greenlife-b2b-production.up.railway.app/img/hero.jpg",
  },
];

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function rewriteHtml(html: string, target: ProxyTarget): string {
  const { origin, canonical, ogImage } = target;

  // 1. Point every relative `img/...` reference at the Railway origin.
  //    Covers src/href/poster/data attributes (single or double quoted) and CSS
  //    url(). `data` catches <object data="img/ebike-anatomy.svg"> — an <object>
  //    that resolves to voxa.co.id would embed our SPA's 404 page instead.
  //    Leaves absolute URLs (wa.me, socials, fonts) and #fragment links untouched.
  let out = html
    .replace(/(\b(?:src|href|poster|data)\s*=\s*["'])img\//gi, `$1${origin}/img/`)
    .replace(/url\(\s*(["']?)img\//gi, `url($1${origin}/img/`);

  // 2. Inject canonical + Open Graph metadata (the source pages ship none).
  const titleMatch = out.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = out.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
  );
  const title = titleMatch ? titleMatch[1].trim() : "";
  const description = descMatch ? descMatch[1].trim() : "";

  const tags = [
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:type" content="article" />`,
    title ? `<meta property="og:title" content="${escapeAttr(title)}" />` : "",
    description
      ? `<meta property="og:description" content="${escapeAttr(description)}" />`
      : "",
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
  ]
    .filter(Boolean)
    .join("\n");

  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `${tags}\n</head>`);
  } else {
    out = `${tags}\n${out}`;
  }

  return out;
}

async function proxyLandingPage(target: ProxyTarget, res: Response): Promise<void> {
  try {
    const upstream = await fetch(`${target.origin}/`, {
      headers: { Accept: "text/html" },
    });

    if (!upstream.ok) {
      console.error(
        `[LandingProxy] upstream ${target.origin} responded ${upstream.status}`
      );
      res.status(502).send("Landing page backend error");
      return;
    }

    const html = await upstream.text();
    const rewritten = rewriteHtml(html, target);

    res
      .status(200)
      .set({
        "Content-Type": "text/html; charset=utf-8",
        // Short cache: the landing pages are maintained live on Railway.
        "Cache-Control": "public, max-age=300",
      })
      .send(rewritten);
  } catch (err) {
    console.error(`[LandingProxy] failed to proxy ${target.origin}:`, err);
    res.status(502).send("Landing page backend unreachable");
  }
}

export function registerLandingProxy(app: Express) {
  for (const target of TARGETS) {
    app.get(target.path, (_req: Request, res: Response) => {
      void proxyLandingPage(target, res);
    });
  }
}
