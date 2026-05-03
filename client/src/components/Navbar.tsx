import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronDown, MessageCircle } from 'lucide-react';

const LOGO_URL = '/manus-storage/voxa-logo_923e0d6b.png';

const sepedaListrikItems = [
  { name: 'Liberty', href: '/products/liberty' },
  { name: 'Liberty Star', href: '/products/liberty-star' },
  { name: 'Liberty Ultimate', href: '/products/liberty-ultimate' },
  { name: 'Liberty Stylish', href: '/products/liberty-stylish' },
  { name: 'Liberty 7', href: '/products/liberty-7' },
  { name: 'Eiffel Rider', href: '/products/eiffel-rider' },
  { name: 'Eiffel City', href: '/products/eiffel-city' },
  { name: 'Eiffel 7', href: '/products/eiffel-7' },
  { name: 'Elite City', href: '/products/elite-city' },
  { name: 'Elite Fantasi', href: '/products/elite-fantasi' },
  { name: 'Elite Rider', href: '/products/elite-rider' },
  { name: 'Elite Fantasi S', href: '/products/elite-fantasi-s' },
  { name: 'Elite Rider S', href: '/products/elite-rider-s' },
  { name: 'Voxa G3', href: '/products/voxa-g3' },
  { name: 'Voxa Kurir', href: '/products/voxa-kurir' },
];

const batreItems = [
  { name: 'Greenlife 3kg', href: '/products/greenlife-3kg' },
  { name: 'Greenlife 3,45kg', href: '/products/greenlife-345kg' },
  { name: 'TNE 12-12', href: '/products/tne-12-12' },
  { name: 'TNE 12-15', href: '/products/tne-12-15' },
  { name: 'Chilwee Gold', href: '/products/chilwee-gold' },
  { name: 'Chilwee Platinum', href: '/products/chilwee-platinum' },
  { name: 'Chilwee 12v/20ah', href: '/products/chilwee-12v-20ah' },
  { name: 'Lithium 48v/12ah', href: '/products/lithium-48v-12ah' },
  { name: 'Lithium 48v/21ah', href: '/products/lithium-48v-21ah' },
];

