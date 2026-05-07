# VOXA Website TODO

- [x] Setup design system (colors, fonts, global CSS)
- [x] Upload VOXA logo and configure branding
- [x] Build announcement bar with scrolling text
- [x] Build sticky mega dropdown navigation with all menu items
- [x] Build full-screen hero section
- [x] Build category block grid (4 tiles)
- [x] Build homepage featured products section
- [x] Build "Kenapa VOXA" section
- [x] Build product comparison preview section
- [x] Build VOXA Guide content section
- [x] Build B2B section on homepage
- [x] Build B2G section on homepage
- [x] Build trust section (testimonials, showroom, production, warranty)
- [x] Build final CTA section
- [x] Build product catalog page (Sepeda Listrik - 15 models)
- [x] Build product catalog page (Batre - 9 models)
- [x] Build product catalog page (Sparepart)
- [x] Build product detail page with gallery, specs, FAQ, WhatsApp CTA
- [x] Build product comparison page with specs table
- [x] Build B2B dedicated page with hero, value prop, lead form
- [x] Build B2G dedicated page with hero, value prop, lead form
- [x] Build Showroom page
- [x] Build Tentang VOXA page
- [x] Build Bantuan/FAQ page
- [x] Build VOXA Guide page
- [x] Sticky WhatsApp CTA on product detail pages (mobile)
- [x] Mobile-first responsive design throughout
- [x] Write and pass vitest tests (10 tests passing)
- [x] Final testing and checkpoint

## Gymshark-Inspired Redesign

- [x] Navbar: logo left, centered nav links, CTA + icons (search/wishlist/account/cart) on right
- [x] Mega dropdown: 3-column layout (Sepeda Listrik, Batre, Sparepart) with Series → Products hierarchy
- [x] Mega dropdown: hover open/close, fade+slide animation, dimmed backdrop
- [x] Hero: full-width cinematic, dark gradient overlay, bottom-left headline + description + 2 CTAs

## Exact Gymshark Layout Rebuild

- [x] Navbar: nav links LEFT, VOXA logo CENTER, icons RIGHT (exact Gymshark format)
- [x] Mega dropdown: opens from left, two-column (category list left → sub-items right on hover)
- [x] Hero: underlined CTA links at bottom-left (not buttons), Gymshark-exact style

## Hero Section Update

- [x] Remove any slider/carousel from hero, replace with single static image
- [x] Set hero height to 60–70vh (not full-screen)
- [x] Keep bottom-left text, dark gradient overlay, underlined CTA links

## Gymshark 10-Section Homepage Rebuild

- [x] Section 3: Hero 85-90vh, full-width, dark gradient bottom, bottom-left text + 2 underlined CTAs
- [x] Section 4: Product row "PRODUK UNGGULAN" — title left + View All right, horizontal scroll, 4 cards, wishlist icon
- [x] Section 5: Featured campaign banner — full-width 3-image mosaic, bottom-left headline + subtext + 1 CTA
- [x] Section 6: Product row "SEPEDA LISTRIK TERBARU" — same structure as Section 4
- [x] Section 7: "POPULER SEKARANG" grid — HARIAN/BISNIS tabs, 4-column image grid with overlay text
- [x] Section 8: "VOXA UNTUK SIAPA?" lifestyle tiles
- [x] Section 9: Lifestyle/community collage section
- [x] Section 10: Footer — 4-column, newsletter, social icons, payment icons

## Mega Dropdown Rebuild (Gymshark Exact)

- [x] Rebuild mega dropdown: two-panel layout (left categories + right sub-items), pure white background
- [x] Dropdown opens ONLY on hover over nav item, closes immediately when mouse leaves entire dropdown area
- [x] Left panel: large clean category names with chevron arrows (Sepeda Listrik, Batre, Sparepart)
- [x] Right panel: sub-items appear when hovering a category, plain text links, no headers/columns
- [x] No gray background, no complex grid, no category headers — clean minimal like Gymshark
- [x] Smooth fade transition, thin top border separator only

