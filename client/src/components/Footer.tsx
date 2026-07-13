import { useState } from 'react';
import { Link } from 'wouter';
import { Instagram, Youtube, Facebook } from 'lucide-react';

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.78 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z"/>
    </svg>
  );
}

const LOGO_URL = '/voxa-logo.jpg';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    // Simulate submission — replace with real API call when available
    setNewsletterStatus('success');
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-gray-200">

      {/* ── Main 4-column grid ─────────────────────────────────────── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem 3rem' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Column 1: BANTUAN */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-gray-900 mb-5 uppercase">Bantuan</h4>
            <ul className="space-y-3">
              {[
                { label: 'Pusat Bantuan', href: '/bantuan' },
                { label: 'Cara Pemesanan', href: '/bantuan' },
                { label: 'Garansi Produk', href: '/bantuan' },
                { label: 'Sparepart & Servis', href: '/bantuan' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/628156161071?text=Halo%2C%20saya%20mengunjungi%20website%20VOXA%20dan%20ingin%20mengetahui%20lebih%20lanjut%20mengenai%20produk-produk%20VOXA.%20Terima%20kasih."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: PRODUK */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-gray-900 mb-5 uppercase">Produk</h4>
            <ul className="space-y-3">
              {[
                { label: 'Sepeda Listrik', href: '/sepeda-listrik' },
                { label: 'Baterai', href: '/baterai' },
                { label: 'Sparepart', href: '/sparepart' },
                { label: 'Bandingkan Model', href: '/compare' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: PERUSAHAAN */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-gray-900 mb-5 uppercase">Perusahaan</h4>
            <ul className="space-y-3">
              {[
                { label: 'Tentang VOXA', href: '/tentang' },
                { label: 'Artikel', href: '/artikel' },
                { label: 'Distributor VOXA', href: '/pemerintah' },
                { label: 'Showroom', href: '/showroom' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: MORE — newsletter + blog tiles */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-gray-900 mb-5 uppercase">Lebih Banyak</h4>
            <div className="space-y-3">
              {/* Newsletter tile */}
              <form onSubmit={handleNewsletter} className="bg-[#00B4D8] p-4">
                <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">Newsletter VOXA</p>
                <p className="text-white/80 text-xs mb-3 leading-relaxed">Dapatkan info produk terbaru dan promo eksklusif.</p>
                {newsletterStatus === 'success' ? (
                  <p className="text-white text-xs font-semibold py-2">Terima kasih! Kamu sudah terdaftar.</p>
                ) : (
                  <>
                    <div className="flex">
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setNewsletterStatus('idle'); }}
                        placeholder="Email kamu"
                        className="flex-1 text-xs px-3 py-2 bg-white text-gray-900 placeholder-gray-400 outline-none min-w-0"
                        required
                      />
                      <button type="submit" className="bg-gray-900 text-white text-xs font-bold px-3 py-2 hover:bg-gray-700 transition-colors whitespace-nowrap">
                        Daftar
                      </button>
                    </div>
                    {newsletterStatus === 'error' && (
                      <p className="text-white/80 text-[10px] mt-1">Masukkan email yang valid.</p>
                    )}
                  </>
                )}
              </form>
              {/* Guide tile */}
              <Link href="/guide">
                <div className="border border-gray-200 p-4 hover:border-gray-400 transition-colors cursor-pointer">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">VOXA Guide</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Tips, panduan, dan artikel seputar kendaraan listrik.</p>
                </div>
              </Link>
              {/* Showroom tile */}
              <Link href="/showroom">
                <div className="border border-gray-200 p-4 hover:border-gray-400 transition-colors cursor-pointer">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Temukan Showroom</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Kunjungi showroom VOXA terdekat di kota Anda.</p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Social + Payment row ───────────────────────────────────── */}
      <div className="border-t border-gray-100">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem' }}
          className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {[
              { icon: <Instagram size={18} />, href: 'https://www.instagram.com/voxaofficial', label: 'Instagram' },
              { icon: <Facebook size={18} />, href: 'https://www.facebook.com/voxaofficial/?ref=1', label: 'Facebook' },
              { icon: <Youtube size={18} />, href: 'https://www.youtube.com/channel/UCnWwDV4uaSEdXm80rH1i83A/videos', label: 'YouTube' },
              { icon: <TikTokIcon size={18} />, href: 'https://www.tiktok.com/@voxaofficial', label: 'TikTok' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Payment icons (text-based badges) */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['Visa', 'Mastercard', 'BCA', 'Mandiri', 'GoPay', 'OVO', 'Dana'].map(method => (
              <span
                key={method}
                className="border border-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded tracking-wider"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="VOXA" className="h-7 w-auto object-contain opacity-70" />
            <span className="font-display text-lg tracking-widest text-gray-400">VOXA</span>
          </div>
        </div>
      </div>

      {/* ── Bottom legal bar ──────────────────────────────────────── */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem' }}
          className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-400">
            © 2025 VOXA. Hak Cipta Dilindungi. Produk Lokal Indonesia.
          </p>
          <div className="flex gap-4">
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Garansi', 'Sitemap'].map(link => (
              <a key={link} href="#" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
