/**
 * Authentic default prize presets and Tunisian governorates for Dlilek Mlak (دليلك ملاك)
 */

export interface GamePreset {
  id: string;
  nameAr: string;
  nameFr: string;
  count: number;
  prizes: string[];
}

export interface GovernorateInfo {
  id: number;
  nameAr: string;
  nameFr: string;
}

export const TUNISIAN_GOVERNORATES: GovernorateInfo[] = [
  { id: 1, nameAr: 'تونس', nameFr: 'Tunis' },
  { id: 2, nameAr: 'نابل', nameFr: 'Nabeul' },
  { id: 3, nameAr: 'زغوان', nameFr: 'Zaghouan' },
  { id: 4, nameAr: 'بنزرت', nameFr: 'Bizerte' },
  { id: 5, nameAr: 'منوبة', nameFr: 'Manouba' },
  { id: 6, nameAr: 'اريانة', nameFr: 'Ariana' },
  { id: 7, nameAr: 'الكاف', nameFr: 'Le Kef' },
  { id: 8, nameAr: 'سليانة', nameFr: 'Siliana' },
  { id: 9, nameAr: 'صفاقس', nameFr: 'Sfax' },
  { id: 10, nameAr: 'قفصة', nameFr: 'Gafsa' },
  { id: 11, nameAr: 'مدنين', nameFr: 'Médenine' },
  { id: 12, nameAr: 'المنستير', nameFr: 'Monastir' },
  { id: 13, nameAr: 'قابس', nameFr: 'Gabès' },
  { id: 14, nameAr: 'المهدية', nameFr: 'Mahdia' },
  { id: 15, nameAr: 'سوسة', nameFr: 'Sousse' },
  { id: 16, nameAr: 'قبلي', nameFr: 'Kébili' },
  { id: 17, nameAr: 'بوزيد', nameFr: 'Sidi Bouzid' },
  { id: 18, nameAr: 'تطاوين', nameFr: 'Tataouine' },
  { id: 19, nameAr: 'جندوبة', nameFr: 'Jendouba' },
  { id: 20, nameAr: 'القصرين', nameFr: 'Kasserine' },
  { id: 21, nameAr: 'توزر', nameFr: 'Tozeur' },
  { id: 22, nameAr: 'القيروان', nameFr: 'Kairouan' },
  { id: 23, nameAr: 'باجة', nameFr: 'Béja' },
  { id: 24, nameAr: 'بن عروس', nameFr: 'Ben Arous' },
];

export function getGovernorate(boxNumber: number): GovernorateInfo {
  const index = (boxNumber - 1) % TUNISIAN_GOVERNORATES.length;
  return TUNISIAN_GOVERNORATES[index];
}

