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
 * /artikel/... those would resolve against voxa.co.id and break.
 *
 * We serve the assets SAME-ORIGIN: img/ references are rewritten to
 * `<article-path>/img/...` on voxa.co.id, and a second proxy route relays those
 * requests to the page's Railway origin. Same-origin matters because one asset —
 * img/ebike-anatomy.svg — is itself an <object type="image/svg+xml"> whose SVG
 * pulls in a nested <image href="moped-anatomy.png">. Cross-origin that breaks
 * two ways: Chrome's Opaque Response Blocking blanks the cross-origin <object>,
 * and an <img> fallback renders the SVG in "secure static mode" which strips the
 * nested PNG. Serving everything from voxa.co.id sidesteps both — the page's own
 * <object> renders exactly as it does on Railway.
 *
 * We also inject canonical / Open Graph metadata pointing at the voxa.co.id path
 * (the source pages ship none), so search engines and social shares treat
 * voxa.co.id as the authoritative URL.
 *
 * Mirrors the fetch-based proxy pattern already used in storageProxy.ts — no
 * extra dependency required (Node's global fetch).
 */

type ProxyTarget = {
  /** Path on voxa.co.id that serves the proxied page (also the asset base). */
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
  const { path, canonical, ogImage } = target;

  // 1. Point every relative `img/...` reference at the same-origin asset path
  //    (`<article-path>/img/...`), served by the asset proxy below. Covers
  //    src/href/poster/data attributes (single or double quoted) and CSS url().
  //    `data` catches <object data="img/ebike-anatomy.svg">. Leaves absolute
  //    URLs (wa.me, socials, fonts) and #fragment links untouched.
  let out = html
    .replace(/(\b(?:src|href|poster|data)\s*=\s*["'])img\//gi, `$1${path}/img/`)
    .replace(/url\(\s*(["']?)img\//gi, `url($1${path}/img/`);

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

/**
 * Relay an asset request (`<article-path>/img/...`) to the page's Railway
 * origin. `assetPath` is everything after `<article-path>/` — e.g.
 * "img/ebike-anatomy.svg" — including any query string.
 */
async function proxyLandingAsset(
  target: ProxyTarget,
  assetPath: string,
  res: Response
): Promise<void> {
  try {
    const upstream = await fetch(`${target.origin}/${assetPath}`);

    if (!upstream.ok) {
      res.status(upstream.status).send("Asset not found");
      return;
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    res
      .status(200)
      .set({
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      })
      .send(buf);
  } catch (err) {
    console.error(
      `[LandingProxy] failed to proxy asset ${target.origin}/${assetPath}:`,
      err
    );
    res.status(502).send("Asset backend unreachable");
  }
}

export function registerLandingProxy(app: Express) {
  for (const target of TARGETS) {
    // Assets first (more specific path), then the page itself.
    app.get(`${target.path}/img/*`, (req: Request, res: Response) => {
      // originalUrl is `<article-path>/img/...?query`; strip the leading
      // `<article-path>/` to get the upstream-relative asset path + query.
      const assetPath = req.originalUrl.slice(target.path.length + 1);
      void proxyLandingAsset(target, assetPath, res);
    });

    app.get(target.path, (_req: Request, res: Response) => {
      void proxyLandingPage(target, res);
    });
  }
}
