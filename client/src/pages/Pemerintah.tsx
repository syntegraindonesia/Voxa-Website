import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Building2, Leaf, TrendingDown, Award, MessageCircle, ArrowRight, CheckCircle, FileText } from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=85';

export default function Pemerintah() {
  const [form, setForm] = useState({ nama: '', instansi: '', jabatan: '', email: '', telepon: '', jumlah: '', pesan: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Halo VOXA, saya ${form.nama} (${form.jabatan}) dari ${form.instansi}.\n\nEmail: ${form.email}\nTelepon: ${form.telepon}\nJumlah Unit: ${form.jumlah}\n\nPesan: ${form.pesan}`
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
            <span className="text-gray-900 font-medium">Untuk Pemerintah</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="VOXA Pemerintah" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="relative container py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#00B4D8]/20 border border-[#00B4D8]/40 text-[#00B4D8] text-xs font-bold px-4 py-2 rounded-full mb-6">
              <Building2 size={12} />
              SOLUSI PEMERINTAH & INSTANSI
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-6 tracking-wide">
              KENDARAAN LISTRIK<br /><span className="text-[#00B4D8]">UNTUK INSTANSI</span><br />PEMERINTAH
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              Dukung program kendaraan listrik nasional, hemat anggaran operasional, dan wujudkan komitmen lingkungan instansi Anda bersama VOXA.
            </p>
            <a
              href="#kontak-pemerintah"
              className="inline-flex items-center gap-2 bg-[#00B4D8] text-white font-bold px-8 py-4 rounded-full hover:bg-[#0096b8] transition-all text-base shadow-lg"
            >
              Ajukan Proposal <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Program Nasional Banner */}
      <section className="py-10 bg-[#00B4D8]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-4">
              <Award size={32} className="shrink-0" />
              <div>
                <p className="font-bold text-lg">Mendukung Program Kendaraan Listrik Nasional</p>
                <p className="text-white/80 text-sm">Sesuai Perpres No. 55 Tahun 2019 tentang Percepatan Program Kendaraan Bermotor Listrik</p>
              </div>
            </div>
            <a href="#kontak-pemerintah" className="shrink-0 bg-white text-[#00B4D8] font-bold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all text-sm">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">MENGAPA VOXA UNTUK INSTANSI?</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">MANFAAT UNTUK INSTANSI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingDown size={28} />, title: 'Efisiensi Anggaran', desc: 'Hemat anggaran operasional kendaraan dinas hingga 70% dengan beralih ke kendaraan listrik VOXA.' },
              { icon: <Leaf size={28} />, title: 'Komitmen Lingkungan', desc: 'Wujudkan target emisi karbon dan tunjukkan komitmen nyata instansi terhadap lingkungan.' },
              { icon: <FileText size={28} />, title: 'Kemudahan Pengadaan', desc: 'Proses pengadaan sesuai regulasi pemerintah dengan dokumentasi lengkap dan transparan.' },
              { icon: <Award size={28} />, title: 'Produk Bersertifikat', desc: 'Semua produk VOXA telah bersertifikat dan memenuhi standar nasional Indonesia.' },
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

      {/* Use Cases for Government */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">APLIKASI</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-wide">COCOK UNTUK INSTANSI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Pemerintah Daerah', desc: 'Armada kendaraan dinas untuk operasional Pemda, kelurahan, dan kecamatan.' },
              { title: 'Kepolisian & TNI', desc: 'Kendaraan patroli dan operasional internal yang hemat dan ramah lingkungan.' },
              { title: 'Dinas Kesehatan', desc: 'Kendaraan untuk petugas kesehatan keliling dan operasional puskesmas.' },
              { title: 'Dinas Pendidikan', desc: 'Armada untuk operasional sekolah, kampus, dan lembaga pendidikan negeri.' },
              { title: 'BUMN & BUMD', desc: 'Solusi armada kendaraan listrik untuk perusahaan milik negara dan daerah.' },
              { title: 'Kawasan Industri', desc: 'Kendaraan operasional internal kawasan industri dan pelabuhan.' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-[#00B4D8]/10 hover:border-[#00B4D8]/30 transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#00B4D8] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procurement Process */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">PROSES PENGADAAN</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">ALUR PENGADAAN</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Konsultasi', desc: 'Hubungi tim VOXA untuk konsultasi kebutuhan armada instansi Anda.' },
              { step: '02', title: 'Proposal', desc: 'Tim kami menyiapkan proposal teknis dan komersial sesuai kebutuhan.' },
              { step: '03', title: 'Pengadaan', desc: 'Proses pengadaan sesuai regulasi dengan dokumentasi lengkap.' },
              { step: '04', title: 'Implementasi', desc: 'Pengiriman, pelatihan, dan dukungan teknis berkelanjutan.' },
            ].map((step, i) => (
              <div key={step.step} className="text-center relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-[#00B4D8]/30" />}
                <div className="w-16 h-16 bg-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-xl text-white tracking-wider">{step.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="kontak-pemerintah" className="py-20 bg-gray-50">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">AJUKAN SEKARANG</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-4">KONSULTASI INSTANSI</h2>
            <p className="text-gray-500 text-lg">Isi form berikut dan tim khusus pemerintahan kami akan menghubungi Anda.</p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 text-xl mb-2">Terima Kasih!</h3>
              <p className="text-gray-500">Pesan Anda telah dikirim. Tim kami akan segera menghubungi Anda dalam 1x24 jam.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
                  <input required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="Nama Anda" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jabatan *</label>
                  <input required value={form.jabatan} onChange={e => setForm({...form, jabatan: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="Jabatan / Posisi" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Instansi *</label>
                <input required value={form.instansi} onChange={e => setForm({...form, instansi: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="Nama instansi / lembaga" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Resmi *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="email@instansi.go.id" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon *</label>
                  <input required value={form.telepon} onChange={e => setForm({...form, telepon: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors" placeholder="08xx-xxxx-xxxx" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimasi Kebutuhan Unit</label>
                <select value={form.jumlah} onChange={e => setForm({...form, jumlah: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors">
                  <option value="">Pilih jumlah unit</option>
                  <option value="5-20">5–20 Unit</option>
                  <option value="21-100">21–100 Unit</option>
                  <option value="101-500">101–500 Unit</option>
                  <option value="500+">Lebih dari 500 Unit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kebutuhan / Keterangan</label>
                <textarea value={form.pesan} onChange={e => setForm({...form, pesan: e.target.value})} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors resize-none" placeholder="Ceritakan kebutuhan kendaraan listrik instansi Anda..." />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-[#00B4D8] text-white font-bold py-4 rounded-full hover:bg-[#0096b8] transition-all">
                  Kirim via WhatsApp <MessageCircle size={18} />
                </button>
                <a href="mailto:pemerintah@voxa.co.id" className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-full hover:border-[#00B4D8] hover:text-[#00B4D8] transition-all text-sm">
                  Kirim via Email Resmi
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
