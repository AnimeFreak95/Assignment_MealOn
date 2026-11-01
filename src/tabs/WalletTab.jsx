import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Plane,
  BadgeCheck
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audioDelight';

export default function WalletTab({ credits, setCredits, onNotify, triggerConfetti, paymentMode = 'prepaid' }) {
  const [vacationDays, setVacationDays] = useState(2);
  const [autoRolloverActive, setAutoRolloverActive] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(true);
  const [safetyNetAccrued, setSafetyNetAccrued] = useState(0);

  // Compute extended date based on base date + credits + vacation days
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 20 + vacationDays);
  const extendedDateStr = baseDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const totalPassCredits = 20;
  const progressPercent = Math.min(Math.round((credits / totalPassCredits) * 100), 100);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVacationDays(val);
    playPop();
  };

  const toggleAutoRollover = () => {
    const nextVal = !autoRolloverActive;
    setAutoRolloverActive(nextVal);
    playSuccessChime();
    if (onNotify) {
      onNotify(
        nextVal ? 'Auto-Rollover Guaranteed 🛡️' : 'Manual Mode',
        nextVal ? 'Unused meals at cycle end roll over automatically.' : 'Manual rollover activated.',
        'info'
      );
    }
  };

  // Simulate end of pass cycle expiry safety net
  const handleSimulatePassExpiry = () => {
    playSuccessChime();
    if (triggerConfetti) triggerConfetti();
    setSafetyNetAccrued((prev) => prev + 450); // 2 unused meals * ₹225
    if (onNotify) {
      onNotify(
        'Safety Net Triggered! 🛡️',
        '2 unconsumed meals converted to ₹450 MealsOn Balance (Valid 60 days on renewal).',
        'success'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5">
      {/* 1. Hero Card: Dynamic Meal Quota & Validity Ring */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[#064E3B] via-[#0b3d30] to-[#0F172A] text-white shadow-lg border border-emerald-500/30 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center shadow-xs">
            <ShieldCheck className="w-3 h-3 mr-1 text-[#10B981]" />
            Active Pass Horizon
          </span>

          <span className="text-[10px] font-medium text-emerald-200/70">
            #MO-8842
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold text-emerald-200/90 uppercase tracking-tight">
              Remaining Meal Quota (In Pack)
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
              {credits} <span className="text-sm font-semibold text-emerald-300">Meals</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Pass capacity: <strong>{credits} of {totalPassCredits}</strong> lunches active
            </p>
          </div>

          {/* Circular SVG Ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={32}
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-700/50"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={32}
                stroke="#10B981"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={2 * Math.PI * 32 - (progressPercent / 100) * 2 * Math.PI * 32}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-extrabold text-white">{credits}/20</span>
              <span className="text-[8px] text-emerald-300 font-semibold">In Pack</span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-emerald-200/90">
          <span className="flex items-center">
            <BadgeCheck className="w-3 h-3 mr-1 text-emerald-400" />
            Zero Breakage Guarantee
          </span>
          <span className="font-bold text-white">Buffer Valid to {extendedDateStr}</span>
        </div>
      </div>

      {/* 1.5 Educational Callout: Quota Preservation vs End-of-Cycle Safety Net */}
      <div className={`rounded-2xl p-3 border shadow-sm space-y-2.5 ${
        paymentMode === 'prepaid'
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-blue-50/70 border-blue-200 text-blue-950'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-extrabold text-xs">
            <span className="text-base select-none">{paymentMode === 'prepaid' ? '🛡️' : '⚡'}</span>
            <span>
              {paymentMode === 'prepaid'
                ? 'Prepaid Pass: Quota Preserved in Pack'
                : 'UPI Mandate: Zero-Debit Cancellation (₹0 Charged)'}
            </span>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
            paymentMode === 'prepaid'
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 text-white'
          }`}>
            {paymentMode === 'prepaid' ? 'Prepaid Active' : 'Mandate Active'}
          </span>
        </div>

        <p className="text-[11px] leading-relaxed opacity-90">
          {paymentMode === 'prepaid'
            ? 'When you skip a meal before 10:00 PM, your meal is NOT consumed. It stays in your pack, extending your runway +1 day into your 20-day buffer. The wallet credit is only given as a Safety Net if your 20-day validity window expires with unconsumed meals!'
            : 'Because you pay per-meal via UPI AutoPay, skipping a meal before 10:00 PM simply cancels that night\'s debit. ₹0 is deducted from your bank, so no wallet credit is needed.'}
        </p>

        <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
          <div className="bg-white/90 rounded-lg p-2 border border-slate-200/70 space-y-0.5">
            <span className="font-extrabold text-emerald-900 block">📅 Daily Skips</span>
            <span className="text-slate-600">Meal stays in pack (e.g. 14/20 left). Zero accounting friction.</span>
          </div>
          <div className="bg-white/90 rounded-lg p-2 border border-slate-200/70 space-y-0.5">
            <span className="font-extrabold text-emerald-900 block">🛡️ End of Pass (Day 20)</span>
            <span className="text-slate-600">Unused meals convert to ₹225/meal balance on renewal.</span>
          </div>
        </div>

        {/* Safety Net Balance Display & Simulation Button */}
        {paymentMode === 'prepaid' && (
          <div className="bg-white rounded-xl p-2.5 border border-emerald-300 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block font-semibold">End-of-Cycle Safety Net Balance:</span>
              <span className="font-black text-emerald-700 text-sm">
                ₹{safetyNetAccrued} <span className="text-[10px] font-normal text-slate-500">(from expired passes)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleSimulatePassExpiry}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-xs transition-all active:scale-95"
            >
              ⚡ Test Safety Net Expiry
            </button>
          </div>
        )}
      </div>

      {/* 2. Visual 10-Day Timeline & Vacation Slider */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        <h3 className="text-xs font-bold text-slate-900">
          10-Day Horizon & Rollover Track
        </h3>

        {/* Horizontal Track */}
        <div className="overflow-x-auto pb-1 hide-scrollbar">
          <div className="flex space-x-1.5 min-w-[480px]">
            {[1, 2].map((d) => (
              <div key={d} className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-1.5 text-center">
                <div className="text-[9px] font-bold text-emerald-800">D{d}</div>
                <div className="text-sm">✓</div>
                <div className="text-[8px] font-bold text-emerald-700">Delivered</div>
              </div>
            ))}
            {[3, 4].map((d) => (
              <div key={d} className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-1.5 text-center">
                <div className="text-[9px] font-bold text-amber-800">D{d}</div>
                <div className="text-sm">🛡️</div>
                <div className="text-[8px] font-bold text-amber-700">Shielded</div>
              </div>
            ))}
            {[5, 6, 7, 8].map((d) => (
              <div key={d} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-1.5 text-center">
                <div className="text-[9px] font-bold text-slate-700">D{d}</div>
                <div className="text-sm">📅</div>
                <div className="text-[8px] text-slate-500 font-semibold">Planned</div>
              </div>
            ))}
            {[9, 10].map((d) => (
              <div key={d} className="flex-1 bg-[#ECFDF5] border-2 border-[#10B981] rounded-xl p-1.5 text-center">
                <div className="text-[9px] font-extrabold text-emerald-900">D{d}</div>
                <div className="text-sm">🎁</div>
                <div className="text-[8px] font-extrabold text-[#10B981]">+Rollover</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rollover badge */}
        <div className="bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl p-2 flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold text-emerald-900 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 animate-ping" />
            +2 Free Rollover Days Added
          </span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
            ₹0 Fee
          </span>
        </div>

        {/* Vacation Pause Slider */}
        <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center">
              <Plane className="w-3 h-3 mr-1 text-[#FF5A1F]" />
              Vacation Pause Slider
            </span>
            <span className="text-xs font-extrabold text-[#FF5A1F] bg-[#FFF5F0] border border-[#FF5A1F]/30 px-2 py-0.2 rounded-full">
              {vacationDays} Days
            </span>
          </div>

          <div className="py-2 flex items-center">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              aria-label="Vacation pause days slider"
              value={vacationDays}
              onChange={handleSliderChange}
              className="w-full accent-[#FF5A1F] cursor-pointer h-2 min-h-[32px]"
            />
          </div>

          <div className="flex justify-between text-[9px] font-semibold text-slate-400">
            <span>1d</span>
            <span>2d</span>
            <span>3d</span>
            <span>4d</span>
            <span>5d</span>
          </div>

          <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-600">Buffer Valid Until:</span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              {extendedDateStr} (+{vacationDays}d Pause Shield)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Auto-Rollover Guarantee Toggle */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Auto-Rollover Guarantee
              </h4>
              <p className="text-[10px] text-slate-500">100% money protected</p>
            </div>
          </div>

          <button
            onClick={toggleAutoRollover}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 focus:outline-none cta-bounce ${
              autoRolloverActive ? 'bg-[#10B981]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                autoRolloverActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Concise FAQ */}
        <div className="border-t border-slate-100 pt-1.5">
          <button
            onClick={() => {
              playPop();
              setExpandedFaq(!expandedFaq);
            }}
            className="w-full flex items-center justify-between text-left py-0.5 text-xs font-bold text-slate-800 hover:text-[#10B981] transition-colors"
          >
            <span className="flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Pass Rules & Zero-Expiry
            </span>
            {expandedFaq ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {expandedFaq && (
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] animate-in fade-in duration-150">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-bold text-emerald-800 block">✓ Dynamic Buffer Window</span>
                Banked meals never expire during your pass.
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-bold text-emerald-800 block">✓ Instant Pause</span>
                Pause trips without losing subscription discounts.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
