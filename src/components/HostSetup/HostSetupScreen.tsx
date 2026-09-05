import React, { useState } from 'react';
import { 
  Dices, 
  Save, 
  FolderOpen, 
  Play, 
  Sparkles, 
  Coins, 
  Sliders, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { ChestInputCard } from './ChestInputCard';
import type { Language, Chest } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { generateStarterPrizes, getPresetByCount } from '../../utils/defaultPresets';
import { parsePrizeNumericValue } from '../../utils/gameRules';
import { sounds } from '../../utils/soundEffects';

interface HostSetupScreenProps {
  lang: Language;
  onStartGame: (chests: Chest[]) => void;
}

export const HostSetupScreen: React.FC<HostSetupScreenProps> = ({
  lang,
  onStartGame,
}) => {
  const t = getTranslation(lang);

  // Default to classic 24 chests
  const [chestCount, setChestCount] = useState<number>(24);
  const [labels, setLabels] = useState<string[]>(() => {
    // Try to load any saved current session or default preset
    const saved = localStorage.getItem('dlilek_current_prizes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return generateStarterPrizes(24);
  });

  const [numericOverrides, setNumericOverrides] = useState<(number | null)[]>(() => 
    new Array(labels.length).fill(null)
  );

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Adjust count
  const handleCountChange = (newCount: number) => {
    const clamped = Math.max(4, Math.min(30, newCount));
    setChestCount(clamped);

    let newLabels = [...labels];
    if (clamped > newLabels.length) {
      // Pad with starter prizes
      const extra = generateStarterPrizes(clamped).slice(newLabels.length);
      newLabels = [...newLabels, ...extra];
    } else if (clamped < newLabels.length) {
      newLabels = newLabels.slice(0, clamped);
    }
    setLabels(newLabels);

    const newOverrides = [...numericOverrides];
    if (clamped > newOverrides.length) {
      newOverrides.push(...new Array(clamped - newOverrides.length).fill(null));
    } else {
      newOverrides.splice(clamped);
    }
    setNumericOverrides(newOverrides);
  };

  // Load a preset template
  const handleLoadPreset = (count: number) => {
    const preset = getPresetByCount(count);
    if (preset) {
      setChestCount(preset.count);
      setLabels([...preset.prizes]);
      setNumericOverrides(new Array(preset.prizes.length).fill(null));
      showToast(lang === 'ar' ? `تم تحميل نموذج ${preset.count} صندوق!` : `Preset ${preset.count} boîtes chargé !`);
    }
  };

  // Label update
  const handleLabelChange = (index: number, val: string) => {
    const updated = [...labels];
    updated[index] = val;
    setLabels(updated);
  };

  // Numeric override update
  const handleNumericOverrideChange = (index: number, val: number | null) => {
    const updated = [...numericOverrides];
    updated[index] = val;
    setNumericOverrides(updated);
  };

  // Shuffle contents
  const handleShuffle = () => {
    sounds.playChestClick();
    // Combine label + override pairs and shuffle with Fisher-Yates
    const combined = labels.map((label, i) => ({
      label,
      override: numericOverrides[i] ?? null,
    }));

    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    setLabels(combined.map((c) => c.label));
    setNumericOverrides(combined.map((c) => c.override));
    showToast(t.shuffledAlert, 'info');
  };

  // Save to localStorage
  const handleSaveToLocalStorage = () => {
    try {
      const data = {
        count: chestCount,
        labels,
        numericOverrides,
        timestamp: Date.now(),
      };
      localStorage.setItem('dlilek_custom_preset', JSON.stringify(data));
      showToast(t.presetSaved, 'success');
    } catch {
      showToast('خطأ في حفظ البيانات', 'warn');
    }
  };

  // Load from localStorage
  const handleLoadFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem('dlilek_custom_preset');
      if (!raw) {
        showToast(t.noPresetFound, 'warn');
        return;
      }
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.labels) && data.labels.length >= 4) {
        setChestCount(data.labels.length);
        setLabels(data.labels);
        setNumericOverrides(data.numericOverrides || new Array(data.labels.length).fill(null));
        showToast(t.presetLoaded, 'success');
      } else {
        showToast(t.noPresetFound, 'warn');
      }
    } catch {
      showToast(t.noPresetFound, 'warn');
    }
  };

  // Prepare and Launch Game
  const handleLaunchGame = () => {
    // Save current state for continuity
    localStorage.setItem('dlilek_current_prizes', JSON.stringify(labels));

    const finalChests: Chest[] = labels.map((label, idx) => {
      const parsed = parsePrizeNumericValue(label);
      const effectiveNum = numericOverrides[idx] !== null ? numericOverrides[idx] : parsed;
      return {
        id: idx + 1,
        chestNumber: idx + 1,
        label: label.trim() || `${t.boxNumber} ${idx + 1}`,
        numericValue: effectiveNum,
        isOpen: false,
        isContestantBox: false,
      };
    });

    sounds.playRevealChime(true);
    onStartGame(finalChests);
  };

  // Compute stats for Host overview
  const totalNumeric = labels.reduce((sum, label, idx) => {
    const val = numericOverrides[idx] !== null ? numericOverrides[idx] : parsePrizeNumericValue(label);
    return sum + (val || 0);
  }, 0);

  const maxPrize = Math.max(
    0,
    ...labels.map((l, idx) => {
      const val = numericOverrides[idx] !== null ? numericOverrides[idx] : parsePrizeNumericValue(l);
      return val || 0;
    })
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl border text-sm font-bold flex items-center gap-2 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
                : toastMessage.type === 'info'
                ? 'bg-amber-950/90 text-amber-200 border-amber-500'
                : 'bg-rose-950/90 text-rose-200 border-rose-500'
            }`}
          >
            {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'info' && <Dices className="w-4 h-4 text-amber-400" />}
            {toastMessage.type === 'warn' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.hostMode}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100">
              {t.setupHeading}
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              {t.setupNotice}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-amber-500/20 rounded-xl p-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <div className="text-slate-400">{lang === 'ar' ? 'إجمالي الجوائز النقدية' : 'Cagnotte Totale'}</div>
              <div className="text-base font-black text-amber-400">
                {totalNumeric.toLocaleString()} DT
              </div>
              <div className="text-[11px] text-slate-500">
                {lang === 'ar' ? `أعلى جائزة: ${maxPrize.toLocaleString()} DT` : `Top: ${maxPrize.toLocaleString()} DT`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Presets Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col gap-4 shadow-lg">
        {/* Row 1: Chest Count Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              {t.presetPicks}
            </span>
            {[9, 12, 16, 20, 24, 26].map((num) => (
              <button
                key={num}
                onClick={() => {
                  handleCountChange(num);
                  handleLoadPreset(num);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  chestCount === num
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {num} {t.chestsCountLabel}
              </button>
            ))}
          </div>

          {/* Custom Count Spinner */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              {t.customCount}
            </span>
            <input
              type="number"
              min="4"
              max="30"
              value={chestCount}
              onChange={(e) => handleCountChange(parseInt(e.target.value) || 4)}
              className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-center text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Row 2: Action Buttons (Shuffle, Save, Load, Starter Preset) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Populate Classic Tunisian Prizes */}
            <button
              onClick={() => handleLoadPreset(chestCount)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="تعبئة الجوائز التونسية الكلاسيكية"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.loadTunisianPresets}</span>
            </button>

            {/* Shuffle Positions */}
            <button
              onClick={handleShuffle}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
              title="خلط ترتيب الجوائز عشوائياً"
            >
              <Dices className="w-4 h-4 text-purple-400" />
              <span>{t.shuffleBtn}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Preset */}
            <button
              onClick={handleSaveToLocalStorage}
              className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.savePresetBtn}</span>
            </button>

            {/* Load Preset */}
            <button
              onClick={handleLoadFromLocalStorage}
              className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.loadPresetBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chest Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {labels.map((label, idx) => (
          <ChestInputCard
            key={idx}
            index={idx}
            chestNumber={idx + 1}
            label={label}
            numericOverride={numericOverrides[idx]}
            onChangeLabel={(val) => handleLabelChange(idx, val)}
            onChangeNumericOverride={(val) => handleNumericOverrideChange(idx, val)}
            lang={lang}
          />
        ))}
      </div>

      {/* Bottom Sticky Action Banner to Launch Game */}
      <div className="sticky bottom-4 z-30 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-start">
          <div className="text-sm font-bold text-slate-200">
            {lang === 'ar' ? `جاهز للبدء مع ${chestCount} صندوقاً` : `Prêt à lancer avec ${chestCount} boîtes`}
          </div>
          <div className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'عند الضغط على ابدأ اللعبة، سيتم قفل الجوائز والانتقال لشاشة العرض واللعب.'
              : 'En lançant le jeu, les contenus seront verrouillés et la partie commencera.'}
          </div>
        </div>

        <button
          onClick={handleLaunchGame}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-base font-black tracking-wide shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-amber-200"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>{t.startGameBtn}</span>
        </button>
      </div>
    </div>
  );
};
