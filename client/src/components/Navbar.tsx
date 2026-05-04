import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronDown, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const LOGO_URL = '/manus-storage/voxa-logo_923e0d6b.png';

// ─── Mega Menu Data ──────────────────────────────────────────────────────────

const megaMenuData = {
  sepedaListrik: {
    label: 'Sepeda Listrik',
    href: '/catalog/sepeda-listrik',
    series: [
      {
        name: 'Elite Series',
        items: [
          { name: 'Elite Fantasi', href: '/products/elite-fantasi' },
          { name: 'Elite Rider', href: '/products/elite-rider' },
          { name: 'Elite Fantasi S', href: '/products/elite-fantasi-s' },
          { name: 'Elite Rider S', href: '/products/elite-rider-s' },
        ],
      },
      {
        name: 'Eiffel Series',
        items: [
          { name: 'Eiffel Rider', href: '/products/eiffel-rider' },
          { name: 'Eiffel City', href: '/products/eiffel-city' },
          { name: 'Eiffel 7', href: '/products/eiffel-7' },
        ],
      },
      {
        name: 'Liberty Series',
        items: [
          { name: 'Liberty', href: '/products/liberty' },
          { name: 'Liberty Star', href: '/products/liberty-star' },
          { name: 'Liberty Ultimate', href: '/products/liberty-ultimate' },
          { name: 'Liberty Stylish', href: '/products/liberty-stylish' },
          { name: 'Liberty 7', href: '/products/liberty-7' },
        ],
      },
      {
        name: 'Other Models',
        items: [
          { name: 'Voxa G3', href: '/products/voxa-g3' },
          { name: 'Voxa Kurir', href: '/products/voxa-kurir' },
        ],
      },
    ],
  },
  batre: {
    label: 'Batre',
    href: '/catalog/batre',
    series: [
      {
        name: 'Greenlife Series',
        items: [
          { name: 'Greenlife 3kg', href: '/products/greenlife-3kg' },
          { name: 'Greenlife 3.45kg', href: '/products/greenlife-345kg' },
        ],
      },
      {
        name: 'TNE Series',
        items: [
          { name: 'TNE 12-12', href: '/products/tne-12-12' },
          { name: 'TNE 12-15', href: '/products/tne-12-15' },
        ],
      },
      {
        name: 'Chilwee Series',
        items: [
          { name: 'Chilwee Gold', href: '/products/chilwee-gold' },
          { name: 'Chilwee Platinum', href: '/products/chilwee-platinum' },
          { name: 'Chilwee 12v20ah', href: '/products/chilwee-12v-20ah' },
        ],
      },
      {
        name: 'Lithium Series',
        items: [
          { name: 'Lithium 48v12ah', href: '/products/lithium-48v-12ah' },
          { name: 'Lithium 48v21ah', href: '/products/lithium-48v-21ah' },
        ],
      },
    ],
  },
  sparepart: {
    label: 'Sparepart',
    href: '/catalog/sparepart',
    series: [
      {
        name: 'Motor & Core Parts',
        items: [
          { name: 'Motor Listrik', href: '/catalog/sparepart?cat=motor' },
          { name: 'Controller', href: '/catalog/sparepart?cat=controller' },
        ],
      },
      {
        name: 'Electrical',
        items: [
          { name: 'Charger', href: '/catalog/sparepart?cat=charger' },
        ],
      },
      {
        name: 'Mechanical',
        items: [
          { name: 'Rem & Komponen', href: '/catalog/sparepart?cat=rem' },
        ],
      },
      {
        name: 'Wheels',
        items: [
          { name: 'Ban & Velg', href: '/catalog/sparepart?cat=ban' },
        ],
      },
    ],
  },
};

