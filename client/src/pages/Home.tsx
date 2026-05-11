import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { sepedaListrik, batre, products } from '@/data/products';

// Curated Produk Unggulan: all 5 Elite series only
const produkUnggulan = (() => {
  const byId = (id: string) => products.find(p => p.id === id);
  return [
    byId('elite-rider-s'),
    byId('elite-fantasi-s'),
    byId('elite-rider'),
    byId('elite-fantasi'),
    byId('elite-city'),
  ].filter((p): p is NonNullable<typeof p> => p != null);
})();

// Curated Sepeda Listrik Terbaru: Liberty + Eiffel series (8 products with new images)
const sepedaListrikTerbaru = (() => {
  const byId = (id: string) => products.find(p => p.id === id);
  return [
    byId('liberty-7'),
    byId('liberty'),
    byId('liberty-star'),
    byId('eiffel-7'),
    byId('liberty-ultimate'),
    byId('liberty-stylish'),
    byId('eiffel-city'),
    byId('eiffel-rider'),
  ].filter((p): p is NonNullable<typeof p> => p != null);
})();

// ─── Image constants ──────────────────────────────────────────────────────────
const HERO_BG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=90';

// Campaign banner images (3-panel mosaic)
const BANNER1 = '/manus-storage/campaign1_3919f523.png';
const BANNER2 = '/manus-storage/campaign2_2430bf5c.png';
const BANNER3 = '/manus-storage/campaign3_58add809.png';

// Campaign banner 2 images
const BANNER2A = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80';
const BANNER2B = 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=800&q=80';
const BANNER2C = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';

// Popular / lifestyle images
const POP_IMG_1 = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80';
const POP_IMG_2 = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80';
const POP_IMG_3 = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80';
const POP_IMG_4 = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80';

// Lifestyle collage images
const LIFE1 = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';
const LIFE2 = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80';
const LIFE3 = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80';
const LIFE4 = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80';
const LIFE5 = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80';
const LIFE6 = 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=600&q=80';

// ─── Product Card ───────────────────────────────────────────────────────────────────
function ProductCard({ product, cardWidth }: { product: (typeof sepedaListrik)[0]; cardWidth: string }) {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <div
      className="group relative flex-shrink-0"
      style={{ width: cardWidth, scrollSnapAlign: 'start' }}
    >
      <Link href={`/product/${product.id}`}>
        {/* Image area — fixed height on desktop, scales down on smaller screens */}
        <div
          className="relative overflow-hidden bg-white"
          style={{ height: 'clamp(200px, 28vw, 480px)' }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
              {product.badge}
            </span>
          )}
        </div>
        {/* Text block */}
        <div className="pt-3 pb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{product.series}</p>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">{product.name}</h3>
          <p className="text-sm font-bold text-gray-900">{product.price}</p>
        </div>
      </Link>
      {/* Wishlist icon */}
      <button
        onClick={() => setWishlisted(w => !w)}
        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label="Tambah ke wishlist"
      >
        <Heart size={14} className={wishlisted ? 'fill-[#00B4D8] text-[#00B4D8]' : 'text-gray-400'} />
      </button>
    </div>
  );
}

