export interface Product {
  id: string;
  name: string;
  category: 'sepeda-listrik' | 'batre' | 'sparepart';
  series: string;
  price: string;
  priceNum: number;
  description: string;
  shortDesc: string;
  image: string;
  specs: {
    // Sepeda listrik fields
    jarakTempuh?: string;
    baterai?: string;
    kecepatan?: string;
    kegunaan?: string;
    motor?: string;
    pengisian?: string;
    bobot?: string;
    dayaAngkut?: string;
    dimensi?: string;
    pengereman?: string;
    ban?: string;
    keamanan?: string;
    // Batre fields
    voltase?: string;
    kapasitas?: string;
    tipe?: string;
    merk?: string;
    model?: string;
    daya?: string;
    arusPelepasan?: string;
    arusPengisian?: string;
    arusPengisianMaks?: string;
    teganganPengisian?: string;
    isiKemasan?: string;
    rekomendasiMotor?: string;
    waktuPenggunaan?: string;
  };
  features: string[];
  useCases: string[];
  faqs: { q: string; a: string }[];
  badge?: string;
}

// Product image URLs — uploaded to VOXA CDN
const IMG_LIBERTY = '/manus-storage/Liberty_79777234.png';
const IMG_LIBERTY_7 = '/manus-storage/Liberty7_73e8ed11.png';
const IMG_LIBERTY_STAR = '/manus-storage/LibertyStar_8cec3088.png';
const IMG_LIBERTY_STYLISH = '/manus-storage/LibertyStylish_395993ed.png';
const IMG_LIBERTY_ULTIMATE = '/manus-storage/LibertyUltimate_e3671716.png';
const IMG_EIFFEL_7 = '/manus-storage/Eiffel7_167d9416.png';
const IMG_EIFFEL_CITY = '/manus-storage/Eiffelcity_ee121f6e.png';
const IMG_EIFFEL_RIDER = '/manus-storage/EiffelRider_16406906.png';
const IMG_ELITE_FANTASY = '/manus-storage/EliteFantasy_5e108b8b.png';
const IMG_ELITE_CITY = '/manus-storage/EliteCity_9756080d.png';
const IMG_ELITE_FANTASY_S = '/manus-storage/EliteFantasyS_19412188.png';
const IMG_ELITE_RIDER = '/manus-storage/EliteRider_06f0f0ee.png';
const IMG_ELITE_RIDER_S = '/manus-storage/EliteRiderS_76ab996d.png';

