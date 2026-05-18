import { useState } from 'react';
import { Link } from 'wouter';
import {
  ChevronRight, TrendingUp, Star, Megaphone, Factory,
  ShieldCheck, BarChart3, ArrowRight, CheckCircle, MessageCircle,
} from 'lucide-react';

// ─── CDN image constants ──────────────────────────────────────────────────────
const IMG_HERO       = '/manus-storage/P1014908_5a27f79b.webp'; // wide factory floor
const IMG_FACTORY    = '/manus-storage/P1015061_fda3a73c.webp'; // assembly worker (new)
const IMG_CTA_BG     = '/manus-storage/P1015177_e752378f.webp'; // warehouse/dark

// Gallery: 11 unique images (no duplicates with hero/factory/cta backgrounds)
const GALLERY = [
  '/manus-storage/P1015005_29a053b2.webp',   // 0 — wide (spans 2 cols)
  '/manus-storage/P1015061_7b0fdb62.webp',   // 1
  '/manus-storage/P1015067_6aacd27c.webp',   // 2
  '/manus-storage/P1015079_0389577d.webp',   // 3
  '/manus-storage/P1015095_d9359bc1.webp',   // 4
  '/manus-storage/P1015061_fda3a73c.webp',   // 5 — new assembly worker photo
  '/manus-storage/P1014963_3bf46146.webp',   // 6 — wide (spans 2 cols)
  '/manus-storage/P1014999_94114b94.webp',   // 7
  '/manus-storage/P1015033_108e19a9.webp',   // 8
  '/manus-storage/P1015047_606cad4f.webp',   // 9
  '/manus-storage/P1015105_831765ce.webp',   // 10
];

const BENEFITS = [
  {
    icon: <TrendingUp size={26} />,
    title: 'Profit Menarik',
    desc: 'VOXA memberikan peluang keuntungan kompetitif bagi distributor dengan pasar kendaraan listrik yang terus berkembang.',
  },
  {
    icon: <Star size={26} />,
    title: 'Produk Modern & Berkualitas',
    desc: 'Desain stylish, nyaman digunakan, dan cocok untuk kebutuhan harian maupun operasional bisnis.',
  },
  {
    icon: <Megaphone size={26} />,
    title: 'Dukungan Promosi',
    desc: 'Dukungan branding, promosi, dan materi pemasaran untuk membantu meningkatkan penjualan distributor.',
  },
  {
    icon: <Factory size={26} />,
    title: 'Produksi Lokal Indonesia',
    desc: 'Pabrik perakitan di Balaraja, Tangerang dengan kapasitas produksi yang terus berkembang.',
  },
  {
    icon: <ShieldCheck size={26} />,
    title: 'Garansi & Sparepart',
    desc: 'Didukung layanan after-sales dan ketersediaan suku cadang untuk kenyamanan pelanggan dan distributor.',
  },
  {
    icon: <BarChart3 size={26} />,
    title: 'Pasar Kendaraan Listrik Bertumbuh',
    desc: 'Permintaan kendaraan listrik terus meningkat di Indonesia — momentum terbaik untuk bergabung.',
  },
];

