import { Link } from 'wouter';
import { ChevronRight, MapPin, Phone, Clock, Navigation } from 'lucide-react';

const showrooms = [
  { city: 'Jakarta Pusat', address: 'Jl. Sudirman No. 123, Jakarta Pusat 10220', phone: '+62 21 5555-1234', hours: 'Senin–Sabtu 09.00–18.00', img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&q=80' },
  { city: 'Jakarta Selatan', address: 'Jl. Fatmawati No. 45, Jakarta Selatan 12430', phone: '+62 21 5555-5678', hours: 'Senin–Sabtu 09.00–18.00', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80' },
  { city: 'Surabaya', address: 'Jl. Pemuda No. 45, Surabaya 60271', phone: '+62 31 5555-1234', hours: 'Senin–Sabtu 09.00–17.00', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { city: 'Bandung', address: 'Jl. Asia Afrika No. 78, Bandung 40111', phone: '+62 22 5555-1234', hours: 'Senin–Sabtu 09.00–17.00', img: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400&q=80' },
  { city: 'Medan', address: 'Jl. Gatot Subroto No. 56, Medan 20112', phone: '+62 61 5555-1234', hours: 'Senin–Sabtu 09.00–17.00', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80' },
  { city: 'Semarang', address: 'Jl. Pandanaran No. 90, Semarang 50134', phone: '+62 24 5555-1234', hours: 'Senin–Sabtu 09.00–17.00', img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&q=80' },
  { city: 'Yogyakarta', address: 'Jl. Malioboro No. 12, Yogyakarta 55213', phone: '+62 274 5555-1234', hours: 'Senin–Sabtu 09.00–17.00', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80' },
  { city: 'Makassar', address: 'Jl. Penghibur No. 34, Makassar 90111', phone: '+62 411 5555-1234', hours: 'Senin–Sabtu 09.00–17.00', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
];

export default function Showroom() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Showroom</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 text-white py-16">
        <div className="container">
          <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">TEMUKAN KAMI</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-4">SHOWROOM VOXA</h1>
          <p className="text-gray-400 text-lg max-w-xl">Kunjungi showroom terdekat untuk test ride dan konsultasi langsung dengan tim ahli kami.</p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {showrooms.map(s => (
            <div key={s.city} className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="aspect-video overflow-hidden">
                <img src={s.img} alt={s.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-3">{s.city}</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-[#00B4D8] shrink-0 mt-0.5" />
                    <span>{s.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} className="text-[#00B4D8] shrink-0" />
                    <a href={`tel:${s.phone}`} className="hover:text-[#00B4D8]">{s.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} className="text-[#00B4D8] shrink-0" />
                    <span>{s.hours}</span>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-[#00B4D8] text-sm font-bold hover:gap-3 transition-all"
                >
                  <Navigation size={14} />
                  Lihat di Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
