import React from 'react';
import { Volume2, VolumeX, Globe, LogOut, Sparkles } from 'lucide-react';
import type { Language, GamePhase } from '../types/game';
import { getTranslation } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  phase: GamePhase;
  onEndGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  isMuted,
  onToggleSound,
  phase,
  onEndGame,
}) => {
  const t = getTranslation(lang);
  const isPlayMode = phase !== 'setup';

  const handleEndGameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sounds.stopBankerRing();
    onEndGame();
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 sticky top-0 z-40 shadow-xl select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40">
            <span className="text-xl">🎁</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2 pb-1 leading-normal">
              {t.appTitle}
              <Sparkles className="w-4 h-4 text-amber-400 hidden sm:inline" />
            </h1>
            <p className="text-xs text-slate-400 hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Phase Indicator Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
              isPlayMode
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isPlayMode ? `● ${t.playMode}` : `⚙️ ${t.hostMode}`}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={isMuted ? t.soundOff : t.soundOn}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
            <span className="hidden lg:inline">
              {isMuted ? t.soundOff : t.soundOn}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{t.langToggle}</span>
          </button>

          {/* Emergency End Game Escape Hatch (Only visible during active game) */}
          {isPlayMode && (
            <button
              type="button"
              id="end-game-btn"
              onClick={handleEndGameClick}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-700/80 via-rose-600/80 to-red-700/80 hover:from-rose-600 hover:to-red-600 border border-rose-400/60 text-white transition-all flex items-center gap-1.5 text-xs font-black shadow-lg shadow-rose-900/40 hover:scale-105 active:scale-95 cursor-pointer"
              title="إنهاء اللعبة الحالية والعودة لصفحة الإعدادات"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>{t.endGameBtn}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
