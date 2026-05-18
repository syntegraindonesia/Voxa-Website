export type ArticleCategory =
  | 'Teknologi EV'
  | 'Mobilitas Berkelanjutan'
  | 'Tips Kendaraan Listrik'
  | 'Berita VOXA'
  | 'Industri Otomotif'
  | 'Inovasi';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  publishDate: string;
  readTime: number; // minutes
  featured: boolean;
  image: string;
  author: string;
  tags?: string[];
}

export const articles: Article[] = [
  {
    id: '1',
    slug: 'masa-depan-kendaraan-listrik-indonesia',
    title: 'Masa Depan Kendaraan Listrik di Indonesia: Peluang dan Tantangan 2025',
    excerpt:
      'Indonesia menargetkan 2 juta unit kendaraan listrik di jalan pada 2025. Bagaimana industri EV lokal seperti VOXA mempersiapkan diri menghadapi era baru mobilitas hijau ini?',
    content: `Indonesia tengah memasuki babak baru dalam sejarah transportasinya. Pemerintah telah menetapkan target ambisius: 2 juta unit kendaraan listrik beroperasi di seluruh nusantara pada tahun 2025. Di tengah dorongan global menuju dekarbonisasi, industri EV domestik seperti VOXA hadir sebagai jawaban nyata atas kebutuhan mobilitas modern yang ramah lingkungan.

Pertumbuhan pasar kendaraan listrik di Indonesia dipicu oleh beberapa faktor utama. Pertama, kebijakan insentif pemerintah yang memberikan keringanan pajak bagi pembeli kendaraan listrik. Kedua, meningkatnya kesadaran masyarakat terhadap dampak emisi karbon dari kendaraan berbahan bakar fosil. Ketiga, perkembangan infrastruktur pengisian daya yang semakin merata di kota-kota besar.

VOXA, sebagai merek kendaraan listrik asli Indonesia, telah memposisikan diri sebagai pemain kunci dalam ekosistem ini. Dengan lini produk yang mencakup sepeda listrik untuk kebutuhan harian, bisnis, hingga pengiriman, VOXA menawarkan solusi mobilitas yang terjangkau namun berkualitas tinggi.

Tantangan terbesar yang dihadapi industri EV Indonesia saat ini adalah infrastruktur pengisian daya yang belum merata, terutama di luar Pulau Jawa. Namun, dengan investasi besar dari pemerintah dan swasta, hambatan ini diperkirakan akan teratasi dalam beberapa tahun ke depan.

Ke depan, VOXA berkomitmen untuk terus berinovasi dalam teknologi baterai, desain produk, dan layanan purna jual. Dengan pabrik perakitan modern di Balaraja dan jaringan showroom yang terus berkembang, VOXA siap menjadi pilihan utama masyarakat Indonesia dalam bertransisi menuju mobilitas berkelanjutan.`,
    category: 'Teknologi EV',
    publishDate: '2025-05-10',
    readTime: 5,
    featured: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    author: 'Tim Redaksi VOXA',
  },
  {
    id: '2',
    slug: 'tips-merawat-baterai-sepeda-listrik',
    title: '7 Tips Merawat Baterai Sepeda Listrik Agar Tahan Lama',
    excerpt:
      'Baterai adalah jantung dari sepeda listrik Anda. Dengan perawatan yang tepat, baterai VOXA bisa bertahan hingga 3–5 tahun. Simak tips lengkapnya di sini.',
    content: `Baterai adalah komponen paling vital sekaligus paling mahal dalam sepeda listrik. Merawatnya dengan benar bukan hanya soal menghemat biaya, tetapi juga memastikan performa kendaraan Anda tetap optimal setiap hari.

**1. Jangan Biarkan Baterai Habis Total**
Hindari menggunakan sepeda listrik hingga baterai benar-benar habis (0%). Idealnya, mulai pengisian ulang ketika indikator menunjukkan 20–30% kapasitas tersisa. Kebiasaan ini akan memperpanjang siklus hidup baterai secara signifikan.

**2. Gunakan Charger Original**
Selalu gunakan charger bawaan atau charger resmi VOXA. Charger pihak ketiga yang tidak kompatibel dapat merusak sel baterai dan berpotensi menimbulkan risiko keselamatan.

**3. Hindari Pengisian Berlebihan**
Jangan biarkan sepeda listrik tercolok ke listrik semalaman secara rutin. Setelah baterai penuh (100%), segera cabut charger untuk menghindari overcharging yang dapat menurunkan kapasitas baterai.

**4. Simpan di Suhu yang Tepat**
Baterai lithium sangat sensitif terhadap suhu ekstrem. Hindari menyimpan atau mengisi daya di bawah terik matahari langsung atau di ruangan yang sangat panas. Suhu ideal penyimpanan adalah 15–25°C.

**5. Bersihkan Terminal Baterai Secara Berkala**
Kotoran dan oksidasi pada terminal baterai dapat mengganggu aliran listrik. Bersihkan terminal dengan kain kering setiap 1–2 bulan sekali.

**6. Lakukan Kalibrasi Baterai**
Setiap 3 bulan, lakukan kalibrasi dengan mengisi baterai hingga penuh, lalu gunakan hingga 10–15%, kemudian isi kembali hingga penuh. Ini membantu sistem manajemen baterai membaca kapasitas dengan akurat.

**7. Servis Berkala di Showroom VOXA**
Kunjungi showroom VOXA terdekat setiap 6 bulan untuk pemeriksaan kondisi baterai oleh teknisi bersertifikat. Deteksi dini masalah baterai dapat mencegah kerusakan yang lebih serius.`,
    category: 'Tips Kendaraan Listrik',
    publishDate: '2025-05-05',
    readTime: 4,
    featured: false,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    author: 'Tim Teknis VOXA',
  },
  {
    id: '3',
    slug: 'voxa-elite-rider-s-review',
    title: 'Review VOXA Elite Rider S: Sepeda Listrik Premium untuk Pengendara Aktif',
    excerpt:
      'Elite Rider S hadir dengan motor 650W, suspensi ganda, dan desain sporty yang memukau. Kami menguji langsung performa dan kenyamanannya di jalanan Jakarta.',
    content: `VOXA Elite Rider S adalah puncak dari lini Elite Series — sebuah pernyataan desain dan performa yang ditujukan bagi pengendara yang menginginkan lebih dari sekadar alat transportasi. Dengan motor 650W dan berbagai fitur premium, apakah Elite Rider S layak menjadi pilihan utama Anda?

**Desain dan Build Quality**
Tampilan Elite Rider S langsung mencuri perhatian. Garis-garis bodi yang tegas, lampu LED berbentuk elips, dan pilihan warna yang berani mencerminkan karakter sporty yang sesungguhnya. Material bodi menggunakan ABS grade tinggi yang ringan namun kokoh.

**Performa Motor**
Motor brushless 650W memberikan akselerasi yang responsif dan torsi yang cukup untuk mengatasi tanjakan hingga 25 derajat. Dalam pengujian kami di jalanan Jakarta, Elite Rider S mampu mencapai kecepatan puncak 45 km/jam dengan mulus.

**Jangkauan Baterai**
Dengan baterai 60V 20Ah, Elite Rider S menawarkan jangkauan hingga 60–70 km dalam kondisi jalan datar dan beban normal. Cukup untuk perjalanan komuter harian tanpa khawatir kehabisan daya.

**Kenyamanan Berkendara**
Suspensi teleskopik di depan dan suspensi ganda di belakang meredam getaran dengan baik. Kursi yang lebar dan empuk membuat perjalanan jauh tetap nyaman. Panel instrumen digital memberikan informasi lengkap: kecepatan, level baterai, jarak tempuh, dan mode berkendara.

**Kesimpulan**
VOXA Elite Rider S adalah pilihan tepat bagi mereka yang menginginkan sepeda listrik premium dengan performa tinggi, desain menawan, dan fitur lengkap. Dengan harga Rp 5.800.000, Elite Rider S menawarkan nilai yang kompetitif di segmennya.`,
    category: 'Berita VOXA',
    publishDate: '2025-04-28',
    readTime: 6,
    featured: false,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
    author: 'Tim Redaksi VOXA',
  },
  {
    id: '4',
    slug: 'sepeda-listrik-untuk-bisnis-pengiriman',
    title: 'Mengapa Sepeda Listrik Adalah Solusi Terbaik untuk Bisnis Pengiriman di Indonesia',
    excerpt:
      'Biaya operasional lebih rendah, ramah lingkungan, dan mudah bermanuver di kemacetan kota. Pelajari bagaimana VOXA membantu bisnis pengiriman bertumbuh lebih efisien.',
    content: `Di era e-commerce yang terus berkembang pesat, bisnis pengiriman last-mile menghadapi tekanan besar untuk beroperasi lebih efisien dan berkelanjutan. Sepeda listrik hadir sebagai solusi yang tidak hanya mengurangi biaya operasional, tetapi juga meningkatkan citra merek bisnis Anda sebagai perusahaan yang peduli lingkungan.

**Penghematan Biaya Operasional yang Signifikan**
Dibandingkan dengan motor bensin konvensional, sepeda listrik VOXA menawarkan penghematan biaya bahan bakar hingga 80%. Biaya pengisian daya hanya sekitar Rp 2.000–3.000 per 50 km, jauh lebih hemat dibandingkan bensin yang bisa mencapai Rp 15.000–20.000 untuk jarak yang sama.

**Perawatan yang Lebih Mudah dan Murah**
Motor listrik memiliki komponen yang jauh lebih sedikit dibandingkan mesin bensin. Tidak ada oli mesin, busi, atau filter udara yang perlu diganti secara rutin. Biaya perawatan tahunan sepeda listrik VOXA rata-rata 60% lebih rendah dari motor bensin.

**Mobilitas Tinggi di Perkotaan**
Ukuran yang kompak dan kemampuan bermanuver yang baik membuat sepeda listrik VOXA ideal untuk navigasi di kemacetan kota. Pengiriman last-mile menjadi lebih cepat dan efisien.

**Program B2B VOXA**
VOXA menawarkan program khusus untuk bisnis dengan pembelian armada. Manfaat yang ditawarkan meliputi diskon volume, layanan purna jual prioritas, pelatihan pengemudi, dan opsi cicilan yang fleksibel. Hubungi tim B2B VOXA untuk konsultasi gratis.`,
    category: 'Mobilitas Berkelanjutan',
    publishDate: '2025-04-20',
    readTime: 5,
    featured: false,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    author: 'Tim Bisnis VOXA',
  },
  {
    id: '5',
    slug: 'teknologi-baterai-ev-terbaru-2025',
    title: 'Perkembangan Teknologi Baterai EV Terbaru: Dari Lithium-Ion ke Solid-State',
    excerpt:
      'Teknologi baterai kendaraan listrik berkembang dengan pesat. Dari lithium-ion yang sudah mapan hingga solid-state yang menjanjikan, simak ikhtisar lengkap perkembangannya.',
    content: `Teknologi baterai adalah inti dari revolusi kendaraan listrik. Perkembangannya yang pesat dalam beberapa tahun terakhir telah membuat EV semakin terjangkau, bertenaga, dan praktis. Berikut adalah ikhtisar teknologi baterai terkini yang membentuk masa depan mobilitas.

**Lithium-Ion: Standar Industri Saat Ini**
Baterai lithium-ion (Li-ion) saat ini mendominasi pasar kendaraan listrik. Keunggulannya meliputi kepadatan energi yang tinggi, siklus pengisian yang panjang, dan biaya produksi yang terus menurun. VOXA menggunakan baterai Li-ion berkualitas tinggi dari mitra terpercaya untuk memastikan performa dan keandalan optimal.

**LFP (Lithium Iron Phosphate): Keamanan Lebih Tinggi**
Baterai LFP menawarkan stabilitas termal yang lebih baik dibandingkan Li-ion konvensional, mengurangi risiko thermal runaway. Meski kepadatan energinya sedikit lebih rendah, umur siklus yang lebih panjang membuatnya ideal untuk aplikasi komersial.

**Solid-State: Masa Depan yang Menjanjikan**
Baterai solid-state menggantikan elektrolit cair dengan elektrolit padat, menghasilkan kepadatan energi yang jauh lebih tinggi, pengisian lebih cepat, dan keamanan yang lebih baik. Meski masih dalam tahap pengembangan untuk produksi massal, teknologi ini diperkirakan akan mulai memasuki pasar konsumen pada 2027–2030.

**Komitmen VOXA terhadap Inovasi Baterai**
VOXA terus berinvestasi dalam penelitian dan pengembangan teknologi baterai untuk menghadirkan produk yang semakin efisien dan terjangkau bagi konsumen Indonesia. Kolaborasi dengan mitra teknologi global memastikan VOXA selalu berada di garis terdepan inovasi EV.`,
    category: 'Teknologi EV',
    publishDate: '2025-04-15',
    readTime: 7,
    featured: false,
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dfd4d?w=800&q=80',
    author: 'Tim R&D VOXA',
  },
  {
    id: '6',
    slug: 'voxa-buka-showroom-ke-5-meruya',
    title: 'VOXA Resmi Membuka Showroom Ke-5 di Meruya, Jakarta Barat',
    excerpt:
      'VOXA terus memperluas jaringan showroom untuk melayani pelanggan di seluruh Jabodetabek. Showroom terbaru di Meruya hadir dengan konsep modern dan layanan lengkap.',
    content: `VOXA dengan bangga mengumumkan pembukaan showroom ke-5 di Meruya, Jakarta Barat. Berlokasi di Srengseng, Kecamatan Kembangan, showroom terbaru ini hadir untuk melayani pelanggan di wilayah Jakarta Barat dan sekitarnya dengan lebih mudah dan nyaman.

**Konsep Showroom Modern**
Showroom VOXA Meruya dirancang dengan konsep modern yang mencerminkan identitas merek VOXA: bersih, futuristik, dan ramah pengunjung. Seluruh lini produk VOXA tersedia untuk dilihat dan dicoba langsung, mulai dari Elite Series hingga Liberty dan Eiffel Series.

**Layanan Lengkap**
Selain penjualan unit baru, showroom VOXA Meruya juga menyediakan layanan purna jual lengkap: servis berkala, penggantian suku cadang, konsultasi produk, dan test ride gratis untuk semua model.

**Akses Mudah**
Berlokasi strategis di Srengseng, showroom ini mudah diakses dari berbagai penjuru Jakarta Barat, Tangerang, dan Depok. Tersedia area parkir yang luas untuk kenyamanan pengunjung.

**Jam Operasional**
Showroom VOXA Meruya buka setiap hari Senin–Sabtu pukul 09.00–18.00 WIB. Untuk informasi lebih lanjut, hubungi WhatsApp: 081119279326.

Kunjungi showroom VOXA terdekat Anda dan rasakan sendiri pengalaman berkendara listrik yang modern dan menyenangkan!`,
    category: 'Berita VOXA',
    publishDate: '2025-04-08',
    readTime: 3,
    featured: false,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    author: 'Tim Komunikasi VOXA',
  },
  {
    id: '7',
    slug: 'regulasi-kendaraan-listrik-indonesia-2025',
    title: 'Regulasi Kendaraan Listrik Indonesia 2025: Apa yang Perlu Anda Ketahui',
    excerpt:
      'Pemerintah Indonesia terus memperbarui regulasi kendaraan listrik. Dari insentif pajak hingga standar keselamatan, berikut panduan lengkap untuk konsumen dan pelaku bisnis.',
    content: `Regulasi kendaraan listrik di Indonesia terus berkembang seiring dengan pertumbuhan industri EV yang pesat. Memahami regulasi yang berlaku penting bagi konsumen maupun pelaku bisnis untuk memastikan kepatuhan dan memanfaatkan berbagai insentif yang tersedia.

**Insentif Pajak untuk Kendaraan Listrik**
Pemerintah Indonesia memberikan berbagai insentif fiskal untuk mendorong adopsi kendaraan listrik. Pembebasan Pajak Penjualan atas Barang Mewah (PPnBM) untuk kendaraan listrik roda dua dan roda empat yang memenuhi syarat TKDN (Tingkat Komponen Dalam Negeri) minimal 40%.

**Standar Keselamatan dan Sertifikasi**
Semua kendaraan listrik yang dijual di Indonesia wajib memenuhi standar keselamatan yang ditetapkan oleh Kementerian Perhubungan dan Kementerian Perindustrian. VOXA memastikan seluruh produknya telah memperoleh sertifikasi yang diperlukan.

**Regulasi Penggunaan di Jalan**
Sepeda listrik dengan kecepatan maksimum di bawah 25 km/jam dikategorikan sebagai kendaraan tidak bermotor dan tidak memerlukan SIM atau STNK. Untuk sepeda listrik dengan kecepatan lebih tinggi, berlaku regulasi yang sama dengan kendaraan bermotor konvensional.

**Infrastruktur Pengisian Daya**
Pemerintah mendorong pembangunan stasiun pengisian kendaraan listrik umum (SPKLU) di seluruh Indonesia. Regulasi terbaru mewajibkan pusat perbelanjaan, perkantoran, dan area publik tertentu untuk menyediakan fasilitas pengisian daya.

**Dukungan VOXA untuk Kepatuhan Regulasi**
VOXA berkomitmen untuk memastikan semua produknya mematuhi regulasi yang berlaku dan terus memperbarui informasi kepada pelanggan mengenai perubahan regulasi yang relevan.`,
    category: 'Industri Otomotif',
    publishDate: '2025-03-30',
    readTime: 6,
    featured: false,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    author: 'Tim Legal VOXA',
  },
];

export const categories: ArticleCategory[] = [
  'Teknologi EV',
  'Mobilitas Berkelanjutan',
  'Tips Kendaraan Listrik',
  'Berita VOXA',
  'Industri Otomotif',
  'Inovasi',
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getFeaturedArticle(): Article {
  return articles.find((a) => a.featured) ?? articles[0];
}

export function getRegularArticles(): Article[] {
  return articles.filter((a) => !a.featured);
}