const sparepartCategories = [
  { name: 'Motor Listrik', href: '/catalog/sparepart?cat=motor' },
  { name: 'Controller', href: '/catalog/sparepart?cat=controller' },
  { name: 'Charger', href: '/catalog/sparepart?cat=charger' },
  { name: 'Rem & Komponen', href: '/catalog/sparepart?cat=rem' },
  { name: 'Ban & Velg', href: '/catalog/sparepart?cat=ban' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#00B4D8] text-white text-xs md:text-sm font-semibold overflow-hidden h-9 flex items-center">
        <div className="animate-marquee">
          {[1, 2].map((i) => (
            <span key={i} className="flex items-center gap-8 px-8">
              <span>✓ Garansi Resmi</span>
              <span>•</span>
              <span>✓ Sparepart Tersedia</span>
              <span>•</span>
              <span>✓ Support Seluruh Indonesia</span>
              <span>•</span>
              <span>✓ Garansi Resmi</span>
              <span>•</span>
              <span>✓ Sparepart Tersedia</span>
              <span>•</span>
              <span>✓ Support Seluruh Indonesia</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src={LOGO_URL} alt="VOXA" className="h-10 w-10 object-contain" />
              <span className="font-display text-2xl tracking-widest text-gray-900 hidden sm:block">VOXA</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Produk Kami Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${megaOpen ? 'text-[#00B4D8]' : 'text-gray-700 hover:text-[#00B4D8]'}`}
                >
                  Produk Kami
                  <ChevronDown size={14} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Dropdown Panel */}
                {megaOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[700px] bg-white shadow-2xl border-t-2 border-[#00B4D8] rounded-b-xl z-50 p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Sepeda Listrik */}
                      <div>
                        <Link href="/catalog/sepeda-listrik">
                          <h3 className="font-display text-base tracking-wider text-[#00B4D8] mb-3 hover:underline">SEPEDA LISTRIK</h3>
                        </Link>
                        <div className="space-y-1">
                          {sepedaListrikItems.map(item => (
                            <Link key={item.href} href={item.href} className="block text-sm text-gray-600 hover:text-[#00B4D8] hover:pl-1 transition-all py-0.5">
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* Batre */}
                      <div>
                        <Link href="/catalog/batre">
                          <h3 className="font-display text-base tracking-wider text-[#00B4D8] mb-3 hover:underline">BATRE</h3>
                        </Link>
                        <div className="space-y-1">
                          {batreItems.map(item => (
                            <Link key={item.href} href={item.href} className="block text-sm text-gray-600 hover:text-[#00B4D8] hover:pl-1 transition-all py-0.5">
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* Sparepart */}
                      <div>
                        <Link href="/catalog/sparepart">
                          <h3 className="font-display text-base tracking-wider text-[#00B4D8] mb-3 hover:underline">SPAREPART</h3>
                        </Link>
                        <div className="space-y-1">
                          {sparepartCategories.map(item => (
                            <Link key={item.href} href={item.href} className="block text-sm text-gray-600 hover:text-[#00B4D8] hover:pl-1 transition-all py-0.5">
                              {item.name}
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Link href="/catalog/sepeda-listrik" className="block w-full text-center bg-[#00B4D8] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#0096b8] transition-colors">
                            Lihat Semua Produk →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {[
                { label: 'Bandingkan Produk', href: '/compare' },
                { label: 'Untuk Bisnis', href: '/bisnis' },
                { label: 'Untuk Pemerintah', href: '/pemerintah' },
                { label: 'Showroom', href: '/showroom' },
                { label: 'Tentang VOXA', href: '/tentang' },
                { label: 'Bantuan', href: '/bantuan' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${location === item.href ? 'text-[#00B4D8]' : 'text-gray-700 hover:text-[#00B4D8]'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Button + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/catalog/sepeda-listrik"
                className="hidden md:inline-flex items-center gap-2 bg-[#00B4D8] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0096b8] transition-colors shadow-md whitespace-nowrap"
              >
                Temukan VOXA Anda
              </Link>
              <button
                className="lg:hidden p-2 text-gray-700 hover:text-[#00B4D8]"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="container py-4 space-y-1">
              <MobileSection title="Sepeda Listrik" items={sepedaListrikItems} basePath="/catalog/sepeda-listrik" />
              <MobileSection title="Batre" items={batreItems} basePath="/catalog/batre" />
              <MobileSection title="Sparepart" items={sparepartCategories} basePath="/catalog/sparepart" />
              <div className="pt-2 border-t border-gray-100 space-y-1">
                {[
                  { label: 'Bandingkan Produk', href: '/compare' },
                  { label: 'Untuk Bisnis', href: '/bisnis' },
                  { label: 'Untuk Pemerintah', href: '/pemerintah' },
                  { label: 'Showroom', href: '/showroom' },
                  { label: 'Tentang VOXA', href: '/tentang' },
                  { label: 'Bantuan', href: '/bantuan' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#00B4D8] hover:bg-gray-50 rounded-lg">
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="pt-3">
                <Link href="/catalog/sepeda-listrik" className="flex items-center justify-center gap-2 w-full bg-[#00B4D8] text-white font-bold py-3 rounded-full text-sm">
                  <MessageCircle size={16} />
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

function MobileSection({ title, items, basePath }: { title: string; items: { name: string; href: string }[]; basePath: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold text-gray-800 hover:text-[#00B4D8] hover:bg-gray-50 rounded-lg"
      >
        <span>{title}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-6 pb-2 space-y-1">
          <Link href={basePath} className="block px-4 py-1.5 text-xs font-bold text-[#00B4D8]">Lihat Semua →</Link>
          {items.map(item => (
            <Link key={item.href} href={item.href} className="block px-4 py-1.5 text-sm text-gray-600 hover:text-[#00B4D8]">
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
