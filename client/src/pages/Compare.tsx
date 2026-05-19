import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, X, Plus, MessageCircle } from 'lucide-react';
import { sepedaListrik, type Product } from '@/data/products';

export default function Compare() {
  const [selected, setSelected] = useState<Product[]>([sepedaListrik[0], sepedaListrik[2], sepedaListrik[10]]);
  const [showPicker, setShowPicker] = useState<number | null>(null);

  const addProduct = (product: Product, slot: number) => {
    const newSelected = [...selected];
    newSelected[slot] = product;
    setSelected(newSelected);
    setShowPicker(null);
  };

  const removeProduct = (slot: number) => {
    const newSelected = [...selected];
    newSelected.splice(slot, 1);
    setSelected(newSelected);
  };

  const specRows = [
    { key: 'jarakTempuh', label: 'Jarak Tempuh' },
    { key: 'baterai', label: 'Baterai' },
    { key: 'kecepatan', label: 'Kecepatan Maksimal' },
    { key: 'motor', label: 'Motor' },
    { key: 'bobot', label: 'Bobot' },
    { key: 'pengisian', label: 'Waktu Pengisian' },
    { key: 'kegunaan', label: 'Kegunaan' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Bandingkan Produk</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section
        className="relative py-14 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EAF9FF 0%, #ffffff 40%, #EAF9FF 100%)' }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#37C5FF' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: '#0A4A63' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#37C5FF 1px, transparent 1px), linear-gradient(90deg, #37C5FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ color: '#37C5FF', borderColor: '#37C5FF', background: 'rgba(55,197,255,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#37C5FF' }} />
            PERBANDINGAN
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight">
            Bandingkan <span style={{ color: '#37C5FF' }}>Produk</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">Bandingkan spesifikasi model VOXA untuk menemukan yang paling sesuai dengan kebutuhan Anda.</p>
        </div>
      </section>

      <div className="container py-12">
        {/* Product Selector Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="hidden md:flex items-center">
            <span className="font-display text-lg text-gray-400 tracking-wider">MODEL</span>
          </div>
          {[0, 1, 2].map(slot => (
            <div key={slot} className="relative">
              {selected[slot] ? (
                <div className="border-2 border-[#00B4D8] rounded-2xl overflow-hidden bg-white">
                  <div className="relative">
                    <img src={selected[slot].image} alt={selected[slot].name} className="w-full aspect-square object-cover" />
                    <button
                      onClick={() => removeProduct(slot)}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{selected[slot].series}</p>
                    <h3 className="font-bold text-gray-900 mb-1">{selected[slot].name}</h3>
                    <p className="font-bold text-[#00B4D8]">{selected[slot].price}</p>
                    <button
                      onClick={() => setShowPicker(slot)}
                      className="mt-3 text-xs text-gray-400 hover:text-[#00B4D8] transition-colors"
                    >
                      Ganti Model
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPicker(slot)}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl aspect-square flex flex-col items-center justify-center gap-3 hover:border-[#00B4D8] hover:bg-[#00B4D8]/5 transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#00B4D8]/10 rounded-full flex items-center justify-center transition-colors">
                    <Plus size={20} className="text-gray-400 group-hover:text-[#00B4D8]" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-[#00B4D8] font-medium">Tambah Model</span>
                </button>
              )}

              {/* Product Picker Dropdown */}
              {showPicker === slot && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-500 tracking-wider">PILIH MODEL</p>
                  </div>
                  {sepedaListrik.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addProduct(p, slot)}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#00B4D8]/5 transition-colors text-left"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.price}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowPicker(null)}
                    className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 border-t border-gray-100"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {selected.length > 0 && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-[#00B4D8] text-white">
                  <th className="text-left px-6 py-4 font-display tracking-wider text-sm w-1/4">SPESIFIKASI</th>
                  {selected.map(p => (
                    <th key={p.id} className="text-center px-4 py-4 font-display tracking-wider text-sm">{p.name}</th>
                  ))}
                  {selected.length < 3 && <th className="px-4 py-4" />}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row, i) => (
                  <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-500">{row.label}</td>
                    {selected.map(p => (
                      <td key={p.id} className="text-center px-4 py-4 text-sm font-bold text-gray-900">
                        {(p.specs as any)[row.key] || '—'}
                      </td>
                    ))}
                    {selected.length < 3 && <td className="px-4 py-4" />}
                  </tr>
                ))}
                {/* Price Row */}
                <tr className="bg-[#00B4D8]/5 border-t-2 border-[#00B4D8]/20">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">Harga</td>
                  {selected.map(p => (
                    <td key={p.id} className="text-center px-4 py-4 text-base font-bold text-[#00B4D8]">{p.price}</td>
                  ))}
                  {selected.length < 3 && <td className="px-4 py-4" />}
                </tr>
                {/* CTA Row */}
                <tr className="bg-white">
                  <td className="px-6 py-4" />
                  {selected.map(p => {
                    const waMsg = encodeURIComponent(`Halo VOXA, saya tertarik dengan produk ${p.name}. Bisa tolong informasi lebih lanjut?`);
                    return (
                      <td key={p.id} className="px-4 py-4 text-center">
                        <a
                          href={`https://wa.me/6281234567890?text=${waMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-green-600 transition-colors"
                        >
                          <MessageCircle size={14} />
                          Chat WA
                        </a>
                      </td>
                    );
                  })}
                  {selected.length < 3 && <td className="px-4 py-4" />}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* All Products Table */}
        <div className="mt-16">
          <h2 className="font-display text-3xl text-gray-900 tracking-wide mb-8">SEMUA MODEL SEPEDA LISTRIK</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-950 text-white">
                  <th className="text-left px-6 py-4 font-display tracking-wider text-sm">MODEL</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">JARAK TEMPUH</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">BATERAI</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">KECEPATAN</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">KEGUNAAN</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">HARGA</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {sepedaListrik.map((p, i) => (
                  <tr key={p.id} className={`border-b border-gray-100 hover:bg-[#00B4D8]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <Link href={`/products/${p.id}`} className="font-bold text-gray-900 hover:text-[#00B4D8] transition-colors">{p.name}</Link>
                      <p className="text-xs text-gray-400 mt-0.5">{p.series}</p>
                    </td>
                    <td className="text-center px-4 py-4 text-sm text-gray-700">{p.specs.jarakTempuh}</td>
                    <td className="text-center px-4 py-4 text-sm text-gray-700">{p.specs.baterai}</td>
                    <td className="text-center px-4 py-4 text-sm text-gray-700">{p.specs.kecepatan}</td>
                    <td className="text-center px-4 py-4 text-sm text-gray-700">{p.specs.kegunaan}</td>
                    <td className="text-center px-4 py-4 text-sm font-bold text-[#00B4D8]">{p.price}</td>
                    <td className="text-center px-4 py-4">
                      <Link href={`/products/${p.id}`} className="inline-flex items-center gap-1 text-xs text-[#00B4D8] font-bold hover:underline">
                        Detail <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
