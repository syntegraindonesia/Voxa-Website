import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronRight, ChevronLeft, Filter, SlidersHorizontal, X } from 'lucide-react';

// ─── Sparepart product data ───────────────────────────────────────────────────

interface SparepartItem {
  id: string;
  name: string;
  series: string;
  price: string;
  priceNum: number;
  shortDesc: string;
  description: string;
  specs: { label: string; value: string }[];
  images: string[]; // first image = thumbnail
  badge?: string;
}

const sparepartProducts: SparepartItem[] = [
  // ── Alarm Keyless ──────────────────────────────────────────────────────────
  {
    id: 'sp-alarm-keyless',
    name: 'Alarm Keyless VOXA',
    series: 'Keamanan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Sistem kunci keyless dengan alarm anti-maling untuk sepeda listrik VOXA',
    description:
      'Tingkatkan keamanan sepeda listrik Anda dengan Kunci Keyless Alarm VOXA. Produk 100% original VOXA ini memudahkan aktivitas harian Anda — cukup satu sentuhan untuk mengunci dan membuka kunci kendaraan tanpa perlu memasukkan kunci fisik. Dilengkapi sistem alarm yang akan berbunyi jika ada gangguan, memberikan ketenangan pikiran di mana pun Anda berada.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
      { label: 'Pengiriman', value: 'Senin – Jumat (hari kerja)' },
    ],
    images: [
      '/manus-storage/VOXASparepart-AlarmKeyless(1)_382a2e4d.jpg',
      '/manus-storage/VOXASparepart-AlarmKeyless(2)_e20eaad6.jpg',
      '/manus-storage/VOXASparepart-AlarmKeyless(3)_e66aef57.jpg',
    ],
    badge: 'Original',
  },
  // ── As Roda Depan ──────────────────────────────────────────────────────────
  {
    id: 'sp-as-roda-depan',
    name: 'As Roda Depan VOXA',
    series: 'Rangka & Suspensi',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'As roda depan stainless steel 14 cm, kuat dan tahan karat untuk sepeda listrik VOXA',
    description:
      'As Roda Depan VOXA terbuat dari bahan stainless steel berkualitas tinggi yang memberikan kekuatan optimal sekaligus ketahanan terhadap karat dan cuaca. Komponen ini merupakan suku cadang original VOXA yang dirancang presisi untuk memastikan kestabilan dan keamanan roda depan kendaraan Anda dalam setiap kondisi jalan.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Dimensi', value: '14 cm' },
      { label: 'Bahan', value: 'Stainless Steel' },
      { label: 'Garansi', value: '3 Bulan' },
      { label: 'Pengiriman', value: 'Senin – Jumat (hari kerja)' },
    ],
    images: [
      '/manus-storage/VOXASparepart-AsRodaDepan(1)_9b66b767.jpg',
      '/manus-storage/VOXASparepart-AsRodaDepan(2)_e7bf92b4.jpg',
      '/manus-storage/VOXASparepart-AsRodaDepan(3)_f20fa392.jpg',
    ],
  },
  // ── Charger ────────────────────────────────────────────────────────────────
  {
    id: 'sp-charger',
    name: 'Charger Sepeda Listrik VOXA',
    series: 'Charger',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Charger original 48V dengan perlindungan arus dan hubung singkat untuk pengisian aman',
    description:
      'Charger Sepeda Listrik VOXA dibuat dari bahan berkualitas tinggi dan merupakan produk 100% Original. Dilengkapi dengan teknologi canggih yang mencakup perlindungan output, perlindungan hubung singkat, dan perlindungan arus lebih — menjamin proses pengisian yang aman, efisien, dan memperpanjang umur baterai Anda. Pastikan spesifikasi charger sesuai dengan baterai kendaraan Anda sebelum melakukan pembelian.',
    specs: [
      { label: 'Tegangan Input', value: '110–220 VAC, 60 Hz' },
      { label: 'Tegangan Output', value: '48V 12AH' },
      { label: 'Fitur', value: 'Proteksi output, hubung singkat & arus lebih' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Charger(1)_3234d1ab.jpg',
      '/manus-storage/VOXASparepart-Charger(2)_f9ef176a.jpg',
      '/manus-storage/VOXASparepart-Charger(3)_2f0a6097.jpg',
      '/manus-storage/VOXASparepart-Charger(4)_e30a873b.jpg',
    ],
    badge: 'Original',
  },
  // ── Charger Grade A ────────────────────────────────────────────────────────
  {
    id: 'sp-charger-grade-a',
    name: 'Charger Grade A VOXA',
    series: 'Charger',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Charger Grade A 48V 128W dengan input 180–240V dan proteksi lengkap',
    description:
      'Charger Grade A VOXA adalah pilihan premium untuk pengisian baterai sepeda listrik Anda. Dibuat dari bahan berkualitas tinggi dan merupakan produk 100% Original, charger ini hadir dengan daya 128W dan rentang tegangan input yang lebih lebar (180–240 VAC) sehingga lebih stabil di berbagai kondisi jaringan listrik. Dilengkapi perlindungan output, hubung singkat, dan arus lebih untuk keamanan pengisian maksimal.',
    specs: [
      { label: 'Tegangan Input', value: '180–240 VAC, 60 Hz, 128W' },
      { label: 'Tegangan Output', value: '48V 12AH' },
      { label: 'Fitur', value: 'Proteksi output, hubung singkat & arus lebih' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-ChargerGradeA(1)_b9afc2a6.jpg',
      '/manus-storage/VOXASparepart-ChargerGradeA(2)_9032cdac.jpg',
      '/manus-storage/VOXASparepart-ChargerGradeA(3)_bc624742.jpg',
      '/manus-storage/VOXASparepart-ChargerGradeA(4)_c52e3460.jpg',
    ],
    badge: 'Grade A',
  },
  // ── Controller 350W ────────────────────────────────────────────────────────
  {
    id: 'sp-controller-350w',
    name: 'Controller 350W VOXA',
    series: 'Controller',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Controller 350W 48V dengan arus 17A, proteksi under-voltage, desain universal',
    description:
      'Controller 350W VOXA dirancang untuk memberikan tenaga yang stabil dan efisiensi optimal pada sepeda listrik bertegangan 48V. Dengan arus terkontrol serta fitur perlindungan under-voltage, controller ini memastikan motor bekerja halus, responsif, dan aman untuk penggunaan harian. Desain universal menjadikannya kompatibel dengan berbagai motor 48V, sehingga sangat cocok untuk penggantian controller lama atau peningkatan performa tanpa harus mengganti seluruh sistem.',
    specs: [
      { label: 'Daya Maksimal', value: '350W' },
      { label: 'Tegangan Kerja', value: '48V' },
      { label: 'Arus Kelistrikan', value: '17 ± 1A' },
      { label: 'Under Voltage', value: '42 ± 1V' },
      { label: 'Tipe Rem', value: 'Low Brake Level' },
      { label: 'Berat', value: '250 g' },
      { label: 'Dimensi', value: '11.4 × 8.3 × 4 cm' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Controller350w#2(1)_f478ef4b.jpg',
      '/manus-storage/VOXASparepart-Controller350w#2(2)_d5e75262.jpg',
      '/manus-storage/VOXASparepart-Controller350w#2(3)_4cf636a8.jpg',
    ],
  },
  // ── Controller 500W ────────────────────────────────────────────────────────
  {
    id: 'sp-controller-500w',
    name: 'Controller 500W VOXA',
    series: 'Controller',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Controller 500W 48V dengan arus 21A, ideal untuk upgrade performa sepeda listrik',
    description:
      'Controller 500W VOXA dirancang untuk memberikan performa optimal pada berbagai jenis sepeda listrik. Dengan arus yang stabil dan perlindungan under-voltage, controller ini memastikan motor bekerja efisien, responsif, dan aman ketika digunakan sehari-hari. Desain universal membuatnya kompatibel dengan sebagian besar motor 48V, sehingga menjadi pilihan ideal untuk upgrade, penggantian, atau peningkatan tenaga pada sepeda listrik Anda. Pemasangan wajib dilakukan oleh teknisi atau ahli.',
    specs: [
      { label: 'Daya Maksimal', value: '500W' },
      { label: 'Tegangan Kerja', value: '48V' },
      { label: 'Arus Kelistrikan', value: '21 ± 1A' },
      { label: 'Under Voltage', value: '42 ± 1V' },
      { label: 'Tipe Rem', value: 'Low Brake Level' },
      { label: 'Berat', value: '250 g' },
      { label: 'Dimensi', value: '11.4 × 8.3 × 4 cm' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Controller500w#2(1)_cab8dcf1.jpg',
      '/manus-storage/VOXASparepart-Controller500w#2(2)_7abd8686.jpg',
      '/manus-storage/VOXASparepart-Controller500w#2(3)_5f882edb.jpg',
    ],
    badge: 'Populer',
  },
  // ── Fork Garpu Depan ───────────────────────────────────────────────────────
  {
    id: 'sp-fork-garpu-depan',
    name: 'Fork Garpu Depan VOXA',
    series: 'Rangka & Suspensi',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Fork garpu depan besi ringan tahan cuaca, original VOXA untuk kestabilan berkendara',
    description:
      'Fork Garpu Depan VOXA merupakan komponen suku cadang original yang dirancang khusus untuk sepeda listrik VOXA. Terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan terhadap berbagai kondisi cuaca, fork ini memastikan kestabilan kemudi dan kenyamanan berkendara yang optimal. Cocok sebagai pengganti fork yang aus atau rusak untuk mengembalikan performa kendaraan Anda seperti semula.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Garansi', value: '3 Bulan' },
      { label: 'Pengiriman', value: 'Senin – Jumat (hari kerja)' },
    ],
    images: [
      '/manus-storage/VOXASparepart-ForkGarpuDepan(1)_22170589.jpg',
      '/manus-storage/VOXASparepart-ForkGarpuDepan(2)_ff25c055.jpg',
      '/manus-storage/VOXASparepart-ForkGarpuDepan(3)_a6d9bdf6.jpg',
      '/manus-storage/VOXASparepart-ForkGarpuDepan(4)_e526faaa.jpg',
    ],
  },
];

// Placeholder for products whose images haven't been uploaded yet
// These will be replaced once the remaining image batches are received
const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';

const pendingProducts: SparepartItem[] = [
  {
    id: 'sp-jok-belakang',
    name: 'Jok Belakang VOXA',
    series: 'Jok & Aksesori',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Jok belakang hitam 33×16×4.5 cm, nyaman dan tahan lama untuk sepeda listrik VOXA',
    description:
      'Jok Belakang VOXA adalah suku cadang original yang dirancang untuk memberikan kenyamanan penumpang belakang. Dengan dimensi 33×16×4.5 cm dan warna hitam elegan, jok ini mudah dipasang dan cocok sebagai pengganti jok yang aus atau rusak.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Dimensi', value: '33 × 16 × 4.5 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-JokBelakang(1)_161e252d.jpg',
      '/manus-storage/VOXASparepart-JokBelakang(2)_3ba8dcb5.jpg',
      '/manus-storage/VOXASparepart-JokBelakang(3)_d4da7455.jpg',
    ],
  },
  {
    id: 'sp-jok-depan',
    name: 'Jok Depan VOXA',
    series: 'Jok & Aksesori',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Jok depan hitam 27×19.5×8 cm, ergonomis dan nyaman untuk pengendara utama',
    description:
      'Jok Depan VOXA dirancang secara ergonomis untuk memberikan kenyamanan maksimal bagi pengendara utama. Dengan dimensi 27×19.5×8 cm dan material berkualitas, jok ini memberikan bantalan yang cukup untuk perjalanan harian maupun jarak jauh.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Dimensi', value: '27 × 19.5 × 8 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-JokDepan(1)_c51d6d2c.jpg',
      '/manus-storage/VOXASparepart-JokDepan(2)_5a3cb4de.jpg',
      '/manus-storage/VOXASparepart-JokDepan(3)_394e6e68.jpg',
    ],
  },
  {
    id: 'sp-kabel-motor-350w',
    name: 'Kabel Motor 350W VOXA',
    series: 'Kelistrikan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Set kabel motor 350W original VOXA untuk koneksi motor yang andal dan aman',
    description:
      'Kabel Motor 350W VOXA adalah komponen kelistrikan original yang dirancang khusus untuk motor 350W pada sepeda listrik VOXA. Kabel berkualitas tinggi ini memastikan koneksi yang stabil dan aman antara controller dan motor, mencegah gangguan kelistrikan yang dapat merusak sistem penggerak kendaraan.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Kompatibel', value: 'Motor 350W' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-KabelMotor350w(1)_505911f3.jpg',
      '/manus-storage/VOXASparepart-KabelMotor350w(2)_f8a79ca7.jpg',
      '/manus-storage/VOXASparepart-KabelMotor350w(3)_04288a08.jpg',
    ],
  },
  {
    id: 'sp-kabel-motor-500w',
    name: 'Kabel Motor 500W VOXA',
    series: 'Kelistrikan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Set kabel motor 500W original VOXA untuk koneksi motor bertenaga tinggi',
    description:
      'Kabel Motor 500W VOXA adalah komponen kelistrikan original yang dirancang untuk motor 500W pada sepeda listrik VOXA. Dengan spesifikasi kabel yang lebih tebal dan tahan arus tinggi, produk ini memastikan performa motor 500W berjalan optimal dan aman dalam jangka panjang.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Kompatibel', value: 'Motor 500W' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-KabelMotor500w(1)_8935830b.jpg',
      '/manus-storage/VOXASparepart-KabelMotor500w(2)_b1200453.jpg',
      '/manus-storage/VOXASparepart-KabelMotor500w(3)_f67b4fe6.jpg',
    ],
  },
  {
    id: 'sp-keranjang',
    name: 'Keranjang VOXA',
    series: 'Jok & Aksesori',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Keranjang PP universal 29×30×25 cm, ringan, tahan benturan, dan waterproof',
    description:
      'Keranjang VOXA cocok untuk berbagai tipe sepeda listrik. Terbuat dari material PP (Polypropylene) berkualitas tinggi yang dikenal ringan, kuat, dan tahan cuaca, sehingga ideal untuk penggunaan harian maupun perjalanan jarak jauh. Tahan benturan, tidak mudah patah, dan tidak menyerap air. Dilengkapi bracket dan baut pemasangan untuk instalasi yang mudah.',
    specs: [
      { label: 'Material', value: 'Plastik PP (Polypropylene)' },
      { label: 'Ukuran', value: '29 × 30 × 25 cm' },
      { label: 'Berat', value: '810 gram' },
      { label: 'Fitur', value: 'Durable, waterproof, universal fit' },
      { label: 'Isi Paket', value: 'Keranjang + bracket & baut pemasangan' },
    ],
    images: [
      '/manus-storage/Keranjang-thumb_2c0bb82b.jpg',
      '/manus-storage/Keranjang-dim_0f0828e4.jpg',
      '/manus-storage/Keranjang-open1_4e77763b.jpg',
      '/manus-storage/Keranjang-open2_075e724c.jpg',
      '/manus-storage/Keranjang-kit_d8157e51.jpg',
    ],
    badge: 'Universal',
  },
  {
    id: 'sp-klakson',
    name: 'Klakson Trumpet Horn VOXA',
    series: 'Kelistrikan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Klakson trumpet horn 18 cm, suara keras dan jelas untuk keselamatan berkendara',
    description:
      'Klakson Trumpet Horn VOXA menghadirkan suara yang keras dan jelas untuk meningkatkan keselamatan berkendara di jalan raya. Dengan desain trumpet berukuran 18 cm dan warna hitam yang elegan, klakson ini mudah dipasang dan kompatibel dengan berbagai tipe sepeda listrik VOXA.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Tipe', value: 'Trumpet Horn' },
      { label: 'Dimensi', value: '18 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Klakson(1)_2f0339d3.jpg',
      '/manus-storage/VOXASparepart-Klakson(2)_dee6743e.jpg',
      '/manus-storage/VOXASparepart-Klakson(3)_77dd0a2a.jpg',
    ],
  },
  {
    id: 'sp-kunci-kontak',
    name: 'Kunci Kontak VOXA',
    series: 'Keamanan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Kunci kontak original VOXA 19×2.5 cm, presisi dan tahan lama',
    description:
      'Kunci Kontak VOXA adalah suku cadang original yang dirancang dengan presisi tinggi untuk memastikan sistem pengapian kendaraan bekerja dengan andal. Dengan dimensi 19×2.5 cm, kunci ini mudah digunakan dan cocok sebagai pengganti kunci kontak yang hilang atau rusak pada sepeda listrik VOXA.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Dimensi', value: '19 × 2.5 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Kunci(1)_e8ec3c4e.jpg',
      '/manus-storage/VOXASparepart-Kunci(2)_2c0e0285.jpg',
      '/manus-storage/VOXASparepart-Kunci(3)_853adc0d.jpg',
    ],
  },
  {
    id: 'sp-lampu-depan',
    name: 'Lampu Depan VOXA',
    series: 'Pencahayaan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Lampu depan original VOXA 14×3×5 cm, terang dan hemat energi',
    description:
      'Lampu Depan VOXA merupakan suku cadang original yang memberikan pencahayaan optimal untuk berkendara malam hari maupun kondisi minim cahaya. Dengan dimensi kompak 14×3×5 cm dan desain aerodinamis, lampu ini mudah dipasang dan dirancang untuk bertahan dalam kondisi cuaca apapun.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Dimensi', value: '14 × 3 × 5 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-LampuDepan(1)_d61d6d8a.jpg',
      '/manus-storage/VOXASparepart-LampuDepan(2)_726438a8.jpg',
      '/manus-storage/VOXASparepart-LampuDepan(3)_2d404854.jpg',
    ],
  },
  {
    id: 'sp-lampu-sein-depan',
    name: 'Lampu Sein Depan VOXA',
    series: 'Pencahayaan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Lampu sein depan universal 32 cm, 70g — visibilitas tinggi untuk keselamatan',
    description:
      'Lampu Sein Depan VOXA adalah komponen pencahayaan universal yang meningkatkan visibilitas dan keselamatan berkendara. Dengan panjang 32 cm dan bobot ringan hanya 70 gram, lampu sein ini mudah dipasang pada berbagai tipe sepeda listrik dan memberikan sinyal yang jelas kepada pengguna jalan lainnya.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.07 kg' },
      { label: 'Dimensi', value: 'P 32 cm × L 3 cm × T 3 cm' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-LampuSeinDepan(1)_27a3d96c.jpg',
      '/manus-storage/VOXASparepart-LampuSeinDepan(2)_1a5209ce.jpg',
      '/manus-storage/VOXASparepart-LampuSeinDepan(3)_acfe53b9.jpg',
    ],
  },
  {
    id: 'sp-motor-350w',
    name: 'Motor Listrik 350W VOXA',
    series: 'Motor Listrik',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Motor brushless 350W universal, berat 4.55 kg, diameter 26 cm — andal untuk harian',
    description:
      'Motor Listrik 350W VOXA adalah penggerak utama yang handal untuk sepeda listrik entry-level hingga menengah. Terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan cuaca, motor brushless ini menghadirkan tenaga yang cukup untuk berbagai kondisi jalan perkotaan dengan efisiensi energi yang baik.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Daya', value: '350W' },
      { label: 'Berat', value: '4.55 kg' },
      { label: 'Diameter', value: '26 cm' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Motor350W(1)_24ca88ea.jpg',
      '/manus-storage/VOXASparepart-Motor350W(2)_9b749e87.jpg',
      '/manus-storage/VOXASparepart-Motor350W(3)_d723c717.jpg',
    ],
  },
  {
    id: 'sp-motor-500w',
    name: 'Motor Listrik 500W VOXA',
    series: 'Motor Listrik',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Motor brushless 500W universal, berat 5.265 kg, diameter 26 cm — performa tinggi',
    description:
      'Motor Listrik 500W VOXA menghadirkan tenaga ekstra untuk penggunaan yang lebih menuntut, seperti medan berbukit atau membawa beban berat. Terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan cuaca, motor ini menjadi pilihan ideal untuk upgrade performa sepeda listrik Anda ke level berikutnya.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Daya', value: '500W' },
      { label: 'Berat', value: '5.265 kg' },
      { label: 'Diameter', value: '26 cm' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Motor500W(1)_1573047d.jpg',
      '/manus-storage/VOXASparepart-Motor500W(2)_d89b9d2d.jpg',
      '/manus-storage/VOXASparepart-Motor500W(3)_50a8da2d.jpg',
    ],
    badge: 'Populer',
  },
  {
    id: 'sp-pedal-set',
    name: 'Pedal Set VOXA',
    series: 'Rangka & Suspensi',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Pedal set universal nylon/resin dengan poros baja, 9×7×2 cm, 450g',
    description:
      'Pedal Set VOXA terbuat dari material nylon/resin berkualitas dengan poros baja yang kokoh, menghadirkan kombinasi bobot ringan dan kekuatan struktural yang optimal. Dengan dimensi 9×7×2 cm dan berat 450 gram, pedal ini memberikan pijakan yang nyaman dan anti-selip untuk pengendara dalam berbagai kondisi.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Bahan', value: 'Plastik nylon/resin dengan poros baja' },
      { label: 'Berat', value: '0.45 kg' },
      { label: 'Dimensi', value: 'P 9 cm × L 7 cm × T 2 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-PedalSet(1)_9bd95084.jpg',
      '/manus-storage/VOXASparepart-PedalSet(2)_3353a498.jpg',
      '/manus-storage/VOXASparepart-PedalSet(3)_ad60b219.jpg',
    ],
  },
  {
    id: 'sp-pijakan-kaki-depan',
    name: 'Pijakan Kaki Depan VOXA',
    series: 'Rangka & Suspensi',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Front footrest universal 14×3×1 cm, 355g — pijakan kokoh untuk penumpang depan',
    description:
      'Pijakan Kaki Depan VOXA (Front Footrest) adalah aksesori universal yang memberikan tempat pijakan yang aman dan nyaman bagi penumpang di bagian depan. Dengan dimensi 14×3×1 cm dan bobot 355 gram, produk ini mudah dipasang dan dirancang untuk menahan beban dengan stabil.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.355 kg' },
      { label: 'Dimensi', value: 'P 14 cm × L 3 cm × T 1 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-PijakanKakiDepan(1)_a17f554e.jpg',
      '/manus-storage/VOXASparepart-PijakanKakiDepan(2)_299a04c6.jpg',
      '/manus-storage/VOXASparepart-PijakanKakiDepan(3)_910ace38.jpg',
    ],
  },
  {
    id: 'sp-rem-tromol-belakang',
    name: 'Rem Tromol Belakang VOXA',
    series: 'Rem & Komponen',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Rem tromol belakang besi 32×32×15.5 cm, 450g — pengereman andal dan aman',
    description:
      'Rem Tromol Belakang VOXA adalah komponen pengereman original yang memastikan daya henti yang andal dan konsisten. Terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan cuaca, rem ini dirancang untuk memberikan performa pengereman optimal dalam berbagai kondisi jalan dan cuaca.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.45 kg' },
      { label: 'Dimensi', value: '32 × 32 × 15.5 cm' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-RemTromolBelakang(1)_5078495b.jpg',
      '/manus-storage/VOXASparepart-RemTromolBelakang(2)_9051e354.jpg',
      '/manus-storage/VOXASparepart-RemTromolBelakang(3)_ab3fc8e9.jpg',
      '/manus-storage/VOXASparepart-RemTromolBelakang(4)_b04bc838.jpg',
    ],
  },
  {
    id: 'sp-rem-tromol-depan',
    name: 'Rem Tromol Depan VOXA',
    series: 'Rem & Komponen',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Rem tromol depan besi diameter 13 cm, 570g — kontrol pengereman presisi',
    description:
      'Rem Tromol Depan VOXA memberikan kontrol pengereman yang presisi dan responsif untuk sepeda listrik Anda. Terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan cuaca, rem dengan diameter 13 cm ini memastikan daya henti yang optimal dan konsisten di berbagai kondisi permukaan jalan.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.57 kg' },
      { label: 'Diameter', value: '13 cm' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-RemTromolDepan(1)_158bee59.jpg',
      '/manus-storage/VOXASparepart-RemTromolDepan(2)_79d6f0da.jpg',
      '/manus-storage/VOXASparepart-RemTromolDepan(3)_f3ee7923.jpg',
    ],
  },
  {
    id: 'sp-set-grip',
    name: 'Set Grip VOXA',
    series: 'Setang & Kontrol',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Grip lever set universal 60×7×5 cm, 200g — genggaman nyaman dan anti-selip',
    description:
      'Set Grip VOXA (Grip Lever Set) adalah aksesori setang universal yang memberikan genggaman nyaman, anti-selip, dan ergonomis untuk pengendara. Dengan panjang 60 cm dan bobot ringan 200 gram, set grip ini mudah dipasang dan meningkatkan kontrol kendaraan secara keseluruhan.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.2 kg' },
      { label: 'Dimensi', value: 'P 60 cm × L 7 cm × T 5 cm' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-SetGrip(1)_1488754f.jpg',
      '/manus-storage/VOXASparepart-SetGrip(2)_06fb6b00.jpg',
      '/manus-storage/VOXASparepart-SetGrip(3)_5da8df29.jpg',
    ],
  },
  {
    id: 'sp-set-kabel-utama',
    name: 'Set Kabel Utama VOXA',
    series: 'Kelistrikan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Set kabel utama hitam 60×7×5 cm, 200g — koneksi kelistrikan lengkap dan andal',
    description:
      'Set Kabel Utama VOXA adalah paket kabel kelistrikan lengkap yang menghubungkan seluruh komponen elektrikal utama pada sepeda listrik. Dengan kualitas kabel yang terjamin dan koneksi yang presisi, set ini memastikan aliran listrik yang stabil dan aman ke seluruh sistem kendaraan.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.2 kg' },
      { label: 'Dimensi', value: 'P 60 cm × L 7 cm × T 5 cm' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-SetKabelUtama(1)_c4eb5e25.jpg',
      '/manus-storage/VOXASparepart-SetKabelUtama(2)_1e099e8f.jpg',
      '/manus-storage/VOXASparepart-SetKabelUtama(3)_be422f71.jpg',
    ],
  },
  {
    id: 'sp-set-tuas-rem',
    name: 'Set Tuas Rem VOXA',
    series: 'Rem & Komponen',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Set tuas rem universal panjang 111 cm, 420g — kontrol pengereman presisi',
    description:
      'Set Tuas Rem VOXA adalah komponen pengereman universal yang memberikan kontrol rem yang presisi dan responsif. Dengan total panjang 111 cm dan bobot 420 gram, set ini mencakup tuas rem kiri dan kanan beserta kabel rem yang siap dipasang untuk menggantikan komponen yang aus atau rusak.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.42 kg' },
      { label: 'Panjang', value: '111 cm' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-SetTuasRem(1)_5bd92ac0.jpg',
      '/manus-storage/VOXASparepart-SetTuasRem(2)_5cb10f76.jpg',
      '/manus-storage/VOXASparepart-SetTuasRem(3)_4463ebbf.jpg',
      '/manus-storage/VOXASparepart-SetTuasRem(4)_ef3ad842.jpg',
      '/manus-storage/VOXASparepart-SetTuasRem(5)_37dda703.jpg',
    ],
  },
  {
    id: 'sp-setang',
    name: 'Setang VOXA',
    series: 'Setang & Kontrol',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Setang besi universal 25×2×32 cm, 625g — kokoh, ringan, dan tahan cuaca',
    description:
      'Setang VOXA terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan terhadap berbagai kondisi cuaca. Dengan dimensi 25×2×32 cm dan bobot 625 gram, setang ini memberikan kontrol kemudi yang presisi dan nyaman. Desain universal membuatnya kompatibel dengan berbagai tipe sepeda listrik VOXA.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.625 kg' },
      { label: 'Dimensi', value: 'P 25 cm × L 2 cm × T 32 cm' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Setang(1)_f3c54404.jpg',
      '/manus-storage/VOXASparepart-Setang(2)_8fbff559.jpg',
      '/manus-storage/VOXASparepart-Setang(3)_47c34f15.jpg',
      '/manus-storage/VOXASparepart-Setang(4)_ace812c2.jpg',
      '/manus-storage/VOXASparepart-Setang(5)_7f01d1a4.jpg',
    ],
  },
  {
    id: 'sp-shockbreaker',
    name: 'Shockbreaker Set VOXA',
    series: 'Rangka & Suspensi',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Shockbreaker set besi 24.5×5×5 cm, 1.315 kg — suspensi optimal untuk jalan bergelombang',
    description:
      'Shockbreaker Set VOXA adalah komponen suspensi universal yang meredam getaran dan benturan dari permukaan jalan yang tidak rata, memberikan kenyamanan berkendara yang optimal. Terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan cuaca, shockbreaker ini memastikan stabilitas kendaraan dan kenyamanan pengendara dalam setiap kondisi jalan.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '1.315 kg' },
      { label: 'Dimensi', value: 'P 24.5 cm × L 5 cm × T 5 cm' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Shockbreaker(1)_e6ea17ac.jpg',
      '/manus-storage/VOXASparepart-Shockbreaker(2)_df7ddaa3.jpg',
      '/manus-storage/VOXASparepart-Shockbreaker(3)_b2f82d8d.jpg',
    ],
  },
  {
    id: 'sp-speedometer',
    name: 'Speedometer VOXA',
    series: 'Kelistrikan',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Speedometer digital universal 4×3×4 cm, 130g — tampilan kecepatan dan baterai akurat',
    description:
      'Speedometer VOXA adalah panel instrumen digital universal yang menampilkan informasi kecepatan, level baterai, dan data perjalanan secara akurat dan mudah dibaca. Dengan dimensi kompak 4×3×4 cm dan bobot ringan 130 gram, speedometer ini mudah dipasang di setang dan kompatibel dengan berbagai tipe sepeda listrik.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.13 kg' },
      { label: 'Dimensi', value: 'P 4 cm × L 3 cm × T 4 cm' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Speedometer(1)_b3939226.jpg',
      '/manus-storage/VOXASparepart-Speedometer(2)_48471a6a.jpg',
      '/manus-storage/VOXASparepart-Speedometer(3)_4f2af83d.jpg',
    ],
  },
  {
    id: 'sp-spion',
    name: 'Spion VOXA',
    series: 'Setang & Kontrol',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Spion besi universal diameter 10 cm, panjang 26 cm, 255g — visibilitas belakang optimal',
    description:
      'Spion VOXA terbuat dari bahan besi berkualitas tinggi yang kuat, ringan, dan tahan cuaca. Dengan diameter cermin 10 cm dan panjang total 26 cm, spion ini memberikan sudut pandang belakang yang luas untuk meningkatkan keselamatan berkendara. Desain universal membuatnya mudah dipasang pada berbagai tipe setang sepeda listrik.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.255 kg' },
      { label: 'Panjang', value: '26 cm' },
      { label: 'Diameter', value: '10 cm' },
      { label: 'Bahan', value: 'Besi — kuat, ringan, tahan cuaca' },
      { label: 'Warna', value: 'Hitam' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-Spion(1)_5d2ee517.jpg',
      '/manus-storage/VOXASparepart-Spion(2)_25c2ccb0.jpg',
      '/manus-storage/VOXASparepart-Spion(3)_d492b301.jpg',
    ],
  },
  {
    id: 'sp-standar-samping',
    name: 'Standar Samping VOXA',
    series: 'Rangka & Suspensi',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Standar samping stainless universal 19.5×2.5×2 cm, 145g — parkir praktis dan aman',
    description:
      'Standar Samping VOXA terbuat dari bahan stainless steel berkualitas yang ringan dan tahan karat. Dengan dimensi 19.5×2.5×2 cm dan bobot hanya 145 gram, standar ini mudah dioperasikan dengan satu kaki dan memberikan kestabilan parkir yang baik pada berbagai permukaan.',
    specs: [
      { label: 'Merek', value: 'VOXA' },
      { label: 'Berat', value: '0.145 kg' },
      { label: 'Dimensi', value: 'P 19.5 cm × L 2.5 cm × T 2 cm' },
      { label: 'Bahan', value: 'Stainless Steel' },
      { label: 'Garansi', value: '3 Bulan' },
    ],
    images: [
      '/manus-storage/VOXASparepart-StandarSamping(1)_e8a404af.jpg',
      '/manus-storage/VOXASparepart-StandarSamping(2)_a807578f.jpg',
      '/manus-storage/VOXASparepart-StandarSamping(3)_31764da1.jpg',
    ],
  },
  {
    id: 'sp-standar-tengah',
    name: 'Standar Tengah (Double Stand) VOXA',
    series: 'Rangka & Suspensi',
    price: 'Hubungi Kami',
    priceNum: 0,
    shortDesc: 'Standar dua kaki belakang 25.5×24×8 cm — parkir stabil di berbagai permukaan',
    description:
      'Standar Tengah VOXA (Double Stand) adalah standar dua kaki belakang yang memberikan kestabilan parkir superior dibandingkan standar samping biasa. Dengan ukuran 25.5×24×8 cm dan kompatibilitas universal untuk sepeda listrik dan skuter listrik, standar ini memastikan kendaraan Anda berdiri tegak dan stabil di berbagai permukaan.',
    specs: [
      { label: 'Tipe', value: 'Standar dua kaki belakang (double stand)' },
      { label: 'Ukuran', value: '25.5 × 24 × 8 cm' },
      { label: 'Kompatibel', value: 'Sepeda listrik, skuter listrik' },
      { label: 'Isi Paket', value: '1× Standar 2 kaki belakang' },
    ],
    images: [
      '/manus-storage/VOXASparepart-StandarTengah(1)_afb7871c.jpg',
      '/manus-storage/VOXASparepart-StandarTengah(2)_4062eb1f.jpg',
      '/manus-storage/VOXASparepart-StandarTengah(3)_a55dc648.jpg',
    ],
  },
];

