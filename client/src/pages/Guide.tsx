import { Link } from 'wouter';
import { ChevronRight, BookOpen } from 'lucide-react';

const articles = [
  { title: 'Berapa Hemat Pakai Kendaraan Listrik?', excerpt: 'Hitung penghematan nyata beralih dari motor bensin ke sepeda listrik VOXA. Dengan harga listrik rata-rata Rp 1.500/kWh, Anda bisa hemat hingga Rp 500.000 per bulan.', img: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=600&q=80', tag: 'Keuangan', readTime: '5 menit' },
  { title: 'Cara Memilih Sepeda Listrik yang Tepat', excerpt: 'Panduan lengkap memilih sepeda listrik sesuai kebutuhan dan budget Anda. Dari Liberty untuk harian hingga Elite Rider S untuk performa tinggi.', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80', tag: 'Panduan', readTime: '8 menit' },
  { title: 'Tips Merawat Baterai Sepeda Listrik', excerpt: 'Cara merawat baterai agar tahan lama dan performa tetap optimal. Ikuti 5 tips sederhana ini untuk memperpanjang umur baterai Anda.', img: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=600&q=80', tag: 'Perawatan', readTime: '4 menit' },
  { title: 'Sepeda Listrik untuk Bisnis Kurir', excerpt: 'Bagaimana Voxa Kurir membantu bisnis pengiriman Anda lebih efisien dan hemat. Studi kasus dari 50+ mitra kurir VOXA.', img: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80', tag: 'Bisnis', readTime: '6 menit' },
  { title: 'Perbandingan Motor Bensin vs Listrik di Indonesia', excerpt: 'Analisis mendalam biaya kepemilikan, perawatan, dan dampak lingkungan antara motor bensin dan sepeda listrik.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', tag: 'Analisis', readTime: '10 menit' },
  { title: 'Panduan Pengisian Baterai yang Benar', excerpt: 'Kapan waktu terbaik mengisi baterai? Berapa lama harus diisi? Semua pertanyaan Anda dijawab di sini.', img: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=600&q=80', tag: 'Perawatan', readTime: '3 menit' },
];

const tags = ['Semua', 'Panduan', 'Keuangan', 'Perawatan', 'Bisnis', 'Analisis'];

export default function Guide() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">VOXA Guide</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 text-white py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen size={32} className="text-[#00B4D8]" />
            <p className="text-[#00B4D8] text-sm font-bold tracking-widest">EDUKASI & TIPS</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-4">VOXA GUIDE</h1>
          <p className="text-gray-400 text-lg max-w-xl">Panduan, tips, dan artikel edukatif seputar kendaraan listrik untuk membantu Anda membuat keputusan terbaik.</p>
        </div>
      </div>

      <div className="container py-16">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map(tag => (
            <button key={tag} className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-[#00B4D8] hover:text-white transition-all">
              {tag}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <div className="mb-10">
          <Link href="#">
            <div className="group grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <img src={articles[0].img} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="inline-block bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-bold px-3 py-1 rounded-full mb-4 self-start">{articles[0].tag}</span>
                <h2 className="font-bold text-gray-900 text-2xl md:text-3xl mb-4 group-hover:text-[#00B4D8] transition-colors leading-snug">{articles[0].title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{articles[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{articles[0].readTime} baca</span>
                  <span className="text-[#00B4D8] font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
                    Baca Selengkapnya <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
            <Link key={article.title} href="#">
              <div className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                <div className="aspect-video overflow-hidden">
                  <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-bold px-3 py-1 rounded-full">{article.tag}</span>
                    <span className="text-gray-400 text-xs">{article.readTime} baca</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#00B4D8] transition-colors leading-snug">{article.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center gap-1 mt-4 text-[#00B4D8] text-sm font-bold">
                    Baca Selengkapnya <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
