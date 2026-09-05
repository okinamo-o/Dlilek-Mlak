import React from 'react';
import type { Chest, Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { X } from 'lucide-react';

interface PrizeBoardProps {
  chests: Chest[];
  lang: Language;
}

export const PrizeBoard: React.FC<PrizeBoardProps> = ({ chests, lang }) => {
  const t = getTranslation(lang);

  // Maintain a stable sorted layout based on initial prize values so positions don't jump
  // We sort by numeric value ascending (0 or non-numeric first, all the way up to the jackpot)
  const sortedChestIds = React.useMemo(() => {
    return [...chests]
      .sort((a, b) => {
        const valA = a.numericValue ?? -1;
        const valB = b.numericValue ?? -1;
        return valA - valB;
      })
      .map((c) => c.id);
  }, [chests.length]); // Only recompute order if chest count changes

  // Map each sorted ID to the current live chest state (to get live isOpen)
  const chestMap = React.useMemo(() => {
    const map = new Map<number, Chest>();
    chests.forEach((c) => map.set(c.id, c));
    return map;
  }, [chests]);

  const sortedChests = sortedChestIds.map((id) => chestMap.get(id)!);

  const midpoint = Math.ceil(sortedChests.length / 2);
  const leftColumn = sortedChests.slice(0, midpoint); // Lower / Blue prizes
  const rightColumn = sortedChests.slice(midpoint);   // Higher / Red prizes

  return (
    <div className="bg-slate-950/95 border-2 border-amber-500/30 rounded-2xl p-3 md:p-4 shadow-2xl flex flex-col gap-3 backdrop-blur-md">
      <div className="text-center pb-2 border-b border-slate-800">
        <h3 className="text-xs md:text-sm font-black tracking-wider text-amber-400 uppercase flex items-center justify-center gap-1.5">
          <span>{t.prizeBoardTitle}</span>
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {lang === 'ar' ? 'الجوائز المتبقية والمستبعدة' : 'Tableau des montants en jeu'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs md:text-sm font-bold">
        {/* Left Column: Blue (Low & Gag Prizes) */}
        <div className="flex flex-col gap-1.5">
          {leftColumn.map((item) => {
            const isEliminated = item.isOpen;
            return (
              <div
                key={`left-${item.id}`}
                className={`relative px-2.5 py-2 rounded-xl border text-center transition-all duration-300 flex items-center justify-between gap-1 overflow-hidden select-none ${
                  isEliminated
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-600 line-through opacity-25 grayscale scale-95 shadow-none'
                    : 'bg-gradient-to-r from-blue-950 via-blue-900/90 to-indigo-950 border-blue-500/60 text-blue-100 shadow-md shadow-blue-500/20 hover:scale-[1.02]'
                }`}
                title={item.label}
              >
                <span className="truncate flex-1 text-center font-extrabold text-[11px] md:text-xs">
                  {item.label}
                </span>

                {isEliminated ? (
                  <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-sm shadow-blue-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Red (Jackpot & High Prizes) */}
        <div className="flex flex-col gap-1.5">
          {rightColumn.map((item) => {
            const isEliminated = item.isOpen;
            return (
              <div
                key={`right-${item.id}`}
                className={`relative px-2.5 py-2 rounded-xl border text-center transition-all duration-300 flex items-center justify-between gap-1 overflow-hidden select-none ${
                  isEliminated
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-600 line-through opacity-25 grayscale scale-95 shadow-none'
                    : 'bg-gradient-to-r from-rose-950 via-red-900/90 to-rose-950 border-rose-500/60 text-rose-100 shadow-md shadow-rose-500/30 hover:scale-[1.02]'
                }`}
                title={item.label}
              >
                <span className="truncate flex-1 text-center font-black text-[11px] md:text-xs">
                  {item.label}
                </span>

                {isEliminated ? (
                  <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 shadow-sm shadow-rose-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
