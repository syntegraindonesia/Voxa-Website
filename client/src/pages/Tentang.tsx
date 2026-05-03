import { Link } from 'wouter';
import { ChevronRight, Zap, Leaf, Users, Award } from 'lucide-react';

const LOGO_URL = '/manus-storage/voxa-logo_923e0d6b.png';

export default function Tentang() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Tentang VOXA</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gray-950 text-white py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <img src={LOGO_URL} alt="VOXA" className="w-24 h-24 object-contain mx-auto mb-8" />
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-4">TENTANG KAMI</p>
            <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-6 leading-none">
              VOXA — KENDARAAN<br /><span className="text-[#00B4D8]">LISTRIK INDONESIA</span>
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed">
              Kami hadir untuk menghadirkan solusi mobilitas listrik yang modern, terjangkau, dan cocok untuk jalanan Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-4">MISI KAMI</p>
              <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide mb-6 leading-none">
                MENGGERAKKAN<br />INDONESIA<br /><span className="text-[#00B4D8]">SECARA LISTRIK</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                VOXA didirikan dengan satu tujuan: menghadirkan kendaraan listrik berkualitas tinggi yang dirancang khusus untuk kondisi jalan, iklim, dan kebutuhan masyarakat Indonesia.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami percaya bahwa masa depan mobilitas Indonesia adalah listrik — bersih, hemat, dan cerdas. Setiap produk VOXA dirancang untuk membuktikan bahwa beralih ke kendaraan listrik tidak perlu mahal atau rumit.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Zap size={24} />, title: 'Inovasi', desc: 'Teknologi terdepan untuk performa optimal' },
                { icon: <Leaf size={24} />, title: 'Ramah Lingkungan', desc: 'Zero emisi untuk Indonesia lebih hijau' },
                { icon: <Users size={24} />, title: 'Lokal', desc: 'Dirancang untuk kebutuhan Indonesia' },
                { icon: <Award size={24} />, title: 'Kualitas', desc: 'Standar internasional, harga lokal' },
              ].map(item => (
                <div key={item.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="w-10 h-10 bg-[#00B4D8]/10 rounded-xl flex items-center justify-center text-[#00B4D8] mb-3">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#00B4D8]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '2018', label: 'Tahun Berdiri' },
              { num: '10.000+', label: 'Pengguna Aktif' },
              { num: '50+', label: 'Kota di Indonesia' },
              { num: '15+', label: 'Model Produk' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display text-4xl md:text-5xl tracking-wide mb-2">{stat.num}</p>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">NILAI KAMI</p>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 tracking-wide">PRINSIP VOXA</h2>
          </div>
          <div className="space-y-5">
            {[
              { num: '01', title: 'Produk Lokal, Standar Global', desc: 'VOXA dirancang di Indonesia dengan standar kualitas internasional. Kami bangga menjadi bagian dari industri kendaraan listrik nasional.' },
              { num: '02', title: 'Keterjangkauan Tanpa Kompromi', desc: 'Kami percaya kendaraan listrik berkualitas harus bisa diakses oleh semua kalangan masyarakat Indonesia.' },
              { num: '03', title: 'Dukungan Purna Jual Terpercaya', desc: 'Garansi resmi, sparepart tersedia, dan jaringan servis di seluruh Indonesia memastikan Anda selalu bisa berkendara.' },
              { num: '04', title: 'Inovasi Berkelanjutan', desc: 'Kami terus berinovasi menghadirkan teknologi terbaru yang relevan dengan kebutuhan pengguna Indonesia.' },
            ].map(val => (
              <div key={val.num} className="flex items-start gap-6 bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#00B4D8]/30 transition-all">
                <span className="font-display text-4xl text-[#00B4D8]/30 tracking-wider shrink-0">{val.num}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{val.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
