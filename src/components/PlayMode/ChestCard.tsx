import React from 'react';
import type { Chest, Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { getGovernorate } from '../../utils/defaultPresets';

interface ChestCardProps {
  chest: Chest;
  isContestantBox: boolean;
  isOpening: boolean;
  canClick: boolean;
  onClick: () => void;
  lang: Language;
}

export const ChestCard: React.FC<ChestCardProps> = ({
  chest,
  isContestantBox,
  isOpening,
  canClick,
  onClick,
  lang,
}) => {
  const t = getTranslation(lang);

  // Governorate name (from chest or fallback lookup)
  const governorate = chest.governorate || getGovernorate(chest.chestNumber).nameAr;
  const boxImgSrc = `/game_assets/boxes/box_${chest.chestNumber}.png`;

  // Opened state: Box is dimmed/greyed out with revealed prize badge
  if (chest.isOpen) {
    const isHigh = (chest.numericValue || 0) >= 5000;
    return (
      <div className="relative flex flex-col items-center justify-end group select-none opacity-40 grayscale-[0.6] transition-all duration-300">
        <div className="relative w-16 sm:w-20 md:w-24 flex flex-col items-center">
          {/* Revealed Prize Badge overlay */}
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black shadow-lg border whitespace-nowrap ${
              isHigh
                ? 'bg-rose-950/90 text-rose-200 border-rose-500'
                : 'bg-slate-900/95 text-cyan-300 border-cyan-500/60'
            }`}
          >
            {chest.label}
          </div>

          <img
            src={boxImgSrc}
            alt={`${t.boxNumber} ${chest.chestNumber}`}
            className="w-full h-auto object-contain filter brightness-75 drop-shadow"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <span className="font-extrabold text-slate-400 text-xs mt-0.5 drop-shadow line-through">
          {governorate}
        </span>
      </div>
    );
  }

  // Contestant Lucky Box on stage (if placed on stage before moving to podium)
  if (isContestantBox) {
    return (
      <div className="relative flex flex-col items-center justify-end group select-none">
        <div className="relative w-16 sm:w-20 md:w-24 flex flex-col items-center animate-pulse">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded-full shadow border border-amber-200 uppercase whitespace-nowrap">
            {t.yourBox}
          </div>
          <img
            src={boxImgSrc}
            alt={`${t.boxNumber} ${chest.chestNumber}`}
            className="w-full h-auto object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
          />
        </div>
        <span className="font-black text-amber-300 text-xs sm:text-sm mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
          {governorate}
        </span>
      </div>
    );
  }

  // Active unopened box
  return (
    <button
      type="button"
      onClick={canClick ? onClick : undefined}
      disabled={!canClick || isOpening}
      className={`group relative flex flex-col items-center justify-end transition-all duration-200 select-none outline-none ${
        isOpening
          ? 'scale-110 z-30 animate-suspense'
          : canClick
          ? 'cursor-pointer hover:scale-105 active:scale-95'
          : 'cursor-not-allowed opacity-75'
      }`}
    >
      <div className="relative w-16 sm:w-20 md:w-24 flex flex-col items-center">
        {/* Suspense Glow */}
        {isOpening && (
          <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-md animate-ping pointer-events-none" />
        )}

        {/* Authentic Box Sprite (Number + Avatar) */}
        <img
          src={boxImgSrc}
          alt={`${t.boxNumber} ${chest.chestNumber}`}
          className={`w-full h-auto object-contain transition-transform duration-200 ${
            isOpening
              ? 'drop-shadow-[0_0_18px_rgba(251,191,36,1)]'
              : 'group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.8)] drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]'
          }`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Governorate Calligraphy Label with High Contrast Text Stroke */}
      <span
        className={`text-xs sm:text-sm font-black mt-0.5 transition-colors ${
          isOpening
            ? 'text-amber-300 drop-shadow-[0_2px_5px_rgba(0,0,0,1)]'
            : 'text-white group-hover:text-cyan-200'
        }`}
        style={{
          textShadow: '0 2px 4px #000, 0 -1px 2px #000, 1px 0 2px #000, -1px 0 2px #000',
        }}
      >
        {governorate}
      </span>
    </button>
  );
};
