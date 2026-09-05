import React from 'react';
import { DollarSign, Gift, Edit3 } from 'lucide-react';
import { parsePrizeNumericValue } from '../../utils/gameRules';
import type { Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';

interface ChestInputCardProps {
  index: number;
  chestNumber: number;
  label: string;
  numericOverride: number | null;
  onChangeLabel: (newLabel: string) => void;
  onChangeNumericOverride: (val: number | null) => void;
  lang: Language;
}

export const ChestInputCard: React.FC<ChestInputCardProps> = ({
  chestNumber,
  label,
  numericOverride,
  onChangeLabel,
  onChangeNumericOverride,
  lang,
}) => {
  const t = getTranslation(lang);
  const autoParsed = parsePrizeNumericValue(label);
  const effectiveValue = numericOverride !== null ? numericOverride : autoParsed;
  const [isEditingOverride, setIsEditingOverride] = React.useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 shadow-md hover:border-amber-500/50 transition-all flex flex-col gap-2.5 relative group">
      {/* Header with Chest Number Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-md border border-amber-300">
            {chestNumber}
          </div>
          <span className="text-xs font-bold text-slate-300">
            {t.chestNumber} {chestNumber}
          </span>
        </div>

        {/* Value Tag Badge */}
        {effectiveValue !== null && effectiveValue > 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <DollarSign className="w-3 h-3" />
            {effectiveValue.toLocaleString()} DT
          </span>
        ) : effectiveValue === 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            0 DT
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            <Gift className="w-3 h-3 text-rose-400" />
            {lang === 'ar' ? 'هدية عينية' : 'Cadeau'}
          </span>
        )}
      </div>

      {/* Main Free-Text Prize Input */}
      <div className="relative">
        <input
          type="text"
          value={label}
          onChange={(e) => {
            onChangeLabel(e.target.value);
            // If user typed a value with auto-parsed number, reset manual override
            if (numericOverride !== null) {
              onChangeNumericOverride(null);
            }
          }}
          placeholder={t.prizePlaceholder}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-colors font-medium"
        />
      </div>

      {/* Optional Custom Value Adjuster */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
        <span className="truncate">
          {effectiveValue !== null
            ? `${t.detectedNumeric} ${effectiveValue.toLocaleString()} DT`
            : t.noNumeric}
        </span>
        
        <button
          type="button"
          onClick={() => setIsEditingOverride(!isEditingOverride)}
          className="text-amber-400 hover:text-amber-300 underline text-[11px] flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
          title="تعديل القيمة المحسوبة للبنكار يدوياً"
        >
          <Edit3 className="w-3 h-3" />
          {isEditingOverride ? (lang === 'ar' ? 'إغلاق' : 'Fermer') : (lang === 'ar' ? 'تعديل DT' : 'Ajuster')}
        </button>
      </div>

      {/* Override Value Input Modal/Flyout */}
      {isEditingOverride && (
        <div className="mt-1 bg-slate-950/95 border border-amber-500/40 rounded-lg p-2 flex items-center gap-2 text-xs">
          <span className="text-slate-300 shrink-0">DT:</span>
          <input
            type="number"
            min="0"
            step="10"
            value={effectiveValue !== null ? effectiveValue : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Math.max(0, parseFloat(e.target.value));
              onChangeNumericOverride(val);
            }}
            placeholder="القيمة بالدينار"
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>
      )}
    </div>
  );
};