const mainNavLinks = [
  { label: 'Bandingkan Produk', href: '/compare' },
  { label: 'Untuk Bisnis', href: '/bisnis' },
  { label: 'Untuk Pemerintah', href: '/pemerintah' },
  { label: 'Showroom', href: '/showroom' },
  { label: 'Tentang VOXA', href: '/tentang' },
  { label: 'Bantuan', href: '/bantuan' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const megaRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  const handleMegaEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    leaveTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────────────── */}
      <div className="bg-[#00B4D8] text-white text-xs font-semibold overflow-hidden h-8 flex items-center relative">
        <div className="animate-marquee whitespace-nowrap flex">
          {[0, 1].map((i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span>✓ Garansi Resmi</span>
              <span className="opacity-50">•</span>
              <span>✓ Sparepart Tersedia</span>
              <span className="opacity-50">•</span>
              <span>✓ Support Seluruh Indonesia</span>
              <span className="opacity-50">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Navbar ──────────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-md' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 gap-4">

            {/* ── Logo (Left) ── */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-4">
              <img src={LOGO_URL} alt="VOXA" className="h-9 w-9 object-contain" />
              <span className="font-display text-xl tracking-[0.2em] text-gray-900 hidden sm:block">VOXA</span>
            </Link>

            {/* ── Desktop Nav (Center) ── */}
            <div
              className="hidden lg:flex items-center gap-0 flex-1 justify-center"
              ref={megaRef}
            >
              {/* Produk Kami trigger */}
              <div
                className="relative"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    megaOpen ? 'text-[#00B4D8]' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Produk Kami
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* ── Mega Dropdown ── */}
                <div
                  className={`fixed left-0 right-0 top-[calc(var(--navbar-top,0px)+4rem)] bg-white shadow-xl border-t border-gray-100 z-40 transition-all duration-200 ${
                    megaOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                >
                  {/* Backdrop */}
                  <div
                    className={`fixed inset-0 bg-black/20 backdrop-blur-[1px] -z-10 transition-opacity duration-200 ${
                      megaOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ top: '6rem' }}
                  />

                  <div className="max-w-screen-xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-3 gap-8 divide-x divide-gray-100">

                      {/* Column 1: Sepeda Listrik */}
                      <div className="pr-8">
                        <Link
                          href={megaMenuData.sepedaListrik.href}
                          className="block text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-4 hover:text-[#00B4D8] transition-colors"
                        >
                          {megaMenuData.sepedaListrik.label}
                        </Link>
                        <div className="space-y-4">
                          {megaMenuData.sepedaListrik.series.map((series) => (
                            <div key={series.name}>
                              <p className="text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                                {series.name}
                              </p>
                              <div className="space-y-0.5">
                                {series.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block text-sm text-gray-500 hover:text-gray-900 py-0.5 transition-colors group"
                                  >
                                    <span className="group-hover:underline underline-offset-2">{item.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Batre */}
                      <div className="px-8">
                        <Link
                          href={megaMenuData.batre.href}
                          className="block text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-4 hover:text-[#00B4D8] transition-colors"
                        >
                          {megaMenuData.batre.label}
                        </Link>
                        <div className="space-y-4">
                          {megaMenuData.batre.series.map((series) => (
                            <div key={series.name}>
                              <p className="text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                                {series.name}
                              </p>
                              <div className="space-y-0.5">
                                {series.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block text-sm text-gray-500 hover:text-gray-900 py-0.5 transition-colors group"
                                  >
                                    <span className="group-hover:underline underline-offset-2">{item.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 3: Sparepart */}
                      <div className="pl-8">
                        <Link
                          href={megaMenuData.sparepart.href}
                          className="block text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-4 hover:text-[#00B4D8] transition-colors"
                        >
                          {megaMenuData.sparepart.label}
                        </Link>
                        <div className="space-y-4">
                          {megaMenuData.sparepart.series.map((series) => (
                            <div key={series.name}>
                              <p className="text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                                {series.name}
                              </p>
                              <div className="space-y-0.5">
                                {series.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block text-sm text-gray-500 hover:text-gray-900 py-0.5 transition-colors group"
                                  >
                                    <span className="group-hover:underline underline-offset-2">{item.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Link
                            href="/catalog/sepeda-listrik"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-[#00B4D8] transition-colors group"
                          >
                            Lihat Semua Produk
                            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other nav links */}
              {mainNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    location === item.href
                      ? 'text-gray-900 underline underline-offset-4 decoration-[#00B4D8] decoration-2'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* ── Right Side: CTA + Icons ── */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0 shrink-0">
              {/* Icon buttons (desktop only) */}
              <div className="hidden lg:flex items-center gap-0.5 mr-2">
                <button onClick={() => toast.info('Fitur pencarian segera hadir')} className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50" aria-label="Cari">
                  <Search size={18} />
                </button>
                <button onClick={() => toast.info('Fitur wishlist segera hadir')} className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50" aria-label="Wishlist">
                  <Heart size={18} />
                </button>
                <button onClick={() => toast.info('Fitur akun segera hadir')} className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50" aria-label="Akun">
                  <User size={18} />
                </button>
                <button onClick={() => toast.info('Fitur keranjang segera hadir')} className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50" aria-label="Keranjang">
                  <ShoppingBag size={18} />
                </button>
              </div>

              {/* Primary CTA */}
              <Link
                href="/catalog/sepeda-listrik"
                className="hidden md:inline-flex items-center bg-[#00B4D8] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#0096b8] transition-colors whitespace-nowrap"
              >
                Temukan VOXA Anda
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:text-gray-900 ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              <MobileSection title="Sepeda Listrik" data={megaMenuData.sepedaListrik} />
              <MobileSection title="Batre" data={megaMenuData.batre} />
              <MobileSection title="Sparepart" data={megaMenuData.sparepart} />
              <div className="pt-3 border-t border-gray-100 space-y-0.5">
                {mainNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="pt-3">
                <Link
                  href="/catalog/sepeda-listrik"
                  className="flex items-center justify-center w-full bg-[#00B4D8] text-white font-semibold py-3 rounded-full text-sm"
                >
                  Temukan VOXA Anda
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── Mobile Accordion Section ────────────────────────────────────────────────

function MobileSection({
  title,
  data,
}: {
  title: string;
  data: { href: string; series: { name: string; items: { name: string; href: string }[] }[] };
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
      >
        <span>{title}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-4 pb-2 space-y-3 mt-1">
          {data.series.map((series) => (
            <div key={series.name}>
              <p className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{series.name}</p>
              {series.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
