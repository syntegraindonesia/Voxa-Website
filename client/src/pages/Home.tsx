import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Heart, ChevronLeft, ChevronRight, ArrowRight, MessageCircle, Shield, Wrench, X, Zap } from 'lucide-react';
import { sepedaListrik, batre, products, type Product } from '@/data/products';
import { getProductGallery } from '@/data/productGalleries';

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
const HERO_BG = '/manus-storage/hero-banner-v2_0bbd7a2c.png';
const HERO_BG_MOBILE = '/manus-storage/hero-mobile-v3_de725c00.png';

// Campaign banner images (3-panel mosaic)
const BANNER1 = '/manus-storage/campaign1_3919f523.png';
const BANNER2 = '/manus-storage/campaign2_2430bf5c.png';
const BANNER3 = '/manus-storage/campaign3_58add809.png';

// Campaign banner 2 images
const BANNER2A = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80';
const BANNER2B = 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=800&q=80';
const BANNER2C = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';

// Popular series images
const POP_IMG_LIBERTY = '/manus-storage/popular-liberty_6fcc442b.png';
const POP_IMG_EIFFEL  = '/manus-storage/popular-eiffel_7013e82b.png';
const POP_IMG_ELITE   = '/manus-storage/popular-elite_f051405c.png';
const POP_IMG_VOXA    = '/manus-storage/popular-voxa_c4653a81.png';
// Legacy aliases used by useTiles
const POP_IMG_1 = POP_IMG_LIBERTY;
const POP_IMG_2 = POP_IMG_EIFFEL;
const POP_IMG_3 = POP_IMG_ELITE;
const POP_IMG_4 = POP_IMG_VOXA;

// Lifestyle collage images
const LIFE1 = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';
const LIFE2 = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80';
const LIFE3 = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80';
const LIFE4 = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80';
const LIFE5 = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80';
const LIFE6 = 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=600&q=80';

// Community / customer photos
const COMMUNITY_PHOTOS: string[] = [
  '/manus-storage/p1_ea197215.jpeg',
  '/manus-storage/p2_1d043544.jpeg',
  '/manus-storage/p3_7d54d5c7.jpeg',
  '/manus-storage/p4_a39a5f06.webp',
  '/manus-storage/p5_e82e8225.webp',
  '/manus-storage/p6_d73b34de.jpeg',
  '/manus-storage/p7_77ff902f.jpeg',
  '/manus-storage/p8_e3bb9c56.jpeg',
  '/manus-storage/p9_a21a0dde.jpeg',
  '/manus-storage/p10_bece9069.jpeg',
  '/manus-storage/p11_c9441a58.jpeg',
  '/manus-storage/p12_591a9764.jpeg',
  '/manus-storage/p13_ae54b341.jpeg',
  '/manus-storage/p14_9e05130d.jpeg',
  '/manus-storage/p15_3fc672ab.webp',
  '/manus-storage/p16_767380d5.jpeg',
  '/manus-storage/p17_461886b0.jpeg',
  '/manus-storage/p18_6f004696.webp',
  '/manus-storage/p19_ebdd7cfd.jpeg',
  '/manus-storage/p20_8168671d.webp',
  '/manus-storage/p21_57182216.jpeg',
  '/manus-storage/p23_41a4bd78.jpeg',
  '/manus-storage/p24_c2b9880d.jpeg',
];

// ─── Product Card ───────────────────────────────────────────────────────────────────
function ProductCard({ product, cardWidth, onSelect }: { product: (typeof sepedaListrik)[0]; cardWidth: string; onSelect: (p: Product) => void }) {
  const [wishlisted, setWishlisted] = useState(false);
  const gallery = getProductGallery(product.id, product.image);
  return (
    <div
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ width: cardWidth, scrollSnapAlign: 'start' }}
      onClick={() => onSelect(product as Product)}
    >
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
        {gallery.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            1/{gallery.length}
          </span>
        )}
      </div>
      {/* Text block */}
      <div className="pt-3 pb-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{product.series}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">{product.name}</h3>
        <p className="text-sm font-bold text-gray-900">{product.price}</p>
      </div>
      {/* Wishlist icon */}
      <button
        onClick={e => { e.stopPropagation(); setWishlisted(w => !w); }}
        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label="Tambah ke wishlist"
      >
        <Heart size={14} className={wishlisted ? 'fill-[#00B4D8] text-[#00B4D8]' : 'text-gray-400'} />
      </button>
    </div>
  );
}

