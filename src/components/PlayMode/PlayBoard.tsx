import React, { useState, useMemo } from 'react';
import type { Chest, GamePhase, Language, BankerOfferRecord, FinalOutcome } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { ChestCard } from './ChestCard';
import { PrizeColumn, getPrizeRank } from './PrizeBoard';
import { BankerModal } from './BankerModal';
import { FinalSwapModal } from './FinalSwapModal';
import { ResultScreen } from './ResultScreen';
import { getRoundSchedule, calculateBankerOffer } from '../../utils/gameRules';
import { sounds } from '../../utils/soundEffects';
import { Sparkles, Phone, Volume2, VolumeX, RotateCcw } from 'lucide-react';

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
  const [contestantBoxId, setContestantBoxId] = useState<number | null>(1); // Default to Box 1 like the reference game
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getIsMuted());

  // Elimination schedule & tracking
  const [schedule] = useState<number[]>(() => getRoundSchedule(initialChests.length));
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [chestsOpenedThisRound, setChestsOpenedThisRound] = useState<number>(0);
  const [openingChestId, setOpeningChestId] = useState<number | null>(null);

  // Banker offers & outcomes
  const [currentOffer, setCurrentOffer] = useState<number>(0);
  const [offerHistory, setOfferHistory] = useState<BankerOfferRecord[]>([]);
  const [finalOutcome, setFinalOutcome] = useState<FinalOutcome | null>(null);

  // Studio reaction banner (laughter, sad aww, standard)
  const [revealMood, setRevealMood] = useState<{ type: 'laugh' | 'sad' | 'standard'; message: string } | null>(null);

  // Derived state
  const contestantChest = chests.find((c) => c.id === contestantBoxId) || chests[0];
  const unopenedChests = chests.filter((c) => !c.isOpen);
  const currentTarget = schedule[currentRoundIndex] || 1;
  const remainingTargetForRound = Math.max(0, currentTarget - chestsOpenedThisRound);

  // Split all prizes into Left (Low & Gag) and Right (High & Jackpot) sorted by official TV rank
  const { leftChests, rightChests } = useMemo(() => {
    const sorted = [...chests].sort((a, b) => getPrizeRank(a) - getPrizeRank(b));
    const midpoint = Math.ceil(sorted.length / 2);
    return {
      leftChests: sorted.slice(0, midpoint),
      rightChests: sorted.slice(midpoint),
    };
  }, [chests]);

  // Stage chests (the chests on the floor excluding the contestant's lucky box)
  const stageChests = useMemo(() => {
    return chests.filter((c) => c.id !== contestantChest.id);
  }, [chests, contestantChest.id]);

  // Partition stage chests into 5 rows (Row 1: 4, Row 2: 5, Row 3: 5, Row 4: 5, Row 5: 4)
  const stageRows = useMemo(() => {
    if (stageChests.length === 23) {
      return [
        stageChests.slice(0, 4),   // Boxes 2..5
        stageChests.slice(4, 9),   // Boxes 6..10
        stageChests.slice(9, 14),  // Boxes 11..15
        stageChests.slice(14, 19), // Boxes 16..20
        stageChests.slice(19, 23), // Boxes 21..24
      ];
    }
    // Dynamic partitioning for other counts
    const total = stageChests.length;
    const numRows = Math.min(5, Math.ceil(total / 5));
    const rows: Chest[][] = [];
    const basePerRow = Math.floor(total / numRows);
    let rem = total % numRows;
    let offset = 0;

    for (let r = 0; r < numRows; r++) {
      const take = basePerRow + (rem > 0 ? 1 : 0);
      if (rem > 0) rem--;
      rows.push(stageChests.slice(offset, offset + take));
      offset += take;
    }
    return rows;
  }, [stageChests]);

  // 1. Contestant selects their lucky box
  const handleSelectContestantBox = (chestId: number) => {
    sounds.playChestClick();
    sounds.playRevealChime(true);

    const updated = chests.map((c) =>
      c.id === chestId ? { ...c, isContestantBox: true } : { ...c, isContestantBox: false }
    );
    setChests(updated);
    setContestantBoxId(chestId);
    setPhase('elimination');
  };

  // 2. Contestant opens an elimination chest
  const handleOpenChest = (chestId: number) => {
    if (phase !== 'elimination' || openingChestId !== null) return;

    const target = chests.find((c) => c.id === chestId);
    if (!target || target.isOpen || target.id === contestantBoxId) return;

    setOpeningChestId(chestId);
    sounds.playChestClick();
    sounds.playSuspenseRiser();

    setTimeout(() => {
      // High jackpots trigger the dramatic sad aww sound
      const isJackpot =
        (target.numericValue !== null && target.numericValue >= 50000) ||
        /مليار|سيارة|100\s*مليون|200\s*مليون|300\s*مليون|500\s*مليون|1\.000\.000|2\.000\.000/i.test(target.label);

      // Low / Blue prizes eliminated is great news for the contestant!
      const isLowOrGag =
        (target.numericValue !== null && target.numericValue <= 2000) ||
        /مخدة|فريت|فخذ|دجاج|كردونة|صباط|ماء|ساندوتش|فارغة|صفر|بوسة|0\.1|100\s*مليم/i.test(target.label);

      if (isJackpot) {
        sounds.playSadMusic();
        setRevealMood({
          type: 'sad',
          message: lang === 'ar'
            ? `😭 يا خسارة! طارت ${target.label} من اللعبة!`
            : `😭 Coup dur ! ${target.label} vient d'être éliminé !`
        });
      } else if (isLowOrGag) {
        // Audience cheers and applauds because eliminating low amounts protects the jackpots
        sounds.playHappyCrowd();
        setRevealMood({
          type: 'laugh',
          message: lang === 'ar'
            ? `👏 برافو! خرجت ${target.label} والفلوس الكبيرة ما زالت في اللعبة!`
            : `👏 Bravo ! ${target.label} est éliminé, les gros montants restent !`
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

      const remainingUnopened = updated.filter((c) => !c.isOpen);

      // Case A: 2 chests left in the game -> Final Swap
      if (remainingUnopened.length === 2) {
        setTimeout(() => {
          setPhase('final_swap');
        }, 900);
        return;
      }

      // Case B: Round target reached -> Banker calls
      if (newOpenedInRound >= currentTarget) {
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
    }, 1300);
  };

  // 3. Banker Offer Accepted (DEAL)
  const handleAcceptDeal = () => {
    const outcome: FinalOutcome = {
      type: 'deal',
      winLabel: `${currentOffer.toLocaleString()} DT`,
      winNumericValue: currentOffer,
      contestantOriginalBoxNumber: contestantChest.chestNumber,
      contestantOriginalBoxLabel: contestantChest.label,
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

    setCurrentRoundIndex((prev) => prev + 1);
    setChestsOpenedThisRound(0);
    setPhase('elimination');
  };

  // 5. Final Swap: Keep original box
  const handleKeepBox = () => {
    const other = chests.find((c) => !c.isOpen && c.id !== contestantBoxId);
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

  // 6. Final Swap: Swap with rival box
  const handleSwapBox = () => {
    const other = chests.find((c) => !c.isOpen && c.id !== contestantBoxId);
    if (!other) return;

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

  const toggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
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
    <div
      className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-cover bg-center overflow-x-hidden select-none"
      style={{
        backgroundImage: "url('/game_assets/studio_stage_bg.webp')",
      }}
    >
      {/* Studio dark blue spotlight overlay for optimal box visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-black/70 pointer-events-none" />

      {/* Top Header Controls & Round Status Banner */}
      <div className="relative z-20 w-full px-3 py-2 flex flex-wrap items-center justify-between gap-2 bg-black/60 backdrop-blur-sm border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          {phase === 'pick_contestant_box' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-200 font-bold text-xs sm:text-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {lang === 'ar'
                  ? 'اختر صندوقك المفضل للبدء في اللعبة'
                  : 'Sélectionnez votre boîte chanceuse'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar' ? `الجولة ${currentRoundIndex + 1}` : `Tour ${currentRoundIndex + 1}`}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-200">
                {lang === 'ar'
                  ? `افتح ${remainingTargetForRound} صندوق قبل مكالمة البنكاجي`
                  : `Ouvrez encore ${remainingTargetForRound} boîte(s)`}
              </span>
            </div>
          )}
        </div>

        {/* Reaction mood banner if active */}
        {revealMood && (
          <div
            className={`px-4 py-1 rounded-full border text-xs sm:text-sm font-black shadow-xl animate-bounce flex items-center gap-1.5 ${
              revealMood.type === 'laugh'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-100'
                : revealMood.type === 'sad'
                ? 'bg-rose-950 border-rose-500 text-rose-100'
                : 'bg-slate-900 border-amber-400 text-amber-200'
            }`}
          >
            <span>{revealMood.message}</span>
          </div>
        )}

        {/* Top-right action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={onNewGame}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-colors text-xs font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Main Authentic Stage Area */}
      <div
        dir="ltr"
        className="relative z-10 w-full flex-1 max-w-[1500px] mx-auto px-1 sm:px-3 py-2 flex items-stretch justify-between gap-1 sm:gap-3"
      >
        {/* Far Left: 12 Blue Metallic Low/Gag Prize Bars */}
        <div className="w-[110px] sm:w-[150px] md:w-[180px] lg:w-[220px] shrink-0 flex flex-col justify-center">
          <PrizeColumn chests={leftChests} isLeft={true} lang={lang} />
        </div>

        {/* Center Stage: The 5-row Pyramid of Boxes */}
        <div className="flex-1 flex flex-col items-center justify-between py-1 px-1">
          {/* The 5 Rows of Character Avatar Blue Boxes */}
          <div className="w-full flex flex-col items-center justify-center gap-1.5 sm:gap-3 my-auto">
            {stageRows.map((rowBoxes, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-nowrap"
              >
                {rowBoxes.map((box) => (
                  <ChestCard
                    key={box.id}
                    chest={box}
                    isContestantBox={false}
                    isOpening={openingChestId === box.id}
                    canClick={
                      phase === 'pick_contestant_box'
                        ? !box.isOpen
                        : phase === 'elimination' &&
                          !box.isOpen &&
                          openingChestId === null
                    }
                    onClick={() => {
                      if (phase === 'pick_contestant_box') {
                        handleSelectContestantBox(box.id);
                      } else if (phase === 'elimination') {
                        handleOpenChest(box.id);
                      }
                    }}
                    lang={lang}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Bottom Stage Floor: Left Podium (Lucky Box) + Right Studio Badge */}
          <div className="w-full flex items-end justify-between px-2 sm:px-6 pt-2">
            {/* Bottom-Left: The Illuminated Circular White Ring Podium with Box 1 */}
            <div className="flex flex-col items-center justify-center">
              <div
                className={`relative rounded-full border-[5px] sm:border-[6px] border-white bg-slate-950/70 p-2 sm:p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.95),inset_0_0_15px_rgba(255,255,255,0.5)] ${
                  phase === 'pick_contestant_box'
                    ? 'cursor-pointer hover:scale-105 hover:border-amber-300'
                    : ''
                }`}
                onClick={() => {
                  if (phase === 'pick_contestant_box') {
                    handleSelectContestantBox(contestantChest.id);
                  }
                }}
              >
                {/* Contestant Lucky Box Inside the Ring */}
                <div className="w-16 sm:w-20 md:w-24">
                  <img
                    src={`/game_assets/boxes/box_${contestantChest.chestNumber}.png`}
                    alt={`${t.boxNumber} ${contestantChest.chestNumber}`}
                    className="w-full h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </div>

              {/* Governorate Calligraphy Label under the podium ring (e.g. تونس) */}
              <span
                className="text-sm sm:text-base md:text-lg font-black mt-1 text-white"
                style={{
                  textShadow: '0 2px 4px #000, 0 -1px 2px #000, 1px 0 2px #000, -1px 0 2px #000',
                }}
              >
                {contestantChest.governorate || 'تونس'}
              </span>
            </div>

            {/* Bottom-Right: Official Dlilek Mlak Studio Badge */}
            <div className="flex items-end justify-end pointer-events-none pb-2">
              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl bg-slate-950/75 border border-amber-500/40 backdrop-blur-md shadow-2xl shadow-amber-500/20">
                <span
                  className="font-black text-amber-300 text-base sm:text-xl tracking-wider"
                  style={{ textShadow: '0 0 12px rgba(251,191,36,0.8), 0 2px 4px #000' }}
                >
                  دليلك ملاك
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-300 font-extrabold uppercase tracking-widest mt-0.5">
                  Dlilek Mlak Studio
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Far Right: 12 Metallic High / Jackpot Prize Bars (6 Tan, 4 Red, 2 Green) */}
        <div className="w-[110px] sm:w-[150px] md:w-[180px] lg:w-[220px] shrink-0 flex flex-col justify-center">
          <PrizeColumn chests={rightChests} isLeft={false} lang={lang} />
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
      {phase === 'final_swap' && (
        <FinalSwapModal
          contestantChest={contestantChest}
          otherChest={chests.find((c) => !c.isOpen && c.id !== contestantChest.id)!}
          onChooseKeep={handleKeepBox}
          onChooseSwap={handleSwapBox}
          lang={lang}
        />
      )}
    </div>
  );
};
