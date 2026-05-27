import { useState } from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { getProductById, Product } from '@/data/products';
import { getLoginUrl } from '@/const';

export default function WishlistPage() {
  const { savedIds, toggle } = useWishlist();
  const { addItem, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const savedProducts = Array.from(savedIds)
    .map((id) => getProductById(id))
    .filter(Boolean) as Product[];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <Heart size={48} className="text-gray-300" />
        <h2 className="text-xl font-bold text-gray-800">Wishlist Anda</h2>
        <p className="text-gray-500 text-center text-sm max-w-xs">
          Masuk untuk menyimpan produk favorit Anda dan mengaksesnya kapan saja.
        </p>
        <a
          href={getLoginUrl()}
          className="px-6 py-3 bg-[#00B4D8] text-white font-semibold rounded-lg hover:bg-[#0099bb] transition-colors"
        >
          Masuk Sekarang
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Wishlist Saya</h1>
          {savedProducts.length > 0 && (
            <span className="ml-1 text-sm text-gray-400">({savedProducts.length} produk)</span>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Heart size={48} className="text-gray-200" />
            <p className="text-gray-400 text-sm">Belum ada produk tersimpan.</p>
            <Link
              href="/sepeda-listrik"
              className="px-5 py-2.5 bg-[#00B4D8] text-white text-sm font-semibold rounded-lg hover:bg-[#0099bb] transition-colors"
            >
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full aspect-square object-contain bg-gray-50 p-2"
                  />
                  <button
                    onClick={() => toggle(p.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform"
                    aria-label="Hapus dari wishlist"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{p.series}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5 leading-tight">{p.name}</p>
                  <p className="text-sm font-bold text-[#00B4D8] mt-1">{p.price}</p>
                  <button
                    onClick={() => { addItem(p.id); openCart(); }}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 bg-[#00B4D8] text-white text-xs font-semibold rounded-lg hover:bg-[#0099bb] transition-colors"
                  >
                    <ShoppingBag size={12} />
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
