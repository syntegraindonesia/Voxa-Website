import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, ChevronDown, ArrowRight, Zap, Leaf, Factory, Star, TrendingUp, Shield, Globe, Cpu } from 'lucide-react';

// ─── Brand color ──────────────────────────────────────────────────────────────
const CYAN = '#50B1D4';
const CYAN_GLOW = 'rgba(80,177,212,';

// ─── CDN images ───────────────────────────────────────────────────────────────
const IMG_BANNER  = '/manus-storage/banner_8f991ec1.png';
const IMG_FACTORY = '/manus-storage/P1014908_5a27f79b.webp';

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

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '2022', label: 'Tahun Berdiri' },
  { value: '13+',  label: 'Model Sepeda Listrik' },
  { value: '5',    label: 'Showroom Aktif' },
  { value: '100%', label: 'Produksi Lokal' },
];

const MISSIONS = [
  {
    letter: 'V', word: 'Value',       color: CYAN,
    icon: <Star size={18} />,
    text: 'Memberikan produk dan layanan terbaik dengan kualitas yang mampu memenuhi kebutuhan masyarakat modern.',
  },
  {
    letter: 'O', word: 'Opportunity', color: '#38bdf8',
    icon: <TrendingUp size={18} />,
    text: 'Membuka peluang pertumbuhan bersama bagi pelanggan, distributor, dan seluruh mitra VOXA di Indonesia.',
  },
  {
    letter: 'X', word: 'eXcellence',  color: '#7dd3fc',
    icon: <Cpu size={18} />,
    text: 'Berkomitmen menghadirkan inovasi, performa, dan pelayanan terbaik dalam setiap produk yang kami kembangkan.',
  },
  {
    letter: 'A', word: 'Advancement', color: '#bae6fd',
    icon: <Globe size={18} />,
    text: 'Terus berkembang melalui teknologi dan inovasi kendaraan listrik untuk mendukung masa depan yang lebih hijau dan berkelanjutan.',
  },
];

