import { useState, useEffect } from 'react';
import type { Chest, GamePhase, Language } from './types/game';
import { Navbar } from './components/Navbar';
import { HostSetupScreen } from './components/HostSetup/HostSetupScreen';
import { PlayBoard } from './components/PlayMode/PlayBoard';
import { sounds } from './utils/soundEffects';

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('dlilek_lang');
    return (saved === 'fr' || saved === 'ar') ? saved : 'ar';
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getIsMuted());
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [activeChests, setActiveChests] = useState<Chest[]>([]);

  // Update HTML document direction and language when toggled
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('dlilek_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  };

  const toggleSound = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleStartGame = (configuredChests: Chest[]) => {
    setActiveChests(configuredChests);
    setGamePhase('pick_contestant_box');
  };

  const handleEndGameToSetup = () => {
    setGamePhase('setup');
    sounds.stopBankerRing();
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col stage-spotlight">
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        phase={gamePhase}
        onEndGame={handleEndGameToSetup}
      />

      <main className="flex-1 w-full">
        {gamePhase === 'setup' ? (
          <HostSetupScreen
            lang={lang}
            onStartGame={handleStartGame}
          />
        ) : (
          <PlayBoard
            key={activeChests.map(c => c.id).join('-')}
            initialChests={activeChests}
            lang={lang}
            onNewGame={handleEndGameToSetup}
            isMuted={isMuted}
            onToggleSound={toggleSound}
          />
        )}
      </main>

      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900 bg-slate-950/60 backdrop-blur-sm">
        {lang === 'ar'
          ? 'دليلك ملاك — لعبة المتصفح التونسية الخاصة بالسهرات والبث المباشر (نسخة المضيف والجمهور)'
          : 'Dlilek Mlak — Jeu de soirée et livestream interactif (Version Hôte & Public)'}
      </footer>
    </div>
  );
}

export default App;
