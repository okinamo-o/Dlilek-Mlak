import React from 'react';
import type { Chest, Language } from '../../types/game';

export const OFFICIAL_24_PRIZES = [
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
];

const LEFT_PRIZE_IMAGES = [
  '/game_assets/prizes/left_1_0.1.png',
  '/game_assets/prizes/left_2_1.png',
  '/game_assets/prizes/left_3_mekhadda.png',
  '/game_assets/prizes/left_4_10.png',
  '/game_assets/prizes/left_5_50.png',
  '/game_assets/prizes/left_6_frite.png',
  '/game_assets/prizes/left_7_100.png',
  '/game_assets/prizes/left_8_250.png',
  '/game_assets/prizes/left_9_500.png',
  '/game_assets/prizes/left_10_djej.png',
  '/game_assets/prizes/left_11_1000.png',
  '/game_assets/prizes/left_12_2000.png',
];

const RIGHT_PRIZE_IMAGES = [
  '/game_assets/prizes/right_1_5000.png',
  '/game_assets/prizes/right_2_10000.png',
  '/game_assets/prizes/right_3_15000.png',
  '/game_assets/prizes/right_4_20000.png',
  '/game_assets/prizes/right_5_25000.png',
  '/game_assets/prizes/right_6_30000.png',
  '/game_assets/prizes/right_7_50000.png',
  '/game_assets/prizes/right_8_100000.png',
  '/game_assets/prizes/right_9_200000.png',
  '/game_assets/prizes/right_10_300000.png',
  '/game_assets/prizes/right_11_1000000.png',
  '/game_assets/prizes/right_12_2000000.png',
];

export function getPrizeExactImage(label: string): string | null {
  const norm = label.trim();
  const idx = OFFICIAL_24_PRIZES.indexOf(norm);
  if (idx >= 0 && idx < 12) {
    return LEFT_PRIZE_IMAGES[idx];
  }
  if (idx >= 12 && idx < 24) {
    return RIGHT_PRIZE_IMAGES[idx - 12];
  }
  return null;
}

export function getPrizeRank(chest: Chest): number {
  const norm = chest.label.trim();
  const idx = OFFICIAL_24_PRIZES.indexOf(norm);
  if (idx !== -1) return idx;
  return (chest.numericValue ?? 0) + 1000;
}

interface PrizeColumnProps {
  chests: Chest[];
  isLeft: boolean;
  lang: Language;
}

export const PrizeColumn: React.FC<PrizeColumnProps> = ({ chests, isLeft }) => {
  return (
    <div className="flex flex-col gap-[2px] sm:gap-[3px] w-full select-none">
      {chests.map((item, idx) => {
        const isEliminated = item.isOpen;
        const exactImg = getPrizeExactImage(item.label);

        // Fallback templates for custom host prizes
        let templateBg = '/game_assets/prizes/template_blue.png';
        let customTextColor = 'text-slate-950';

        if (!isLeft) {
          if (idx < 6) {
            templateBg = '/game_assets/prizes/template_tan.png';
            customTextColor = 'text-amber-950';
          } else if (idx < 10) {
            templateBg = '/game_assets/prizes/template_red.png';
            customTextColor = 'text-white';
          } else {
            templateBg = '/game_assets/prizes/template_green.png';
            customTextColor = 'text-slate-950';
          }
        }

        return (
          <div
            key={`prize-${item.id}-${item.label}`}
            className={`relative w-full h-[26px] sm:h-[30px] md:h-[34px] lg:h-[38px] flex items-center justify-center transition-all duration-300 rounded overflow-hidden shadow-sm ${
              isEliminated
                ? 'opacity-20 grayscale brightness-50'
                : 'hover:brightness-110'
            }`}
          >
            {/* If matching an authentic game prize, show the exact mobile game sprite */}
            {exactImg ? (
              <img
                src={exactImg}
                alt={item.label}
                className="w-full h-full object-fill pointer-events-none"
              />
            ) : (
              /* Custom template background with crisp text */
              <div
                className="w-full h-full flex items-center justify-center px-2 bg-cover bg-center"
                style={{ backgroundImage: `url(${templateBg})` }}
              >
                <span
                  className={`font-black text-xs sm:text-sm truncate ${customTextColor}`}
                  style={{ textShadow: isLeft ? 'none' : '0 1px 1px rgba(0,0,0,0.3)' }}
                >
                  {item.label}
                </span>
              </div>
            )}

            {/* Red elimination strike line */}
            {isEliminated && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[2.5px] bg-red-600/90 shadow-sm" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface PrizeBoardProps {
  chests: Chest[];
  lang: Language;
}

export const PrizeBoard: React.FC<PrizeBoardProps> = ({ chests, lang }) => {
  const sorted = React.useMemo(() => {
    return [...chests].sort((a, b) => getPrizeRank(a) - getPrizeRank(b));
  }, [chests]);

  const midpoint = Math.ceil(sorted.length / 2);
  const leftChests = sorted.slice(0, midpoint);
  const rightChests = sorted.slice(midpoint);

  return (
    <div className="flex justify-between items-start gap-4 w-full">
      <PrizeColumn chests={leftChests} isLeft={true} lang={lang} />
      <PrizeColumn chests={rightChests} isLeft={false} lang={lang} />
    </div>
  );
};
