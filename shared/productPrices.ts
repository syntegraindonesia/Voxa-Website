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
};
