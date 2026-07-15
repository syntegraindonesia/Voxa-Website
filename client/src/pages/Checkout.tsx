import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getProductById } from '@/data/products';
import { ALL_SPAREPART_PRODUCTS } from '@/pages/Sparepart';

function resolveProduct(id: string) {
  const p = getProductById(id);
  if (p) return { name: p.name, image: p.image, priceNum: p.priceNum };
  const sp = ALL_SPAREPART_PRODUCTS.find(s => s.id === id);
  if (sp) return { name: sp.name, image: sp.images[0] ?? '', priceNum: sp.priceNum };
  return undefined;
}
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function Checkout() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const enriched = items.map((item) => ({
    ...item,
    product: resolveProduct(item.productId),
  }));

  const subtotal = enriched.reduce((sum, item) => {
    return sum + (item.product?.priceNum ?? 0) * item.quantity;
  }, 0);

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      clearCart();
      // Redirect to Xendit hosted payment page
      window.location.href = data.invoiceUrl;
    },
    onError: (err) => {
      toast.error(err.message || 'Terjadi kesalahan. Coba lagi.');
    },
  });

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Nama minimal 2 karakter';
    if (!form.email.includes('@')) e.email = 'Email tidak valid';
    if (!form.phone || form.phone.replace(/\D/g, '').length < 8) e.phone = 'Nomor HP tidak valid';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    createOrder.mutate({
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        color: i.color,
      })),
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || undefined,
      },
    });
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag size={48} className="text-gray-200" />
        <p className="text-gray-500 text-lg">Keranjang Anda kosong.</p>
        <Link href="/sepeda-listrik" className="px-6 py-3 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-[#0099bb] transition-colors">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/sepeda-listrik" className="hover:text-[#00B4D8]">Produk</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container py-10 max-w-5xl">
        <h1 className="text-2xl font-black text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left: customer form */}
            <div className="lg:col-span-3 space-y-6">

              {/* Customer Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-5">Data Pemesan</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Nama lengkap kamu"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-[#00B4D8] ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="email@kamu.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-[#00B4D8] ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    <p className="text-gray-400 text-xs mt-1">Invoice dan konfirmasi pembayaran dikirim ke email ini.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor HP / WhatsApp *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-[#00B4D8] ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Pengiriman <span className="text-gray-400 font-normal">(opsional)</span></label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="Jl. Nama Jalan No. XX, Kota"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-colors focus:border-[#00B4D8] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
                <Lock size={16} className="text-[#00B4D8] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Pembayaran diproses melalui <strong>Xendit</strong> — platform pembayaran terpercaya di Indonesia. Anda dapat membayar dengan transfer bank, e-wallet (GoPay, OVO, Dana), QRIS, atau kartu kredit/debit.
                </p>
              </div>
            </div>

            {/* Right: order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-5">Ringkasan Pesanan</h2>

                {/* Items */}
                <ul className="space-y-4 mb-5">
                  {enriched.map((item) => (
                    <li key={item.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                        {item.product && (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain p-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{item.product?.name ?? item.productId}</p>
                        {item.color !== 'Default' && <p className="text-xs text-gray-400">{item.color}</p>}
                        <p className="text-xs text-gray-500 mt-0.5">{formatRp(item.product?.priceNum ?? 0)} × {item.quantity}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                            className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus size={9} />
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-5 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus size={9} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-1 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatRp(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Biaya pengiriman</span>
                    <span className="text-gray-400 text-xs">Dikonfirmasi via WhatsApp</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-base pt-1 border-t border-gray-100 mt-1">
                    <span>Total</span>
                    <span className="text-[#00B4D8]">{formatRp(subtotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createOrder.isPending || items.length === 0}
                  className="w-full py-3.5 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-[#0099bb] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createOrder.isPending ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Bayar Sekarang</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/628156161071?text=${encodeURIComponent(
                    'Halo, saya ingin bertanya mengenai pesanan saya di VOXA.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-full py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold text-center rounded-xl hover:border-gray-400 transition-colors"
                >
                  Ada pertanyaan? Chat WhatsApp
                </a>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
