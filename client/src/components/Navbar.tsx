import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, Heart, User, ShoppingBag, ChevronDown, ChevronRight, LogOut, Package, BookOpen } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { getLoginUrl } from '@/const';
import SearchOverlay from './SearchOverlay';
import { Product } from '@/data/products';

const LOGO_URL = '/manus-storage/voxa-logo_923e0d6b.png';

// ─── Data ─────────────────────────────────────────────────────────────────────

type SubItem = { name: string; href: string };
type Category = { name: string; href: string; subItems: SubItem[] };

const produkKamiCategories: Category[] = [
  {
    name: 'Sepeda Listrik',
    href: '/sepeda-listrik',
    subItems: [
      { name: 'Elite Fantasi', href: '/sepeda-listrik' },
      { name: 'Elite Rider', href: '/sepeda-listrik' },
      { name: 'Elite Fantasi S', href: '/sepeda-listrik' },
      { name: 'Elite Rider S', href: '/sepeda-listrik' },
      { name: 'Eiffel Rider', href: '/sepeda-listrik' },
      { name: 'Eiffel City', href: '/sepeda-listrik' },
      { name: 'Eiffel 7', href: '/sepeda-listrik' },
      { name: 'Liberty', href: '/sepeda-listrik' },
      { name: 'Liberty Star', href: '/sepeda-listrik' },
      { name: 'Liberty Ultimate', href: '/sepeda-listrik' },
      { name: 'Liberty Stylish', href: '/sepeda-listrik' },
      { name: 'Liberty 7', href: '/sepeda-listrik' },
      { name: 'Voxa G3', href: '/sepeda-listrik' },
      { name: 'Voxa Kurir', href: '/sepeda-listrik' },
    ],
  },
  {
    name: 'Batre',
    href: '/batre',
    subItems: [
      { name: 'Greenlife 12KG', href: '/batre' },
      { name: 'Greenlife 13.8KG', href: '/batre' },
      { name: 'Tianneng 12V-15AH', href: '/batre' },
      { name: 'Tianneng 12V-25AH', href: '/batre' },
      { name: 'Chilwee Gold', href: '/batre' },
      { name: 'Chilwee Platinum', href: '/batre' },
      { name: 'Chilwee 12V-20AH', href: '/batre' },
      { name: 'Lithium 48V-12AH', href: '/batre' },
      { name: 'Lithium 48V-21AH', href: '/batre' },
    ],
  },
  {
    name: 'Sparepart',
    href: '/sparepart',
    subItems: [
      { name: 'Motor Listrik', href: '/sparepart' },
      { name: 'Controller', href: '/sparepart' },
      { name: 'Charger', href: '/sparepart' },
      { name: 'Rem & Komponen', href: '/sparepart' },
      { name: 'Ban & Velg', href: '/sparepart' },
    ],
  },
];

