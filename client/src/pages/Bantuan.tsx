import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, ChevronDown, MessageCircle, Phone, Mail, Shield } from 'lucide-react';

const faqs = [
  { cat: 'Produk', q: 'Berapa lama garansi produk VOXA?', a: 'Semua produk VOXA dilindungi garansi resmi selama 2 tahun untuk rangka dan motor, serta 1 tahun untuk baterai.' },
  { cat: 'Produk', q: 'Apakah sparepart VOXA mudah didapat?', a: 'Ya, VOXA memiliki jaringan distribusi sparepart yang tersebar di seluruh Indonesia. Anda bisa mendapatkan sparepart di showroom resmi atau memesan secara online.' },
  { cat: 'Produk', q: 'Berapa kecepatan maksimal sepeda listrik VOXA?', a: 'Tergantung model, kecepatan maksimal berkisar antara 25–45 km/jam. Setiap model memiliki spesifikasi yang berbeda.' },
  { cat: 'Pembelian', q: 'Bagaimana cara membeli produk VOXA?', a: 'Anda bisa membeli melalui showroom resmi VOXA terdekat, atau menghubungi tim kami via WhatsApp untuk pembelian online.' },
  { cat: 'Pembelian', q: 'Apakah ada cicilan untuk pembelian?', a: 'Ya, VOXA bekerja sama dengan beberapa lembaga pembiayaan. Hubungi showroom terdekat untuk informasi cicilan.' },
  { cat: 'Pembelian', q: 'Apakah bisa test ride sebelum membeli?', a: 'Ya, Anda bisa melakukan test ride gratis di semua showroom resmi VOXA.' },
  { cat: 'Perawatan', q: 'Bagaimana cara merawat baterai agar tahan lama?', a: 'Hindari pengisian penuh 100% setiap hari, simpan di suhu ruang, dan gunakan charger original VOXA. Pengisian ideal adalah 20–80%.' },
  { cat: 'Perawatan', q: 'Berapa lama interval servis rutin?', a: 'Servis rutin disarankan setiap 3 bulan atau 1.000 km, mana yang lebih dulu tercapai.' },
  { cat: 'Perawatan', q: 'Apakah bisa digunakan saat hujan?', a: 'Semua produk VOXA memiliki rating tahan percikan air (IP54 atau lebih). Namun hindari genangan air yang dalam.' },
  { cat: 'Teknis', q: 'Berapa lama pengisian baterai penuh?', a: 'Tergantung kapasitas baterai dan jenis charger. Rata-rata 4–8 jam untuk pengisian penuh dengan charger standar.' },
  { cat: 'Teknis', q: 'Apakah bisa digunakan untuk jalan berbukit?', a: 'Model tertentu seperti Elite Series dirancang untuk medan berbukit dengan torsi tinggi.' },
];

