import React, { useEffect } from 'react';
import { ArrowLeftRight, Lock, Sparkles, HelpCircle } from 'lucide-react';
import type { Chest, Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface FinalSwapModalProps {
  contestantChest: Chest;
  otherChest: Chest;
  onChooseKeep: () => void;
  onChooseSwap: () => void;
  lang: Language;
}

export const FinalSwapModal: React.FC<FinalSwapModalProps> = ({
  contestantChest,
  otherChest,
  onChooseKeep,
  onChooseSwap,
  lang,
}) => {
  const t = getTranslation(lang);

  useEffect(() => {
    sounds.playHeartbeat();
    const interval = setInterval(() => {
      sounds.playHeartbeat();
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-500/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/30 flex flex-col items-center text-center overflow-hidden">
        {/* Spotlight Flare */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.finalStandoffTitle}</span>
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-slate-100 mb-2">
          {t.swapQuestion}
        </h3>

        <p className="text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
          {t.finalStandoffDesc}
        </p>

        {/* The Two Standoff Boxes Visual */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-md my-3 items-center">
          {/* Box 1: Contestant's Box */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-900/90 border-2 border-amber-400 shadow-xl shadow-amber-500/20 relative group">
            <span className="text-[11px] font-bold text-amber-400 mb-1">
              {t.yourBox}
            </span>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 text-slate-950 font-black text-2xl md:text-3xl flex items-center justify-center shadow-lg border border-amber-100">
              {contestantChest.chestNumber}
            </div>
            <span className="text-xs font-bold text-slate-300 mt-2">
              {t.boxNumber} {contestantChest.chestNumber}
            </span>
          </div>

          {/* VS Divider */}
          <div className="hidden">VS</div>

          {/* Box 2: The Other Chest */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-900/90 border-2 border-indigo-500 shadow-xl shadow-indigo-500/20 relative group">
            <span className="text-[11px] font-bold text-indigo-400 mb-1">
              {lang === 'ar' ? 'الصندوق الآخر' : 'L\'Autre Boîte'}
            </span>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-400 to-indigo-200 text-slate-950 font-black text-2xl md:text-3xl flex items-center justify-center shadow-lg border border-indigo-100">
              {otherChest.chestNumber}
            </div>
            <span className="text-xs font-bold text-slate-300 mt-2">
              {t.boxNumber} {otherChest.chestNumber}
            </span>
          </div>
        </div>

        {/* Action Choice Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
          {/* Keep Box Button */}
          <button
            onClick={() => {
              sounds.playChestClick();
              onChooseKeep();
            }}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-base md:text-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
          >
            <Lock className="w-5 h-5" />
            <span>{t.keepBtn}</span>
          </button>

          {/* Swap Box Button */}
          <button
            onClick={() => {
              sounds.playChestClick();
              onChooseSwap();
            }}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base md:text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-300"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span>{t.swapBtn}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>
            {lang === 'ar'
              ? 'القرار نهائي ولا يمكن الرجوع فيه بعد الاختيار!'
              : 'Ce choix est irréversible, choisissez bien !'}
          </span>
        </div>
      </div>
    </div>
  );
};