const navLinks = [
  { label: 'Bandingkan', href: '/compare' },
  { label: 'Distributor VOXA', href: '/pemerintah' },
  { label: 'Showroom', href: '/showroom' },
  { label: 'Tentang VOXA', href: '/tentang' },
  { label: 'Artikel', href: '/artikel' },
  { label: 'Bantuan', href: '/bantuan' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [location, navigate] = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { savedIds } = useWishlist();
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setAccountOpen(false);
  }, [location]);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [accountOpen]);

  const handleMouseEnterTrigger = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const handleMouseLeaveArea = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 80);
  };

  const handleMouseEnterDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const activeSubItems = produkKamiCategories[activeCategory]?.subItems ?? [];
  const wishlistCount = savedIds.size;

  const handleSearchSelect = (product: Product) => {
    // Navigate to the right page and open the product modal
    // For now, navigate to the category page — product detail modals are handled per-page
    if (product.category === 'sepeda-listrik') navigate('/sepeda-listrik');
    else if (product.category === 'batre') navigate('/batre');
    else if (product.category === 'sparepart') navigate('/sparepart');
  };

  return (
    <>
      {/* Search overlay */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={handleSearchSelect}
      />

      {/* ── Main Header ──────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}
      >
        <div className="flex items-center h-16 px-4 xl:px-8 border-b border-gray-100 flex-nowrap gap-0">

          {/* LEFT: Nav links */}
          <nav className="hidden xl:flex items-center gap-0 flex-1 flex-nowrap min-w-0 overflow-visible">
            {/* Produk Kami — hover trigger */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterTrigger}
              onMouseLeave={handleMouseLeaveArea}
            >
              <Link
                href="/catalog/sepeda-listrik"
                className={`flex items-center gap-0.5 px-2 py-5 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                  megaOpen
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Produk Kami
              </Link>

              {/* Mega Dropdown */}
              <div
                className={`absolute top-full left-0 bg-white border border-gray-100 shadow-lg z-50 transition-all duration-150 ${
                  megaOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}
                style={{ width: '640px', marginTop: '0' }}
                onMouseEnter={handleMouseEnterDropdown}
                onMouseLeave={handleMouseLeaveArea}
              >
                <div className="flex">
                  <div className="w-52 border-r border-gray-100 py-6">
                    {produkKamiCategories.map((cat, idx) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onMouseEnter={() => setActiveCategory(idx)}
                        className={`flex items-center justify-between w-full px-6 py-3 cursor-pointer transition-colors ${
                          activeCategory === idx ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span className={`text-sm font-medium transition-all ${activeCategory === idx ? 'font-semibold underline underline-offset-4' : ''}`}>
                          {cat.name}
                        </span>
                        <ChevronRight size={13} strokeWidth={1.5} className={`transition-opacity ${activeCategory === idx ? 'opacity-100' : 'opacity-30'}`} />
                      </Link>
                    ))}
                    <div className="px-6 mt-4 pt-4 border-t border-gray-100">
                      <Link href={produkKamiCategories[activeCategory]?.href ?? '/sepeda-listrik'} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
                        Lihat Semua →
                      </Link>
                    </div>
                  </div>
                  <div className="flex-1 py-6 px-6">
                    <div className={`grid gap-x-6 gap-y-0.5 ${activeSubItems.length > 7 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {activeSubItems.map((item) => (
                        <Link key={item.name} href={item.href} className="block py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors">
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
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Cari"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Akun"
              >
                {isAuthenticated && user ? (
                  <div className="w-[18px] h-[18px] rounded-full bg-[#00B4D8] flex items-center justify-center text-white text-[10px] font-bold">
                    {(user.name ?? 'U').charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User size={18} strokeWidth={1.5} />
                )}
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name ?? 'Pengguna'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email ?? ''}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Heart size={14} className="text-gray-400" />
                          Wishlist Saya
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} />
                          Keluar
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-400">Masuk untuk akses penuh</p>
                      </div>
                      <a
                        href={getLoginUrl()}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#00B4D8] hover:bg-blue-50 transition-colors"
                      >
                        <User size={14} />
                        Masuk / Daftar
                      </a>
                      <Link href="/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Heart size={14} className="text-gray-400" />
                        Wishlist
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#00B4D8] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {totalCount > 9 ? '9+' : totalCount}
                </span>
              )}
            </button>


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
              {/* Mobile account section */}
              <div className="pt-3 border-t border-gray-100 space-y-1">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-semibold text-gray-900">{user.name ?? 'Pengguna'}</div>
                    <Link href="/wishlist" className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
                      <Heart size={14} className="text-gray-400" />
                      Wishlist Saya
                    </Link>
                    <button onClick={() => logout()} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded">
                      <LogOut size={14} />
                      Keluar
                    </button>
                  </>
                ) : (
                  <a href={getLoginUrl()} className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#00B4D8] hover:bg-blue-50 rounded">
                    <User size={14} />
                    Masuk / Daftar
                  </a>
                )}
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
                <Link href={cat.href} className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#00B4D8] cursor-pointer">
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
                    <Link key={item.name} href={item.href} className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
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
