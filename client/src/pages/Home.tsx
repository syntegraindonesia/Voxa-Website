import { Link } from 'wouter';
import { ArrowRight, Zap, Leaf, Wrench, MapPin, Shield, ChevronRight, Star, MessageCircle } from 'lucide-react';
import { sepedaListrik, batre } from '@/data/products';

const HERO_BG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85';
const DAILY_IMG = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80';
const KURIR_IMG = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80';
const LIFESTYLE_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';
const FLEET_IMG = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80';
const PRODUCTION_IMG = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80';

const featuredBikes = sepedaListrik.slice(0, 8);
const featuredBatre = batre.slice(0, 4);

const testimonials = [
  { name: 'Budi Santoso', city: 'Jakarta', text: 'Sudah 1 tahun pakai VOXA Liberty, hemat bensin banget! Sekarang cuma bayar listrik aja.', rating: 5 },
  { name: 'Siti Rahayu', city: 'Surabaya', text: 'Sparepart mudah dicari, servis cepat. VOXA memang pilihan terbaik untuk harian.', rating: 5 },
  { name: 'Ahmad Fauzi', city: 'Bandung', text: 'Pakai Voxa Kurir untuk bisnis pengiriman, sudah 8 bulan tidak ada masalah. Recommended!', rating: 5 },
  { name: 'Dewi Lestari', city: 'Medan', text: 'Elite Rider S luar biasa! Desainnya keren, performanya top. Bangga pakai produk lokal.', rating: 5 },
];

const showrooms = [
  { city: 'Jakarta', address: 'Jl. Sudirman No. 123, Jakarta Pusat' },
  { city: 'Surabaya', address: 'Jl. Pemuda No. 45, Surabaya' },
  { city: 'Bandung', address: 'Jl. Asia Afrika No. 78, Bandung' },
  { city: 'Medan', address: 'Jl. Gatot Subroto No. 56, Medan' },
  { city: 'Semarang', address: 'Jl. Pandanaran No. 90, Semarang' },
  { city: 'Yogyakarta', address: 'Jl. Malioboro No. 12, Yogyakarta' },
];

