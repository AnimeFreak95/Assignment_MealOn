import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  Calendar,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BadgeCheck,
  ArrowRight
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audioDelight';

export default function WalletTab({
  credits = 14,
  setCredits,
  onNotify,
  triggerConfetti,
  paymentMode = 'prepaid',
  setPaymentMode
}) {
  const [safetyNetAccrued, setSafetyNetAccrued] = useState(50);
  const [expandedFaq, setExpandedFaq] = useState(false);

  // Compute 20-day pass validity window
  const passExpiryDate = new Date();
  passExpiryDate.setDate(passExpiryDate.getDate() + 20);
  const validityDateStr = passExpiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const totalPassCredits = 20;
  const progressPercent = Math.min(Math.round((credits / totalPassCredits) * 100), 100);

  // Simulate end of pass cycle expiry safety net
  const handleSimulatePassExpiry = () => {
    playSuccessChime();
    if (triggerConfetti) triggerConfetti();
    setSafetyNetAccrued((prev) => prev + 450); // 2 unused meals * ₹225
    if (onNotify) {
      onNotify(
        'Safety Net Triggered! 🛡️',
        '2 unconsumed meals converted to ₹450 MealsOn Balance (Valid on renewal).',
        'success'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5 max-w-lg mx-auto">
      {/* 1. HERO CARD: Active Meal Pass Quota */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[#064E3B] via-[#0B3D30] to-[#0F172A] text-white shadow-lg border border-emerald-500/30 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center shadow-xs">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
            Active Meal Pass
          </span>

          <span className="text-[10px] font-mono text-emerald-300/80 bg-white/10 px-2 py-0.5 rounded-md">
            #MO-8842
          </span>
        </div>

        {/* Big numbers + Progress Ring */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="text-[10px] font-bold text-emerald-200/90 uppercase tracking-wider">
              Remaining Meal Quota
            </div>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5 flex items-baseline gap-1.5">
              <span>{credits}</span>
              <span className="text-xs font-semibold text-emerald-300">/ {totalPassCredits} lunches in pack</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 font-medium">
              Corporate Thalis Tier • ₹250/meal cap
            </p>
          </div>

          {/* Clean Circular Gauge */}
          <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
            <svg className="w-18 h-18 transform -rotate-90">
              <circle
                cx="36"
                cy="36"
                r="28"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-700/60"
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r="28"
                stroke="#10B981"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 - (progressPercent / 100) * 2 * Math.PI * 28}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-black text-white">{progressPercent}%</span>
              <span className="text-[7.5px] text-emerald-300 font-bold uppercase">Left</span>
            </div>
          </div>
        </div>

        {/* Validity Footer Strip */}
        <div className="mt-3.5 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] relative z-10">
          <span className="flex items-center text-emerald-200 font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Valid for 20 calendar days
          </span>
          <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
            Until {validityDateStr}
          </span>
        </div>
      </div>

      {/* 2. WALLET CASH ACCOUNT (Rupee Balance) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                MealsOn Wallet Cash
              </span>
              <div className="text-xl font-black text-slate-900 leading-tight">
                ₹{safetyNetAccrued}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulatePassExpiry}
            className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Simulate end of 20-day pass refund"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Test Unused Refund</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          Wallet cash automatically discounts your next pass renewal or premium dish add-ons.
        </p>

        <div className="flex items-center gap-1.5 pt-0.5 text-[10px]">
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
            🎁 Spin Wheel Rewards
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
            🛡️ Safety Net Credits
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
            ✨ Never Expires
          </span>
        </div>
      </div>

      {/* 3. HOW SKIPS & VALIDITY WORK (Crystal Clear, Zero Jargon) */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
          <BadgeCheck className="w-4 h-4 text-emerald-600" />
          <span>How Skips & Quota Work</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Card 1: Daily Skip */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
              <span className="text-emerald-600 font-black">1.</span>
              <span>Daily Skips</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              Skipping before 10 PM preserves your meal in the pack. It is not consumed or wasted.
            </p>
            <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Quota Saved in Pack
            </span>
          </div>

          {/* Card 2: End of 20-Day Cycle */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
              <span className="text-emerald-600 font-black">2.</span>
              <span>Pass Expiry</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              If your 20 days expire with unused meals, they convert to ₹225/meal wallet cash on renewal.
            </p>
            <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Zero Money Lost
            </span>
          </div>
        </div>
      </div>

      {/* 4. PAYMENT MODE STATUS */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            paymentMode === 'prepaid' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900">
              {paymentMode === 'prepaid' ? 'Prepaid Meal Pass' : 'UPI AutoPay Mandate'}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {paymentMode === 'prepaid'
                ? 'Upfront discount locked • Quota saved on skips'
                : 'Pay-per-meal • ₹0 debited when you skip'}
            </div>
          </div>
        </div>

        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
          paymentMode === 'prepaid'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : 'bg-blue-50 text-blue-700 border-blue-300'
        }`}>
          Active
        </span>
      </div>

      {/* 5. RECENT PASS ACTIVITY LEDGER */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5">
        <h4 className="text-xs font-black text-slate-900 flex items-center justify-between">
          <span>Recent Activity</span>
          <span className="text-[10px] text-slate-400 font-normal">Last 5 events</span>
        </h4>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base">🥗</span>
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Thursday Lunch Delivered</p>
                <p className="text-[9px] text-slate-500">Paneer Makhani • 1:15 PM</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">-1 Lunch</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base">🛡️</span>
              <div>
                <p className="font-bold text-emerald-900 text-[11px]">Wednesday Meal Skipped</p>
                <p className="text-[9px] text-slate-500">Preserved in pack before 10 PM</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Quota Kept
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base">🎡</span>
              <div>
                <p className="font-bold text-amber-900 text-[11px]">Friday Roulette Reward</p>
                <p className="text-[9px] text-slate-500">Credited to wallet cash</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-600">+₹50 Cash</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base">📦</span>
              <div>
                <p className="font-bold text-slate-900 text-[11px]">20-Meal Pass Activated</p>
                <p className="text-[9px] text-slate-500">Corporate Thalis Tier (₹250/meal)</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">+20 Lunches</span>
          </div>
        </div>
      </div>

      {/* 6. CONCISE FAQ ACCORDION */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs">
        <button
          type="button"
          onClick={() => {
            playPop();
            setExpandedFaq(!expandedFaq);
          }}
          className="w-full flex items-center justify-between text-left py-0.5 text-xs font-bold text-slate-800 hover:text-[#10B981] transition-colors cursor-pointer"
        >
          <span className="flex items-center">
            <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Frequently Asked Questions
          </span>
          {expandedFaq ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {expandedFaq && (
          <div className="pt-2.5 space-y-2 text-[10px] text-slate-600 animate-in fade-in duration-150 border-t border-slate-100 mt-2">
            <div>
              <strong className="text-slate-800 block text-[11px]">What happens when I skip a meal?</strong>
              <p className="mt-0.5 text-slate-500">
                Your meal is not consumed. It stays in your pack, so you can have lunch on another weekday within your 20-day validity window.
              </p>
            </div>
            <div>
              <strong className="text-slate-800 block text-[11px]">What happens if my 20-day window expires?</strong>
              <p className="mt-0.5 text-slate-500">
                You never lose your money. Any leftover meals in your pack convert to wallet cash at ₹225/meal that applies automatically to your renewal.
              </p>
            </div>
            <div>
              <strong className="text-slate-800 block text-[11px]">Can I pause for vacations?</strong>
              <p className="mt-0.5 text-slate-500">
                Simply tap "Skip" on the days you will be away before the 10:00 PM cutoff. Your meal quota stays 100% intact.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
