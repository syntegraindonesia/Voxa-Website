import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getProductById } from '@/data/products';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const enriched = items.map((item) => ({
    ...item,
    product: getProductById(item.productId),
  }));

  const subtotal = enriched.reduce((sum, item) => {
    const price = item.product?.priceNum ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const formatRp = (n: number) =>
    'Rp ' + n.toLocaleString('id-ID');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[160] w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gray-700" />
            <h2 className="font-bold text-gray-900">Keranjang</h2>
            {items.length > 0 && (
              <span className="text-xs text-gray-400">({items.length} item)</span>
            )}
          </div>
          <button onClick={closeCart} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {enriched.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-4 py-16 text-center">
              <ShoppingBag size={40} className="text-gray-200" />
              <p className="text-gray-400 text-sm">Keranjang Anda masih kosong.</p>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 bg-[#00B4D8] text-white text-sm font-semibold rounded-lg hover:bg-[#0099bb] transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-4">
              {enriched.map((item) => (
                <li key={item.id} className="py-4 flex gap-3">
                  {/* Image */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    {item.product ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                      {item.product?.name ?? item.productId}
                    </p>
                    {item.color !== 'Default' && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.color}</p>
                    )}
                    <p className="text-sm font-bold text-[#00B4D8] mt-1">
                      {item.product ? formatRp(item.product.priceNum) : '—'}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-400 transition-colors self-start mt-1"
                    aria-label="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {enriched.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-base font-bold text-gray-900">{formatRp(subtotal)}</span>
            </div>

            {isAuthenticated ? (
              <a
                href={`https://wa.me/628156161071?text=${encodeURIComponent(
                  'Halo, saya ingin memesan:\n' +
                  enriched.map((i) => `- ${i.product?.name ?? i.productId} x${i.quantity}`).join('\n') +
                  `\nTotal: ${formatRp(subtotal)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-[#25D366] text-white text-sm font-bold text-center rounded-xl hover:bg-[#1ebe5d] transition-colors"
              >
                Pesan via WhatsApp
              </a>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 text-center">Masuk untuk melanjutkan pemesanan</p>
                <a
                  href={getLoginUrl()}
                  className="block w-full py-3 bg-[#00B4D8] text-white text-sm font-bold text-center rounded-xl hover:bg-[#0099bb] transition-colors"
                >
                  Masuk & Checkout
                </a>
              </div>
            )}

            <button
              onClick={clearCart}
              className="w-full py-2 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Kosongkan Keranjang
            </button>
          </div>
        )}
      </div>
    </>
  );
}