export const DEFAULT_PRESETS: GamePreset[] = [
  {
    id: 'classic_24',
    nameAr: 'كلاسيك 24 صندوق (برنامج دليلك ملك الرسمي)',
    nameFr: 'Format Officiel 24 Boîtes',
    count: 24,
    prizes: [
      // Left side (Low & Gag)
      '0.1 د',
      '1 د',
      'مخدة',
      '10 د',
      '50 د',
      'صحن فريت',
      '100 د',
      '250 د',
      '500 د',
      'فخذ دجاج',
      '1.000 د',
      '2.000 د',
      // Right side (High & Jackpot)
      '5.000 د',
      '10.000 د',
      '15.000 د',
      '20.000 د',
      '25.000 د',
      '30.000 د',
      '50.000 د',
      '100.000 د',
      '200.000 د',
      '300.000 د',
      '1.000.000 د',
      '2.000.000 د',
    ],
  },
  {
    id: 'express_9',
    nameAr: 'سريع 9 صناديق (حفلات وسهرات سريعة)',
    nameFr: 'Express 9 Boîtes (Party)',
    count: 9,
    prizes: [
      'كردونة',
      '10 دينار',
      '50 دينار',
      '100 دينار',
      '500 دينار',
      '1,000 دينار',
      '5,000 دينار',
      '10,000 دينار',
      'iPhone 16 Pro (4,500 د.ت)',
    ],
  },
  {
    id: 'standard_12',
    nameAr: 'متوسط 12 صندوق (مناسب للبث واللايف)',
    nameFr: 'Moyen 12 Boîtes (Livestream)',
    count: 12,
    prizes: [
      '0.1 دينار',
      'دبوزة ماء',
      '20 دينار',
      '50 دينار',
      '100 دينار',
      '300 دينار',
      '1,000 دينار',
      '2,500 دينار',
      '5,000 دينار',
      '10,000 دينار',
      '20,000 دينار',
      '50,000 دينار',
    ],
  },
  {
    id: 'medium_16',
    nameAr: '16 صندوق (توازن رائع للإثارة)',
    nameFr: 'Standard 16 Boîtes',
    count: 16,
    prizes: [
      'كردونة فارغة',
      '0.5 دينار',
      '10 دينار',
      '25 دينار',
      '50 دينار',
      '100 دينار',
      '250 دينار',
      '500 دينار',
      '1,000 دينار',
      '2,000 دينار',
      '5,000 دينار',
      '10,000 دينار',
      '20,000 دينار',
      'PlayStation 5 (2,500 د.ت)',
      '50,000 دينار',
      '100,000 دينار',
    ],
  },
  {
    id: 'party_20',
    nameAr: '20 صندوق (إثارة متكاملة)',
    nameFr: 'Plein Format 20 Boîtes',
    count: 20,
    prizes: [
      'كردونة',
      'فردة صباط',
      'دبوزة ماء',
      '1 دينار',
      '10 دينار',
      '50 دينار',
      '100 دينار',
      '250 دينار',
      '500 دينار',
      '1,000 دينار',
      '2,000 دينار',
      '5,000 دينار',
      '10,000 دينار',
      '15,000 دينار',
      '20,000 دينار',
      '30,000 دينار',
      '50,000 دينار',
      '75,000 دينار',
      '100,000 دينار',
      '200,000 دينار',
    ],
  },
  {
    id: 'deal_26',
    nameAr: 'النسخة العالمية 26 صندوق (Deal or No Deal)',
    nameFr: 'Version Mondiale 26 Boîtes',
    count: 26,
    prizes: [
      '0.01 DT',
      '1 DT',
      '5 DT',
      '10 DT',
      '25 DT',
      '50 DT',
      '75 DT',
      '100 DT',
      '200 DT',
      '300 DT',
      '400 DT',
      '500 DT',
      '750 DT',
      '1,000 DT',
      '5,000 DT',
      '10,000 DT',
      '25,000 DT',
      '50,000 DT',
      '75,000 DT',
      '100,000 DT',
      '200,000 DT',
      '300,000 DT',
      '400,000 DT',
      '500,000 DT',
      '750,000 DT',
      '1,000,000 DT',
    ],
  },
];

export function getPresetByCount(count: number): GamePreset | undefined {
  return DEFAULT_PRESETS.find((p) => p.count === count);
}

/**
 * Generate starter prizes for any custom count N
 */
export function generateStarterPrizes(count: number): string[] {
  const match = getPresetByCount(count);
  if (match) {
    return [...match.prizes];
  }

  const baseValues = [
    '0.1 د', '1 د', 'مخدة', '10 د', '50 د', 'صحن فريت', '100 د', '250 د',
    '500 د', 'فخذ دجاج', '1.000 د', '2.000 د', '5.000 د', '10.000 د',
    '15.000 د', '20.000 د', '25.000 د', '30.000 د', '50.000 د', '100.000 د',
    '200.000 د', '300.000 د', '1.000.000 د', '2.000.000 د'
  ];

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(baseValues[i % baseValues.length]);
  }
  return result;
}
