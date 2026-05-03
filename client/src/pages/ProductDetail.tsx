import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { ChevronRight, MessageCircle, Zap, Shield, Wrench, ChevronDown, ArrowRight, Star } from 'lucide-react';
import { getProductById, sepedaListrik } from '@/data/products';

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=85',
  'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=85',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=85',
];

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const product = getProductById(params.id || '');
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-4xl text-gray-900 mb-4">PRODUK TIDAK DITEMUKAN</h2>
          <Link href="/catalog/sepeda-listrik" className="text-[#00B4D8] font-bold hover:underline">
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = sepedaListrik
    .filter(p => p.series === product.series && p.id !== product.id)
    .slice(0, 4);

  const waMessage = encodeURIComponent(`Halo VOXA, saya tertarik dengan produk ${product.name}. Bisa tolong informasi lebih lanjut?`);
  const waUrl = `https://wa.me/6281234567890?text=${waMessage}`;

  const categoryPath = product.category === 'batre' ? '/catalog/batre' : '/catalog/sepeda-listrik';
  const categoryLabel = product.category === 'batre' ? 'Baterai' : 'Sepeda Listrik';

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <Link href={categoryPath} className="hover:text-[#00B4D8]">{categoryLabel}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={GALLERY_IMAGES[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#00B4D8]' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            {product.badge && (
              <span className="inline-flex self-start bg-[#00B4D8] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}
            <p className="text-gray-400 text-sm mb-2">{product.series}</p>
            <h1 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-3">{product.name}</h1>
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#00B4D8] text-[#00B4D8]" />)}
              <span className="text-gray-400 text-sm ml-2">(48 ulasan)</span>
            </div>
            <p className="text-gray-600 text-base leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <p className="text-gray-500 text-sm mb-1">Harga Mulai</p>
              <p className="font-display text-4xl text-[#00B4D8] tracking-wide">{product.price}</p>
              <p className="text-gray-400 text-xs mt-1">*Harga dapat berbeda di setiap showroom</p>
            </div>

            {/* Key Specs */}
            {product.category === 'sepeda-listrik' && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Jarak Tempuh', value: product.specs.jarakTempuh },
                  { label: 'Kecepatan Maks', value: product.specs.kecepatan },
                  { label: 'Baterai', value: product.specs.baterai },
                  { label: 'Waktu Pengisian', value: product.specs.pengisian },
                ].map(spec => (
                  <div key={spec.label} className="bg-white border border-gray-100 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{spec.label}</p>
                    <p className="font-bold text-gray-900 text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all text-base shadow-lg hover:shadow-green-500/30"
              >
                <MessageCircle size={20} />
                Chat WhatsApp — Tanya Harga
              </a>
              <Link
                href="/compare"
                className="flex items-center justify-center gap-2 w-full border-2 border-[#00B4D8] text-[#00B4D8] font-bold py-3.5 rounded-2xl hover:bg-[#00B4D8] hover:text-white transition-all text-sm"
              >
                Bandingkan dengan Model Lain
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
              {[
                { icon: <Shield size={16} />, text: 'Garansi 2 Tahun' },
                { icon: <Wrench size={16} />, text: 'Sparepart Tersedia' },
                { icon: <Zap size={16} />, text: 'Produk Original' },
              ].map(badge => (
                <div key={badge.text} className="flex items-center gap-2 text-gray-500 text-xs">
                  <span className="text-[#00B4D8]">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 tracking-wide mb-10 text-center">FITUR UNGGULAN</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:border-[#00B4D8]/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[#00B4D8]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={20} className="text-[#00B4D8]" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Specs Table */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 tracking-wide mb-10 text-center">SPESIFIKASI LENGKAP</h2>
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => {
                  const labels: Record<string, string> = {
                    jarakTempuh: 'Jarak Tempuh',
                    baterai: 'Baterai',
                    kecepatan: 'Kecepatan Maksimal',
                    kegunaan: 'Kegunaan',
                    voltase: 'Voltase',
                    kapasitas: 'Kapasitas',
                    bobot: 'Bobot',
                    motor: 'Motor',
                    pengisian: 'Waktu Pengisian',
                  };
                  return (
                    <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-500 w-1/2">{labels[key] || key}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{value as string}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-950 text-white">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-10 text-center">COCOK UNTUK</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {product.useCases.map((useCase, i) => (
              <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center hover:bg-[#00B4D8]/20 hover:border-[#00B4D8]/40 transition-all">
                <div className="w-10 h-10 bg-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <p className="font-semibold text-white">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 tracking-wide mb-10 text-center">PERTANYAAN UMUM</h2>
          <div className="space-y-3">
            {product.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-[#00B4D8] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-gray-900 tracking-wide">PRODUK SERUPA</h2>
              <Link href={categoryPath} className="flex items-center gap-2 text-[#00B4D8] font-bold text-sm hover:gap-3 transition-all">
                Lihat Semua <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <div className="product-card group rounded-2xl overflow-hidden border border-gray-100 bg-white cursor-pointer">
                    <div className="aspect-square overflow-hidden bg-white">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#00B4D8] transition-colors">{p.name}</h3>
                      <p className="font-bold text-[#00B4D8] text-sm">{p.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky WhatsApp CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 p-3 shadow-2xl">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all text-base"
        >
          <MessageCircle size={20} />
          Chat WhatsApp — Tanya Harga {product.name}
        </a>
      </div>
      {/* Spacer for sticky CTA on mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
