import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import {
  ChevronRight, ArrowRight, Zap, Leaf, Factory, Star,
  TrendingUp, Shield, Globe, Cpu, ChevronDown,
} from 'lucide-react';

// ─── CDN images ───────────────────────────────────────────────────────────────
const IMG_HERO_BG  = '/manus-storage/P1015177_e752378f.webp';  // dark warehouse
const IMG_FACTORY  = '/manus-storage/P1014908_5a27f79b.webp';  // wide factory floor
const IMG_BANNER   = '/manus-storage/banner_8f991ec1.png';     // assembly & warehouse collage

// Product images
const PRODUCTS = [
  { name: 'Liberty',         tagline: 'Gaya Urban Modern',      img: '/manus-storage/Liberty_79777234.png',        href: '/products/liberty' },
  { name: 'Liberty 7',       tagline: 'Performa Tangguh',       img: '/manus-storage/Liberty7_73e8ed11.png',       href: '/products/liberty-7' },
  { name: 'Liberty Star',    tagline: 'Elegan & Bertenaga',     img: '/manus-storage/LibertyStar_8cec3088.png',    href: '/products/liberty-star' },
  { name: 'Liberty Stylish', tagline: 'Stylish Setiap Hari',    img: '/manus-storage/LibertyStylish_395993ed.png', href: '/products/liberty-stylish' },
  { name: 'Eiffel Rider',    tagline: 'Jelajahi Tanpa Batas',   img: '/manus-storage/EiffelRider_16406906.png',    href: '/products/eiffel-rider' },
  { name: 'Eiffel City',     tagline: 'Kota Adalah Milikmu',    img: '/manus-storage/Eiffelcity_ee121f6e.png',     href: '/products/eiffel-city' },
  { name: 'Eiffel 7',        tagline: 'Teknologi Masa Depan',   img: '/manus-storage/Eiffel7_167d9416.png',        href: '/products/eiffel-7' },
  { name: 'Elite Rider S',   tagline: 'Puncak Performa VOXA',   img: '/manus-storage/EliteRiderS_76ab996d.png',    href: '/products/elite-rider-s' },
];

const STATS = [
  { value: '2022',  label: 'Tahun Berdiri' },
  { value: '13+',   label: 'Model Tersedia' },
  { value: '5',     label: 'Showroom Aktif' },
  { value: '100%',  label: 'Produksi Lokal' },
];

const MISSIONS = [
  {
    letter: 'V', word: 'Value',       color: '#00B4D8', glow: 'rgba(0,180,216,0.4)',
    icon: <Star size={20} />,
    text: 'Memberikan produk dan layanan terbaik dengan kualitas yang mampu memenuhi kebutuhan masyarakat modern.',
  },
  {
    letter: 'O', word: 'Opportunity', color: '#22d3ee', glow: 'rgba(34,211,238,0.4)',
    icon: <TrendingUp size={20} />,
    text: 'Membuka peluang pertumbuhan bersama bagi pelanggan, distributor, dan seluruh mitra VOXA di Indonesia.',
  },
  {
    letter: 'X', word: 'eXcellence',  color: '#a3e635', glow: 'rgba(163,230,53,0.4)',
    icon: <Cpu size={20} />,
    text: 'Berkomitmen menghadirkan inovasi, performa, dan pelayanan terbaik dalam setiap produk yang kami kembangkan.',
  },
  {
    letter: 'A', word: 'Advancement', color: '#4ade80', glow: 'rgba(74,222,128,0.4)',
    icon: <Globe size={20} />,
    text: 'Terus berkembang melalui teknologi dan inovasi kendaraan listrik untuk mendukung masa depan yang lebih hijau dan berkelanjutan.',
  },
];