const guideArticles = [
  { title: 'Berapa Hemat Pakai Kendaraan Listrik?', excerpt: 'Hitung penghematan nyata beralih dari motor bensin ke sepeda listrik VOXA.', img: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=400&q=80', tag: 'Keuangan' },
  { title: 'Cara Memilih Sepeda Listrik yang Tepat', excerpt: 'Panduan lengkap memilih sepeda listrik sesuai kebutuhan dan budget Anda.', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80', tag: 'Panduan' },
  { title: 'Tips Merawat Baterai Sepeda Listrik', excerpt: 'Cara merawat baterai agar tahan lama dan performa tetap optimal.', img: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=400&q=80', tag: 'Perawatan' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION — Gymshark proportions: ~85–90vh ===== */}
      <section
        className="relative w-full overflow-hidden bg-black"
        style={{
          /* Mobile: 70vh | Tablet: 82vh | Desktop: 88vh — matches Gymshark reference */
          height: 'clamp(480px, 70vh, 700px)',
        }}
      >
        {/* Responsive height overrides */}
        <style>{`
          @media (min-width: 768px)  { .voxa-hero { height: clamp(560px, 82vh, 860px) !important; } }
          @media (min-width: 1024px) { .voxa-hero { height: clamp(620px, 88vh, 960px) !important; } }
        `}</style>

        {/* Static background image */}
        <img
          src={HERO_BG}
          alt="VOXA — Kendaraan Listrik untuk Jalanan Indonesia"
          className="voxa-hero absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.85 }}
        />

        {/* Gradient: left-heavy for text legibility, fades right */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.05) 100%)' }} />
        {/* Bottom fade for text anchor */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.10) 40%, transparent 100%)' }} />

        {/* Bottom-left text block — 6–8% left padding, 8–10% bottom padding */}
        <div
          className="absolute bottom-0 left-0"
          style={{ paddingLeft: 'clamp(1.5rem, 7vw, 5rem)', paddingBottom: 'clamp(1.5rem, 9%, 4rem)' }}
        >
          {/* Headline: controlled size, no excessive wrapping */}
          <h1
            className="font-display text-white leading-none tracking-wide mb-1.5"
            style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3rem)' }}
          >
            KENDARAAN LISTRIK{' '}
            <span className="text-[#00B4D8]">UNTUK JALANAN</span>{' '}
            INDONESIA.
          </h1>
          {/* Subtext: compact, close to headline */}
          <p className="text-gray-200 leading-snug mb-3" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)', maxWidth: '28rem' }}>
            Desain modern, performa tangguh, dan hemat energi untuk jalanan Indonesia.
          </p>
          {/* CTAs: tight gap, underlined Gymshark style */}
          <div className="flex items-center gap-5">
            <Link
              href="/catalog/sepeda-listrik"
              className="text-white font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
              style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}
            >
              Temukan Produk
            </Link>
            <Link
              href="/compare"
              className="text-white font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
              style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}
            >
              Bandingkan Model
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY BLOCK ===== */}
      <section className="pt-12 pb-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-3">VOXA UNTUK SIAPA?</h2>
            <p className="text-gray-500 text-lg">Temukan model yang paling sesuai dengan kebutuhan Anda</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Untuk Harian', desc: 'Ringan, efisien, dan nyaman untuk aktivitas sehari-hari', img: DAILY_IMG, href: '/catalog/sepeda-listrik?use=harian', color: '#00B4D8' },
              { title: 'Untuk Kurir / Bisnis', desc: 'Kapasitas angkut besar, tahan lama untuk operasional bisnis', img: KURIR_IMG, href: '/bisnis', color: '#0096b8' },
              { title: 'Untuk Lifestyle', desc: 'Desain modern dan stylish untuk gaya hidup urban', img: LIFESTYLE_IMG, href: '/catalog/sepeda-listrik?use=lifestyle', color: '#007a96' },
              { title: 'Untuk Fleet / Pemerintah', desc: 'Solusi armada kendaraan listrik untuk instansi', img: FLEET_IMG, href: '/pemerintah', color: '#005f74' },
            ].map((cat) => (
              <Link key={cat.title} href={cat.href}>
                <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl text-white tracking-wide mb-1">{cat.title}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed mb-3">{cat.desc}</p>
                    <span className="inline-flex items-center gap-1 text-[#00B4D8] text-xs font-bold group-hover:gap-2 transition-all">
                      Lihat Selengkapnya <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUK UNGGULAN - SEPEDA LISTRIK ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-2">KOLEKSI TERBARU</p>
              <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">SEPEDA LISTRIK</h2>
            </div>
            <Link href="/catalog/sepeda-listrik" className="hidden md:flex items-center gap-2 text-[#00B4D8] font-bold text-sm hover:gap-3 transition-all">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredBikes.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/catalog/sepeda-listrik" className="inline-flex items-center gap-2 border-2 border-[#00B4D8] text-[#00B4D8] font-bold px-8 py-3 rounded-full hover:bg-[#00B4D8] hover:text-white transition-all">
              Lihat Semua Sepeda Listrik <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== KENAPA VOXA ===== */}
      <section className="py-20 bg-gray-950 text-white overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-4">KEUNGGULAN KAMI</p>
              <h2 className="font-display text-4xl md:text-6xl tracking-wide mb-8 leading-none">
                KENAPA<br /><span className="text-[#00B4D8]">VOXA?</span>
              </h2>
              <div className="space-y-5">
                {[
                  { icon: <Zap size={20} />, title: 'Hemat Biaya Bensin', desc: 'Hemat hingga 80% biaya bahan bakar dibanding kendaraan konvensional.' },
                  { icon: <Leaf size={20} />, title: 'Ramah Lingkungan', desc: 'Zero emisi, berkontribusi pada udara bersih untuk Indonesia.' },
                  { icon: <Wrench size={20} />, title: 'Sparepart Mudah Didapat', desc: 'Jaringan distribusi sparepart tersebar di seluruh Indonesia.' },
                  { icon: <MapPin size={20} />, title: 'Produksi Lokal Indonesia', desc: 'Dirancang dan diproduksi di Indonesia untuk jalanan Indonesia.' },
                  { icon: <Shield size={20} />, title: 'Cocok untuk Jalanan Indonesia', desc: 'Diuji dan dioptimalkan untuk kondisi jalan dan iklim Indonesia.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-[#00B4D8]/20 border border-[#00B4D8]/30 rounded-xl flex items-center justify-center text-[#00B4D8] shrink-0 group-hover:bg-[#00B4D8] group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img src={LIFESTYLE_IMG} alt="Kenapa VOXA" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#00B4D8] text-white rounded-2xl p-6 shadow-2xl">
                <p className="font-display text-4xl tracking-wide">80%</p>
                <p className="text-sm font-medium mt-1">Hemat Biaya BBM</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-white text-gray-900 rounded-2xl p-6 shadow-2xl">
                <p className="font-display text-4xl tracking-wide text-[#00B4D8]">15+</p>
                <p className="text-sm font-medium mt-1">Model Tersedia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BATRE SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-2">PILIHAN TERLENGKAP</p>
              <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">BATERAI</h2>
            </div>
            <Link href="/catalog/batre" className="hidden md:flex items-center gap-2 text-[#00B4D8] font-bold text-sm hover:gap-3 transition-all">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredBatre.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARE PREVIEW ===== */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-2">PERBANDINGAN PRODUK</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-3">BANDINGKAN MODEL</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Temukan model yang paling sesuai dengan kebutuhan Anda</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-[#00B4D8] text-white">
                  <th className="text-left px-6 py-4 font-display tracking-wider text-sm">MODEL</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">JARAK TEMPUH</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">BATERAI</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">KECEPATAN</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">KEGUNAAN</th>
                  <th className="text-center px-4 py-4 font-display tracking-wider text-sm">HARGA</th>
                </tr>
              </thead>
              <tbody>
                {sepedaListrik.slice(0, 5).map((p, i) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link href="/compare" className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-full hover:bg-[#00B4D8] transition-all">
              Lihat Perbandingan Lengkap <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== VOXA GUIDE ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-2">EDUKASI & TIPS</p>
              <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">VOXA GUIDE</h2>
            </div>
            <Link href="/guide" className="hidden md:flex items-center gap-2 text-[#00B4D8] font-bold text-sm hover:gap-3 transition-all">
              Semua Artikel <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guideArticles.map((article) => (
              <Link key={article.title} href="/guide">
                <div className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden">
                    <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-bold px-3 py-1 rounded-full mb-3">{article.tag}</span>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#00B4D8] transition-colors leading-snug">{article.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{article.excerpt}</p>
                    <div className="flex items-center gap-1 mt-4 text-[#00B4D8] text-sm font-bold">
                      Baca Selengkapnya <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== B2B SECTION ===== */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-4">SOLUSI BISNIS</p>
              <h2 className="font-display text-4xl md:text-5xl tracking-wide mb-6 leading-none">
                BANGUN BISNIS<br />KENDARAAN LISTRIK<br /><span className="text-[#00B4D8]">BERSAMA VOXA</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Jadilah bagian dari ekosistem kendaraan listrik Indonesia. VOXA menyediakan solusi armada, kemitraan bisnis, dan dukungan penuh untuk perusahaan Anda.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Harga Armada Khusus', 'Dukungan Teknis 24/7', 'Pelatihan Tim', 'Garansi Extended'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-5 h-5 bg-[#00B4D8] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/bisnis" className="inline-flex items-center gap-2 bg-[#00B4D8] text-white font-bold px-8 py-4 rounded-full hover:bg-[#0096b8] transition-all">
                Pelajari Solusi Bisnis <ArrowRight size={18} />
              </Link>
            </div>
            <div className="relative">
              <img src={KURIR_IMG} alt="VOXA Bisnis" className="rounded-3xl w-full aspect-[4/3] object-cover" />
              <div className="absolute -bottom-4 -right-4 bg-[#00B4D8] text-white rounded-2xl p-5 shadow-2xl">
                <p className="font-display text-3xl tracking-wide">500+</p>
                <p className="text-sm font-medium">Mitra Bisnis Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== B2G SECTION ===== */}
      <section className="py-20 bg-[#00B4D8]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img src={FLEET_IMG} alt="VOXA Pemerintah" className="rounded-3xl w-full aspect-[4/3] object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-white/70 text-sm font-bold tracking-widest mb-4">SOLUSI PEMERINTAH</p>
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-6 leading-none">
                SOLUSI KENDARAAN<br />LISTRIK UNTUK<br />INSTANSI
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Dukung program kendaraan listrik nasional dengan armada VOXA. Hemat anggaran operasional dan wujudkan komitmen lingkungan instansi Anda.
              </p>
              <Link href="/pemerintah" className="inline-flex items-center gap-2 bg-white text-[#00B4D8] font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all">
                Konsultasi Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { num: '10.000+', label: 'Pengguna Aktif' },
              { num: '50+', label: 'Kota di Indonesia' },
              { num: '15+', label: 'Model Tersedia' },
              { num: '2 Tahun', label: 'Garansi Resmi' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="font-display text-4xl md:text-5xl text-[#00B4D8] tracking-wide mb-2">{stat.num}</p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-2">KATA MEREKA</p>
              <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">TESTIMONI PENGGUNA</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#00B4D8] text-[#00B4D8]" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Showroom */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-2">TEMUKAN KAMI</p>
              <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">SHOWROOM VOXA</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {showrooms.map((s) => (
                <div key={s.city} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#00B4D8]/30 hover:bg-[#00B4D8]/5 transition-all group">
                  <div className="w-10 h-10 bg-[#00B4D8]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#00B4D8] transition-colors">
                    <MapPin size={18} className="text-[#00B4D8] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{s.city}</p>
                    <p className="text-gray-500 text-sm">{s.address}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/showroom" className="inline-flex items-center gap-2 text-[#00B4D8] font-bold hover:gap-3 transition-all">
                Lihat Semua Showroom <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Warranty & Production */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-950 text-white rounded-3xl p-8">
              <Shield size={32} className="text-[#00B4D8] mb-4" />
              <h3 className="font-display text-2xl tracking-wide mb-3">GARANSI RESMI</h3>
              <p className="text-gray-400 leading-relaxed mb-4">Setiap produk VOXA dilindungi garansi resmi 2 tahun. Kami berkomitmen pada kualitas dan kepuasan pelanggan.</p>
              <Link href="/bantuan" className="inline-flex items-center gap-2 text-[#00B4D8] font-bold text-sm hover:gap-3 transition-all">
                Pelajari Garansi <ChevronRight size={14} />
              </Link>
            </div>
            <div className="relative rounded-3xl overflow-hidden">
              <img src={PRODUCTION_IMG} alt="Produksi VOXA" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-2xl text-white tracking-wide mb-2">PRODUKSI LOKAL</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Dirancang dan diproduksi di Indonesia, VOXA memahami kebutuhan jalanan dan pengguna lokal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00B4D8] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00B4D8] rounded-full blur-3xl" />
        </div>
        <div className="relative container">
          <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-4">MULAI SEKARANG</p>
          <h2 className="font-display text-5xl md:text-7xl tracking-wide mb-6 leading-none">
            SIAP BERALIH KE<br /><span className="text-[#00B4D8]">KENDARAAN LISTRIK?</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-xl mx-auto mb-10">
            Bergabunglah dengan ribuan pengguna VOXA dan rasakan perbedaannya.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/catalog/sepeda-listrik" className="inline-flex items-center gap-2 bg-[#00B4D8] text-white font-bold px-10 py-4 rounded-full hover:bg-[#0096b8] transition-all text-lg shadow-lg hover:shadow-[#00B4D8]/30 hover:shadow-xl">
              Temukan Produk <ArrowRight size={20} />
            </Link>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-10 py-4 rounded-full hover:bg-green-600 transition-all text-lg">
              <MessageCircle size={20} />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: { id: string; name: string; price: string; image: string; shortDesc: string; badge?: string; series: string } }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="product-card group rounded-2xl overflow-hidden border border-gray-100 bg-white cursor-pointer">
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
          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#00B4D8] transition-colors">{product.name}</h3>
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
