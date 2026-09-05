/**
 * Authentic default prize presets for Dlilek Mlak (دليلك ملاك)
 * Includes classic TV values and iconic gag prizes
 */

export interface GamePreset {
  id: string;
  nameAr: string;
  nameFr: string;
  count: number;
  prizes: string[];
}

export const DEFAULT_PRESETS: GamePreset[] = [
  {
    id: 'classic_24',
    nameAr: 'كلاسيك 24 صندوق (برنامج التلفزة التونسية)',
    nameFr: 'Classique 24 Boîtes (Format TV)',
    count: 24,
    prizes: [
      '0.1 دينار (100 مليم)',
      'كردونة فارغة',
      'دبوزة ماء صافية',
      'تيكي بلانات (1 د.ت)',
      'فردة صباط',
      'ساندوتش كفتاجي (5 د.ت)',
      'عشوية في قمرت (50 د.ت)',
      '100 دينار',
      '250 دينار',
      '500 دينار',
      '1,000 دينار (مليون)',
      '2,500 دينار',
      '5,000 دينار (5 ملاين)',
      '10,000 دينار (10 ملاين)',
      '20,000 دينار (20 مليون)',
      '30,000 دينار (30 مليون)',
      'رحلة إلى تركيا لشخصين (6,000 د.ت)',
      '50,000 دينار (50 مليون)',
      'سيارة جديدة (55,000 د.ت)',
      '75,000 دينار (75 مليون)',
      '100,000 دينار (100 مليون)',
      '200,000 دينار (200 مليون)',
      '500,000 دينار (500 مليون)',
      '1,000,000 دينار (المليار)',
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

  // Generate sensible values scaling from small to big
  const result: string[] = [];
  const baseValues = [
    'كردونة', 'دبوزة ماء', '1 د.ت', '10 د.ت', '50 د.ت', '100 د.ت',
    '250 د.ت', '500 د.ت', '1,000 د.ت', '2,500 د.ت', '5,000 د.ت',
    '10,000 د.ت', '20,000 د.ت', '35,000 د.ت', '50,000 د.ت', '75,000 د.ت',
    '100,000 د.ت', '150,000 د.ت', '250,000 د.ت', '500,000 د.ت', '1,000,000 د.ت',
    'هدية مفاجئة', 'سيارة جديدة', 'عشوية في نزل فاخر', 'تلفزة 65 بوصة', 'PlayStation 5',
    'iPhone 16 Pro', 'رحلة سفر', '0.01 د.ت', 'بوسة من عند سامي'
  ];

  for (let i = 0; i < count; i++) {
    result.push(baseValues[i % baseValues.length]);
  }
  return result;
}
