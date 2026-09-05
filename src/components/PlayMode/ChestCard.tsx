import type { Chest, Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { Sparkles, Lock } from 'lucide-react';

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

  // If this is the contestant's chosen box, it stays on the podium (unopened until the end)
  if (isContestantBox && !chest.isOpen) {
    return (
      <div className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-500/20 via-amber-600/10 to-slate-900 border-2 border-amber-400 shadow-xl shadow-amber-500/20 opacity-90 scale-95 cursor-default select-none">
        <div className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{t.yourBox}</span>
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 text-slate-950 font-black text-xl md:text-2xl flex items-center justify-center shadow-lg border border-amber-200 mt-2">
          {chest.chestNumber}
        </div>
        <span className="text-[11px] font-bold text-amber-300 mt-1.5 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          {t.boxNumber} {chest.chestNumber}
        </span>
      </div>
    );
  }

  // If chest is already opened: show prize content with clean TV styling
  if (chest.isOpen) {
    const isHigh = (chest.numericValue || 0) >= 5000;
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 select-none ${
          isHigh
            ? 'bg-rose-950/40 border-rose-600/40 text-rose-200'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        } opacity-60 scale-95`}
      >
        <div className="text-[10px] font-extrabold text-slate-400 mb-0.5">
          {t.boxNumber} {chest.chestNumber}
        </div>
        <div className="text-xs md:text-sm font-black text-center line-clamp-2 px-1 text-slate-200">
          {chest.label}
        </div>
        <div className="text-[10px] font-semibold text-rose-400/80 mt-1 px-1.5 py-0.2 rounded bg-rose-950/40 border border-rose-900/40">
          {t.openedBadge}
        </div>
      </div>
    );
  }

  // Active unopened chest
  return (
    <button
      onClick={canClick ? onClick : undefined}
      disabled={!canClick || isOpening}
      className={`group relative flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
        isOpening
          ? 'animate-suspense bg-gradient-to-b from-amber-500/40 via-amber-600/20 to-slate-900 border-2 border-amber-300 shadow-2xl shadow-amber-500/50 scale-105 z-20'
          : canClick
          ? 'bg-gradient-to-b from-slate-800/90 via-slate-900/90 to-slate-950 border border-amber-500/30 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1 hover:scale-[1.03] active:scale-95'
          : 'bg-slate-900/60 border border-slate-800 opacity-70 cursor-not-allowed'
      }`}
    >
      {/* 3D Chest Lid Accent */}
      <div className="w-10 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 mb-2 shadow-sm group-hover:from-amber-400 group-hover:to-amber-400 transition-colors" />

      {/* Big Golden Number Emblem */}
      <div
        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-black text-xl md:text-2xl shadow-lg border transition-all ${
          isOpening
            ? 'bg-gradient-to-tr from-amber-300 via-amber-400 to-white text-slate-950 border-white animate-pulse'
            : 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-200 group-hover:scale-105 group-hover:shadow-amber-500/40'
        }`}
      >
        {chest.chestNumber}
      </div>

      {/* Chest Label / Action Prompt */}
      <span className="text-xs font-bold text-amber-200/90 mt-2 group-hover:text-amber-100 transition-colors">
        {t.boxNumber} {chest.chestNumber}
      </span>

      {/* Shine overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