// ─── Horizontal Product Row ───────────────────────────────────────────────────────
function ProductRow({ title, viewAllHref, products, onSelect }: { title: string; viewAllHref: string; products: (typeof sepedaListrik); onSelect: (p: Product) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePage, setMobilePage] = useState(0);

  const GAP = 16;

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Desktop scroll
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'right' ? scrollRef.current.offsetWidth : -scrollRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  // Mobile: group products into pages of 4 (2×2)
  const MOBILE_PAGE_SIZE = 4;
  const mobilePages = [];
  for (let i = 0; i < products.length; i += MOBILE_PAGE_SIZE) {
    mobilePages.push(products.slice(i, i + MOBILE_PAGE_SIZE));
  }
  const totalMobilePages = mobilePages.length;

  const mobilePrev = () => setMobilePage(p => Math.max(0, p - 1));
  const mobileNext = () => setMobilePage(p => Math.min(totalMobilePages - 1, p + 1));

  return (
    <section className="py-10 md:py-16 bg-white">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1rem' }} className="md:[padding:0_2rem]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="font-display text-xl md:text-3xl text-gray-900 tracking-wide">{title}</h2>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href={viewAllHref}
              className="text-xs md:text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-[#00B4D8] transition-colors"
            >
              Lihat Semua
            </Link>
            <div className="flex gap-2">
              <button
                onClick={isMobile ? mobilePrev : () => scroll('left')}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30"
                aria-label="Scroll kiri"
                disabled={isMobile && mobilePage === 0}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={isMobile ? mobileNext : () => scroll('right')}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-[#00B4D8] transition-colors disabled:opacity-30"
                aria-label="Scroll kanan"
                disabled={isMobile && mobilePage === totalMobilePages - 1}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE: 2×2 grid pager ── */}
        {isMobile ? (
          <div>
            <div
              className="grid"
              style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}
            >
              {(mobilePages[mobilePage] ?? []).map(p => (
                <MobileProductCard key={p.id} product={p} onSelect={onSelect} />
              ))}
            </div>
            {/* Dot indicators */}
            {totalMobilePages > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {mobilePages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMobilePage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === mobilePage ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                    aria-label={`Halaman ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── DESKTOP / TABLET: horizontal scroll row ── */
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
              const cardWidth = `min(calc((min(100vw, 1440px) - 4rem - ${GAP * 3}px) / 4), 340px)`;
              return (
                <ProductCard key={p.id} product={p} cardWidth={cardWidth} onSelect={onSelect} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Mobile Product Card (2×2 grid item) ─────────────────────────────────────
function MobileProductCard({ product, onSelect }: { product: (typeof sepedaListrik)[0]; onSelect: (p: Product) => void }) {
  const [wishlisted, setWishlisted] = useState(false);
  const gallery = getProductGallery(product.id, product.image);
  return (
    <div className="group relative cursor-pointer" onClick={() => onSelect(product as Product)}>
      {/* Square image area */}
      <div className="relative overflow-hidden bg-white" style={{ aspectRatio: '1/1' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
        />
        {gallery.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
            1/{gallery.length}
          </span>
        )}
      </div>
      {/* Text */}
      <div className="pt-2 pb-1">
        <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5 truncate">{product.series}</p>
        <h3 className="text-xs font-semibold text-gray-900 leading-snug mb-0.5 line-clamp-2">{product.name}</h3>
        <p className="text-xs font-bold text-gray-900">{product.price}</p>
      </div>
      {/* Wishlist */}
      <button
        onClick={e => { e.stopPropagation(); setWishlisted(w => !w); }}
        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
        aria-label="Tambah ke wishlist"
      >
        <Heart size={11} className={wishlisted ? 'fill-[#00B4D8] text-[#00B4D8]' : 'text-gray-400'} />
      </button>
    </div>
  );
}

// ─── Campaign Banner (3-panel mosaic on desktop, swipe carousel on mobile) ──────────
function CampaignBanner({
  img1, img2, img3,
  headline, subtext, ctaLabel, ctaHref,
}: {
  img1: string; img2: string; img3: string;
  headline: string; subtext: string; ctaLabel: string; ctaHref: string;
}) {
  const images = [img1, img2, img3];

  return (
    <section className="w-full overflow-hidden">
      {/* ── DESKTOP / TABLET (≥768px): original 3-panel mosaic ── */}
      <div
        className="hidden md:flex"
        style={{ height: 'clamp(320px, 55vh, 620px)' }}
      >
        {/* Panel 1 — text overlay */}
        <div className="relative flex-1 overflow-hidden">
          <img src={img1} alt="" className="w-full h-full object-cover object-center" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)' }}
          />
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

      {/* ── MOBILE (<768px): horizontal swipe carousel, no text overlays ── */}
      <div className="md:hidden">
        <div
          className="flex overflow-x-auto"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            gap: '12px',
            padding: '0 16px 16px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden rounded-2xl"
              style={{
                width: '82vw',
                aspectRatio: '4/3',
                scrollSnapAlign: 'start',
              }}
            >
              <img
                src={src}
                alt={`Campaign ${i + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Popular Grid ─────────────────────────────────────────────────────────────
const popularItems = [
  { label: 'LIBERTY SERIES', img: POP_IMG_LIBERTY, href: '/sepeda-listrik?series=Liberty+Series' },
  { label: 'EIFFEL SERIES',  img: POP_IMG_EIFFEL,  href: '/sepeda-listrik?series=Eiffel+Series' },
  { label: 'ELITE SERIES',   img: POP_IMG_ELITE,   href: '/sepeda-listrik?series=Elite+Series' },
  { label: 'VOXA SERIES',    img: POP_IMG_VOXA,    href: '/sepeda-listrik?series=Voxa+Series' },
];

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

// ─── Home Product Modal ──────────────────────────────────────────────────────
function HomeProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const galleryImages = getProductGallery(product.id, product.image);

  const prev = () => setActiveImg(i => (i - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setActiveImg(i => (i + 1) % galleryImages.length);

  const waMessage = encodeURIComponent(`Halo VOXA, saya tertarik dengan produk ${product.name}. Bisa tolong informasi lebih lanjut?`);
  const waUrl = `https://wa.me/628156161071?text=${waMessage}`;

  const specLabels: Record<string, string> = {
    jarakTempuh: 'Jarak Tempuh', baterai: 'Baterai', kecepatan: 'Kecepatan Maks', motor: 'Motor',
    pengisian: 'Waktu Pengisian', bobot: 'Bobot', dayaAngkut: 'Daya Angkut', dimensi: 'Dimensi',
    pengereman: 'Pengereman', ban: 'Ban', keamanan: 'Keamanan', kegunaan: 'Kegunaan',
    voltase: 'Voltase', kapasitas: 'Kapasitas', tipe: 'Tipe', merk: 'Merek', model: 'Model',
    daya: 'Daya', arusPelepasan: 'Arus Pelepasan', arusPengisian: 'Arus Pengisian',
    arusPengisianMaks: 'Arus Pengisian Maks', teganganPengisian: 'Tegangan Pengisian',
    isiKemasan: 'Isi Kemasan', rekomendasiMotor: 'Rekomendasi Motor', waktuPenggunaan: 'Waktu Penggunaan',
  };

  const specEntries = Object.entries(product.specs)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => ({ label: specLabels[k] || k, value: v as string }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <span className="text-xs font-semibold text-[#00B4D8] uppercase tracking-wider">{product.series}</span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="flex flex-col">
          <div className="relative w-full bg-white overflow-hidden" style={{ height: '300px' }}>
            <img src={galleryImages[activeImg]} alt={`${product.name} ${activeImg + 1}`} className="w-full h-full object-contain object-center" />
            {galleryImages.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all"><ChevronLeft size={18} className="text-gray-700" /></button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all"><ChevronRight size={18} className="text-gray-700" /></button>
                <span className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">{activeImg + 1}/{galleryImages.length}</span>
              </>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-none px-5 py-3 border-b border-gray-100">
              {galleryImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#00B4D8]' : 'border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-contain bg-white" />
                </button>
              ))}
            </div>
          )}
          <div className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-1">{product.name}</h2>
              <p className="text-lg font-bold text-[#00B4D8] mb-2">{product.price}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            {specEntries.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Spesifikasi</h3>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  {specEntries.map((spec, i) => (
                    <div key={i} className={`flex text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <span className="w-2/5 px-3 py-2 text-gray-500 font-medium shrink-0">{spec.label}</span>
                      <span className="w-3/5 px-3 py-2 text-gray-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {[{ icon: <Shield size={14} />, text: 'Garansi 2 Tahun' }, { icon: <Wrench size={14} />, text: 'Sparepart Tersedia' }, { icon: <Zap size={14} />, text: 'Produk Original' }].map(badge => (
                <div key={badge.text} className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <span className="text-[#00B4D8]">{badge.icon}</span>{badge.text}
                </div>
              ))}
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-all">
              <MessageCircle size={18} />Chat WhatsApp — Tanya Harga
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [useTab, setUseTab] = useState<'HARIAN' | 'BISNIS'>('HARIAN');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: HERO — mobile portrait / desktop landscape
      ═══════════════════════════════════════════════════════════════ */}

      {/* ── MOBILE hero (< sm): full portrait image, text pinned to bottom ── */}
      <section
        className="sm:hidden relative w-full overflow-hidden"
        style={{ height: '100svh', minHeight: '600px', maxHeight: '900px' }}
      >
        <img
          src={HERO_BG_MOBILE}
          alt="VOXA — Kendaraan Listrik untuk Jalanan Indonesia"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        />
        {/* Strong bottom-up dark gradient so text is always legible */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(3,15,30,0.94) 0%, rgba(3,15,30,0.70) 38%, rgba(3,15,30,0.10) 65%, transparent 80%)' }}
        />
        {/* WhatsApp button — top right */}
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 flex items-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97]"
          style={{
            background: '#25D366',
            color: '#ffffff',
            padding: '0.55rem 1rem',
            fontSize: '0.78rem',
            boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat WhatsApp
        </a>

        {/* Text block — pinned to bottom of image */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: '0 1.75rem 3.5rem' }}
        >
          <p
            className="font-bold uppercase mb-3"
            style={{ fontSize: '0.62rem', color: '#4DD9F5', letterSpacing: '0.26em' }}
          >
            Kendaraan Listrik Indonesia
          </p>
          <h1
            className="font-display leading-[1.0] tracking-tight mb-3"
            style={{ fontSize: 'clamp(2.6rem, 10vw, 3.4rem)', color: '#ffffff', letterSpacing: '-0.025em', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
          >
            BEBAS,<br />
            <span style={{ color: '#4DD9F5' }}>HEMAT,</span><br />
            TANPA BATAS.
          </h1>
          <p
            className="leading-relaxed"
            style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.88)', maxWidth: '22rem' }}
          >
            Sepeda listrik VOXA — desain elegan, performa tangguh,
            dan hemat energi untuk setiap perjalanan Anda.
          </p>
        </div>
      </section>

      {/* ── DESKTOP hero (sm+): landscape image, left text overlay ── */}
      <section
        className="hidden sm:block relative w-full overflow-hidden bg-sky-100"
        style={{ height: 'clamp(480px, 75vh, 820px)' }}
      >
        <img
          src={HERO_BG}
          alt="VOXA — Kendaraan Listrik untuk Jalanan Indonesia"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Soft radial glow behind text only */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 70% at 22% 52%, rgba(255,255,255,0.38) 0%, transparent 100%)' }}
        />
        <div className="absolute top-1/2 left-0 -translate-y-1/2" style={{ padding: '0 clamp(1.5rem, 6vw, 5rem)', maxWidth: '42rem' }}>
          <p className="text-[#0090B8] font-bold tracking-[0.22em] uppercase mb-3" style={{ fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)' }}>
            Kendaraan Listrik Indonesia
          </p>
          <h1
            className="font-display leading-none tracking-tight mb-4"
            style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)', color: '#0a2540', letterSpacing: '-0.02em' }}
          >
            BEBAS,{' '}
            <span style={{ color: '#00B4D8' }}>HEMAT,</span>
            <br />
            TANPA BATAS.
          </h1>
          <p className="mb-6 leading-relaxed" style={{ fontSize: 'clamp(0.8rem, 1.05vw, 0.95rem)', color: '#334e68', maxWidth: '26rem' }}>
            Sepeda listrik VOXA — desain elegan, performa tangguh, dan hemat energi untuk setiap perjalanan Anda.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/catalog/sepeda-listrik"
              className="inline-flex items-center gap-2 font-bold text-white rounded-full transition-all hover:brightness-110 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00B4D8 0%, #0090B8 100%)',
                padding: 'clamp(0.55rem, 1vw, 0.75rem) clamp(1.2rem, 2vw, 1.8rem)',
                fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                boxShadow: '0 4px 18px rgba(0,180,216,0.35)',
              }}
            >
              Temukan Produk
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 font-semibold rounded-full border-2 transition-all hover:bg-[#00B4D8]/10"
              style={{
                borderColor: '#00B4D8',
                color: '#0090B8',
                padding: 'clamp(0.5rem, 1vw, 0.7rem) clamp(1.2rem, 2vw, 1.8rem)',
                fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
              }}
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
        onSelect={setSelectedProduct}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: CAMPAIGN BANNER — 3-panel mosaic
      ═══════════════════════════════════════════════════════════════ */}
      <CampaignBanner
        img1={BANNER1}
        img2={BANNER2}
        img3={BANNER3}
        headline=""
        subtext=""
        ctaLabel=""
        ctaHref="/bisnis"
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: CARI VOXA ANDA — 4-column series grid
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">CARI VOXA ANDA</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularItems.map(item => (
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
          SECTION 8: PRODUCT ROW — POPULER SEKARANG (Batre)
      ═══════════════════════════════════════════════════════════════ */}
      <ProductRow
        title="POPULER SEKARANG"
        viewAllHref="/batre"
        products={batre}
        onSelect={setSelectedProduct}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: CERIA BARENG VOXA — horizontal scrollable photo strip
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">CERIA BARENG VOXA</h2>
          </div>
          {/* Horizontal scrollable strip */}
          <div
            className="flex gap-3 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#00B4D8 #e5e7eb' }}
          >
            {COMMUNITY_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="flex-none overflow-hidden bg-gray-100"
                style={{ width: '260px', height: '320px', borderRadius: '4px' }}
              >
                <img
                  src={src}
                  alt={`VOXA Customer ${i + 1}`}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <HomeProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
