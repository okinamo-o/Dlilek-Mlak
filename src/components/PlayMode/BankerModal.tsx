import React, { useEffect } from 'react';
import { Phone, CheckCircle2, XCircle, TrendingUp, History } from 'lucide-react';
import type { BankerOfferRecord, Language } from '../../types/game';
import { getTranslation } from '../../utils/translations';
import { sounds } from '../../utils/soundEffects';

interface BankerModalProps {
  offerAmount: number;
  round: number;
  offerHistory: BankerOfferRecord[];
  onAcceptDeal: () => void;
  onRejectDeal: () => void;
  lang: Language;
}

export const BankerModal: React.FC<BankerModalProps> = ({
  offerAmount,
  round,
  offerHistory,
  onAcceptDeal,
  onRejectDeal,
  lang,
}) => {
  const t = getTranslation(lang);

  useEffect(() => {
    // Start phone ring sound on mount
    sounds.startBankerRing();
    return () => {
      sounds.stopBankerRing();
    };
  }, []);

  const handleDeal = () => {
    sounds.stopBankerRing();
    sounds.playDealSound();
    onAcceptDeal();
  };

  const handleNoDeal = () => {
    sounds.stopBankerRing();
    sounds.playNoDealSound();
    onRejectDeal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-red-500/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-red-600/30 flex flex-col items-center text-center overflow-hidden">
        {/* Red Studio Spotlight Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Vintage Telephone Icon with Ringing Animation */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 text-white flex items-center justify-center shadow-2xl shadow-red-500/50 border-2 border-red-300 animate-phone-ring">
            <Phone className="w-10 h-10" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>

        {/* Header Title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black border border-red-500/40 mb-2">
          <span>{t.bankerTitle}</span>
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-slate-100 mb-1">
          {lang === 'ar' ? `عرض الجولة ${round}` : `Offre du Tour ${round}`}
        </h3>

        <p className="text-sm text-slate-400 max-w-md italic mb-5">
          {t.bankerQuote}
        </p>

        {/* Big Offer Display Box */}
        <div className="w-full bg-slate-950/90 border-2 border-amber-400/80 rounded-2xl p-5 mb-6 shadow-inner relative overflow-hidden group">
          <div className="text-xs font-bold text-amber-400/80 uppercase tracking-wider mb-1">
            {t.bankerOfferLabel}
          </div>
          <div className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 drop-shadow-md">
            {offerAmount.toLocaleString()}{' '}
            <span className="text-2xl md:text-3xl text-amber-400 font-bold">DT</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {t.dinars}
          </div>
        </div>

        {/* Deal or No Deal Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-5">
          {/* DEAL Button */}
          <button
            onClick={handleDeal}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg md:text-xl shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>{t.dealBtn}</span>
          </button>

          {/* NO DEAL Button */}
          <button
            onClick={handleNoDeal}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black text-lg md:text-xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-300"
          >
            <XCircle className="w-6 h-6" />
            <span>{t.noDealBtn}</span>
          </button>
        </div>

        {/* Offer History mini section */}
        {offerHistory.length > 0 && (
          <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.offerHistory}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {offerHistory.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 text-slate-500" />
                  <span>J{item.round}: {item.amount.toLocaleString()} DT</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
