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
  ArrowRight,
  ExternalLink,
  Clock,
  AlertCircle
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

  // Compute 20-day pass validity window (Nov 22, 2026 based on Nov 2 base)
  const passExpiryDate = new Date();
  passExpiryDate.setDate(passExpiryDate.getDate() + 20);
  const passValidityStr = passExpiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  // Compute 60-day rolling cash expiry from Notion BID (Jan 1, 2027 based on Nov 2 base)
  const cashExpiryDate = new Date();
  cashExpiryDate.setDate(cashExpiryDate.getDate() + 60);
  const cashExpiryStr = cashExpiryDate.toLocaleDateString('en-US', {
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
        '2 unconsumed meals converted to ₹450 MealsOn Balance (Valid for 60 days on renewal).',
        'success'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5 max-w-md mx-auto animate-in fade-in duration-200">
      {/* 1. TOP SECTION: Screen Header + Payment Mode Switcher */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pass & Wallet
          </h1>
          <p className="text-[11px] font-medium text-slate-500">
            Active meal quota & rollover balance
          </p>
        </div>

        {setPaymentMode && (
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => {
                playPop();
                setPaymentMode('prepaid');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                paymentMode === 'prepaid'
                  ? 'bg-[#FF5A1F] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Prepaid Pass
            </button>
            <button
              type="button"
              onClick={() => {
                playPop();
                setPaymentMode('mandate');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                paymentMode === 'mandate'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              UPI Mandate
            </button>
          </div>
        )}
      </div>

      {/* 2. REPAIRED HERO CARD: Active Meal Pass Quota (Apple Wallet / CRED Design Language) */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[#064E3B] via-[#0B3D30] to-[#0F172A] text-white shadow-lg border border-emerald-500/30 relative overflow-hidden ring-1 ring-white/10">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full flex items-center shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            {paymentMode === 'prepaid' ? 'Active Prepaid Pass' : 'Active UPI Mandate'}
          </span>

          <span className="text-[10px] font-mono text-emerald-300/80 bg-white/10 px-2 py-0.5 rounded-md font-bold">
            #MO-8842
          </span>
        </div>

        {/* Big numbers + Calibrated 80px SVG Gauge (Fixed width/height & viewBox) */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="text-[10px] font-bold text-emerald-200/90 uppercase tracking-wider">
              Remaining Meal Quota
            </div>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5 flex items-baseline gap-1.5">
              <span>{credits}</span>
              <span className="text-xs font-semibold text-emerald-300">/ {totalPassCredits} lunches left</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 font-medium">
              Corporate Thalis Tier • ₹250/meal cap
            </p>
          </div>

          {/* Calibrated 80px Circular Gauge (Standard Tailwind w-20 h-20 with precise viewBox) */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800/80"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="#10B981"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={2 * Math.PI * 32 - (progressPercent / 100) * 2 * Math.PI * 32}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="text-sm font-black text-white leading-none">{credits}</span>
              <span className="text-[8px] text-emerald-300 font-extrabold uppercase tracking-tight mt-0.5">Left</span>
            </div>
          </div>
        </div>

        {/* Validity Footer Strip */}
        <div className="mt-3.5 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] relative z-10">
          <span className="flex items-center text-emerald-200 font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            20-Day Buffer Runway
          </span>
          <span className="font-extrabold text-white bg-white/10 px-2 py-0.5 rounded-md">
            Valid until {passValidityStr}
          </span>
        </div>
      </div>

      {/* 3. WALLET CASH ACCOUNT: Verified 60-Day Rolling Expiry & 25% Burn Cap from BID */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                MealsOn Wallet Cash
              </span>
              <div className="text-2xl font-black text-slate-900 leading-tight">
                ₹{safetyNetAccrued}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulatePassExpiry}
            className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Simulate end-of-cycle pass expiry safety net (+₹450)"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Test Refund (+₹450)</span>
          </button>
        </div>

        {/* Accurate BID Expiry Notice (Correcting "Never Expires" to 60-Day Rolling Expiry) */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 space-y-1.5 text-xs text-amber-950">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[11px] text-amber-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Valid Until: {cashExpiryStr}</span>
            </span>
            <span className="text-[9px] font-black uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
              60-Day Rolling Window
            </span>
          </div>
          <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
            As per BID policy, wallet balance expires in <strong>60 days</strong> but resets upon pass renewal. Offsets up to <strong>25%</strong> of your next pass invoice.
          </p>
        </div>

        {/* Breakdown chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px]">
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
            🎁 Spin Rewards (30d)
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
            🛡️ Safety Net (60d)
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
            🔔 WhatsApp Alerts at Day 45 & 55
          </span>
        </div>
      </div>

      {/* 4. HOW SKIPS & QUOTA WORK (Notion BID Section 2 & 6 Flow) */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 space-y-3">
        <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
          <BadgeCheck className="w-4 h-4 text-emerald-600" />
          <span>How Skips & Quota Work</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Card 1: Daily Skip */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-900">
              <span className="text-emerald-600">1.</span>
              <span>Daily Skips</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              {paymentMode === 'prepaid'
                ? 'Skipping before 10 PM preserves your meal in the pack. Not consumed or deducted.'
                : 'Skipping cancels that night’s auto-debit. ₹0 charged to your bank.'}
            </p>
            <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {paymentMode === 'prepaid' ? 'Quota Kept in Pack' : '₹0 Debited'}
            </span>
          </div>

          {/* Card 2: Pass Expiry */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-900">
              <span className="text-emerald-600">2.</span>
              <span>Pass Expiry</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              If your 20-day pass expires with unused meals, they convert to ₹225/meal cash with 60-day validity.
            </p>
            <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Zero Money Lost
            </span>
          </div>
        </div>
      </div>

      {/* 5. RECENT PASS ACTIVITY LEDGER (Apple Card Clean Transaction Style) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5">
        <h4 className="text-xs font-black text-slate-900 flex items-center justify-between">
          <span>Recent Activity</span>
          <span className="text-[10px] text-slate-400 font-normal">Last 4 events</span>
        </h4>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base select-none">🥗</span>
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Thursday Lunch Delivered</p>
                <p className="text-[9px] text-slate-500">Paneer Makhani • 1:15 PM</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">-1 Lunch</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base select-none">🛡️</span>
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
              <span className="text-base select-none">🎡</span>
              <div>
                <p className="font-bold text-amber-900 text-[11px]">Friday Roulette Reward</p>
                <p className="text-[9px] text-slate-500">Credited to wallet cash (30d expiry)</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-600">+₹50 Cash</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base select-none">📦</span>
              <div>
                <p className="font-bold text-slate-900 text-[11px]">20-Meal Pass Activated</p>
                <p className="text-[9px] text-slate-500">Corporate Thalis Tier (₹250/meal)</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">+20 Lunches</span>
          </div>
        </div>
      </div>

      {/* 6. NOTION BID FACT-CHECK & FAQ ACCORDION */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs space-y-2">
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
            Wallet Policy & Fact-Check Details
          </span>
          {expandedFaq ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {expandedFaq && (
          <div className="pt-2.5 space-y-2.5 text-[10px] text-slate-600 animate-in fade-in duration-150 border-t border-slate-100">
            <div>
              <strong className="text-slate-800 block text-[11px]">Why does wallet cash expire in 60 days?</strong>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                As detailed in the BID, indefinite cash balances create balance sheet debt liabilities and RBI escrow issues. A 60-day rolling window provides maximum subscriber flexibility while resetting whenever you renew your pass.
              </p>
            </div>
            <div>
              <strong className="text-slate-800 block text-[11px]">What is the 25% invoice offset cap?</strong>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                To guarantee that kitchen procurement and delivery logistics remain funded, wallet cash can offset up to 25% of any renewal invoice. Remaining balance rolls forward into a fresh 60-day window.
              </p>
            </div>
            <div className="pt-1">
              <a
                href="https://app.notion.com/p/5-Pause-Shield-Rollover-Wallet-Engine-40b80bcda12981a58fe1dbf4408af5dc"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF5A1F] hover:underline"
              >
                <span>View Full BID Specification in Notion</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