// ─── Horizontal Product Row ───────────────────────────────────────────────────────
function ProductRow({ title, viewAllHref, products }: { title: string; viewAllHref: string; products: (typeof sepedaListrik) }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const GAP = 16; // px gap between cards

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'right' ? scrollRef.current.offsetWidth : -scrollRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-16 bg-white">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">{title}</h2>
          <div className="flex items-center gap-4">
            <Link
              href={viewAllHref}
              className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-[#00B4D8] transition-colors"
            >
              Lihat Semua
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                aria-label="Scroll kiri"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-[#00B4D8] transition-colors"
                aria-label="Scroll kanan"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable track
             Card width strategy:
             - Desktop (≥1024px): 4 cards → each = (viewport - 4rem padding - 3×16px gaps) / 4
             - Tablet (640–1023px): 2 cards
             - Mobile (<640px): 1 card (full width minus padding)
             We use vw-based calc so the cards always fit the visible area exactly.
        */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide"
          style={{
            gap: `${GAP}px`,
            scrollSnapType: 'x mandatory',
            overflowY: 'hidden',
          }}
        >
          {products.map(p => {
            // Use vw units so the width is relative to the viewport, not the scroll container
            // Desktop: 4 cards in ~1440px container with 64px padding + 3×16px gaps
            //   card = (min(100vw, 1440px) - 64px - 48px) / 4
            // Tablet: 2 cards
            //   card = (100vw - 64px - 16px) / 2
            // Mobile: 1 card
            //   card = 100vw - 64px
            const cardWidth = [
              `min(calc((min(100vw, 1440px) - 4rem - ${GAP * 3}px) / 4), 340px)`,
            ].join('');
            return (
              <ProductCard key={p.id} product={p} cardWidth={cardWidth} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Campaign Banner (3-panel mosaic) ─────────────────────────────────────────
function CampaignBanner({
  img1, img2, img3,
  headline, subtext, ctaLabel, ctaHref,
}: {
  img1: string; img2: string; img3: string;
  headline: string; subtext: string; ctaLabel: string; ctaHref: string;
}) {
  return (
    <section className="w-full overflow-hidden" style={{ height: 'clamp(320px, 55vh, 620px)' }}>
      <div className="flex h-full">
        {/* Panel 1 — text overlay */}
        <div className="relative flex-1 overflow-hidden">
          <img src={img1} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)' }} />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <h2 className="font-display text-white text-2xl md:text-4xl tracking-wide leading-tight mb-2">{headline}</h2>
            <p className="text-gray-200 text-sm mb-4 max-w-xs leading-relaxed">{subtext}</p>
            <Link
              href={ctaHref}
              className="text-white text-sm font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
        {/* Panel 2 */}
        <div className="relative flex-1 overflow-hidden border-l border-white/10">
          <img src={img2} alt="" className="w-full h-full object-cover object-center" />
        </div>
        {/* Panel 3 */}
        <div className="relative flex-1 overflow-hidden border-l border-white/10">
          <img src={img3} alt="" className="w-full h-full object-cover object-center" />
        </div>
      </div>
    </section>
  );
}

// ─── Popular Grid ─────────────────────────────────────────────────────────────
const popularItemsByTab: Record<'HARIAN' | 'BISNIS', typeof useTiles> = {
  HARIAN: [
    { label: 'LIBERTY SERIES', img: POP_IMG_1, href: '/catalog/sepeda-listrik' },
    { label: 'EIFFEL SERIES', img: POP_IMG_2, href: '/catalog/sepeda-listrik' },
    { label: 'ELITE SERIES', img: POP_IMG_3, href: '/catalog/sepeda-listrik' },
    { label: 'VOXA G3', img: POP_IMG_4, href: '/catalog/sepeda-listrik' },
  ],
  BISNIS: [
    { label: 'VOXA KURIR', img: POP_IMG_2, href: '/bisnis' },
    { label: 'FLEET SOLUTION', img: POP_IMG_3, href: '/pemerintah' },
    { label: 'BATRE GREENLIFE', img: POP_IMG_4, href: '/catalog/batre' },
    { label: 'SPAREPART', img: POP_IMG_1, href: '/catalog/sparepart' },
  ],
};

// ─── Lifestyle use tiles ──────────────────────────────────────────────────────
const useTiles = [
  { label: 'HARIAN', img: POP_IMG_1, href: '/catalog/sepeda-listrik?use=harian' },
  { label: 'KURIR', img: POP_IMG_2, href: '/bisnis' },
  { label: 'LIFESTYLE', img: POP_IMG_3, href: '/catalog/sepeda-listrik?use=lifestyle' },
  { label: 'FLEET', img: POP_IMG_4, href: '/pemerintah' },
];

const useTilesByTab: Record<'HARIAN' | 'BISNIS', typeof useTiles> = {
  HARIAN: [
    { label: 'HARIAN', img: POP_IMG_1, href: '/catalog/sepeda-listrik?use=harian' },
    { label: 'LIFESTYLE', img: POP_IMG_2, href: '/catalog/sepeda-listrik?use=lifestyle' },
    { label: 'COMMUTER', img: POP_IMG_3, href: '/catalog/sepeda-listrik' },
    { label: 'PELAJAR', img: POP_IMG_4, href: '/catalog/sepeda-listrik' },
  ],
  BISNIS: [
    { label: 'KURIR', img: POP_IMG_2, href: '/bisnis' },
    { label: 'FLEET', img: POP_IMG_3, href: '/pemerintah' },
    { label: 'LOGISTIK', img: POP_IMG_4, href: '/bisnis' },
    { label: 'PEMERINTAH', img: POP_IMG_1, href: '/pemerintah' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [popularTab, setPopularTab] = useState<'HARIAN' | 'BISNIS'>('HARIAN');
  const [useTab, setUseTab] = useState<'HARIAN' | 'BISNIS'>('HARIAN');

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: HERO — 85–90vh, full-width, bottom-left text
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden bg-black"
        style={{ height: 'clamp(480px, 75vh, 820px)' }}
      >
        <img
          src={HERO_BG}
          alt="VOXA — Kendaraan Listrik untuk Jalanan Indonesia"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.82 }}
        />
        {/* Bottom gradient for text legibility */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 35%, transparent 65%)' }}
        />
        {/* Left gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 55%)' }}
        />

        {/* Bottom-left text block */}
        <div className="absolute bottom-0 left-0" style={{ padding: 'clamp(1.5rem, 5vw, 4rem) clamp(1.5rem, 6vw, 5rem)' }}>
          <h1 className="font-display text-white leading-none tracking-wide mb-2" style={{ fontSize: 'clamp(2.625rem, 5vw, 4.5rem)' }}>
            KENDARAAN LISTRIK{' '}
            <span className="text-[#00B4D8]">UNTUK JALANAN</span>{' '}
            INDONESIA.
          </h1>
          <p className="text-gray-200 mb-4 leading-snug" style={{ fontSize: 'clamp(0.8rem, 1.1vw, 1rem)', maxWidth: '30rem' }}>
            Desain modern, performa tangguh, dan hemat energi untuk jalanan Indonesia.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/catalog/sepeda-listrik"
              className="text-white font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
              style={{ fontSize: 'clamp(0.8rem, 1vw, 0.9rem)' }}
            >
              Temukan Produk
            </Link>
            <Link
              href="/compare"
              className="text-white font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
              style={{ fontSize: 'clamp(0.8rem, 1vw, 0.9rem)' }}
            >
              Bandingkan Model
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: PRODUCT ROW — PRODUK UNGGULAN (horizontal scroll)
      ═══════════════════════════════════════════════════════════════ */}
      <ProductRow
        title="PRODUK UNGGULAN"
        viewAllHref="/catalog/sepeda-listrik"
        products={produkUnggulan}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: CAMPAIGN BANNER — 3-panel mosaic
      ═══════════════════════════════════════════════════════════════ */}
      <CampaignBanner
        img1={BANNER1}
        img2={BANNER2}
        img3={BANNER3}
        headline="SEPEDA LISTRIK UNTUK BISNIS ANDA"
        subtext="Armada kendaraan listrik yang handal untuk kurir dan operasional bisnis sehari-hari."
        ctaLabel="Lihat Solusi Bisnis"
        ctaHref="/bisnis"
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: PRODUCT ROW — SEPEDA LISTRIK TERBARU
      ═══════════════════════════════════════════════════════════════ */}
      <ProductRow
        title="SEPEDA LISTRIK TERBARU"
        viewAllHref="/catalog/sepeda-listrik"
        products={sepedaListrikTerbaru}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: POPULER SEKARANG — tabbed 4-column grid
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <h2 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">POPULER SEKARANG</h2>
              <div className="flex gap-1 border-b border-gray-200">
                {(['HARIAN', 'BISNIS'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPopularTab(tab)}
                    className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors border-b-2 -mb-px ${
                      popularTab === tab
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularItemsByTab[popularTab].map(item => (
              <Link key={item.label} href={item.href}>
                <div className="group relative overflow-hidden aspect-[3/4] bg-gray-100">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-5">
                    <h3 className="font-display text-white text-sm md:text-base tracking-wide leading-tight mb-1">{item.label}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: VOXA UNTUK SIAPA? — activity tiles with tabs
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex items-center gap-6 mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">VOXA UNTUK SIAPA?</h2>
            <div className="flex gap-1 border-b border-gray-200">
              {(['HARIAN', 'BISNIS'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setUseTab(tab)}
                  className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors border-b-2 -mb-px ${
                    useTab === tab
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {useTilesByTab[useTab].map(tile => (
              <Link key={tile.label} href={tile.href}>
                <div className="group relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={tile.img}
                    alt={tile.label}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="font-display text-white text-sm md:text-base tracking-widest">{tile.label}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5B: SECOND CAMPAIGN BANNER — B2G / Pemerintah
      ═══════════════════════════════════════════════════════════════ */}
      <CampaignBanner
        img1={BANNER2A}
        img2={BANNER2B}
        img3={BANNER2C}
        headline="SOLUSI ARMADA PEMERINTAH"
        subtext="Kendaraan listrik ramah lingkungan untuk instansi dan program pemerintah daerah."
        ctaLabel="Pelajari Program B2G"
        ctaHref="/pemerintah"
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: LIFESTYLE / COMMUNITY COLLAGE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">KOMUNITAS VOXA</h2>
            <Link href="/guide" className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-[#00B4D8] transition-colors flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          {/* Asymmetric collage grid */}
          <div className="grid grid-cols-3 grid-rows-2 gap-2" style={{ height: 'clamp(300px, 50vh, 560px)' }}>
            {/* Large left tile */}
            <div className="col-span-1 row-span-2 overflow-hidden bg-gray-100">
              <img src={LIFE1} alt="VOXA Community" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
            </div>
            {/* Top middle */}
            <div className="col-span-1 row-span-1 overflow-hidden bg-gray-100">
              <img src={LIFE2} alt="VOXA Lifestyle" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
            </div>
            {/* Top right */}
            <div className="col-span-1 row-span-1 overflow-hidden bg-gray-100">
              <img src={LIFE3} alt="VOXA Riders" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
            </div>
            {/* Bottom middle */}
            <div className="col-span-1 row-span-1 overflow-hidden bg-gray-100">
              <img src={LIFE4} alt="VOXA Urban" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
            </div>
            {/* Bottom right — split into 2 */}
            <div className="col-span-1 row-span-1 grid grid-cols-2 gap-2">
              <div className="overflow-hidden bg-gray-100">
                <img src={LIFE5} alt="VOXA Daily" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="overflow-hidden bg-gray-100">
                <img src={LIFE6} alt="VOXA Green" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