export const products: Product[] = [

  // ═══════════════════════════════════════════════════════════════
  // SEPEDA LISTRIK — LIBERTY SERIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'liberty',
    name: 'Liberty',
    category: 'sepeda-listrik',
    series: 'Liberty Series',
    price: 'Rp 3.200.000',
    priceNum: 3200000,
    description: 'Sepeda listrik VOXA Liberty hadir sebagai pilihan mobilitas harian yang terjangkau dan andal. Dilengkapi motor 350 watt, baterai 48V 12Ah, dan sistem keamanan remote alarm, Liberty cocok untuk perjalanan sehari-hari di dalam kota.',
    shortDesc: 'Sepeda listrik harian terjangkau dengan remote alarm',
    image: IMG_LIBERTY,
    specs: {
      baterai: '48V 12Ah',
      motor: '350 watt',
      jarakTempuh: '±30 km',
      kecepatan: '±35 km/jam',
      dayaAngkut: '±100 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 350 Watt',
      'Baterai 48V 12Ah',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Commuting harian dalam kota', 'Belanja di sekitar rumah', 'Perjalanan jarak pendek'],
    faqs: [
      { q: 'Berapa jarak tempuh Liberty?', a: 'Liberty dapat menempuh ±30 km tergantung kondisi penggunaan.' },
      { q: 'Apa sistem keamanan Liberty?', a: 'Liberty dilengkapi remote alarm untuk keamanan kendaraan.' },
    ],
    badge: 'Terlaris',
  },
  {
    id: 'liberty-star',
    name: 'Liberty Star',
    category: 'sepeda-listrik',
    series: 'Liberty Series',
    price: 'Rp 3.200.000',
    priceNum: 3200000,
    description: 'Liberty Star menghadirkan performa setara Liberty dengan desain yang lebih segar. Spesifikasi identik dengan Liberty standar, cocok untuk pengguna yang menginginkan tampilan berbeda dengan harga yang sama.',
    shortDesc: 'Liberty dengan desain segar, spesifikasi setara',
    image: IMG_LIBERTY_STAR,
    specs: {
      baterai: '48V 12Ah',
      motor: '350 watt',
      jarakTempuh: '±30 km',
      kecepatan: '±35 km/jam',
      dayaAngkut: '±100 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 350 Watt',
      'Baterai 48V 12Ah',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Commuting harian', 'Perjalanan dalam kota', 'Mobilitas sehari-hari'],
    faqs: [
      { q: 'Apa perbedaan Liberty Star dengan Liberty biasa?', a: 'Liberty Star memiliki desain yang berbeda namun spesifikasi teknis yang identik dengan Liberty.' },
    ],
  },
  {
    id: 'liberty-7',
    name: 'Liberty 7',
    category: 'sepeda-listrik',
    series: 'Liberty Series',
    price: 'Rp 3.600.000',
    priceNum: 3600000,
    description: 'Liberty 7 hadir dengan motor hingga 500 watt dan jarak tempuh hingga ±35 km. Pilihan tepat bagi pengguna yang membutuhkan tenaga lebih untuk medan yang lebih bervariasi.',
    shortDesc: 'Motor hingga 500W untuk perjalanan lebih jauh',
    image: IMG_LIBERTY_7,
    specs: {
      baterai: '48V 12Ah',
      motor: 'Hingga 500 watt',
      jarakTempuh: 'Hingga ±35 km',
      kecepatan: '±35 km/jam',
      dayaAngkut: '±100 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor Hingga 500 Watt',
      'Baterai 48V 12Ah',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Perjalanan harian lebih jauh', 'Medan bervariasi', 'Komuter aktif'],
    faqs: [
      { q: 'Berapa jarak tempuh Liberty 7?', a: 'Liberty 7 dapat menempuh hingga ±35 km tergantung kondisi jalan dan beban.' },
      { q: 'Berapa daya motor Liberty 7?', a: 'Motor Liberty 7 memiliki daya hingga 500 watt.' },
    ],
  },
  {
    id: 'liberty-ultimate',
    name: 'Liberty Ultimate',
    category: 'sepeda-listrik',
    series: 'Liberty Series',
    price: 'Rp 3.900.000',
    priceNum: 3900000,
    description: 'Liberty Ultimate adalah varian tertinggi dari seri Liberty. Dengan motor 500 watt, kecepatan hingga ±40 km/jam, dan daya angkut ±120 kg, Liberty Ultimate cocok untuk pengguna yang membutuhkan performa lebih tinggi.',
    shortDesc: 'Performa tertinggi seri Liberty, motor 500W',
    image: IMG_LIBERTY_ULTIMATE,
    specs: {
      baterai: '48V 12Ah',
      motor: '500 watt',
      jarakTempuh: 'Hingga ±40 km',
      kecepatan: '±40 km/jam',
      dayaAngkut: '±120 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 500 Watt',
      'Baterai 48V 12Ah',
      'Kecepatan ±40 km/jam',
      'Daya Angkut ±120 kg',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Perjalanan jarak menengah', 'Pengguna dengan beban lebih besar', 'Komuter aktif'],
    faqs: [
      { q: 'Berapa daya angkut Liberty Ultimate?', a: 'Liberty Ultimate mampu mengangkut hingga ±120 kg.' },
      { q: 'Berapa kecepatan maksimal Liberty Ultimate?', a: 'Kecepatan maksimal Liberty Ultimate adalah ±40 km/jam.' },
    ],
    badge: 'Premium',
  },
  {
    id: 'liberty-stylish',
    name: 'Liberty Stylish',
    category: 'sepeda-listrik',
    series: 'Liberty Series',
    price: 'Rp 3.800.000',
    priceNum: 3800000,
    description: 'Liberty Stylish menggabungkan desain modern dengan performa handal. Motor 500 watt, daya angkut hingga ±150 kg, dan tampilan stylish menjadikannya pilihan ideal untuk pengguna yang mengutamakan estetika dan fungsi.',
    shortDesc: 'Desain stylish, motor 500W, daya angkut ±150 kg',
    image: IMG_LIBERTY_STYLISH,
    specs: {
      baterai: '48V 12Ah',
      motor: '500 watt',
      jarakTempuh: '±40 km',
      kecepatan: '±40 km/jam',
      dayaAngkut: '±150 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 500 Watt',
      'Baterai 48V 12Ah',
      'Daya Angkut ±150 kg',
      'Desain Modern Stylish',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Gaya hidup urban', 'Perjalanan harian stylish', 'Pengguna dengan beban lebih besar'],
    faqs: [
      { q: 'Berapa daya angkut Liberty Stylish?', a: 'Liberty Stylish mampu mengangkut hingga ±150 kg.' },
      { q: 'Apa keunggulan Liberty Stylish?', a: 'Selain performa motor 500W, Liberty Stylish memiliki desain modern yang menonjol.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // SEPEDA LISTRIK — EIFFEL SERIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'eiffel-rider',
    name: 'Eiffel Rider',
    category: 'sepeda-listrik',
    series: 'Eiffel Series',
    price: 'Rp 3.800.000',
    priceNum: 3800000,
    description: 'Eiffel Rider hadir dengan motor 500 watt dan ban ring 10 tubeless yang memberikan kelincahan di jalan kota. Cocok untuk pengguna yang aktif dan membutuhkan sepeda listrik yang responsif.',
    shortDesc: 'Motor 500W dengan ban ring 10 untuk kelincahan kota',
    image: IMG_EIFFEL_RIDER,
    specs: {
      baterai: '48V 12Ah',
      motor: '500 watt',
      jarakTempuh: '±40 km',
      kecepatan: '±35 km/jam',
      dayaAngkut: '±120 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 10 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 500 Watt',
      'Baterai 48V 12Ah',
      'Ban Ring 10 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Mobilitas kota yang lincah', 'Perjalanan harian aktif', 'Pengguna yang dinamis'],
    faqs: [
      { q: 'Mengapa Eiffel Rider menggunakan ban ring 10?', a: 'Ban ring 10 memberikan kelincahan lebih di jalan kota yang padat.' },
      { q: 'Berapa jarak tempuh Eiffel Rider?', a: 'Eiffel Rider dapat menempuh ±40 km tergantung kondisi penggunaan.' },
    ],
  },
  {
    id: 'eiffel-city',
    name: 'Eiffel City',
    category: 'sepeda-listrik',
    series: 'Eiffel Series',
    price: 'Rp 4.000.000',
    priceNum: 4000000,
    description: 'Eiffel City dirancang untuk mobilitas perkotaan yang nyaman. Dengan motor 500 watt dan ban ring 14 tubeless, Eiffel City memberikan kenyamanan berkendara di berbagai kondisi jalan kota.',
    shortDesc: 'Motor 500W, nyaman untuk mobilitas perkotaan',
    image: IMG_EIFFEL_CITY,
    specs: {
      baterai: '48V 12Ah',
      motor: '500 watt',
      jarakTempuh: '±40 km',
      kecepatan: '±35 km/jam',
      dayaAngkut: '±120 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 500 Watt',
      'Baterai 48V 12Ah',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Mobilitas perkotaan', 'Perjalanan harian nyaman', 'Komuter kota'],
    faqs: [
      { q: 'Apa perbedaan Eiffel City dengan Eiffel Rider?', a: 'Eiffel City menggunakan ban ring 14 untuk kenyamanan lebih, sementara Eiffel Rider menggunakan ring 10 untuk kelincahan.' },
    ],
  },
  {
    id: 'eiffel-7',
    name: 'Eiffel 7',
    category: 'sepeda-listrik',
    series: 'Eiffel Series',
    price: 'Rp 3.800.000',
    priceNum: 3800000,
    description: 'Eiffel 7 hadir dengan motor hingga 500 watt dan jarak tempuh hingga ±35 km. Pilihan tepat bagi pengguna yang menginginkan performa Eiffel Series dengan harga yang kompetitif.',
    shortDesc: 'Motor hingga 500W, pilihan kompetitif Eiffel Series',
    image: IMG_EIFFEL_7,
    specs: {
      baterai: '48V 12Ah',
      motor: 'Hingga 500 watt',
      jarakTempuh: 'Hingga ±35 km',
      kecepatan: '±35 km/jam',
      dayaAngkut: '±100 kg',
      bobot: '±50 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor Hingga 500 Watt',
      'Baterai 48V 12Ah',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Perjalanan harian', 'Medan bervariasi', 'Pengguna aktif'],
    faqs: [
      { q: 'Berapa jarak tempuh Eiffel 7?', a: 'Eiffel 7 dapat menempuh hingga ±35 km tergantung kondisi penggunaan.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // SEPEDA LISTRIK — ELITE SERIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'elite-city',
    name: 'Elite City',
    category: 'sepeda-listrik',
    series: 'Elite Series',
    price: 'Rp 5.000.000',
    priceNum: 5000000,
    description: 'Elite City hadir dengan motor 600 watt dan daya angkut hingga 150 kg. Dirancang untuk pengguna yang membutuhkan performa lebih tinggi untuk mobilitas perkotaan yang intens.',
    shortDesc: 'Motor 600W, daya angkut 150 kg untuk kota',
    image: IMG_ELITE_CITY,
    specs: {
      baterai: '48V 12Ah',
      motor: '600 watt',
      jarakTempuh: 'Hingga ±40 km',
      kecepatan: '±40 km/jam',
      dayaAngkut: 'Hingga 150 kg',
      bobot: 'Sekitar 60 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 600 Watt',
      'Baterai 48V 12Ah',
      'Daya Angkut Hingga 150 kg',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Mobilitas kota intens', 'Pengguna dengan beban besar', 'Komuter premium'],
    faqs: [
      { q: 'Berapa daya motor Elite City?', a: 'Elite City menggunakan motor 600 watt untuk performa lebih tinggi.' },
      { q: 'Berapa daya angkut Elite City?', a: 'Elite City mampu mengangkut hingga 150 kg.' },
    ],
    badge: 'Elite',
  },
  {
    id: 'elite-fantasi',
    name: 'Elite Fantasy',
    category: 'sepeda-listrik',
    series: 'Elite Series',
    price: 'Rp 5.300.000',
    priceNum: 5300000,
    description: 'Elite Fantasy menggabungkan performa motor 600 watt dengan desain yang elegan. Cocok untuk pengguna yang menginginkan sepeda listrik bertenaga dengan tampilan premium.',
    shortDesc: 'Motor 600W dengan desain elegan premium',
    image: IMG_ELITE_FANTASY,
    specs: {
      baterai: '48V 12Ah',
      motor: '600 watt',
      jarakTempuh: 'Hingga ±40 km',
      kecepatan: '±40 km/jam',
      dayaAngkut: 'Hingga 150 kg',
      bobot: 'Sekitar 60 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 600 Watt',
      'Baterai 48V 12Ah',
      'Daya Angkut Hingga 150 kg',
      'Desain Elegan Premium',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Lifestyle premium', 'Perjalanan harian bertenaga', 'Pengguna yang mengutamakan estetika'],
    faqs: [
      { q: 'Apa keunggulan Elite Fantasy?', a: 'Elite Fantasy menawarkan motor 600W dengan desain elegan untuk pengguna yang menginginkan performa dan estetika.' },
    ],
  },
  {
    id: 'elite-rider',
    name: 'Elite Rider',
    category: 'sepeda-listrik',
    series: 'Elite Series',
    price: 'Rp 5.700.000',
    priceNum: 5700000,
    description: 'Elite Rider hadir dengan motor 600 watt dan daya angkut hingga 150 kg. Dirancang untuk pengendara yang membutuhkan ketahanan dan performa tinggi dalam penggunaan intensif.',
    shortDesc: 'Motor 600W, daya angkut 150 kg untuk pengendara aktif',
    image: IMG_ELITE_RIDER,
    specs: {
      baterai: '48V 12Ah',
      motor: '600 watt',
      jarakTempuh: 'Hingga ±40 km',
      kecepatan: '±25 km/jam',
      dayaAngkut: 'Hingga 150 kg',
      bobot: 'Sekitar 60 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 600 Watt',
      'Baterai 48V 12Ah',
      'Daya Angkut Hingga 150 kg',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Penggunaan intensif', 'Pengguna dengan beban besar', 'Perjalanan harian bertenaga'],
    faqs: [
      { q: 'Berapa kecepatan maksimal Elite Rider?', a: 'Kecepatan maksimal Elite Rider adalah ±25 km/jam.' },
      { q: 'Berapa daya angkut Elite Rider?', a: 'Elite Rider mampu mengangkut hingga 150 kg.' },
    ],
    badge: 'Sport',
  },
  {
    id: 'elite-fantasi-s',
    name: 'Elite Fantasy S',
    category: 'sepeda-listrik',
    series: 'Elite Series',
    price: 'Rp 5.800.000',
    priceNum: 5800000,
    description: 'Elite Fantasy S adalah upgrade dari Elite Fantasy dengan motor 650 watt yang lebih bertenaga. Berat unit sekitar 65 kg dengan performa yang lebih tinggi untuk pengendara yang menginginkan yang terbaik.',
    shortDesc: 'Motor 650W, upgrade premium dari Elite Fantasy',
    image: IMG_ELITE_FANTASY_S,
    specs: {
      baterai: '48V 12Ah',
      motor: '650 watt',
      jarakTempuh: '±40 km',
      kecepatan: '±40 km/jam',
      dayaAngkut: 'Hingga 150 kg',
      bobot: 'Sekitar 65 kg',
      pengereman: 'Drum Brake',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 650 Watt',
      'Baterai 48V 12Ah',
      'Daya Angkut Hingga 150 kg',
      'Ban Ring 14 Tubeless',
      'Drum Brake',
    ],
    useCases: ['Perjalanan premium bertenaga', 'Pengguna yang membutuhkan motor lebih kuat', 'Lifestyle aktif'],
    faqs: [
      { q: 'Apa perbedaan Elite Fantasy S dengan Elite Fantasy?', a: 'Elite Fantasy S memiliki motor 650W (vs 600W) dan bobot unit sekitar 65 kg.' },
    ],
  },
  {
    id: 'elite-rider-s',
    name: 'Elite Rider S',
    category: 'sepeda-listrik',
    series: 'Elite Series',
    price: 'Rp 6.300.000',
    priceNum: 6300000,
    description: 'Elite Rider S adalah puncak dari seri Elite dengan motor 650 watt, baterai 48V 20Ah, dan jarak tempuh hingga ±50 km. Sistem pengereman kombinasi disc brake depan dan drum brake belakang memberikan keamanan berkendara yang optimal.',
    shortDesc: 'Motor 650W, baterai 20Ah, disc brake — puncak Elite Series',
    image: IMG_ELITE_RIDER_S,
    specs: {
      baterai: '48V 20Ah',
      motor: '650 watt',
      jarakTempuh: 'Hingga ±50 km',
      kecepatan: '±40 km/jam',
      dayaAngkut: 'Hingga 150 kg',
      bobot: 'Sekitar 70 kg',
      pengereman: 'Disc Brake (depan) + Drum Brake (belakang)',
      dimensi: '160 x 70 x 110 cm',
      keamanan: 'Remote Alarm',
      ban: 'Ring 14 Tubeless',
    },
    features: [
      'Speedometer Digital',
      'Remote Alarm Security',
      'Motor 650 Watt',
      'Baterai 48V 20Ah',
      'Jarak Tempuh Hingga ±50 km',
      'Disc Brake Depan',
      'Daya Angkut Hingga 150 kg',
      'Ban Ring 14 Tubeless',
    ],
    useCases: ['Perjalanan jarak jauh', 'Pengendara profesional', 'Pengguna yang membutuhkan performa tertinggi'],
    faqs: [
      { q: 'Apa keunggulan sistem pengereman Elite Rider S?', a: 'Elite Rider S menggunakan kombinasi disc brake depan dan drum brake belakang untuk pengereman optimal.' },
      { q: 'Berapa kapasitas baterai Elite Rider S?', a: 'Elite Rider S menggunakan baterai 48V 20Ah yang memberikan jarak tempuh hingga ±50 km.' },
    ],
    badge: 'Flagship',
  },

  // ═══════════════════════════════════════════════════════════════
  // BATRE — GREENLIFE SERIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'greenlife-3kg',
    name: 'Greenlife 12KG',
    category: 'batre',
    series: 'Greenlife Series',
    price: 'Rp 930.000',
    priceNum: 930000,
    description: 'Baterai Greenlife 12KG adalah baterai lead acid isi ulang berkualitas untuk sepeda listrik di bawah 300W. Dijual per box isi 4 pcs, cocok untuk pengguna yang membutuhkan penggantian baterai standar.',
    shortDesc: 'Lead acid 12V 12Ah, cocok untuk e-bike di bawah 300W',
    image: '/manus-storage/batre-gl12kg-1_0490c863.jpg',
    specs: {
      merk: 'Greenlife',
      tipe: 'Rechargeable Lead Acid Battery',
      model: '6-DZF-12.2',
      voltase: '12 Volt',
      kapasitas: '12 Ah',
      bobot: '±3 kg per pcs',
      dimensi: '150 x 100 x 97 mm',
      isiKemasan: '4 PCS / Box (tidak dijual satuan)',
    },
    features: [
      'Rechargeable Lead Acid',
      'Model 6-DZF-12.2',
      'Tegangan 12 Volt',
      'Kapasitas 12 Ah',
      'Isi 4 PCS per Box',
    ],
    useCases: [
      'Cocok untuk sepeda listrik di bawah 300W',
      'Mainan anak bertenaga listrik',
      'Kebutuhan baterai lainnya',
    ],
    faqs: [
      { q: 'Apakah baterai ini dijual satuan?', a: 'Tidak, baterai ini dijual per box isi 4 pcs dan tidak dijual satuan.' },
      { q: 'Untuk sepeda listrik berapa watt?', a: 'Greenlife 12KG cocok untuk sepeda listrik di bawah 300W.' },
    ],
  },
  {
    id: 'greenlife-345kg',
    name: 'Greenlife 13.8KG',
    category: 'batre',
    series: 'Greenlife Series',
    price: 'Rp 1.030.000',
    priceNum: 1030000,
    description: 'Baterai Greenlife 13.8KG hadir dengan berat 3.4 kg per pcs dan tegangan 12V yang dapat dirangkai menjadi 48V. Cocok untuk e-bike 350W–500W dengan performa yang lebih baik.',
    shortDesc: 'Lead acid 12V 12Ah, cocok untuk e-bike 350W–500W',
    image: '/manus-storage/batre-gl138kg-1_9fe8f125.jpg',
    specs: {
      merk: 'Greenlife',
      tipe: 'Rechargeable Lead Acid Battery',
      voltase: '12 Volt (4 pcs dirangkai menjadi 48V)',
      kapasitas: '12 Ah',
      bobot: '3.4 kg per pcs',
      isiKemasan: '4 PCS / Box (tidak dijual satuan)',
    },
    features: [
      'Rechargeable Lead Acid',
      'Tegangan 12V (48V saat dirangkai)',
      'Kapasitas 12 Ah',
      'Berat 3.4 kg per pcs',
      'Isi 4 PCS per Box',
    ],
    useCases: [
      'Cocok untuk e-bike 350W – 500W',
      'Mainan anak bertenaga listrik',
      'Kebutuhan baterai lainnya',
    ],
    faqs: [
      { q: 'Bagaimana cara merangkai menjadi 48V?', a: '4 pcs baterai 12V dirangkai secara seri untuk menghasilkan tegangan 48V.' },
      { q: 'Untuk sepeda listrik berapa watt?', a: 'Greenlife 13.8KG cocok untuk e-bike 350W hingga 500W.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BATRE — TIANNENG SERIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tne-12-12',
    name: 'Tianneng 12V-15AH',
    category: 'batre',
    series: 'Tianneng Series',
    price: 'Rp 1.175.000',
    priceNum: 1175000,
    description: 'Baterai Tianneng 12V-15AH hadir dengan kapasitas 15Ah dan garansi pengembalian 14 hari. Cocok untuk berbagai merk sepeda listrik dengan performa yang andal.',
    shortDesc: 'Lead acid 12V 15Ah, garansi 14 hari',
    image: '/manus-storage/batre-tne15ah-1_94605d0f.jpg',
    specs: {
      merk: 'Tianneng',
      tipe: 'Rechargeable Lead Acid Battery',
      voltase: '12 Volt',
      kapasitas: '15 Ah',
      bobot: '3.8 kg per pcs',
      dimensi: '15 x 10 x 9.7 cm',
      isiKemasan: '4 PCS / Box (tidak dijual satuan)',
    },
    features: [
      'Merk Tianneng Terpercaya',
      'Kapasitas 15 Ah',
      'Garansi Pengembalian 14 Hari',
      'Tegangan 12 Volt',
      'Isi 4 PCS per Box',
    ],
    useCases: [
      'Cocok untuk berbagai merk sepeda listrik',
      'Kebutuhan baterai lainnya',
    ],
    faqs: [
      { q: 'Apakah ada garansi?', a: 'Ya, Tianneng 12V-15AH memiliki garansi pengembalian 14 hari sejak barang diterima.' },
      { q: 'Apakah dijual satuan?', a: 'Tidak, dijual per box isi 4 pcs.' },
    ],
  },
  {
    id: 'tne-12-15',
    name: 'Tianneng 12V-25AH',
    category: 'batre',
    series: 'Tianneng Series',
    price: 'Rp 1.750.000',
    priceNum: 1750000,
    description: 'Tianneng 12V-25AH hadir dengan kapasitas 25Ah untuk jarak tempuh hingga ±50 km. Direkomendasikan untuk motor 500W–650W dengan waktu penggunaan ±100–120 menit.',
    shortDesc: 'Lead acid 12V 25Ah, jarak tempuh hingga ±50 km',
    image: '/manus-storage/batre-tne15ah-1_94605d0f.jpg',
    specs: {
      merk: 'Tianneng',
      tipe: 'Rechargeable Lead Acid Battery',
      voltase: '12 Volt (4 pcs dirangkai menjadi 48V)',
      kapasitas: '25 Ah',
      rekomendasiMotor: '500W – 650W',
      isiKemasan: '4 PCS / Box',
      jarakTempuh: 'Hingga ±50 km',
      waktuPenggunaan: '±100 – 120 menit',
    },
    features: [
      'Merk Tianneng Terpercaya',
      'Kapasitas 25 Ah',
      'Jarak Tempuh Hingga ±50 km',
      'Untuk Motor 500W–650W',
      'Tegangan 48V (4 pcs seri)',
      'Isi 4 PCS per Box',
    ],
    useCases: [
      'Cocok untuk berbagai merk sepeda listrik',
      'Jarak tempuh hingga ±50 km',
      'Waktu penggunaan ±100–120 menit',
    ],
    faqs: [
      { q: 'Berapa jarak tempuh dengan baterai ini?', a: 'Tianneng 12V-25AH memberikan jarak tempuh hingga ±50 km.' },
      { q: 'Untuk motor berapa watt?', a: 'Direkomendasikan untuk motor 500W hingga 650W.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BATRE — CHILWEE SERIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'chilwee-gold',
    name: 'Chilwee Gold',
    category: 'batre',
    series: 'Chilwee Series',
    price: 'Rp 1.150.000',
    priceNum: 1150000,
    description: 'Chilwee Gold adalah baterai lead acid 12V 12Ah dengan jarak tempuh hingga ±40 km dan waktu penggunaan ±100–120 menit. Cocok untuk sepeda listrik berbagai merk.',
    shortDesc: 'Lead acid 12V 12Ah, jarak tempuh ±40 km',
    image: '/manus-storage/batre-cwgold-1_efa02948.jpg',
    specs: {
      merk: 'Chilwee / Greenlife Gold',
      tipe: 'Rechargeable Lead Acid Battery',
      voltase: '12 Volt (4 pcs dirangkai menjadi 48V)',
      kapasitas: '12 Ah',
      bobot: '3.8 kg per pcs',
      isiKemasan: '4 PCS / Box (tidak dijual satuan)',
      jarakTempuh: 'Hingga ±40 km',
      waktuPenggunaan: '±100 – 120 menit',
    },
    features: [
      'Merk Chilwee / Greenlife Gold',
      'Kapasitas 12 Ah',
      'Jarak Tempuh Hingga ±40 km',
      'Tegangan 48V (4 pcs seri)',
      'Isi 4 PCS per Box',
    ],
    useCases: [
      'Cocok untuk sepeda listrik',
      'Jarak tempuh hingga ±40 km',
      'Waktu penggunaan ±100–120 menit',
    ],
    faqs: [
      { q: 'Berapa jarak tempuh Chilwee Gold?', a: 'Chilwee Gold memberikan jarak tempuh hingga ±40 km.' },
      { q: 'Apakah dijual satuan?', a: 'Tidak, dijual per box isi 4 pcs.' },
    ],
    badge: 'Popular',
  },
  {
    id: 'chilwee-platinum',
    name: 'Chilwee Platinum',
    category: 'batre',
    series: 'Chilwee Series',
    price: 'Rp 1.230.000',
    priceNum: 1230000,
    description: 'Chilwee Platinum hadir dengan jarak tempuh hingga ±45 km dan waktu penggunaan ±120–140 menit. Pilihan premium dari seri Chilwee untuk perjalanan yang lebih jauh.',
    shortDesc: 'Lead acid 12V 12Ah, jarak tempuh ±45 km',
    image: '/manus-storage/batre-cwplatinum-1_d57d93b7.jpg',
    specs: {
      merk: 'Chilwee / Greenlife Platinum',
      tipe: 'Rechargeable Lead Acid Battery',
      voltase: '12 Volt (4 pcs dirangkai menjadi 48V)',
      kapasitas: '12 Ah',
      bobot: '3.8 kg per pcs',
      isiKemasan: '4 PCS / Box (tidak dijual satuan)',
      jarakTempuh: 'Hingga ±45 km',
      waktuPenggunaan: '±120 – 140 menit',
    },
    features: [
      'Merk Chilwee / Greenlife Platinum',
      'Kapasitas 12 Ah',
      'Jarak Tempuh Hingga ±45 km',
      'Waktu Penggunaan Lebih Lama',
      'Tegangan 48V (4 pcs seri)',
      'Isi 4 PCS per Box',
    ],
    useCases: [
      'Cocok untuk sepeda listrik',
      'Jarak tempuh hingga ±45 km',
      'Waktu penggunaan ±120–140 menit',
    ],
    faqs: [
      { q: 'Apa perbedaan Chilwee Platinum dengan Gold?', a: 'Chilwee Platinum memberikan jarak tempuh lebih jauh (±45 km vs ±40 km) dan waktu penggunaan lebih lama.' },
    ],
  },
  {
    id: 'chilwee-12v-20ah',
    name: 'Chilwee 12V-20AH',
    category: 'batre',
    series: 'Chilwee Series',
    price: 'Rp 1.800.000',
    priceNum: 1800000,
    description: 'Chilwee 12V-20AH hadir dengan kapasitas 20Ah untuk jarak tempuh hingga ±50 km. Direkomendasikan untuk motor 500W–650W dengan waktu penggunaan ±100–120 menit.',
    shortDesc: 'Lead acid 12V 20Ah, jarak tempuh hingga ±50 km',
    image: '/manus-storage/batre-cw20ah-1_c4aabb64.jpg',
    specs: {
      merk: 'Chilwee',
      tipe: 'Rechargeable Lead Acid Battery',
      voltase: '12 Volt (4 pcs dirangkai menjadi 48V)',
      kapasitas: '20 Ah',
      rekomendasiMotor: '500W – 650W',
      isiKemasan: '4 PCS / Box',
      jarakTempuh: 'Hingga ±50 km',
      waktuPenggunaan: '±100 – 120 menit',
    },
    features: [
      'Merk Chilwee Terpercaya',
      'Kapasitas 20 Ah',
      'Jarak Tempuh Hingga ±50 km',
      'Untuk Motor 500W–650W',
      'Tegangan 48V (4 pcs seri)',
      'Isi 4 PCS per Box',
    ],
    useCases: [
      'Cocok untuk berbagai merk sepeda listrik',
      'Jarak tempuh hingga ±50 km',
      'Waktu penggunaan ±100–120 menit',
    ],
    faqs: [
      { q: 'Berapa jarak tempuh Chilwee 12V-20AH?', a: 'Chilwee 12V-20AH memberikan jarak tempuh hingga ±50 km.' },
      { q: 'Untuk motor berapa watt?', a: 'Direkomendasikan untuk motor 500W hingga 650W.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BATRE — LITHIUM SERIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'lithium-48v-12ah',
    name: 'Lithium 48V-12AH',
    category: 'batre',
    series: 'Lithium Series',
    price: 'Rp 1.850.000',
    priceNum: 1850000,
    description: 'Baterai Lithium 48V-12AH dengan daya 576Wh untuk penggunaan harian. Lebih ringan dari lead acid dengan jarak tempuh hingga ±40 km. Gunakan charger 48V yang sesuai.',
    shortDesc: 'Lithium 48V 12Ah, 576Wh, jarak tempuh ±40 km',
    image: '/manus-storage/batre-li12ah-1_8c0ba18a.jpg',
    specs: {
      tipe: 'Baterai Lithium',
      voltase: '48 Volt',
      kapasitas: '12 Ah',
      daya: '576 Wh',
      arusPelepasan: '12 Ah',
      arusPengisian: '2A',
      arusPengisianMaks: '5A',
      teganganPengisian: '56.2V',
      bobot: '9.1 kg',
      dimensi: '31 x 19 x 11 cm',
      jarakTempuh: 'Hingga ±40 km',
    },
    features: [
      'Teknologi Lithium',
      'Daya 576 Wh',
      'Tegangan 48 Volt',
      'Kapasitas 12 Ah',
      'Arus Pengisian 2A',
      'Jarak Tempuh ±40 km',
    ],
    useCases: [
      'Cocok untuk penggunaan harian',
      'Jarak tempuh hingga ±40 km',
    ],
    faqs: [
      { q: 'Charger apa yang digunakan?', a: 'Gunakan charger 48V yang sesuai. Hindari penggunaan di bawah batas tegangan minimum.' },
      { q: 'Berapa jarak tempuh baterai ini?', a: 'Lithium 48V-12AH memberikan jarak tempuh hingga ±40 km tergantung kondisi penggunaan.' },
    ],
    badge: 'Lithium',
  },
  {
    id: 'lithium-48v-21ah',
    name: 'Lithium 48V-21AH',
    category: 'batre',
    series: 'Lithium Series',
    price: 'Rp 2.700.000',
    priceNum: 2700000,
    description: 'Lithium 48V-21AH hadir dengan kapasitas 21Ah untuk jarak tempuh hingga ±50 km. Direkomendasikan untuk motor 500W–650W dengan waktu penggunaan ±100–120 menit.',
    shortDesc: 'Lithium 48V 21Ah, jarak tempuh hingga ±50 km',
    image: '/manus-storage/batre-li21ah-1_2a89655d.jpg',
    specs: {
      tipe: 'Baterai Lithium',
      voltase: '48 Volt',
      kapasitas: '21 Ah',
      rekomendasiMotor: '500W – 650W',
      jarakTempuh: 'Hingga ±50 km',
      waktuPenggunaan: '±100 – 120 menit',
    },
    features: [
      'Teknologi Lithium',
      'Kapasitas 21 Ah',
      'Jarak Tempuh Hingga ±50 km',
      'Untuk Motor 500W–650W',
      'Tegangan 48 Volt',
    ],
    useCases: [
      'Jarak tempuh hingga ±50 km',
      'Waktu penggunaan ±100–120 menit',
      'Cocok untuk kebutuhan harian dan sepeda listrik',
    ],
    faqs: [
      { q: 'Berapa jarak tempuh Lithium 48V-21AH?', a: 'Memberikan jarak tempuh hingga ±50 km tergantung kondisi penggunaan.' },
      { q: 'Charger apa yang digunakan?', a: 'Gunakan charger 48V yang sesuai. Hindari penggunaan di bawah batas tegangan minimum.' },
    ],
    badge: 'Best Value',
  },
];

// Elite series first, then other series by original order
export const sepedaListrik = [
  ...products.filter(p => p.category === 'sepeda-listrik' && p.series === 'Elite Series'),
  ...products.filter(p => p.category === 'sepeda-listrik' && p.series !== 'Elite Series'),
];
export const batre = products.filter(p => p.category === 'batre');
export const getProductById = (id: string) => products.find(p => p.id === id);
