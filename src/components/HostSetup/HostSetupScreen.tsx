import React, { useState } from 'react';
import { 
  Play, 
  Dices, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  ChevronDown, 
  Save, 
  FolderOpen, 
  Check, 
  AlertCircle,
  Coins
} from 'lucide-react';
import { ChestInputCard } from './ChestInputCard';
import type { Language, Chest } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { generateStarterPrizes, getPresetByCount, getGovernorate } from '../../utils/defaultPresets';
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

  const [labels, setLabels] = useState<string[]>(() => {
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

  const [chestCount, setChestCount] = useState<number>(() => labels.length);

  const [numericOverrides, setNumericOverrides] = useState<(number | null)[]>(() => 
    new Array(labels.length).fill(null)
  );

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Adjust count
  const handleCountChange = (newCount: number) => {
    const clamped = Math.max(4, Math.min(30, newCount));
    setChestCount(clamped);

    let newLabels = [...labels];
    if (clamped > newLabels.length) {
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
      showToast(lang === 'ar' ? `تم تحميل نموذج ${preset.count} صندوق!` : `Format ${preset.count} boîtes prêt !`);
    }
  };

  // Reset to original default 24
  const handleResetToOfficial = () => {
    sounds.playChestClick();
    handleLoadPreset(chestCount);
    showToast(lang === 'ar' ? 'تم استرجاع التشكيلة الرسمية!' : 'Prix officiels rétablis !', 'info');
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
        governorate: getGovernorate(idx + 1).nameAr,
      };
    });

    sounds.playRevealChime(true);
    onStartGame(finalChests);
  };

  // Compute stats
  const totalNumeric = labels.reduce((sum, label, idx) => {
    const val = numericOverrides[idx] !== null ? numericOverrides[idx] : parsePrizeNumericValue(label);
    return sum + (val || 0);
  }, 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl border text-sm font-bold flex items-center gap-2 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500'
                : toastMessage.type === 'info'
                ? 'bg-amber-950/95 text-amber-200 border-amber-500'
                : 'bg-rose-950/95 text-rose-200 border-rose-500'
            }`}
          >
            {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'info' && <Dices className="w-4 h-4 text-amber-400" />}
            {toastMessage.type === 'warn' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Hero Studio Launch Card */}
      <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-amber-500/30 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Ambient Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-black border border-amber-500/40 mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ar' ? 'استوديو دليلك ملاك الرسمي' : 'Studio Officiel Dlilek Mlak'}</span>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 drop-shadow-sm tracking-tight mb-3">
          {lang === 'ar' ? 'جاهز للمغامرة والتشويق؟' : 'Prêt pour le grand frisson ?'}
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed mb-8">
          {lang === 'ar'
            ? 'الجوائز الأصلية، الصناديق الـ 24، والبنكار في انتظارك. ابدأ اللعبة بضغطة زر واحدة!'
            : 'Les 24 boîtes cultes, le banquier et l\'ambiance du plateau sont prêts. Lancez la partie en un clic !'}
        </p>

        {/* Primary CTA Play Button */}
        <button
          onClick={handleLaunchGame}
          className="group relative inline-flex items-center justify-center gap-3.5 px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-lg md:text-xl font-black shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer border-2 border-amber-200"
        >
          <Play className="w-6 h-6 md:w-7 md:h-7 fill-slate-950 transition-transform group-hover:scale-110" />
          <span>
            {lang === 'ar' ? `ابدأ اللعبة الآن (${chestCount} صندوقاً)` : `Lancer la Partie (${chestCount} boîtes)`}
          </span>
        </button>

        {/* Feature Highlights Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400 mt-4 mb-8">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'تشكيلة الجوائز الرسمية جاهزة' : 'Prix officiels configurés'}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <Coins className="w-3.5 h-3.5" />
            {totalNumeric.toLocaleString()} DT {lang === 'ar' ? 'مجموع الجوائز' : 'en jeu'}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'أصوات وتأثيرات أصلية' : 'Effets sonores TV'}
          </span>
        </div>

        {/* Format Selector Bar */}
        <div className="w-full max-w-2xl bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-400 shrink-0">
            {lang === 'ar' ? 'عدد الصناديق:' : 'Nombre de boîtes :'}
          </span>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { count: 24, labelAr: '24 (الرسمية)', labelFr: '24 (Officiel)', badge: '⭐' },
              { count: 16, labelAr: '16 (سريع)', labelFr: '16 (Rapide)' },
              { count: 12, labelAr: '12 (إكسبرس)', labelFr: '12 (Express)' },
              { count: 9, labelAr: '9 (خفيف)', labelFr: '9 (Mini)' },
            ].map((preset) => (
              <button
                key={preset.count}
                onClick={() => {
                  handleCountChange(preset.count);
                  handleLoadPreset(preset.count);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  chestCount === preset.count
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                {preset.badge && <span>{preset.badge}</span>}
                <span>{lang === 'ar' ? preset.labelAr : preset.labelFr}</span>
              </button>
            ))}
          </div>

          {/* Quick Shuffle Action */}
          <button
            onClick={handleShuffle}
            className="px-3 py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            title={t.shuffleBtn}
          >
            <Dices className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'ar' ? 'خلط عشوائي' : 'Mélanger'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Advanced Customization Accordion */}
      <div className="w-full flex flex-col gap-4">
        {/* Accordion Trigger */}
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="w-full bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-4 transition-all flex items-center justify-between group cursor-pointer shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-500/40 transition-all">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="text-start">
              <div className="text-sm font-bold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                <span>{isCustomizing ? t.hideCustomizationBtn : t.customizePrizesBtn}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                  {chestCount} {t.chestsCountLabel}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {t.customizePrizesSub}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 group-hover:text-amber-400 transition-colors">
            <span className="text-xs font-semibold hidden sm:inline">
              {isCustomizing ? (lang === 'ar' ? 'إغلاق' : 'Fermer') : (lang === 'ar' ? 'تخصيص' : 'Personnaliser')}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isCustomizing ? 'rotate-180 text-amber-400' : ''}`} />
          </div>
        </button>

        {/* Expanded Customization Panel */}
        {isCustomizing && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-6 shadow-xl animate-in fade-in duration-200">
            {/* Action Bar inside panel */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                {/* Reset to official prizes */}
                <button
                  onClick={handleResetToOfficial}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.resetDefaults}</span>
                </button>

                {/* Custom Box Count Spinner */}
                <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">
                    {lang === 'ar' ? 'عدد مخصص (4-30):' : 'Personnalisé (4-30):'}
                  </span>
                  <input
                    type="number"
                    min="4"
                    max="30"
                    value={chestCount}
                    onChange={(e) => handleCountChange(parseInt(e.target.value) || 4)}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-center text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Save & Load Presets */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToLocalStorage}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.savePresetBtn}</span>
                </button>

                <button
                  onClick={handleLoadFromLocalStorage}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.loadPresetBtn}</span>
                </button>
              </div>
            </div>

            {/* Chest Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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

            {/* Launch Button at the bottom of customization */}
            <div className="pt-4 border-t border-slate-800 flex justify-center">
              <button
                onClick={handleLaunchGame}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer border border-amber-200"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>{lang === 'ar' ? `ابدأ اللعبة مع هذه التشكيلة (${chestCount} صندوقاً)` : `Lancer la partie (${chestCount} boîtes)`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
