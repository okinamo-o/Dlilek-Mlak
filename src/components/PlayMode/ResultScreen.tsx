import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Award, CheckCircle2, Box } from 'lucide-react';
import type { Chest, FinalOutcome, Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface ResultScreenProps {
  outcome: FinalOutcome;
  allChests: Chest[];
  lang: Language;
  onNewGame: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  outcome,
  allChests,
  lang,
  onNewGame,
}) => {
  const t = getTranslation(lang);

  useEffect(() => {
    // Play sound based on result (laughter if left with gag item or tiny amount, fanfare if won)
    const isTinyOrGag =
      (outcome.winNumericValue !== null && outcome.winNumericValue <= 10) ||
      /مخدة|فريت|دجاج|فخذ|كردونة|صباط|ماء|ساندوتش|فارغة|صفر|بوسة|0\.1/i.test(outcome.winLabel);

    if (isTinyOrGag) {
      sounds.playLaughterSound();
    } else {
      sounds.playVictoryFanfare();
    }

    // Trigger colorful confetti shower
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-8 animate-fade-in select-none">
      {/* Grand Victory Card */}
      <div className="w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-400 rounded-3xl p-6 md:p-10 shadow-2xl shadow-amber-500/30 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy Emblem */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-2 border-white mb-4 animate-bounce">
          <Trophy className="w-10 h-10 md:w-12 md:h-12 text-amber-950" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40 mb-3">
          <Sparkles className="w-4 h-4" />
          <span>{t.congratsTitle}</span>
        </div>

        {/* Narrative Outcome */}
        <h2 className="text-xl md:text-2xl font-bold text-slate-300 mb-3 max-w-xl">
          {outcome.type === 'deal'
            ? t.dealWonNotice
            : outcome.type === 'box_swapped'
            ? (lang === 'ar' ? 'بدّلت صندوقك وفزت بمحتوى الصندوق الجديد:' : 'Vous avez échangé votre boîte et remportez :')
            : t.boxWonNotice}
        </h2>

        {/* The Big Prize Display */}
        <div className="w-full max-w-lg bg-slate-950/90 border-2 border-amber-400 rounded-2xl p-6 my-2 shadow-2xl relative overflow-hidden group">
          <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-lg">
            {outcome.winLabel}
          </div>
          {outcome.winNumericValue !== null && outcome.winNumericValue > 0 && (
            <div className="text-sm font-bold text-emerald-400 mt-2 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{outcome.winNumericValue.toLocaleString()} DT</span>
            </div>
          )}
        </div>

        {/* Comparisons: What was in the original box vs other box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-6 text-xs md:text-sm">
          {/* Contestant's initial box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <div className="text-slate-400 font-bold mb-1 flex items-center gap-1">
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.yourBox} ({t.boxNumber} {outcome.contestantOriginalBoxNumber})</span>
            </div>
            <div className="font-extrabold text-amber-200">
              {outcome.contestantOriginalBoxLabel}
            </div>
          </div>

          {/* If swapped or had another box */}
          {outcome.otherBoxNumber && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <div className="text-slate-400 font-bold mb-1 flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'ar' ? 'الصندوق المنافس' : 'L\'autre boîte'} ({t.boxNumber} {outcome.otherBoxNumber})</span>
              </div>
              <div className="font-extrabold text-indigo-200">
                {outcome.otherBoxLabel}
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Play Again */}
        <div className="mt-8">
          <button
            onClick={onNewGame}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border border-amber-200"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.playAgainBtn}</span>
          </button>
        </div>
      </div>

      {/* Full Board Reveal for Transparency & Closure */}
      <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-black text-slate-200">
            {t.allBoxesRevealTitle}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
          {allChests.map((chest) => (
            <div
              key={chest.id}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center ${
                chest.chestNumber === outcome.contestantOriginalBoxNumber
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[11px] font-black text-slate-400">
                {t.boxNumber} {chest.chestNumber}
                {chest.chestNumber === outcome.contestantOriginalBoxNumber && ' (صندوقك)'}
              </span>
              <span className="font-bold mt-1 text-slate-100 truncate w-full">
                {chest.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
