// Syncs the injected <section id="voxa-seo-content"> with the current SPA route.
//
// Why this exists:
// - The Express middleware injects page-specific SEO content into the initial
//   HTML (great for crawlers on first request).
// - But this app uses wouter for client-side navigation — when a user clicks a
//   link, no new HTML is fetched. The <section> lives outside <div id="root"/>
//   so React never touches it, meaning it stays showing the FIRST page's
//   content even after navigating to a different route.
//
// This component fixes that by imperatively updating the section's inner HTML
// whenever the current route changes, fetching each page's override from a
// public tRPC endpoint.
import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export function PageSeoContent() {
  const [location] = useLocation();
  const path = (location || "/").split("?")[0] || "/";

  // Fetch the SEO body content for this exact path. Public endpoint, no auth.
  const { data } = trpc.seo.getPublicOverride.useQuery({ path });

  useEffect(() => {
    // Middleware always injects a <section id="voxa-seo-content"> shell (with
    // scoped <style>) into every response. We only replace the content div
    // and preserve the style tag.
    const section = document.getElementById("voxa-seo-content");
    if (!section) return; // Nothing injected yet (very first render before middleware)

    const contentDiv = section.querySelector("div");
    if (!contentDiv) return;

    const styleTag = contentDiv.querySelector("style");
    const styleHtml = styleTag ? styleTag.outerHTML : "";

    if (data?.bodyContent) {
      // Replace: keep scoped style, put new content after it
      contentDiv.innerHTML = styleHtml + data.bodyContent;
      (section as HTMLElement).style.display = "block";
    } else {
      // No override for this path — hide the section entirely so no stale
      // content leaks through from the previous route.
      (section as HTMLElement).style.display = "none";
    }
  }, [path, data?.bodyContent]);

  return null; // No DOM output — we update the middleware-injected element imperatively.
}
