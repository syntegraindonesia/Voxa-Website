import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Truck, Users, Wrench, BarChart3, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=1400&q=85';
const FLEET_IMG = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80';

export default function Bisnis() {
  const [form, setForm] = useState({ nama: '', perusahaan: '', email: '', telepon: '', jumlah: '', pesan: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Halo VOXA, saya ${form.nama} dari ${form.perusahaan}.\n\nEmail: ${form.email}\nTelepon: ${form.telepon}\nJumlah Unit: ${form.jumlah}\n\nPesan: ${form.pesan}`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Untuk Bisnis</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="VOXA Bisnis" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="relative container py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#00B4D8]/20 border border-[#00B4D8]/40 text-[#00B4D8] text-xs font-bold px-4 py-2 rounded-full mb-6">
              <Truck size={12} />
              SOLUSI BISNIS
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-6 tracking-wide">
              ARMADA LISTRIK<br /><span className="text-[#00B4D8]">UNTUK BISNIS</span><br />ANDA
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              Kurangi biaya operasional, tingkatkan efisiensi, dan wujudkan komitmen ramah lingkungan bisnis Anda dengan armada VOXA.
            </p>
            <a
              href="#kontak-bisnis"
              className="inline-flex items-center gap-2 bg-[#00B4D8] text-white font-bold px-8 py-4 rounded-full hover:bg-[#0096b8] transition-all text-base shadow-lg"
            >
              Konsultasi Gratis <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#00B4D8]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '500+', label: 'Mitra Bisnis Aktif' },
              { num: '80%', label: 'Hemat Biaya BBM' },
              { num: '5.000+', label: 'Unit Armada Aktif' },
              { num: '24/7', label: 'Dukungan Teknis' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display text-4xl md:text-5xl tracking-wide mb-2">{stat.num}</p>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">MENGAPA VOXA UNTUK BISNIS?</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">KEUNGGULAN SOLUSI BISNIS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BarChart3 size={28} />, title: 'Hemat Biaya Operasional', desc: 'Kurangi pengeluaran BBM hingga 80% dan biaya perawatan hingga 60% dibanding kendaraan konvensional.' },
              { icon: <Truck size={28} />, title: 'Harga Armada Khusus', desc: 'Dapatkan harga spesial untuk pembelian armada mulai dari 5 unit. Semakin banyak, semakin hemat.' },
              { icon: <Wrench size={28} />, title: 'Dukungan Teknis Penuh', desc: 'Tim teknisi VOXA siap mendukung operasional armada Anda 24/7 di seluruh Indonesia.' },
              { icon: <Users size={28} />, title: 'Pelatihan Tim', desc: 'Program pelatihan lengkap untuk pengemudi dan teknisi internal perusahaan Anda.' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-[#00B4D8]/30 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-[#00B4D8]/10 rounded-2xl flex items-center justify-center text-[#00B4D8] mb-5 group-hover:bg-[#00B4D8] group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-4">COCOK UNTUK</p>
              <h2 className="font-display text-4xl md:text-5xl tracking-wide mb-8 leading-none">
                SOLUSI UNTUK<br /><span className="text-[#00B4D8]">BERBAGAI BISNIS</span>
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'Bisnis Kurir & Pengiriman', desc: 'Armada Voxa Kurir untuk operasional pengiriman last-mile yang efisien dan hemat.' },
                  { title: 'Restoran & F&B Delivery', desc: 'Kendaraan listrik untuk pengiriman makanan yang cepat dan ramah lingkungan.' },
                  { title: 'Retail & E-commerce', desc: 'Solusi armada untuk distribusi produk di area perkotaan.' },
                  { title: 'Properti & Hospitality', desc: 'Kendaraan listrik untuk operasional internal hotel, resort, dan kompleks perumahan.' },
                  { title: 'Logistik & Distribusi', desc: 'Armada kendaraan listrik untuk distribusi barang jarak menengah.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-[#00B4D8] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white mb-1">{item.title}</p>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={FLEET_IMG} alt="Armada VOXA" className="rounded-3xl w-full aspect-[4/3] object-cover" />
              <div className="absolute -bottom-5 -right-5 bg-[#00B4D8] text-white rounded-2xl p-6 shadow-2xl">
                <p className="font-display text-3xl tracking-wide">Rp 0</p>
                <p className="text-sm font-medium mt-1">Biaya Konsultasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">PAKET ARMADA</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">PILIHAN PAKET BISNIS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Starter', units: '5–10 Unit', features: ['Harga armada khusus', 'Garansi 2 tahun', 'Pelatihan dasar', 'Support via WhatsApp'], highlight: false },
              { title: 'Business', units: '11–50 Unit', features: ['Diskon armada 15%', 'Garansi extended 3 tahun', 'Pelatihan lengkap', 'Dedicated account manager', 'Sparepart prioritas'], highlight: true },
              { title: 'Enterprise', units: '50+ Unit', features: ['Harga negosiasi khusus', 'Garansi & SLA custom', 'Teknisi on-site', 'Fleet management system', 'Customisasi livery', 'Kontrak jangka panjang'], highlight: false },
            ].map(pkg => (
              <div key={pkg.title} className={`rounded-3xl p-8 border-2 ${pkg.highlight ? 'border-[#00B4D8] bg-[#00B4D8]/5 shadow-xl' : 'border-gray-100 bg-white'}`}>
                {pkg.highlight && <span className="inline-block bg-[#00B4D8] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">PALING POPULER</span>}
                <h3 className="font-display text-3xl text-gray-900 tracking-wide mb-1">{pkg.title}</h3>
                <p className="text-[#00B4D8] font-bold mb-6">{pkg.units}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-[#00B4D8] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontak-bisnis"
                  className={`flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-full transition-all ${pkg.highlight ? 'bg-[#00B4D8] text-white hover:bg-[#0096b8]' : 'border-2 border-gray-200 text-gray-700 hover:border-[#00B4D8] hover:text-[#00B4D8]'}`}
                >
                  Hubungi Kami
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="kontak-bisnis" className="py-20 bg-gray-50">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">MULAI SEKARANG</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-4">KONSULTASI BISNIS</h2>
            <p className="text-gray-500 text-lg">Isi form berikut dan tim kami akan menghubungi Anda dalam 1x24 jam.</p>
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
                  <input required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="Nama Anda" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Perusahaan *</label>
                  <input required value={form.perusahaan} onChange={e => setForm({...form, perusahaan: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="PT / CV / UD" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="email@perusahaan.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon *</label>
                  <input required value={form.telepon} onChange={e => setForm({...form, telepon: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="08xx-xxxx-xxxx" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimasi Jumlah Unit</label>
                <select value={form.jumlah} onChange={e => setForm({...form, jumlah: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors">
                  <option value="">Pilih jumlah unit</option>
                  <option value="5-10">5–10 Unit</option>
                  <option value="11-50">11–50 Unit</option>
                  <option value="51-100">51–100 Unit</option>
                  <option value="100+">Lebih dari 100 Unit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kebutuhan / Pesan</label>
                <textarea value={form.pesan} onChange={e => setForm({...form, pesan: e.target.value})} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors resize-none" placeholder="Ceritakan kebutuhan armada Anda..." />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-[#00B4D8] text-white font-bold py-4 rounded-full hover:bg-[#0096b8] transition-all">
                  Kirim via WhatsApp <MessageCircle size={18} />
                </button>
                <a href="mailto:bisnis@voxa.co.id" className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-full hover:border-[#00B4D8] hover:text-[#00B4D8] transition-all text-sm">
                  Kirim via Email
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
