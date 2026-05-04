import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, Heart, User, ShoppingBag, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const LOGO_URL = '/manus-storage/voxa-logo_923e0d6b.png';

// ─── Mega Menu Data ──────────────────────────────────────────────────────────

type Series = { name: string; items: { name: string; href: string }[] };
type NavItem = {
  label: string;
  href: string;
  mega?: {
    categories: {
      name: string;
      href: string;
      series: Series[];
    }[];
  };
};

const navItems: NavItem[] = [
  {
    label: 'Produk Kami',
    href: '/catalog/sepeda-listrik',
    mega: {
      categories: [
        {
          name: 'Sepeda Listrik',
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
        {
          name: 'Batre',
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
        {
          name: 'Sparepart',
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
      ],
    },
  },
  { label: 'Bandingkan', href: '/compare' },
  { label: 'Untuk Bisnis', href: '/bisnis' },
  { label: 'Untuk Pemerintah', href: '/pemerintah' },
  { label: 'Showroom', href: '/showroom' },
  { label: 'Tentang VOXA', href: '/tentang' },
  { label: 'Bantuan', href: '/bantuan' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  const openMega = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    leaveTimer.current = setTimeout(() => setMegaOpen(false), 100);
  };

  const megaData = navItems[0].mega!;
  const activeSeries = megaData.categories[activeCategory]?.series ?? [];

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────── */}
      <div className="bg-gray-100 text-gray-700 text-xs font-medium h-9 flex items-center justify-center relative overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[0, 1].map((i) => (
            <span key={i} className="inline-flex items-center gap-8 px-8">
              <span>Garansi Resmi | Sparepart Tersedia | Support Seluruh Indonesia</span>
              <span className="opacity-30">•</span>
              <span>Garansi Resmi | Sparepart Tersedia | Support Seluruh Indonesia</span>
              <span className="opacity-30">•</span>
            </span>
          ))}
        </div>
        {/* Pause icon (Gymshark style) */}
        <button className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Pause">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-current rounded-full" />
            <div className="w-0.5 h-3 bg-current rounded-full" />
          </div>
        </button>
      </div>

      {/* ── Main Header ──────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-sm' : ''
        }`}
        onMouseLeave={closeMega}
      >
        {/* ── Three-column header layout ── */}
        <div className="flex items-center h-14 px-6 md:px-10 border-b border-gray-100">

          {/* LEFT: Nav links */}
          <nav className="hidden lg:flex items-center gap-0 flex-1">
            {/* Produk Kami with mega menu */}
            <div
              className="relative"
              onMouseEnter={() => { openMega(); setActiveCategory(0); }}
            >
              <button
                className={`flex items-center gap-0.5 px-3 py-4 text-sm font-medium transition-colors border-b-2 ${
                  megaOpen
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Produk Kami
              </button>
            </div>

            {/* Other nav links */}
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={closeMega}
                className={`px-3 py-4 text-sm font-medium transition-colors border-b-2 ${
                  location === item.href
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CENTER: Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <Link href="/" className="flex items-center gap-2">
              <img src={LOGO_URL} alt="VOXA" className="h-8 w-8 object-contain" />
              <span className="font-display text-xl tracking-[0.25em] text-gray-900">VOXA</span>
            </Link>
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-0.5 flex-1 justify-end">
            <button
              onClick={() => toast.info('Fitur pencarian segera hadir')}
              className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Cari"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => toast.info('Fitur wishlist segera hadir')}
              className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => toast.info('Fitur akun segera hadir')}
              className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Akun"
            >
              <User size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => toast.info('Fitur keranjang segera hadir')}
              className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
            {/* Persistent CTA — always visible on desktop */}
            <Link
              href="/catalog/sepeda-listrik"
              className="hidden lg:inline-flex items-center ml-3 bg-[#00B4D8] text-white text-xs font-bold px-4 py-2 hover:bg-[#0096b8] transition-colors whitespace-nowrap"
            >
              Temukan VOXA Anda
            </Link>
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* ── Mega Dropdown ─────────────────────────────── */}
        <div
          className={`absolute left-0 right-0 bg-white border-b border-gray-100 z-40 transition-all duration-200 overflow-hidden ${
            megaOpen ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 pointer-events-none'
          }`}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          {/* Backdrop overlay behind page content */}
          {megaOpen && (
            <div
              className="fixed inset-0 bg-black/20 -z-10"
              style={{ top: '5.75rem' }}
            />
          )}

          <div className="flex" style={{ minHeight: '320px' }}>
            {/* Left column: Category list */}
            <div className="w-56 border-r border-gray-100 py-6 shrink-0">
              {megaData.categories.map((cat, idx) => (
                <button
                  key={cat.name}
                  onMouseEnter={() => setActiveCategory(idx)}
                  className={`flex items-center justify-between w-full px-8 py-2.5 text-sm text-left transition-colors group ${
                    activeCategory === idx
                      ? 'text-gray-900 font-semibold bg-gray-50'
                      : 'text-gray-500 hover:text-gray-900 font-medium'
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronRight
                    size={13}
                    className={`transition-opacity ${activeCategory === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
                  />
                </button>
              ))}

              {/* Divider + See all */}
              <div className="mx-8 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={megaData.categories[activeCategory]?.href ?? '/catalog/sepeda-listrik'}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Lihat Semua →
                </Link>
              </div>
            </div>

            {/* Right column: Series + Products */}
            <div className="flex-1 py-6 px-10 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
                {activeSeries.map((series) => (
                  <div key={series.name}>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                      {series.name}
                    </p>
                    <div className="space-y-1">
                      {series.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-sm text-gray-500 hover:text-gray-900 transition-colors py-0.5 group"
                        >
                          <span className="group-hover:underline underline-offset-2 decoration-gray-400">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              <MobileAccordion label="Produk Kami" categories={megaData.categories} />
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// ─── Mobile Accordion ────────────────────────────────────────────────────────

function MobileAccordion({
  label,
  categories,
}: {
  label: string;
  categories: { name: string; href: string; series: Series[] }[];
}) {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<number | null>(null);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded"
      >
        <span>{label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-3 space-y-1 mt-1">
          {categories.map((cat, idx) => (
            <div key={cat.name}>
              <button
                onClick={() => setActiveCat(activeCat === idx ? null : idx)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
              >
                <span>{cat.name}</span>
                <ChevronDown size={12} className={`transition-transform ${activeCat === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeCat === idx && (
                <div className="pl-4 pb-2 space-y-3 mt-1">
                  {cat.series.map((s) => (
                    <div key={s.name}>
                      <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{s.name}</p>
                      {s.items.map((item) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
