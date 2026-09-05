import React, { useState } from 'react';
import type { Chest, GamePhase, Language, BankerOfferRecord, FinalOutcome } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { ChestCard } from './ChestCard';
import { PrizeBoard } from './PrizeBoard';
import { ContestantPodium } from './ContestantPodium';
import { RoundStatusBar } from './RoundStatusBar';
import { BankerModal } from './BankerModal';
import { FinalSwapModal } from './FinalSwapModal';
import { ResultScreen } from './ResultScreen';
import { getRoundSchedule, calculateBankerOffer } from '../../utils/gameRules';
import { sounds } from '../../utils/soundEffects';
import { Sparkles } from 'lucide-react';

interface PlayBoardProps {
  initialChests: Chest[];
  lang: Language;
  onNewGame: () => void;
}

export const PlayBoard: React.FC<PlayBoardProps> = ({
  initialChests,
  lang,
  onNewGame,
}) => {
  const t = getTranslation(lang);

  // Game state
  const [chests, setChests] = useState<Chest[]>(initialChests);
  const [phase, setPhase] = useState<GamePhase>('pick_contestant_box');
  const [contestantBoxId, setContestantBoxId] = useState<number | null>(null);

  // Elimination schedule & tracking
  const [schedule] = useState<number[]>(() => getRoundSchedule(initialChests.length));
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [chestsOpenedThisRound, setChestsOpenedThisRound] = useState<number>(0);
  const [openingChestId, setOpeningChestId] = useState<number | null>(null);

  // Banker offers & outcomes
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [offerHistory, setOfferHistory] = useState<BankerOfferRecord[]>([]);
  const [finalOutcome, setFinalOutcome] = useState<FinalOutcome | null>(null);

  // Studio reaction mood (laughter, sad music, standard)
  const [revealMood, setRevealMood] = useState<{ type: 'laugh' | 'sad' | 'standard'; message: string } | null>(null);

  // Derived variables
  const contestantChest = chests.find((c) => c.id === contestantBoxId) || null;
  const unopenedChests = chests.filter((c) => !c.isOpen);
  const remainingTargetForRound = Math.max(
    0,
    (schedule[currentRoundIndex] || 1) - chestsOpenedThisRound
  );

  // 1. Contestant selects their lucky box
  const handleSelectContestantBox = (chestId: number) => {
    sounds.playChestClick();
    sounds.playRevealChime(true);

    const updated = chests.map((c) =>
      c.id === chestId ? { ...c, isContestantBox: true } : c
    );
    setChests(updated);
    setContestantBoxId(chestId);
    setPhase('elimination');
  };

  // 2. Contestant opens an elimination chest
  const handleOpenChest = (chestId: number) => {
    if (phase !== 'elimination' || openingChestId !== null) return;

    const target = chests.find((c) => c.id === chestId);
    if (!target || target.isOpen || target.isContestantBox) return;

    // Start suspense animation and audio
    setOpeningChestId(chestId);
    sounds.playChestClick();
    sounds.playSuspenseRiser();

    // Reveal after suspense delay
    setTimeout(() => {
      // Check whether this prize triggers the famous TV laughter or the sad music
      const isSmallOrGag = 
        (target.numericValue !== null && target.numericValue <= 100) ||
        /كردونة|صباط|ماء|ساندوتش|فارغة|صفر|بوسة|0\.1|100\s*مليم/i.test(target.label);

      const isJackpot = 
        (target.numericValue !== null && target.numericValue >= 50000) ||
        /مليار|سيارة|100\s*مليون|200\s*مليون|500\s*مليون/i.test(target.label);

      if (isSmallOrGag) {
        // 😂 Audience laughs and cheers because keeping high prizes is good news!
        sounds.playLaughterSound();
        setRevealMood({
          type: 'laugh',
          message: lang === 'ar'
            ? `😂 ههههه! خرجت ${target.label} والفلوس الكبيرة ما زالت في اللعبة!`
            : `😂 Haha ! ${target.label} est sorti, les gros montants restent en jeu !`
        });
      } else if (isJackpot) {
        // 🎻 Dramatic sad music when a massive prize/jackpot is eliminated
        sounds.playSadMusic();
        setRevealMood({
          type: 'sad',
          message: lang === 'ar'
            ? `😭 يا حسارة! خسرنا ${target.label} وطار من الحسبة!`
            : `😭 Aïe coup dur ! ${target.label} vient d'être éliminé !`
        });
      } else {
        const isHigh = (target.numericValue ?? 0) >= 5000;
        sounds.playRevealChime(isHigh);
        setRevealMood({
          type: 'standard',
          message: lang === 'ar'
            ? `📦 كشف الصندوق: ${target.label}`
            : `📦 Boîte révélée : ${target.label}`
        });
      }

      setTimeout(() => {
        setRevealMood(null);
      }, 3500);

      const updated = chests.map((c) =>
        c.id === chestId ? { ...c, isOpen: true } : c
      );
      setChests(updated);
      setOpeningChestId(null);

      const newOpenedInRound = chestsOpenedThisRound + 1;
      setChestsOpenedThisRound(newOpenedInRound);

      // Check remaining unopened chests across the entire game
      const remainingUnopened = updated.filter((c) => !c.isOpen);

      // Case A: Exactly 2 chests remain in the whole game (Contestant Box + 1 other) -> Final Swap!
      if (remainingUnopened.length === 2) {
        setTimeout(() => {
          setPhase('final_swap');
        }, 800);
        return;
      }

      // Case B: Round target reached -> Banker calls!
      const currentTarget = schedule[currentRoundIndex] || 1;
      if (newOpenedInRound >= currentTarget) {
        // Collect numeric values of remaining unopened chests
        const remainingValues = remainingUnopened.map((c) => c.numericValue ?? 0);
        const offer = calculateBankerOffer(
          remainingValues,
          currentRoundIndex,
          schedule.length
        );

        setCurrentOffer(offer);

        setTimeout(() => {
          setPhase('banker_offer');
        }, 1200);
      }
    }, 1200);
  };

  // 3. Banker Offer Accepted (DEAL)
  const handleAcceptDeal = () => {
    const outcome: FinalOutcome = {
      type: 'deal',
      winLabel: `${currentOffer.toLocaleString()} DT`,
      winNumericValue: currentOffer,
      contestantOriginalBoxNumber: contestantChest?.chestNumber ?? 1,
      contestantOriginalBoxLabel: contestantChest?.label ?? '',
    };

    setOfferHistory([
      ...offerHistory,
      {
        round: currentRoundIndex + 1,
        amount: currentOffer,
        accepted: true,
        unopenedCount: unopenedChests.length,
      },
    ]);

    setFinalOutcome(outcome);
    setPhase('result');
  };

  // 4. Banker Offer Rejected (NO DEAL)
  const handleRejectDeal = () => {
    setOfferHistory([
      ...offerHistory,
      {
        round: currentRoundIndex + 1,
        amount: currentOffer,
        accepted: false,
        unopenedCount: unopenedChests.length,
      },
    ]);

    // Advance to next round in schedule
    setCurrentRoundIndex((prev) => prev + 1);
    setChestsOpenedThisRound(0);
    setPhase('elimination');
  };

  // 5. Final Swap: Contestant decides to KEEP their original box
  const handleKeepBox = () => {
    const other = chests.find((c) => !c.isOpen && c.id !== contestantBoxId);
    if (!contestantChest) return;

    const outcome: FinalOutcome = {
      type: 'box_kept',
      winLabel: contestantChest.label,
      winNumericValue: contestantChest.numericValue,
      contestantOriginalBoxNumber: contestantChest.chestNumber,
      contestantOriginalBoxLabel: contestantChest.label,
      otherBoxNumber: other?.chestNumber,
      otherBoxLabel: other?.label,
      finalBoxNumber: contestantChest.chestNumber,
    };

    setFinalOutcome(outcome);
    setPhase('result');
  };

  // 6. Final Swap: Contestant decides to SWAP for the rival box
  const handleSwapBox = () => {
    const other = chests.find((c) => !c.isOpen && c.id !== contestantBoxId);
    if (!contestantChest || !other) return;

    const outcome: FinalOutcome = {
      type: 'box_swapped',
      winLabel: other.label,
      winNumericValue: other.numericValue,
      contestantOriginalBoxNumber: contestantChest.chestNumber,
      contestantOriginalBoxLabel: contestantChest.label,
      otherBoxNumber: other.chestNumber,
      otherBoxLabel: other.label,
      finalBoxNumber: other.chestNumber,
    };

    setFinalOutcome(outcome);
    setPhase('result');
  };

  // If in Result Screen:
  if (phase === 'result' && finalOutcome) {
    return (
      <ResultScreen
        outcome={finalOutcome}
        allChests={chests}
        lang={lang}
        onNewGame={onNewGame}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-6 select-none">
      {/* Step 1: Picking lucky box banner */}
      {phase === 'pick_contestant_box' && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border-2 border-amber-400 rounded-3xl p-5 md:p-6 text-center shadow-2xl animate-pulse-gold">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-2 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الخطوة الأولى' : 'Étape 1'}</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-amber-200">
            {t.pickYourBoxTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {t.pickYourBoxSubtitle}
          </p>
        </div>
      )}

      {/* Step 2: Elimination Round Status Bar & Podium */}
      {phase === 'elimination' && contestantChest && (
        <div className="flex flex-col gap-4">
          <RoundStatusBar
            round={currentRoundIndex + 1}
            remainingInRound={remainingTargetForRound}
            totalInRound={schedule[currentRoundIndex] || 1}
            lang={lang}
          />
        </div>
      )}

      {/* Main Stage Grid & Side Prize Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 Columns: Stage Floor with Chests Grid & Podium */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Contestant Podium (Shown once chosen) */}
          {contestantChest && phase !== 'pick_contestant_box' && (
            <ContestantPodium contestantChest={contestantChest} lang={lang} />
          )}

          {/* Studio Reaction / Mood Alert */}
          {revealMood && (
            <div
              className={`w-full py-3 px-5 rounded-2xl border-2 text-sm md:text-base font-black text-center shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 animate-bounce ${
                revealMood.type === 'laugh'
                  ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-emerald-400 text-emerald-100 shadow-emerald-500/30'
                  : revealMood.type === 'sad'
                  ? 'bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-rose-500 text-rose-100 shadow-red-500/40'
                  : 'bg-slate-900/90 border-amber-400/60 text-amber-200 shadow-amber-500/20'
              }`}
            >
              <span>{revealMood.message}</span>
            </div>
          )}

          {/* Interactive Chests Grid */}
          <div className="bg-slate-950/70 border border-amber-500/20 rounded-3xl p-4 md:p-6 shadow-2xl relative">
            <div className="text-xs font-black text-slate-400 mb-3 flex items-center justify-between">
              <span>
                {phase === 'pick_contestant_box'
                  ? (lang === 'ar' ? 'انقر على صندوقك المفضل:' : 'Choisissez votre boîte :')
                  : (lang === 'ar' ? 'صناديق التصفية على المسرح:' : 'Boîtes d\'élimination :')}
              </span>
              <span className="text-amber-400">
                {unopenedChests.length} {t.chestsCountLabel} {lang === 'ar' ? 'متبقية' : 'restantes'}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {chests.map((chest) => (
                <ChestCard
                  key={chest.id}
                  chest={chest}
                  isContestantBox={chest.id === contestantBoxId}
                  isOpening={openingChestId === chest.id}
                  canClick={
                    phase === 'pick_contestant_box'
                      ? !chest.isOpen
                      : phase === 'elimination' &&
                        !chest.isOpen &&
                        chest.id !== contestantBoxId &&
                        openingChestId === null
                  }
                  onClick={() => {
                    if (phase === 'pick_contestant_box') {
                      handleSelectContestantBox(chest.id);
                    } else if (phase === 'elimination') {
                      handleOpenChest(chest.id);
                    }
                  }}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: TV Prize Board */}
        <div className="lg:col-span-1">
          <PrizeBoard chests={chests} lang={lang} />
        </div>
      </div>

      {/* Banker Call Modal */}
      {phase === 'banker_offer' && (
        <BankerModal
          offerAmount={currentOffer}
          round={currentRoundIndex + 1}
          offerHistory={offerHistory}
          onAcceptDeal={handleAcceptDeal}
          onRejectDeal={handleRejectDeal}
          lang={lang}
        />
      )}

      {/* Final 2 Chests Standoff Modal */}
      {phase === 'final_swap' && contestantChest && (
        <FinalSwapModal
          contestantChest={contestantChest}
          otherChest={chests.find((c) => !c.isOpen && c.id !== contestantBoxId)!}
          onChooseKeep={handleKeepBox}
          onChooseSwap={handleSwapBox}
          lang={lang}
        />
      )}
    </div>
  );
};
