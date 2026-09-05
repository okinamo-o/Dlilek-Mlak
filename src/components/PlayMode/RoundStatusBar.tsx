import React from 'react';
import type { Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { PhoneCall, Target } from 'lucide-react';

interface RoundStatusBarProps {
  round: number;
  remainingInRound: number;
  totalInRound: number;
  lang: Language;
}

export const RoundStatusBar: React.FC<RoundStatusBarProps> = ({
  round,
  remainingInRound,
  totalInRound,
  lang,
}) => {
  const t = getTranslation(lang);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Round Number */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-lg border border-amber-300 shrink-0">
          {round}
        </div>
        <div>
          <div className="text-xs font-bold text-amber-400">
            {t.roundTitle} {round}
          </div>
          <div className="text-sm md:text-base font-black text-slate-100 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              {t.eliminationInstruction.replace('{count}', String(totalInRound))}
            </span>
          </div>
        </div>
      </div>

      {/* Target Progress Counter */}
      <div className="flex items-center gap-3 bg-slate-950/80 border border-amber-500/20 px-4 py-2 rounded-xl shrink-0">
        <div className="text-center">
          <div className="text-[11px] text-slate-400">
            {lang === 'ar' ? 'متبقي في هذه الجولة' : 'Reste à ouvrir'}
          </div>
          <div className="text-lg font-black text-amber-300">
            {remainingInRound} {t.chestsCountLabel}
          </div>
        </div>

        <div className="h-8 w-px bg-slate-800" />

        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>{lang === 'ar' ? 'ثم اتصال البنكار' : 'Puis le Banquier'}</span>
        </div>
      </div>
    </div>
  );
};
