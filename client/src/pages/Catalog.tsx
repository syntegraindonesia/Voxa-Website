import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowRight, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { products, sepedaListrik, batre, type Product } from '@/data/products';

const categoryConfig = {
  'sepeda-listrik': {
    title: 'SEPEDA LISTRIK',
    subtitle: 'Temukan sepeda listrik VOXA yang sempurna untuk Anda',
    products: sepedaListrik,
    series: ['Semua', 'Liberty Series', 'Eiffel Series', 'Elite Series', 'Voxa Series'],
  },
  'batre': {
    title: 'BATERAI',
    subtitle: 'Pilihan baterai berkualitas untuk sepeda listrik Anda',
    products: batre,
    series: ['Semua', 'Greenlife Series', 'TNE Series', 'Chilwee Series', 'Lithium Series'],
  },
  'sparepart': {
    title: 'SPAREPART',
    subtitle: 'Suku cadang original VOXA tersedia lengkap',
    products: [],
    series: ['Semua', 'Motor Listrik', 'Controller', 'Charger', 'Rem & Komponen', 'Ban & Velg'],
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

  const allProducts: any[] = category === 'sparepart'
    ? sparepartItems
    : config.products;

  let filtered = selectedSeries === 'Semua'
    ? allProducts
    : allProducts.filter((p: any) => p.series === selectedSeries);

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a: any, b: any) => (a.priceNum || 0) - (b.priceNum || 0));
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a: any, b: any) => (b.priceNum || 0) - (a.priceNum || 0));

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{config.title}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-950 text-white py-16">
        <div className="container">
          <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">KATALOG PRODUK</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-4">{config.title}</h1>
          <p className="text-gray-400 text-lg max-w-xl">{config.subtitle}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[calc(2.25rem+3.5rem)] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Series Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />
              {config.series.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedSeries === s ? 'bg-[#00B4D8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s}
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
                <option value="default">Urutkan: Default</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
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
              <CatalogCard key={product.id} product={product} category={category} />
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

function CatalogCard({ product, category }: { product: any; category: string }) {
  const href = category === 'sparepart' ? `/catalog/sparepart` : `/products/${product.id}`;
  return (
    <Link href={href}>
      <div className="product-card group rounded-2xl overflow-hidden border border-gray-100 bg-white cursor-pointer h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#00B4D8] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
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
    </Link>
  );
}