const ALL_SPAREPART_PRODUCTS = [...sparepartProducts, ...pendingProducts];

const SERIES_FILTERS = [
  'Semua',
  'Motor Listrik',
  'Controller',
  'Charger',
  'Rem & Komponen',
  'Rangka & Suspensi',
  'Kelistrikan',
  'Setang & Kontrol',
  'Pencahayaan',
  'Jok & Aksesori',
  'Keamanan',
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Sparepart() {
  const [selectedSeries, setSelectedSeries] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState<SparepartItem | null>(null);

  const filtered = selectedSeries === 'Semua'
    ? ALL_SPAREPART_PRODUCTS
    : ALL_SPAREPART_PRODUCTS.filter(p => p.series === selectedSeries);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">SPAREPART</span>
            <span className="text-gray-300 mx-1">|</span>
            <Link href="/sepeda-listrik" className="hover:text-[#00B4D8] text-gray-400">Sepeda Listrik</Link>
            <ChevronRight size={14} />
            <Link href="/batre" className="hover:text-[#00B4D8] text-gray-400">Batre</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <section
        className="relative py-4 md:py-14 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EAF9FF 0%, #ffffff 40%, #EAF9FF 100%)' }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#37C5FF' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: '#0A4A63' }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#37C5FF 1px, transparent 1px), linear-gradient(90deg, #37C5FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ color: '#37C5FF', borderColor: '#37C5FF', background: 'rgba(55,197,255,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#37C5FF' }} />
            KATALOG PRODUK
          </div>
          <h1 className="text-2xl md:text-6xl font-black text-gray-900 mb-2 md:mb-5 tracking-tight">
            <span className="text-gray-900">SPARE</span><span style={{ color: '#37C5FF' }}>PART</span>
          </h1>
          <p className="hidden md:block text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">Temukan sparepart VOXA untuk perawatan dan upgrade kendaraan Anda</p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1 min-w-0 pb-0.5">
              {SERIES_FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    selectedSeries === s
                      ? 'bg-[#00B4D8] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-1 shrink-0 text-xs text-gray-400">
              <Filter size={14} />
              <span>{filtered.length} produk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container py-12">
        <p className="text-gray-500 text-sm mb-6">{filtered.length} produk ditemukan</p>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <SparepartCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-[#00B4D8] py-16">
        <div className="container text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl tracking-wide mb-4">TIDAK MENEMUKAN YANG ANDA CARI?</h2>
          <p className="text-white/80 text-lg mb-8">Hubungi tim kami untuk konsultasi sparepart yang tepat untuk kendaraan Anda.</p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#00B4D8] font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all"
          >
            Chat WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────

function SparepartCard({ product, onSelect }: { product: SparepartItem; onSelect: (p: SparepartItem) => void }) {
  return (
    <div
      className="product-card group rounded-2xl overflow-hidden border border-gray-100 bg-white cursor-pointer h-full"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#00B4D8] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
            +{product.images.length - 1} foto
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.series}</p>
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#00B4D8] transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.shortDesc}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#00B4D8] text-sm">{product.price}</span>
          <span className="text-xs text-gray-400 group-hover:text-[#00B4D8] transition-colors flex items-center gap-1">
            Detail <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductModal({ product, onClose }: { product: SparepartItem; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  const prev = () => setActiveImg(i => (i - 1 + product.images.length) % product.images.length);
  const next = () => setActiveImg(i => (i + 1) % product.images.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="text-xs font-semibold text-[#00B4D8] uppercase tracking-wider">{product.series}</span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="p-5">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
              <img
                src={product.images[activeImg]}
                alt={`${product.name} ${activeImg + 1}`}
                className="w-full h-full object-contain"
              />
              {product.images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all">
                    <ChevronLeft size={18} className="text-gray-700" />
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all">
                    <ChevronRight size={18} className="text-gray-700" />
                  </button>
                  <span className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
                    {activeImg + 1}/{product.images.length}
                  </span>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-[#00B4D8]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col gap-4">
            <div>
              {product.badge && (
                <span className="inline-block bg-[#00B4D8] text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                  {product.badge}
                </span>
              )}
              <h2 className="text-xl font-black text-gray-900 mb-2">{product.name}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            {product.specs.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Spesifikasi</h3>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  {product.specs.map((spec, i) => (
                    <div key={i} className={`flex text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <span className="w-2/5 px-3 py-2 text-gray-500 font-medium shrink-0">{spec.label}</span>
                      <span className="w-3/5 px-3 py-2 text-gray-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <a
              href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan ${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 bg-[#00B4D8] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0090b0] transition-all"
            >
              Tanya via WhatsApp <ArrowRight size={16} />
            </a>
            <p className="text-xs text-gray-400 text-center -mt-2">
              Klaim pengembalian wajib sertakan video unboxing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
