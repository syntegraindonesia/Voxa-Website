import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowRight, ChevronRight, ChevronLeft, Filter, MessageCircle, Shield, SlidersHorizontal, Wrench, X, Zap } from 'lucide-react';
import { sepedaListrik, batre, type Product } from '@/data/products';
import { getProductGallery } from '@/data/productGalleries';

const categoryConfig = {
  'sepeda-listrik': {
    title: 'SEPEDA LISTRIK',
    subtitle: 'Temukan sepeda listrik VOXA yang sempurna untuk Anda',
    products: sepedaListrik,
    series: ['Semua', 'Liberty Series', 'Eiffel Series', 'Elite Series', 'Voxa Series'],
    headerBg: '/manus-storage/P1015067_6aacd27c.webp',
  },
  'batre': {
    title: 'BATRE',
    subtitle: 'Temukan batre VOXA yang sesuai untuk kendaraan Anda',
    products: batre,
    series: ['Semua', 'Greenlife Series', 'Tianneng Series', 'Chilwee Series', 'Lithium Series'],
    headerBg: '/manus-storage/P1015047_606cad4f.webp',
  },
  'sparepart': {
    title: 'SPAREPART',
    subtitle: 'Temukan sparepart VOXA untuk perawatan dan upgrade kendaraan Anda',
    products: [],
    series: ['Semua', 'Motor Listrik', 'Controller', 'Charger', 'Rem & Komponen', 'Ban & Velg'],
    headerBg: '/manus-storage/P1015079_0389577d.webp',
  },
};

