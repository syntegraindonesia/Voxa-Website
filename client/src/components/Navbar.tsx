import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, Heart, User, ShoppingBag, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const LOGO_URL = '/manus-storage/voxa-logo_923e0d6b.png';

// ─── Data ─────────────────────────────────────────────────────────────────────

type SubItem = { name: string; href: string };
type Category = { name: string; href: string; subItems: SubItem[] };

const produkKamiCategories: Category[] = [
  {
    name: 'Sepeda Listrik',
    href: '/sepeda-listrik',
    subItems: [
      { name: 'Elite Fantasi', href: '/products/elite-fantasi' },
      { name: 'Elite Rider', href: '/products/elite-rider' },
      { name: 'Elite Fantasi S', href: '/products/elite-fantasi-s' },
      { name: 'Elite Rider S', href: '/products/elite-rider-s' },
      { name: 'Eiffel Rider', href: '/products/eiffel-rider' },
      { name: 'Eiffel City', href: '/products/eiffel-city' },
      { name: 'Eiffel 7', href: '/products/eiffel-7' },
      { name: 'Liberty', href: '/products/liberty' },
      { name: 'Liberty Star', href: '/products/liberty-star' },
      { name: 'Liberty Ultimate', href: '/products/liberty-ultimate' },
      { name: 'Liberty Stylish', href: '/products/liberty-stylish' },
      { name: 'Liberty 7', href: '/products/liberty-7' },
      { name: 'Voxa G3', href: '/products/voxa-g3' },
      { name: 'Voxa Kurir', href: '/products/voxa-kurir' },
    ],
  },
  {
    name: 'Batre',
    href: '/batre',
    subItems: [
      { name: 'Greenlife 12KG', href: '/products/greenlife-3kg' },
      { name: 'Greenlife 13.8KG', href: '/products/greenlife-345kg' },
      { name: 'Tianneng 12V-15AH', href: '/products/tne-12-12' },
      { name: 'Tianneng 12V-25AH', href: '/products/tne-12-15' },
      { name: 'Chilwee Gold', href: '/products/chilwee-gold' },
      { name: 'Chilwee Platinum', href: '/products/chilwee-platinum' },
      { name: 'Chilwee 12V-20AH', href: '/products/chilwee-12v-20ah' },
      { name: 'Lithium 48V-12AH', href: '/products/lithium-48v-12ah' },
      { name: 'Lithium 48V-21AH', href: '/products/lithium-48v-21ah' },
    ],
  },
  {
    name: 'Sparepart',
    href: '/sparepart',
    subItems: [
      { name: 'Motor Listrik', href: '/catalog/sparepart?cat=motor' },
      { name: 'Controller', href: '/catalog/sparepart?cat=controller' },
      { name: 'Charger', href: '/catalog/sparepart?cat=charger' },
      { name: 'Rem & Komponen', href: '/catalog/sparepart?cat=rem' },
      { name: 'Ban & Velg', href: '/catalog/sparepart?cat=ban' },
    ],
  },
];