## Dropdown Fix (Compact + No Gap)

- [x] Compact dropdown: max-width 520–720px, absolute under nav item, no full-screen width
- [x] Consistent white background throughout (no grey area)
- [x] No transparent gap between nav item and dropdown panel (position: absolute, top: 100%, no margin-top)
- [x] Hover bridge: wrap nav item + dropdown in same parent, hover on either keeps it open
- [x] Two-column layout: left categories (hover to reveal) + right sub-items list
- [x] Proper padding: 24–32px inside, 12–16px vertical spacing between links
- [x] Active category: bold + underline indicator
- [x] "Lihat Semua" as subtle secondary link at bottom
- [x] Smooth opacity + translateY transition (150–200ms)
- [x] Mobile: accordion menu instead of hover dropdown

## New Catalog Pages + Navigation Fix

- [x] Fix dropdown: category names changed from <button> to <Link> so they are real clickable links
- [x] Fix dropdown: Sepeda Listrik → /sepeda-listrik (was /catalog/sepeda-listrik)
- [x] Fix dropdown: Batre → /batre (was /catalog/batre)
- [x] Fix dropdown: Sparepart → /sparepart (was /catalog/sparepart)
- [x] Fix mobile accordion: category names are now real links with separate expand chevron
- [x] Create /batre page — exact Sepeda Listrik layout, 9 products, filter chips (Greenlife/TNE/Chilwee/Lithium)
- [x] Create /sparepart page — exact Sepeda Listrik layout, 11 products, filter chips (Motor/Controller/Charger/Rem/Ban)
- [x] Wire /sepeda-listrik, /batre, /sparepart routes in App.tsx
- [x] Keep /catalog/:category legacy routes for backward compatibility

## Unified Katalog Page + Temukan VOXA Anda Fix

- [x] Create /katalog unified discovery page with all products (Sepeda Listrik + Batre + Sparepart)
- [x] Tab filters: Semua / Sepeda Listrik / Batre / Sparepart (dynamic, no reload)
- [x] Same layout/grid/card as existing catalog pages
- [x] Update "Temukan VOXA Anda" button in navbar to route to /katalog
- [x] Wire /katalog route in App.tsx

## Product Image Galleries

- [x] Upload all gallery images (13 products × multiple images) to CDN
- [x] Create productGalleries.ts data file mapping product IDs to ordered image arrays
- [x] Implement interactive gallery on product detail page (main image + thumbnails)
- [x] Active thumbnail highlight (border/opacity)
- [x] Consistent aspect ratio and object-fit: cover

## Batre Product Name Standardization

- [x] Update batre product names in products.ts (Tianneng, Chilwee, Greenlife, Lithium)
- [x] Update filter chips in Batre.tsx to match new brand names
- [x] Update filter chips in Katalog.tsx if batre filters exist (no hardcoded batre chips — uses data from products.ts)
- [x] Update dropdown sub-items in Navbar.tsx for Batre category
- [x] Verify product IDs remain consistent for image mapping (IDs unchanged, only display names updated)

## Global Layout & Visual Polish Fix

- [x] Remove announcement/marquee bar (sticky top strip with "Garansi Resmi | Sparepart Tersedia...")
- [x] Navbar sits flush at top after bar removal, sticky top-0
- [x] Fix sticky filter bar offsets on all catalog pages after bar removal
- [x] Fix product image cropping: object-fit contain on all catalog cards and carousels
- [x] Fix product image cropping: object-fit contain on product detail thumbnails
- [x] Fix navbar layout: proper 3-column flex (left nav | center logo | right actions)
- [x] Navbar font size 13-15px, icon 18-22px, no wrapping on desktop
- [x] Reduce global "zoomed in" feel: max-width 1200-1400px containers, balanced padding
- [x] Fix hero heading: clamp(42px, 5vw, 72px) font size