const WHY_ITEMS = [
  { icon: <Star size={22} />,    color: '#00B4D8', title: 'Desain Modern & Stylish',              desc: 'Produk VOXA dirancang untuk tampil percaya diri di jalanan Indonesia.' },
  { icon: <Leaf size={22} />,    color: '#4ade80', title: 'Ramah Lingkungan & Hemat Biaya',        desc: 'Zero emisi langsung — hemat biaya operasional dan baik untuk bumi.' },
  { icon: <Factory size={22} />, color: '#a3e635', title: 'Produksi Lokal Indonesia',              desc: 'Pabrik perakitan di Balaraja, Tangerang dengan standar kualitas tinggi.' },
  { icon: <Shield size={22} />,  color: '#22d3ee', title: 'Kualitas & After Sales Terpercaya',     desc: 'Garansi produk dan ketersediaan suku cadang untuk ketenangan pikiran.' },
  { icon: <Zap size={22} />,     color: '#f59e0b', title: 'Mendukung Ekosistem EV Nasional',       desc: 'Mendukung program kendaraan listrik nasional dan masa depan mobilitas.' },
];

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Tentang() {
  const [activeProduct, setActiveProduct] = useState(0);

  const heroReveal    = useReveal(0.05);
  const aboutReveal   = useReveal(0.1);
  const statsReveal   = useReveal(0.15);
  const productReveal = useReveal(0.08);
  const missionReveal = useReveal(0.08);
  const whyReveal     = useReveal(0.08);
  const ctaReveal     = useReveal(0.08);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8] transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Tentang VOXA</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. HERO — cinematic full-screen
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img src={IMG_HERO_BG} alt="" className="w-full h-full object-cover object-center scale-105" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.95) 100%)'
          }} />
        </div>

        {/* Animated glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl animate-pulse"
               style={{ background: 'radial-gradient(circle, #00B4D8 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full opacity-12 blur-3xl animate-pulse"
               style={{ background: 'radial-gradient(circle, #a3e635 0%, transparent 70%)', animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full opacity-8 blur-3xl"
               style={{ background: 'radial-gradient(ellipse, #22d3ee 0%, transparent 70%)' }} />
        </div>

        {/* Content */}
        <div
          ref={heroReveal.ref}
          className={`relative container text-center py-32 transition-all duration-1200 ease-out ${
            heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Brand pill */}
          <div className="inline-flex items-center gap-2 border border-[#00B4D8]/50 text-[#00B4D8] text-xs font-bold px-5 py-2 rounded-full mb-8 tracking-widest backdrop-blur-sm"
               style={{ background: 'rgba(0,180,216,0.08)' }}>
            <Zap size={11} /> PT. VOXA INDO NUSA
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-6 tracking-wide">
            MOBILITAS<br />
            <span style={{
              color: '#00B4D8',
              textShadow: '0 0 60px rgba(0,180,216,0.7), 0 0 120px rgba(0,180,216,0.3)'
            }}>
              MASA DEPAN
            </span><br />
            INDONESIA
          </h1>

          <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            VOXA menghadirkan kendaraan listrik modern, efisien, dan ramah lingkungan untuk masyarakat Indonesia.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalog/sepeda-listrik"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-sm transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: '#00B4D8', color: '#fff', boxShadow: '0 0 30px rgba(0,180,216,0.5)' }}
            >
              Lihat Produk <ArrowRight size={16} />
            </Link>
            <Link
              href="/showroom"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-sm hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. ABOUT COMPANY — split layout
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[640px]">
          {/* Left: factory photo */}
          <div
            ref={aboutReveal.ref}
            className={`relative lg:w-1/2 min-h-[360px] lg:min-h-0 overflow-hidden transition-all duration-1000 ${
              aboutReveal.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
          >
            <img src={IMG_FACTORY} alt="Pabrik VOXA Balaraja"
                 className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 hidden lg:block"
                 style={{ background: 'linear-gradient(to right, transparent 60%, rgb(3,7,18) 100%)' }} />
            {/* Location badge */}
            <div className="absolute bottom-6 left-6 backdrop-blur-md rounded-2xl px-5 py-3 border"
                 style={{ background: 'rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <p className="text-xs text-gray-400 mb-0.5">Berlokasi di</p>
              <p className="text-white font-bold text-sm">Balaraja, Tangerang</p>
            </div>
          </div>

          {/* Right: copy */}
          <div
            className={`lg:w-1/2 flex items-center px-8 py-16 lg:px-16 transition-all duration-1000 delay-200 ${
              aboutReveal.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
          >
            <div className="max-w-lg">
              <p className="text-xs font-bold tracking-widest mb-4 uppercase" style={{ color: '#00B4D8' }}>
                Tentang Kami
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide leading-tight mb-6">
                Tentang PT. Voxa Indo Nusa
              </h2>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-8">
                <p>
                  PT. Voxa Indo Nusa merupakan perusahaan kendaraan listrik Indonesia yang berfokus menghadirkan solusi mobilitas modern, efisien, dan ramah lingkungan untuk masyarakat.
                </p>
                <p>
                  Didirikan pada tahun 2022, VOXA hadir dengan komitmen untuk mendukung perkembangan industri kendaraan listrik di Indonesia melalui produk berkualitas, desain modern, serta teknologi yang terus berkembang.
                </p>
                <p>
                  Berlokasi di Kawasan Industri Benua Permai Lestari, Balaraja – Tangerang, VOXA memiliki fasilitas perakitan dan produksi sendiri untuk memastikan kualitas produk, ketersediaan unit, dan pelayanan terbaik bagi pelanggan serta mitra di seluruh Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. STATS BAR
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 border-t border-white/5">
        <div
          ref={statsReveal.ref}
          className={`container py-16 transition-all duration-700 ${
            statsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
               style={{ background: 'rgba(255,255,255,0.05)' }}>
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-10 px-6 bg-gray-950 group hover:bg-gray-900 transition-colors duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span
                  className="font-display text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: '#00B4D8', textShadow: '0 0 20px rgba(0,180,216,0.5)' }}
                >
                  {s.value}
                </span>
                <span className="text-gray-400 text-xs tracking-widest uppercase text-center">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. FACTORY BANNER — full-width collage
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 py-16">
        <div className="container">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={IMG_BANNER}
              alt="VOXA Assembly & Warehouse"
              className="w-full object-cover hover:scale-[1.02] transition-transform duration-700"
              style={{ maxHeight: '520px', objectPosition: 'center' }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. PRODUCT SHOWCASE
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div
          ref={productReveal.ref}
          className={`container transition-all duration-700 ${
            productReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#00B4D8' }}>
              Lineup Produk
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-gray-900 tracking-wide mb-4">
              Lineup Kendaraan Listrik VOXA
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Dari model urban stylish hingga performa tinggi — temukan VOXA yang tepat untuk Anda.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRODUCTS.map((p, i) => (
              <Link
                key={p.name}
                href={p.href}
                className="group relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                onMouseEnter={() => setActiveProduct(i)}
                style={{
                  boxShadow: activeProduct === i ? '0 0 30px rgba(0,180,216,0.2)' : undefined,
                  borderColor: activeProduct === i ? 'rgba(0,180,216,0.4)' : undefined,
                }}
              >
                {/* Hover glow overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{ background: 'radial-gradient(circle at 50% 30%, rgba(0,180,216,0.1) 0%, transparent 70%)' }}
                />
                <div className="aspect-square overflow-hidden bg-gray-50 rounded-t-2xl">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-contain object-center p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#00B4D8' }}>
                    VOXA
                  </p>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{p.name}</h3>
                  <p className="text-gray-400 text-xs">{p.tagline}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/catalog/sepeda-listrik"
              className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-full text-sm transition-all border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white"
            >
              Lihat Semua Produk <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. VISION & MISSION — VOXA acronym glassmorphism
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-8 blur-3xl"
               style={{ background: 'radial-gradient(ellipse, #00B4D8 0%, transparent 70%)' }} />
        </div>

        <div
          ref={missionReveal.ref}
          className={`container relative transition-all duration-700 ${
            missionReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#00B4D8' }}>
              Visi & Misi
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-wide mb-8">
              Visi & Misi VOXA
            </h2>

            {/* Vision card */}
            <div
              className="max-w-3xl mx-auto rounded-2xl px-8 py-7 border mb-14"
              style={{
                background: 'rgba(0,180,216,0.06)',
                borderColor: 'rgba(0,180,216,0.25)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 0 40px rgba(0,180,216,0.08)',
              }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#00B4D8' }}>Visi</p>
              <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                Menjadi brand kendaraan listrik terpercaya di Indonesia yang menghadirkan mobilitas modern, ramah lingkungan, dan dapat diakses oleh semua kalangan.
              </p>
            </div>
          </div>

          {/* Mission cards — VOXA acronym */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MISSIONS.map((m, i) => (
              <div
                key={m.word}
                className="group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                  transitionDelay: `${i * 80}ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = `0 0 50px ${m.glow}`;
                  el.style.borderColor = m.color + '55';
                  el.style.background = `rgba(${m.color === '#00B4D8' ? '0,180,216' : m.color === '#22d3ee' ? '34,211,238' : m.color === '#a3e635' ? '163,230,53' : '74,222,128'},0.06)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = '';
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                {/* Big letter watermark */}
                <div
                  className="font-display text-7xl font-bold leading-none mb-4 opacity-15 group-hover:opacity-30 transition-opacity duration-300 select-none"
                  style={{ color: m.color }}
                >
                  {m.letter}
                </div>
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: m.color + '18', color: m.color }}
                >
                  {m.icon}
                </div>
                <h3 className="font-bold text-white mb-3 text-base">{m.word}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. WHY VOXA — dark icon grid
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div
          ref={whyReveal.ref}
          className={`container relative transition-all duration-700 ${
            whyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#a3e635' }}>
              Keunggulan
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-wide">
              Mengapa VOXA?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className="group flex gap-5 rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  transitionDelay: `${i * 60}ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = item.color + '40';
                  el.style.background = item.color + '08';
                  el.style.boxShadow = `0 0 30px ${item.color}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'rgba(255,255,255,0.05)';
                  el.style.background = 'rgba(255,255,255,0.02)';
                  el.style.boxShadow = '';
                }}
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: item.color + '18', color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. CINEMATIC CLOSING CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-40 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={IMG_HERO_BG} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.78) 50%, rgba(0,0,0,0.96) 100%)' }} />
          {/* Neon glows */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] opacity-20 blur-3xl animate-pulse"
               style={{ background: 'radial-gradient(ellipse, #a3e635 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] opacity-12 blur-3xl"
               style={{ background: 'radial-gradient(ellipse, #00B4D8 0%, transparent 70%)' }} />
        </div>

        <div
          ref={ctaReveal.ref}
          className={`relative container text-center transition-all duration-1000 ${
            ctaReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs font-bold tracking-widest mb-6 uppercase" style={{ color: '#a3e635' }}>
            Bergabung Bersama VOXA
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-wide leading-tight mb-6">
            BERSAMA MENUJU<br />
            <span style={{
              color: '#a3e635',
              textShadow: '0 0 60px rgba(163,230,53,0.6), 0 0 120px rgba(163,230,53,0.3)'
            }}>
              MASA DEPAN
            </span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
            VOXA hadir untuk menjadi bagian dari perubahan menuju masa depan mobilitas Indonesia yang lebih modern dan berkelanjutan.
          </p>
          <Link
            href="/catalog/sepeda-listrik"
            className="inline-flex items-center gap-3 font-bold px-10 py-5 rounded-full text-base transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #a3e635, #4ade80)',
              color: '#111',
              boxShadow: '0 0 50px rgba(163,230,53,0.45)',
            }}
          >
            Jelajahi Produk VOXA <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}