const WHY_ITEMS = [
  { icon: <Star size={20} />,    color: CYAN,      title: 'Desain Modern & Stylish',           desc: 'Produk VOXA dirancang untuk tampil percaya diri di jalanan Indonesia.' },
  { icon: <Leaf size={20} />,    color: '#4ade80', title: 'Ramah Lingkungan & Hemat Biaya',     desc: 'Zero emisi langsung — hemat biaya operasional dan baik untuk bumi.' },
  { icon: <Factory size={20} />, color: '#38bdf8', title: 'Produksi Lokal Indonesia',           desc: 'Pabrik perakitan di Balaraja, Tangerang dengan standar kualitas tinggi.' },
  { icon: <Shield size={20} />,  color: '#7dd3fc', title: 'Kualitas & After Sales Terpercaya',  desc: 'Garansi produk dan ketersediaan suku cadang untuk ketenangan pikiran.' },
  { icon: <Zap size={20} />,     color: '#a5f3fc', title: 'Mendukung Ekosistem EV Nasional',    desc: 'Mendukung program kendaraan listrik nasional dan masa depan mobilitas.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Tentang() {
  const heroReveal    = useReveal(0.05);
  const storyReveal   = useReveal(0.1);
  const missionReveal = useReveal(0.08);
  const whyReveal     = useReveal(0.08);
  const ctaReveal     = useReveal(0.08);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#50B1D4] transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Tentang VOXA</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. HERO — standard gradient banner
      ══════════════════════════════════════════════════════════ */}
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
            TENTANG KAMI
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 tracking-tight">
            Tentang <span style={{ color: '#37C5FF' }}>VOXA</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">Mengenal lebih dekat VOXA — merek kendaraan listrik Indonesia yang mengutamakan kualitas, inovasi, dan keberlanjutan.</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. COMPANY STORY — editorial split, white bg
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div
          ref={storyReveal.ref}
          className={`container transition-all duration-900 ${
            storyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left: factory image + stats */}
            <div className="lg:w-5/12 shrink-0">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: CYAN }}>
                Tentang Kami
              </p>
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={IMG_FACTORY}
                  alt="Pabrik VOXA Balaraja"
                  className="w-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  style={{ maxHeight: '420px' }}
                />
                {/* Lighter overlay on factory image */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: 'linear-gradient(to top, rgba(7,28,36,0.5) 0%, transparent 50%)' }}
                />
                {/* Location badge */}
                <div
                  className="absolute bottom-5 left-5 rounded-2xl px-4 py-3 border"
                  style={{
                    background: 'rgba(7,28,36,0.7)',
                    borderColor: `${CYAN_GLOW}0.3)`,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <p className="text-xs text-gray-400 mb-0.5">Berlokasi di</p>
                  <p className="text-white font-bold text-sm">Balaraja, Tangerang</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl px-5 py-4 border text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      borderColor: `${CYAN_GLOW}0.2)`,
                      background: `${CYAN_GLOW}0.04)`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = `${CYAN_GLOW}0.5)`;
                      el.style.background = `${CYAN_GLOW}0.08)`;
                      el.style.boxShadow = `0 4px 20px ${CYAN_GLOW}0.15)`;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = `${CYAN_GLOW}0.2)`;
                      el.style.background = `${CYAN_GLOW}0.04)`;
                      el.style.boxShadow = '';
                    }}
                  >
                    <p className="font-display text-2xl font-bold mb-1" style={{ color: CYAN }}>
                      {s.value}
                    </p>
                    <p className="text-gray-500 text-xs tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: editorial copy */}
            <div className="lg:w-7/12">
              <h2 className="font-display text-3xl md:text-4xl text-gray-900 tracking-wide leading-tight mb-8">
                Kendaraan Listrik<br />
                <span style={{ color: CYAN }}>Buatan Indonesia</span>
              </h2>

              <div className="space-y-5 text-gray-600 text-base leading-relaxed">
                <p>
                  PT. Voxa Indo Nusa merupakan perusahaan kendaraan listrik Indonesia yang berfokus menghadirkan solusi mobilitas modern, efisien, dan ramah lingkungan untuk masyarakat.
                </p>
                <p>
                  Didirikan pada tahun 2022, VOXA hadir dengan komitmen untuk mendukung perkembangan industri kendaraan listrik di Indonesia melalui produk berkualitas, desain modern, serta teknologi yang terus berkembang.
                </p>
                <p>
                  Berlokasi di Kawasan Industri Benua Permai Lestari, Balaraja – Tangerang, VOXA memiliki fasilitas perakitan dan produksi sendiri untuk memastikan kualitas produk, ketersediaan unit, dan pelayanan terbaik bagi pelanggan serta mitra di seluruh Indonesia.
                </p>
                <p>
                  Hingga saat ini, VOXA telah menghadirkan berbagai model sepeda listrik yang dirancang untuk kebutuhan harian, bisnis, maupun gaya hidup modern, seperti Liberty, Liberty City, Liberty 07, Liberty Xtreme, Eiffel Rider, Eiffel Stylish, dan Eiffel Fantasy.
                </p>
                <p
                  className="font-medium text-gray-800 pl-5 py-2"
                  style={{ borderLeft: `4px solid ${CYAN}` }}
                >
                  Kami percaya kendaraan listrik bukan hanya tentang teknologi, tetapi juga tentang menciptakan masa depan yang lebih hemat energi, lebih efisien, dan lebih baik untuk lingkungan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* ════════════════════════════════════════════════════════
          3. VISI & MISI — white bg
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">

        <div
          ref={missionReveal.ref}
          className={`container relative transition-all duration-700 ${
            missionReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <h2
            className="font-display text-3xl md:text-5xl tracking-wide mb-10"
            style={{ color: '#50B1D4' }}
            >
              VISI &amp; MISI VOXA
            </h2>

            {/* Vision card */}
            <div
              className="max-w-3xl mx-auto rounded-2xl px-8 py-7 border mb-8"
              style={{
              background: '#ffffff',
              borderColor: '#50B1D4',
              boxShadow: '0 4px 24px rgba(80,177,212,0.12)',
              }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#50B1D4' }}>
                Visi
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Menjadi brand kendaraan listrik terpercaya di Indonesia yang menghadirkan mobilitas modern, ramah lingkungan, dan dapat diakses oleh semua kalangan.
              </p>
            </div>

            {/* Mission card */}
            <div
              className="max-w-3xl mx-auto rounded-2xl px-8 py-7 border mb-8"
              style={{
              background: '#ffffff',
              borderColor: '#50B1D4',
              boxShadow: '0 4px 24px rgba(80,177,212,0.12)',
              }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#50B1D4' }}>
                Misi
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Menghadirkan kendaraan listrik berkualitas tinggi dengan desain inovatif, teknologi terkini, dan layanan purna jual terbaik — agar setiap perjalanan menjadi lebih efisien, hemat, dan menyenangkan bagi seluruh masyarakat Indonesia.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. MENGAPA VOXA — clean trust grid, white bg
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div
          ref={whyReveal.ref}
          className={`container relative transition-all duration-700 ${
            whyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Keunggulan
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-gray-900 tracking-wide">
              Mengapa VOXA?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className="group flex gap-5 rounded-2xl p-6 border border-gray-100 bg-gray-50 transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 60}ms` }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${CYAN_GLOW}0.35)`;
                  el.style.background = `${CYAN_GLOW}0.05)`;
                  el.style.boxShadow = `0 8px 30px ${CYAN_GLOW}0.12)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '';
                  el.style.background = '';
                  el.style.boxShadow = '';
                }}
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${CYAN_GLOW}0.12)`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. CINEMATIC CLOSING — deep cyan-blue, minimal
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative py-40 overflow-hidden"
        style={{
          background: '#50B1D4',
        }}
      >
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] opacity-8 blur-3xl animate-pulse"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(80,177,212,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(80,177,212,0.6) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <div
          ref={ctaReveal.ref}
          className={`relative container text-center transition-all duration-1000 ${
            ctaReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="inline-flex items-center gap-2 border text-xs font-bold px-5 py-2 rounded-full mb-8 tracking-widest"
            style={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <Leaf size={11} /> Mobilitas Berkelanjutan
          </div>

          <p className="text-white/90 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            VOXA hadir untuk menjadi bagian dari perubahan menuju masa depan mobilitas Indonesia yang lebih modern dan berkelanjutan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalog/sepeda-listrik"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-sm text-white transition-all hover:scale-105 hover:brightness-110"
              style={{
                background: 'rgba(255,255,255,0.25)',
                boxShadow: '0 0 28px rgba(255,255,255,0.3)',
                border: '2px solid rgba(255,255,255,0.6)',
              }}
            >
              Jelajahi Produk VOXA <ArrowRight size={16} />
            </Link>
            <Link
              href="/showroom"
              className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-sm text-white transition-all hover:bg-white/10 backdrop-blur-sm"
              style={{ border: '1.5px solid rgba(255,255,255,0.5)' }}
            >
              Kunjungi Showroom
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