const categories = ['Semua', 'Produk', 'Pembelian', 'Perawatan', 'Teknis'];

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState('Semua');

  const filtered = activeCat === 'Semua' ? faqs : faqs.filter(f => f.cat === activeCat);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Bantuan</span>
          </div>
        </div>
      </div>

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
            PUSAT BANTUAN
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight">
            Pusat <span style={{ color: '#37C5FF' }}>Bantuan</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">Temukan jawaban untuk pertanyaan Anda atau hubungi tim kami.</p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 bg-[#00B4D8]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <MessageCircle size={24} />, title: 'WhatsApp', desc: 'Chat langsung dengan tim kami', action: 'Chat Sekarang', href: 'https://wa.me/6281234567890' },
              { icon: <Phone size={24} />, title: 'Telepon', desc: '+62 812 3456 7890', action: 'Hubungi Kami', href: 'tel:+6281234567890' },
              { icon: <Mail size={24} />, title: 'Email', desc: 'info@voxa.co.id', action: 'Kirim Email', href: 'mailto:info@voxa.co.id' },
            ].map(c => (
              <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-2xl p-5 transition-all group">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{c.title}</p>
                  <p className="text-white/70 text-sm">{c.desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/50 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">FAQ</p>
            <h2 className="font-display text-4xl text-gray-900 tracking-wide">PERTANYAAN UMUM</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCat === cat ? 'bg-[#00B4D8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="text-xs font-bold text-[#00B4D8] bg-[#00B4D8]/10 px-2 py-0.5 rounded-full shrink-0">{faq.cat}</span>
                    <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  </div>
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

      {/* Warranty */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-5xl">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#00B4D8]/10 rounded-2xl flex items-center justify-center text-[#00B4D8] shrink-0">
                <Shield size={28} />
              </div>
              <h3 className="font-display text-2xl text-gray-900 tracking-wide">GARANSI RESMI VOXA</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-4 py-3 text-left font-semibold rounded-tl-xl w-8">NO.</th>
                    <th className="px-4 py-3 text-left font-semibold">NAMA SPAREPART</th>
                    <th className="px-4 py-3 text-left font-semibold">GARANSI</th>
                    <th className="px-4 py-3 text-left font-semibold">TIDAK ADA GARANSI</th>
                    <th className="px-4 py-3 text-left font-semibold">JANGKA WAKTU</th>
                    <th className="px-4 py-3 text-left font-semibold rounded-tr-xl">REMARK</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      no: 1,
                      part: 'Motor power assy',
                      garansi: 'Magnetize motor dan dinamo tidak berfungsi dari pabrikan',
                      tidakGaransi: 'Masuk air, kabel putus akibat pemakaian',
                      jangka: '6 bulan',
                      remark: 'Penggantian dalam 6 bulan',
                    },
                    {
                      no: 2,
                      part: 'Frame',
                      garansi: 'Patah, welding lepas',
                      tidakGaransi: 'Rusak akibat kelebihan muatan',
                      jangka: '5 tahun',
                      remark: 'Ganti',
                    },
                    {
                      no: 3,
                      part: 'Controller',
                      garansi: 'Controller tidak berfungsi, suara kipas exhaust bising',
                      tidakGaransi: 'Masuk air, kabel putus, permukaan rusak/pecah',
                      jangka: '3 bulan',
                      remark: 'Ganti',
                    },
                    {
                      no: 4,
                      part: 'Charger',
                      garansi: 'Tidak berfungsi',
                      tidakGaransi: 'Masuk air, kabel putus, permukaan rusak/pecah',
                      jangka: '3 bulan',
                      remark: 'Ganti',
                    },
                    {
                      no: 5,
                      part: 'Spedometer',
                      garansi: 'Tidak berfungsi',
                      tidakGaransi: 'Masuk air, kabel putus, permukaan luar rusak/pecah, sikering putus',
                      jangka: '3 bulan',
                      remark: 'Ganti',
                    },
                    {
                      no: 6,
                      part: 'Aki / battery',
                      garansi: 'Bocoran dan tidak berfungsi',
                      tidakGaransi: 'Kerusakan bagian luar dan kerusakan oleh kelalaian pengguna, battery menggelembung akibat over charger',
                      jangka: '3 bulan',
                      remark: 'Ganti',
                    },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-gray-500 align-top">{row.no}.</td>
                      <td className="px-4 py-3 font-medium text-gray-800 align-top">{row.part}</td>
                      <td className="px-4 py-3 text-gray-600 align-top">{row.garansi}</td>
                      <td className="px-4 py-3 text-gray-600 align-top">{row.tidakGaransi}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold align-top whitespace-nowrap">{row.jangka}</td>
                      <td className="px-4 py-3 text-gray-600 align-top">{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-xs mt-5 italic">
              <strong>Catatan:</strong> Masa garansi ini mengacu pada kerusakan suku cadang yang disebabkan oleh proses produksi. Kerusakan yang disebabkan oleh pelanggan atau faktor lain tidak tercakup dalam garansi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