export default function Distributor() {
  const [form, setForm] = useState({ nama: '', perusahaan: '', kota: '', email: '', telepon: '', pesan: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Halo VOXA, saya ${form.nama} dari ${form.perusahaan} (${form.kota}).\n\nEmail: ${form.email}\nTelepon: ${form.telepon}\n\nPesan: ${form.pesan}`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Breadcrumb ── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Distributor VOXA</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_HERO} alt="Pabrik VOXA" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        </div>
        <div className="relative container py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#00B4D8]/20 border border-[#00B4D8]/40 text-[#00B4D8] text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest">
              PROGRAM DISTRIBUTOR RESMI VOXA
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-none mb-6 tracking-wide">
              BANGUN BISNIS<br />
              <span className="text-[#00B4D8]">MASA DEPAN</span><br />
              BERSAMA VOXA
            </h1>
            <p className="text-gray-200 text-base md:text-lg mb-10 leading-relaxed max-w-xl">
              Peluang distributor sepeda listrik modern dengan dukungan produksi lokal, produk berkualitas, dan pasar kendaraan listrik yang terus berkembang di Indonesia.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#kontak-distributor"
                className="inline-flex items-center gap-2 bg-[#00B4D8] text-white font-bold px-8 py-4 rounded-full hover:bg-[#0096b8] transition-all text-sm shadow-lg shadow-[#00B4D8]/30"
              >
                Menjadi Distributor <ArrowRight size={16} />
              </a>
              <a
                href="#kontak-distributor"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-8 py-4 rounded-full hover:border-white hover:bg-white/10 transition-all text-sm"
              >
                <MessageCircle size={16} /> Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. TRUST BAR
      ══════════════════════════════════════════════════════════ */}
      <section className="py-10 bg-gradient-to-r from-[#00B4D8] to-[#0096b8]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div className="text-center md:text-left">
              <p className="font-bold text-lg md:text-xl mb-1">Mendukung Pertumbuhan Kendaraan Listrik Indonesia</p>
              <p className="text-white/80 text-sm max-w-xl">
                VOXA menghadirkan peluang bisnis kendaraan listrik dengan dukungan produksi lokal, after-sales, dan sistem distribusi yang terus berkembang.
              </p>
            </div>
            <a
              href="#kontak-distributor"
              className="shrink-0 bg-white text-[#00B4D8] font-bold px-7 py-3 rounded-full hover:bg-gray-50 transition-all text-sm shadow-md"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. BENEFITS SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest mb-3 uppercase">Keunggulan Program</p>
            <h2 className="font-display text-3xl md:text-5xl text-gray-900 tracking-wide mb-4">
              Mengapa Menjadi Distributor VOXA?
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Peluang bisnis kendaraan listrik modern dengan dukungan penuh dari VOXA.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(b => (
              <div
                key={b.title}
                className="group bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-[#00B4D8]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#00B4D8]/10 rounded-2xl flex items-center justify-center text-[#00B4D8] mb-5 group-hover:bg-[#00B4D8] group-hover:text-white transition-all duration-300">
                  {b.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. FACTORY SPLIT SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-0 bg-gray-950 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[520px]">
          {/* Left: image */}
          <div className="relative lg:w-1/2 min-h-[320px] lg:min-h-0">
            <img
              src={IMG_FACTORY}
              alt="Pabrik VOXA Balaraja"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-950/60 hidden lg:block" />
          </div>
          {/* Right: text */}
          <div className="lg:w-1/2 flex items-center px-8 py-16 lg:px-16">
            <div className="max-w-lg">
              <p className="text-[#00B4D8] text-xs font-bold tracking-widest mb-4 uppercase">Produksi Lokal</p>
              <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide leading-tight mb-6">
                Produksi Lokal untuk Masa Depan Mobilitas Indonesia
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                VOXA memiliki fasilitas perakitan kendaraan listrik di Balaraja, Tangerang untuk memastikan kualitas produk, ketersediaan unit, dan dukungan jangka panjang bagi mitra distributor di seluruh Indonesia.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Produksi Lokal', 'Dukungan Distributor', 'After Sales', 'Kualitas Terjamin'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-[#00B4D8] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. GALLERY SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest mb-3 uppercase">Fasilitas & Proses</p>
            <h2 className="font-display text-3xl md:text-5xl text-gray-900 tracking-wide mb-4">
              Produksi & Kualitas VOXA
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Setiap unit dirakit dengan perhatian terhadap kualitas, performa, dan detail.
            </p>
          </div>
          {/* Fixed 4-column grid — no duplicates, no empty cells */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY.map((src, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl group ${
                  i === 0 || i === 6 ? 'col-span-2' : ''
                }`}
                style={{ aspectRatio: i === 0 || i === 6 ? '16/9' : '4/3' }}
              >
                <img
                  src={src}
                  alt={`VOXA produksi ${i + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. CTA SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_CTA_BG} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        </div>
        <div className="relative container text-center">
          <p className="text-[#00B4D8] text-xs font-bold tracking-widest mb-4 uppercase">Bergabung Sekarang</p>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-wide leading-tight mb-6">
            VOXA Siap Tumbuh<br />Bersama Anda
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Kami percaya masa depan kendaraan listrik Indonesia dibangun melalui kolaborasi yang kuat bersama para mitra distributor.
          </p>
          <a
            href="#kontak-distributor"
            className="inline-flex items-center gap-2 bg-[#00B4D8] text-white font-bold px-10 py-4 rounded-full hover:bg-[#0096b8] transition-all text-base shadow-2xl shadow-[#00B4D8]/40"
          >
            Gabung Menjadi Distributor <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT FORM
      ══════════════════════════════════════════════════════════ */}
      <section id="kontak-distributor" className="py-24 bg-gray-50">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-[#00B4D8] text-xs font-bold tracking-widest mb-3 uppercase">Daftar Sekarang</p>
            <h2 className="font-display text-3xl md:text-5xl text-gray-900 tracking-wide mb-4">Menjadi Distributor VOXA</h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Isi form berikut dan tim kami akan menghubungi Anda dalam 1×24 jam.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 text-xl mb-2">Terima Kasih!</h3>
              <p className="text-gray-500">Pesan Anda telah dikirim. Tim kami akan segera menghubungi Anda.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
                  <input
                    required
                    value={form.nama}
                    onChange={e => setForm({ ...form, nama: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Perusahaan *</label>
                  <input
                    required
                    value={form.perusahaan}
                    onChange={e => setForm({ ...form, perusahaan: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="PT / CV / Toko Anda"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kota / Wilayah *</label>
                <input
                  required
                  value={form.kota}
                  onChange={e => setForm({ ...form, kota: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                  placeholder="Kota / Kabupaten"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="email@perusahaan.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp *</label>
                  <input
                    required
                    value={form.telepon}
                    onChange={e => setForm({ ...form, telepon: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
                    placeholder="08xx-xxxx-xxxx"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan / Pertanyaan</label>
                <textarea
                  rows={4}
                  value={form.pesan}
                  onChange={e => setForm({ ...form, pesan: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors resize-none"
                  placeholder="Ceritakan sedikit tentang bisnis Anda dan area distribusi yang Anda minati..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00B4D8] text-white font-bold py-4 rounded-xl hover:bg-[#0096b8] transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00B4D8]/20"
              >
                Kirim & Hubungi via WhatsApp <ArrowRight size={16} />
              </button>
              <p className="text-center text-xs text-gray-400">
                Dengan mengirim form ini, Anda akan diarahkan ke WhatsApp VOXA.
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
