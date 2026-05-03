import { Link } from 'wouter';
import { MessageCircle, MapPin, Phone, Mail, Instagram, Youtube, Facebook } from 'lucide-react';

const LOGO_URL = '/manus-storage/voxa-logo_923e0d6b.png';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="VOXA" className="h-12 w-12 object-contain" />
              <span className="font-display text-3xl tracking-widest text-white">VOXA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Kendaraan listrik untuk jalanan Indonesia. Modern, tangguh, dan ramah lingkungan.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#00B4D8] rounded-full flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#00B4D8] rounded-full flex items-center justify-center transition-colors">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-[#00B4D8] rounded-full flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Produk */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-4">PRODUK</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sepeda Listrik', href: '/catalog/sepeda-listrik' },
                { label: 'Batre', href: '/catalog/batre' },
                { label: 'Sparepart', href: '/catalog/sparepart' },
                { label: 'Bandingkan Produk', href: '/compare' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-[#00B4D8] text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-4">PERUSAHAAN</h4>
            <ul className="space-y-2">
              {[
                { label: 'Tentang VOXA', href: '/tentang' },
                { label: 'Untuk Bisnis', href: '/bisnis' },
                { label: 'Untuk Pemerintah', href: '/pemerintah' },
                { label: 'Showroom', href: '/showroom' },
                { label: 'VOXA Guide', href: '/guide' },
                { label: 'Bantuan', href: '/bantuan' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-[#00B4D8] text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-4">KONTAK</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-[#00B4D8] shrink-0 mt-0.5" />
                <span>Indonesia — Tersedia di seluruh wilayah</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-[#00B4D8] shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-[#00B4D8] transition-colors">+62 812 3456 7890</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-[#00B4D8] shrink-0" />
                <a href="mailto:info@voxa.co.id" className="hover:text-[#00B4D8] transition-colors">info@voxa.co.id</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <MessageCircle size={16} className="text-[#00B4D8] shrink-0" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-[#00B4D8] transition-colors">WhatsApp Support</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">© 2025 VOXA. Hak Cipta Dilindungi. Produksi Lokal Indonesia.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-[#00B4D8] text-xs transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-gray-500 hover:text-[#00B4D8] text-xs transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-gray-500 hover:text-[#00B4D8] text-xs transition-colors">Garansi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