const sparepartItems = [
  { id: 'sp-motor', name: 'Motor Listrik 250W', series: 'Motor Listrik', price: 'Rp 450.000', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&q=80', shortDesc: 'Motor brushless 250W untuk sepeda listrik entry-level', badge: undefined },
  { id: 'sp-motor-2', name: 'Motor Listrik 500W', series: 'Motor Listrik', price: 'Rp 750.000', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&q=80', shortDesc: 'Motor brushless 500W untuk performa tinggi', badge: undefined },
  { id: 'sp-controller', name: 'Controller 36V/15A', series: 'Controller', price: 'Rp 280.000', image: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=400&q=80', shortDesc: 'Controller standar untuk sepeda listrik 36V', badge: undefined },
  { id: 'sp-charger', name: 'Charger 48V/2A', series: 'Charger', price: 'Rp 185.000', image: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=400&q=80', shortDesc: 'Charger resmi VOXA 48V/2A', badge: 'Original' },
  { id: 'sp-rem', name: 'Rem Cakram Set', series: 'Rem & Komponen', price: 'Rp 320.000', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', shortDesc: 'Set rem cakram depan-belakang original', badge: undefined },
  { id: 'sp-ban', name: 'Ban Luar 20x2.0', series: 'Ban & Velg', price: 'Rp 145.000', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', shortDesc: 'Ban luar anti-selip ukuran 20x2.0', badge: undefined },
];

export default function Catalog() {
  const params = useParams<{ category: string }>();
  const category = (params.category || 'sepeda-listrik') as keyof typeof categoryConfig;
  const config = categoryConfig[category] || categoryConfig['sepeda-listrik'];
  const [selectedSeries, setSelectedSeries] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const allProducts: any[] = category === 'sparepart'
    ? sparepartItems
    : config.products;

  let filtered = selectedSeries === 'Semua'
    ? allProducts
    : allProducts.filter((p: any) => p.series === selectedSeries);

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a: any, b: any) => (a.priceNum || 0) - (b.priceNum || 0));
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a: any, b: any) => (b.priceNum || 0) - (a.priceNum || 0));

  const isProductCatalog = category === 'sepeda-listrik' || category === 'batre';

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{config.title}</span>
            <span className="text-gray-300 mx-1">|</span>
            {category !== 'sepeda-listrik' && (
              <Link href="/sepeda-listrik" className="hover:text-[#00B4D8] text-gray-400">Sepeda Listrik</Link>
            )}
            {category !== 'sepeda-listrik' && category !== 'batre' && (
              <ChevronRight size={14} />
            )}
            {category !== 'batre' && (
              <Link href="/batre" className="hover:text-[#00B4D8] text-gray-400">Batre</Link>
            )}
            {category !== 'batre' && category !== 'sparepart' && (
              <ChevronRight size={14} />
            )}
            {category !== 'sparepart' && (
              <Link href="/sparepart" className="hover:text-[#00B4D8] text-gray-400">Sparepart</Link>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <section
        className="relative py-4 md:py-14 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EAF9FF 0%, #ffffff 40%, #EAF9FF 100%)' }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#37C5FF' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: '#0A4A63' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#37C5FF 1px, transparent 1px), linear-gradient(90deg, #37C5FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ color: '#37C5FF', borderColor: '#37C5FF', background: 'rgba(55,197,255,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#37C5FF' }} />
            KATALOG PRODUK
          </div>
          <h1 className="text-2xl md:text-6xl font-black text-gray-900 mb-2 md:mb-5 tracking-tight">
            {config.title.split(' ').map((word: string, i: number) => i === config.title.split(' ').length - 1
              ? <span key={i} style={{ color: '#37C5FF' }}>{(i > 0 ? ' ' : '') + word}</span>
              : <span key={i}>{(i > 0 ? ' ' : '') + word}</span>
            )}
          </h1>
          <p className="hidden md:block text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">{config.subtitle}</p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1 min-w-0 pb-0.5">
              {config.series.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${selectedSeries === s ? 'bg-[#00B4D8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <Filter size={14} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs md:text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-[#00B4D8]"
              >
                <option value="default">Default</option>
                <option value="price-asc">Terendah</option>
                <option value="price-desc">Tertinggi</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container py-12">
        <p className="text-gray-500 text-sm mb-6">{filtered.length} produk ditemukan</p>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product: any) => (
              <CatalogCard
                key={product.id}
                product={product}
                category={category}
                onSelect={isProductCatalog ? setSelectedProduct : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-[#00B4D8] py-16">
        <div className="container text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl tracking-wide mb-4">TIDAK MENEMUKAN YANG ANDA CARI?</h2>
          <p className="text-white/80 text-lg mb-8">Hubungi tim kami untuk konsultasi produk yang tepat untuk kebutuhan Anda.</p>
          <a
            href="https://wa.me/628156161071"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#00B4D8] font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all"
          >
            Chat WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────

function CatalogCard({ product, category, onSelect }: { product: any; category: string; onSelect?: (p: Product) => void }) {
  const cardContent = (
    <div className="product-card group rounded-2xl overflow-hidden border border-gray-100 bg-white cursor-pointer h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500" />
        {/* Gallery count hint */}
        {(category === 'sepeda-listrik' || category === 'batre') && (() => {
          const gallery = getProductGallery(product.id, product.image);
          return gallery.length > 1 ? (
            <span className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
              +{gallery.length - 1} foto
            </span>
          ) : null;
        })()}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.series}</p>
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#00B4D8] transition-colors leading-snug">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.shortDesc}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#00B4D8] text-sm">{product.price}</span>
          <span className="text-xs text-gray-400 group-hover:text-[#00B4D8] transition-colors flex items-center gap-1">
            Detail <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );

  // Sepeda listrik & batre → open modal
  if (onSelect) {
    return (
      <div onClick={() => onSelect(product as Product)}>
        {cardContent}
      </div>
    );
  }

  // Sparepart → link to sparepart page
  return (
    <Link href="/sparepart">
      {cardContent}
    </Link>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const galleryImages = getProductGallery(product.id, product.image);

  const prev = () => setActiveImg(i => (i - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setActiveImg(i => (i + 1) % galleryImages.length);

  const waMessage = encodeURIComponent(`Halo VOXA, saya tertarik dengan produk ${product.name}. Bisa tolong informasi lebih lanjut?`);
  const waUrl = `https://wa.me/628156161071?text=${waMessage}`;

  // Build specs array from the product.specs object
  const specLabels: Record<string, string> = {
    jarakTempuh: 'Jarak Tempuh',
    baterai: 'Baterai',
    kecepatan: 'Kecepatan Maks',
    motor: 'Motor',
    pengisian: 'Waktu Pengisian',
    bobot: 'Bobot',
    dayaAngkut: 'Daya Angkut',
    dimensi: 'Dimensi',
    pengereman: 'Pengereman',
    ban: 'Ban',
    keamanan: 'Keamanan',
    kegunaan: 'Kegunaan',
    // Batre
    voltase: 'Voltase',
    kapasitas: 'Kapasitas',
    tipe: 'Tipe',
    merk: 'Merek',
    model: 'Model',
    daya: 'Daya',
    arusPelepasan: 'Arus Pelepasan',
    arusPengisian: 'Arus Pengisian',
    arusPengisianMaks: 'Arus Pengisian Maks',
    teganganPengisian: 'Tegangan Pengisian',
    isiKemasan: 'Isi Kemasan',
    rekomendasiMotor: 'Rekomendasi Motor',
    waktuPenggunaan: 'Waktu Penggunaan',
  };

  const specEntries = Object.entries(product.specs)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => ({ label: specLabels[k] || k, value: v as string }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="text-xs font-semibold text-[#00B4D8] uppercase tracking-wider">{product.series}</span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="p-5">
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden mb-3" style={{ height: 'min(50vw, 320px)' }}>
              <img
                src={galleryImages[activeImg]}
                alt={`${product.name} ${activeImg + 1}`}
                className="w-full h-full object-contain"
              />
              {galleryImages.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all">
                    <ChevronLeft size={18} className="text-gray-700" />
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all">
                    <ChevronRight size={18} className="text-gray-700" />
                  </button>
                  <span className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
                    {activeImg + 1}/{galleryImages.length}
                  </span>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-[#00B4D8]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-1">{product.name}</h2>
              <p className="text-lg font-bold text-[#00B4D8] mb-2">{product.price}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
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

            {/* Trust badges */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { icon: <Shield size={14} />, text: 'Garansi 2 Tahun' },
                { icon: <Wrench size={14} />, text: 'Sparepart Tersedia' },
                { icon: <Zap size={14} />, text: 'Produk Original' },
              ].map(badge => (
                <div key={badge.text} className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <span className="text-[#00B4D8]">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-all"
            >
              <MessageCircle size={18} />
              Chat WhatsApp — Tanya Harga
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
