// Canonical product price list used server-side for order validation.
// Prices must be updated here whenever client/src/data/products.ts changes.
// The server NEVER trusts prices sent by the browser — it always looks up from this map.
export const PRODUCT_PRICES: Record<string, { name: string; priceNum: number }> = {
  // Sepeda Listrik — Liberty Series
  'liberty':          { name: 'VOXA Liberty',          priceNum: 3_400_000 },
  'liberty-star':     { name: 'VOXA Liberty Star',     priceNum: 3_400_000 },
  'liberty-7':        { name: 'VOXA Liberty 7',        priceNum: 3_800_000 },
  'liberty-ultimate': { name: 'VOXA Liberty Ultimate', priceNum: 4_100_000 },
  'liberty-stylish':  { name: 'VOXA Liberty Stylish',  priceNum: 4_100_000 },
  // Sepeda Listrik — Eiffel Series
  'eiffel-rider': { name: 'VOXA Eiffel Rider', priceNum: 4_100_000 },
  'eiffel-city':  { name: 'VOXA Eiffel City',  priceNum: 4_300_000 },
  'eiffel-7':     { name: 'VOXA Eiffel 7',     priceNum: 4_000_000 },
  // Sepeda Listrik — Elite Series
  'elite-city':       { name: 'VOXA Elite City',       priceNum: 5_000_000 },
  'elite-fantasy':    { name: 'VOXA Elite Fantasy',    priceNum: 5_400_000 },
  'elite-rider':      { name: 'VOXA Elite Rider',      priceNum: 5_800_000 },
  'elite-fantasy-s':  { name: 'VOXA Elite Fantasy S',  priceNum: 5_900_000 },
  'elite-rider-s':    { name: 'VOXA Elite Rider S',    priceNum: 6_400_000 },
  // Sepeda Listrik — VOXA Series
  'voxa-g3':    { name: 'VOXA G3',    priceNum: 12_600_000 },
  'voxa-kurir': { name: 'VOXA Kurir', priceNum:  7_800_000 },
  // Baterai — Greenlife Series
  'greenlife-12kg': { name: 'Baterai Greenlife 12KG', priceNum: 1_500_000 },
  'greenlife-15kg': { name: 'Baterai Greenlife 15KG', priceNum: 1_800_000 },
  'greenlife-20kg': { name: 'Baterai Greenlife 20KG', priceNum: 2_200_000 },
  // Sparepart prices — these vary; set conservative defaults
  'controller':  { name: 'Controller VOXA',  priceNum: 350_000 },
  'charger':     { name: 'Charger VOXA',     priceNum: 200_000 },
  'spedometer':  { name: 'Speedometer VOXA', priceNum: 150_000 },
  // Sparepart catalog items (price on request — set 0, staff will confirm)
  'sp-alarm-keyless': { name: 'Alarm Keyless VOXA', priceNum: 1_000 },
  'sp-as-roda-depan': { name: 'As Roda Depan VOXA', priceNum: 1_000 },
  'sp-charger': { name: 'Charger Sepeda Listrik VOXA', priceNum: 1_000 },
  'sp-charger-grade-a': { name: 'Charger Grade A VOXA', priceNum: 1_000 },
  'sp-controller-350w': { name: 'Controller 350W VOXA', priceNum: 1_000 },
  'sp-controller-500w': { name: 'Controller 500W VOXA', priceNum: 1_000 },
  'sp-fork-garpu-depan': { name: 'Fork Garpu Depan VOXA', priceNum: 1_000 },
  'sp-jok-belakang': { name: 'Jok Belakang VOXA', priceNum: 1_000 },
  'sp-jok-depan': { name: 'Jok Depan VOXA', priceNum: 1_000 },
  'sp-kabel-motor-350w': { name: 'Kabel Motor 350W VOXA', priceNum: 1_000 },
  'sp-kabel-motor-500w': { name: 'Kabel Motor 500W VOXA', priceNum: 1_000 },
  'sp-keranjang': { name: 'Keranjang VOXA', priceNum: 1_000 },
  'sp-klakson': { name: 'Klakson Trumpet Horn VOXA', priceNum: 1_000 },
  'sp-kunci-kontak': { name: 'Kunci Kontak VOXA', priceNum: 1_000 },
  'sp-lampu-depan': { name: 'Lampu Depan VOXA', priceNum: 1_000 },
  'sp-lampu-sein-depan': { name: 'Lampu Sein Depan VOXA', priceNum: 1_000 },
  'sp-motor-350w': { name: 'Motor Listrik 350W VOXA', priceNum: 1_000 },
  'sp-motor-500w': { name: 'Motor Listrik 500W VOXA', priceNum: 1_000 },
  'sp-pedal-set': { name: 'Pedal Set VOXA', priceNum: 1_000 },
  'sp-pijakan-kaki-depan': { name: 'Pijakan Kaki Depan VOXA', priceNum: 1_000 },
  'sp-rem-tromol-belakang': { name: 'Rem Tromol Belakang VOXA', priceNum: 1_000 },
  'sp-rem-tromol-depan': { name: 'Rem Tromol Depan VOXA', priceNum: 1_000 },
  'sp-set-grip': { name: 'Set Grip VOXA', priceNum: 1_000 },
  'sp-set-kabel-utama': { name: 'Set Kabel Utama VOXA', priceNum: 1_000 },
  'sp-set-tuas-rem': { name: 'Set Tuas Rem VOXA', priceNum: 1_000 },
  'sp-setang': { name: 'Setang VOXA', priceNum: 1_000 },
  'sp-shockbreaker': { name: 'Shockbreaker Set VOXA', priceNum: 1_000 },
  'sp-speedometer': { name: 'Speedometer VOXA', priceNum: 1_000 },
  'sp-spion': { name: 'Spion VOXA', priceNum: 1_000 },
  'sp-standar-samping': { name: 'Standar Samping VOXA', priceNum: 1_000 },
  'sp-standar-tengah': { name: 'Standar Tengah (Double Stand) VOXA', priceNum: 1_000 },
};