const navLinks = [
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  const handleMouseEnterTrigger = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const handleMouseLeaveArea = () => {
    // Small delay so cursor can move from trigger into dropdown without it closing
    closeTimer.current = setTimeout(() => setMegaOpen(false), 80);
  };

  const handleMouseEnterDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const activeSubItems = produkKamiCategories[activeCategory]?.subItems ?? [];

  return (
    <>
      {/* ── Main Header ──────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}
      >
        <div className="flex items-center h-16 px-4 xl:px-8 border-b border-gray-100 flex-nowrap gap-0">

          {/* LEFT: Nav links */}
          <nav className="hidden xl:flex items-center gap-0 flex-1 flex-nowrap min-w-0 overflow-visible">
            {/* Produk Kami — hover trigger wrapper (trigger + dropdown share same parent so no gap) */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterTrigger}
              onMouseLeave={handleMouseLeaveArea}
            >
              <button
                className={`flex items-center gap-0.5 px-2 py-5 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                  megaOpen
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Produk Kami
              </button>

              {/* ── Mega Dropdown — absolute, compact, CSS visibility transition ── */}
              <div
                className={`absolute top-full left-0 bg-white border border-gray-100 shadow-lg z-50 transition-all duration-150 ${
                  megaOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}
                style={{ width: '640px', marginTop: '0' }}
                onMouseEnter={handleMouseEnterDropdown}
                onMouseLeave={handleMouseLeaveArea}
              >
                  {/* Two-panel layout */}
                  <div className="flex">

                    {/* LEFT PANEL: Category list */}
                    <div className="w-52 border-r border-gray-100 py-6">
                      {produkKamiCategories.map((cat, idx) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          onMouseEnter={() => setActiveCategory(idx)}
                          className={`flex items-center justify-between w-full px-6 py-3 cursor-pointer transition-colors ${
                            activeCategory === idx
                              ? 'text-gray-900'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span
                            className={`text-sm font-medium transition-all ${
                              activeCategory === idx ? 'font-semibold underline underline-offset-4' : ''
                            }`}
                          >
                            {cat.name}
                          </span>
                          <ChevronRight
                            size={13}
                            strokeWidth={1.5}
                            className={`transition-opacity ${activeCategory === idx ? 'opacity-100' : 'opacity-30'}`}
                          />
                        </Link>
                      ))}

                      {/* See All link */}
                      <div className="px-6 mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href={produkKamiCategories[activeCategory]?.href ?? '/catalog/sepeda-listrik'}
                          className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          Lihat Semua →
                        </Link>
                      </div>
                    </div>

                    {/* RIGHT PANEL: Sub-items — 2 columns for long lists */}
                    <div className="flex-1 py-6 px-6">
                      <div className={`grid gap-x-6 gap-y-0.5 ${
                        activeSubItems.length > 7 ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {activeSubItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
            </div>

            {/* Other nav links */}
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-5 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
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
          <div className="flex-1 xl:flex-none flex justify-center xl:absolute xl:left-1/2 xl:-translate-x-1/2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img src={LOGO_URL} alt="VOXA" className="h-8 w-8 object-contain" />
              <span className="font-display text-xl tracking-[0.25em] text-gray-900">VOXA</span>
            </Link>
          </div>

          {/* RIGHT: Icons + CTA */}
          <div className="flex items-center gap-0.5 flex-shrink-0 justify-end">
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
            <Link
              href="/katalog"
              className="hidden xl:inline-flex items-center ml-3 px-4 py-2 bg-[#00B4D8] text-white text-[13px] font-bold tracking-wider uppercase hover:bg-[#0099bb] transition-colors whitespace-nowrap"
            >
              Temukan VOXA Anda
            </Link>
            {/* Mobile hamburger */}
            <button
              className="xl:hidden p-2.5 text-gray-600 hover:text-gray-900 ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────── */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              <MobileAccordion label="Produk Kami" categories={produkKamiCategories} />
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <Link
                  href="/katalog"
                  className="block w-full text-center py-3 bg-[#00B4D8] text-white text-sm font-bold tracking-wider uppercase"
                >
                  Temukan VOXA Anda
                </Link>
              </div>
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
  categories: Category[];
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
              <div className="flex items-center">
                <Link
                  href={cat.href}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#00B4D8] cursor-pointer"
                >
                  {cat.name}
                </Link>
                <button
                  onClick={() => setActiveCat(activeCat === idx ? null : idx)}
                  className="px-2 py-2 text-gray-500 hover:bg-gray-50 rounded"
                  aria-label="Expand"
                >
                  <ChevronDown size={12} className={`transition-transform ${activeCat === idx ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {activeCat === idx && (
                <div className="pl-4 pb-2 space-y-1 mt-1">
                  {cat.subItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
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
