import React from 'react';
import type { Chest, Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ContestantPodiumProps {
  contestantChest: Chest | null;
  lang: Language;
}

export const ContestantPodium: React.FC<ContestantPodiumProps> = ({
  contestantChest,
  lang,
}) => {
  const t = getTranslation(lang);

  if (!contestantChest) return null;

  return (
    <div className="relative flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 via-slate-900/90 to-slate-950 border-2 border-amber-400/60 shadow-2xl shadow-amber-500/20 max-w-sm mx-auto overflow-hidden">
      {/* Background golden flare */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs tracking-wider shadow-md mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t.yourBox}</span>
      </div>

      {/* Center 3D Box Emblem */}
      <div className="relative my-2 group">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 text-slate-950 font-black text-3xl md:text-4xl flex items-center justify-center shadow-2xl border-2 border-amber-100 animate-float">
          {contestantChest.chestNumber}
        </div>
        {/* Glow rings */}
        <div className="absolute -inset-1 rounded-2xl bg-amber-400/30 blur-sm -z-10 animate-pulse-gold" />
      </div>

      {/* Box Title */}
      <div className="text-center mt-2">
        <h4 className="text-base font-black text-amber-200 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {t.boxNumber} {contestantChest.chestNumber}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          {lang === 'ar' ? 'محتوى هذا الصندوق سرّي حتى النهاية!' : 'Le contenu reste secret jusqu\'à la fin !'}
        </p>
      </div>

      {/* Podium Stand Base */}
      <div className="w-32 h-3 rounded-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 mt-4 shadow-lg" />
    </div>
  );
};
