import React, { useState } from 'react';
import { Gift, Edit3, Check } from 'lucide-react';
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
  const [isEditingOverride, setIsEditingOverride] = useState(false);

  return (
    <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 shadow-sm transition-all flex flex-col gap-2">
      {/* Card Header: Box Number + Value Pill + Override Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black flex items-center justify-center text-xs">
            {chestNumber}
          </div>
          <span className="text-xs font-bold text-slate-300">
            {t.chestNumber} {chestNumber}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {effectiveValue !== null && effectiveValue > 0 ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {effectiveValue.toLocaleString()} DT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              <Gift className="w-2.5 h-2.5 text-rose-400" />
              <span>{lang === 'ar' ? 'هدية' : 'Cadeau'}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsEditingOverride(!isEditingOverride)}
            className="p-1 text-slate-400 hover:text-amber-400 transition-colors rounded hover:bg-slate-800"
            title={lang === 'ar' ? 'تعديل القيمة المحسوبة للبنكار' : 'Ajuster la valeur'}
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Prize Input */}
      <div>
        <input
          type="text"
          value={label}
          onChange={(e) => {
            onChangeLabel(e.target.value);
            if (numericOverride !== null) {
              onChangeNumericOverride(null);
            }
          }}
          placeholder={t.prizePlaceholder}
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
        />
      </div>

      {/* Pop-open Numeric Override (only when clicked) */}
      {isEditingOverride && (
        <div className="bg-slate-950 border border-amber-500/40 rounded-lg p-2 flex items-center gap-2 text-xs animate-in fade-in duration-150">
          <span className="text-slate-400 text-[11px] shrink-0">
            {lang === 'ar' ? 'قيمة البنكار (DT):' : 'Valeur banque (DT):'}
          </span>
          <input
            type="number"
            min="0"
            step="10"
            value={effectiveValue !== null ? effectiveValue : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Math.max(0, parseFloat(e.target.value));
              onChangeNumericOverride(val);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsEditingOverride(false)}
            className="p-1 rounded bg-amber-500 text-slate-950 hover:bg-amber-400"
          >
            <Check className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
