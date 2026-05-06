import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { sepedaListrik, batre } from '@/data/products';

// ─── Sparepart data (mirrors Sparepart.tsx) ───────────────────────────────────

const BATTERY_IMAGE = 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=600&q=80';
const BIKE_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';
const BIKE_IMAGE_2 = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80';
const BIKE_IMAGE_3 = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80';

interface UnifiedProduct {
  id: string;
  name: string;
  category: 'sepeda-listrik' | 'batre' | 'sparepart';
  series: string;
  price: string;
  priceNum: number;
  shortDesc: string;
  image: string;
  badge?: string;
}

const sparepartItems: UnifiedProduct[] = [
  { id: 'sp-motor-250w', name: 'Motor Listrik 250W', category: 'sparepart', series: 'Motor Listrik', price: 'Rp 450.000', priceNum: 450000, shortDesc: 'Motor brushless 250W untuk sepeda listrik entry-level', image: BIKE_IMAGE },
  { id: 'sp-motor-500w', name: 'Motor Listrik 500W', category: 'sparepart', series: 'Motor Listrik', price: 'Rp 750.000', priceNum: 750000, shortDesc: 'Motor brushless 500W untuk performa tinggi', image: BIKE_IMAGE_2, badge: 'Populer' },
  { id: 'sp-controller-36v', name: 'Controller 36V/15A', category: 'sparepart', series: 'Controller', price: 'Rp 280.000', priceNum: 280000, shortDesc: 'Controller standar untuk sepeda listrik 36V', image: BATTERY_IMAGE },
  { id: 'sp-controller-48v', name: 'Controller 48V/20A', category: 'sparepart', series: 'Controller', price: 'Rp 380.000', priceNum: 380000, shortDesc: 'Controller 48V untuk performa lebih tinggi', image: BATTERY_IMAGE, badge: 'Original' },
  { id: 'sp-charger-48v-2a', name: 'Charger 48V/2A', category: 'sparepart', series: 'Charger', price: 'Rp 185.000', priceNum: 185000, shortDesc: 'Charger resmi VOXA 48V/2A, pengisian aman dan cepat', image: BATTERY_IMAGE, badge: 'Original' },
  { id: 'sp-charger-60v-3a', name: 'Charger 60V/3A', category: 'sparepart', series: 'Charger', price: 'Rp 265.000', priceNum: 265000, shortDesc: 'Charger 60V/3A untuk model Elite Series', image: BATTERY_IMAGE },
  { id: 'sp-rem-cakram', name: 'Rem Cakram Set', category: 'sparepart', series: 'Rem & Komponen', price: 'Rp 320.000', priceNum: 320000, shortDesc: 'Set rem cakram depan-belakang original VOXA', image: BIKE_IMAGE_3 },
  { id: 'sp-rem-hidrolik', name: 'Rem Hidrolik Set', category: 'sparepart', series: 'Rem & Komponen', price: 'Rp 580.000', priceNum: 580000, shortDesc: 'Rem hidrolik premium untuk Elite dan Eiffel Series', image: BIKE_IMAGE_3, badge: 'Premium' },
  { id: 'sp-ban-20x2', name: 'Ban Luar 20x2.0', category: 'sparepart', series: 'Ban & Velg', price: 'Rp 145.000', priceNum: 145000, shortDesc: 'Ban luar anti-selip ukuran 20x2.0 untuk jalan kota', image: BIKE_IMAGE },
  { id: 'sp-ban-26x2', name: 'Ban Luar 26x2.0', category: 'sparepart', series: 'Ban & Velg', price: 'Rp 175.000', priceNum: 175000, shortDesc: 'Ban luar 26 inci untuk model Eiffel dan Elite', image: BIKE_IMAGE },
  { id: 'sp-velg-20', name: 'Velg Aluminium 20"', category: 'sparepart', series: 'Ban & Velg', price: 'Rp 420.000', priceNum: 420000, shortDesc: 'Velg aluminium alloy ringan ukuran 20 inci', image: BIKE_IMAGE_2 },
];

// Normalize sepedaListrik and batre to UnifiedProduct shape
const bikeProducts: UnifiedProduct[] = sepedaListrik.map(p => ({
  id: p.id,
  name: p.name,
  category: 'sepeda-listrik' as const,
  series: p.series,
  price: p.price,
  priceNum: p.priceNum,
  shortDesc: p.shortDesc,
  image: p.image,
  badge: p.badge,
}));

const batreProducts: UnifiedProduct[] = batre.map(p => ({
  id: p.id,
  name: p.name,
  category: 'batre' as const,
  series: p.series,
  price: p.price,
  priceNum: p.priceNum,
  shortDesc: p.shortDesc,
  image: p.image,
  badge: p.badge,
}));

const ALL_PRODUCTS: UnifiedProduct[] = [...bikeProducts, ...batreProducts, ...sparepartItems];

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabKey = 'semua' | 'sepeda-listrik' | 'batre' | 'sparepart';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'sepeda-listrik', label: 'Sepeda Listrik' },
  { key: 'batre', label: 'Batre' },
  { key: 'sparepart', label: 'Sparepart' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Urutkan: Default' },
  { value: 'price-asc', label: 'Harga: Terendah' },
  { value: 'price-desc', label: 'Harga: Tertinggi' },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Katalog() {
  const [activeTab, setActiveTab] = useState<TabKey>('semua');
  const [sortBy, setSortBy] = useState('default');

  let filtered: UnifiedProduct[] =
    activeTab === 'semua' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === activeTab);

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.priceNum - b.priceNum);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.priceNum - a.priceNum);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">KATALOG PRODUK</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-950 text-white py-16">
        <div className="container">
          <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">KATALOG PRODUK</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-4">TEMUKAN VOXA ANDA</h1>
          <p className="text-gray-400 text-lg max-w-xl">Jelajahi semua produk VOXA untuk kebutuhan Anda</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[calc(4rem+2.25rem)] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab.key
                      ? 'bg-[#00B4D8] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-[#00B4D8]"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
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
            {filtered.map(product => (
              <KatalogCard key={product.id} product={product} />
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
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#00B4D8] font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all"
          >
            Chat WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────

function KatalogCard({ product }: { product: UnifiedProduct }) {
  // Sparepart items link to WhatsApp; bike and batre link to product detail
  const isSparepart = product.category === 'sparepart';

  const cardContent = (
    <div className="product-card group rounded-2xl overflow-hidden border border-gray-100 bg-white cursor-pointer h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#00B4D8] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.series}</p>
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#00B4D8] transition-colors leading-snug">
          {product.name}
        </h3>
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

  if (isSparepart) {
    return (
      <a
        href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan ${encodeURIComponent(product.name)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/products/${product.id}`}>
      {cardContent}
    </Link>
  );
}
