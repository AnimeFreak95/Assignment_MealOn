import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  HelpCircle,
  ArrowRight,
  Plane,
  BadgeCheck,
  RotateCcw
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audioDelight';

export default function WalletTab({ credits, setCredits, onNotify, triggerConfetti }) {
  const [vacationDays, setVacationDays] = useState(2);
  const [autoRolloverActive, setAutoRolloverActive] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(true);

  // Compute extended date based on base date + credits + vacation days
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 20 + vacationDays);
  const extendedDateStr = baseDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate circular SVG progress ring (assuming 20 total pass days, credits / 20)
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
        nextVal ? 'Auto-Rollover Guaranteed 🛡️' : 'Manual Claim Mode',
        nextVal ? 'Unused credits rollover automatically with 0 penalty.' : 'Manual rollover activated.',
        'info'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-4">
      {/* 1. Dynamic Credit Balance & Validity Ring Hero Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[#064E3B] via-[#0b3d30] to-[#0F172A] text-white shadow-lg border border-emerald-500/30 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#10B981]" />
            45-Day Flexible Pass • Zero Expiry Penalty
          </span>

          <span className="text-[10px] font-semibold text-emerald-200/80">
            Pass ID: #MO-8842
          </span>
        </div>

        {/* Balance & Progress Ring */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-tight">
              Live Pause Shield Balance
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
              {credits} <span className="text-base font-semibold text-emerald-300">Credits</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Worth <strong>₹{credits * 190}</strong> in full-value meal rollovers
            </p>
          </div>

          {/* Circular SVG Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-700/50"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#10B981"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-sm font-extrabold text-white">{credits} / 20</span>
              <span className="text-[9px] text-emerald-300 font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* Footer info pill */}
        <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-200/90">
          <span className="flex items-center">
            <BadgeCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            100% money back on unused meals
          </span>
          <span className="font-bold text-white flex items-center">
            Valid until {extendedDateStr}
          </span>
        </div>
      </div>

      {/* 2. Interactive Visual Timeline (10-Day Horizon View) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center">
              10-Day Plan Horizon & Rollover Extension
            </h3>
            <p className="text-[10px] text-slate-500">
              Never lose paid meals when plans change or work travel pops up
            </p>
          </div>
        </div>

        {/* 10-Day Horizontal Timeline Track */}
        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-1.5 min-w-[500px] py-1">
            {/* Days 1-2: Delivered */}
            {[1, 2].map((d) => (
              <div
                key={d}
                className="flex-1 bg-emerald-50 border border-emerald-300 rounded-xl p-2 text-center shadow-xs"
              >
                <div className="text-[10px] font-bold text-emerald-800">Day {d}</div>
                <div className="text-base my-0.5">✓</div>
                <div className="text-[9px] font-bold text-emerald-700">Delivered</div>
              </div>
            ))}

            {/* Days 3-4: Shielded / Skipped */}
            {[3, 4].map((d) => (
              <div
                key={d}
                className="flex-1 bg-amber-50 border border-amber-300 rounded-xl p-2 text-center shadow-xs"
              >
                <div className="text-[10px] font-bold text-amber-800">Day {d}</div>
                <div className="text-base my-0.5">🛡️</div>
                <div className="text-[9px] font-bold text-amber-700">Shielded</div>
              </div>
            ))}

            {/* Days 5-8: Scheduled */}
            {[5, 6, 7, 8].map((d) => (
              <div
                key={d}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-center"
              >
                <div className="text-[10px] font-bold text-slate-700">Day {d}</div>
                <div className="text-base my-0.5">📅</div>
                <div className="text-[9px] font-semibold text-slate-500">Scheduled</div>
              </div>
            ))}

            {/* Days 9-10: Rollover Added */}
            {[9, 10].map((d) => (
              <div
                key={d}
                className="flex-1 bg-[#ECFDF5] border-2 border-[#10B981] rounded-xl p-2 text-center shadow-xs animate-pulse"
              >
                <div className="text-[10px] font-bold text-emerald-900">Day {d}</div>
                <div className="text-base my-0.5">🎁</div>
                <div className="text-[9px] font-extrabold text-[#10B981] leading-tight">
                  +Rollover
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rollover badge callout */}
        <div className="bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl p-2 flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-emerald-900 flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5 animate-ping" />
            +2 Free Rollover Days Added Automatically
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
            ₹0 Fee
          </span>
        </div>

        {/* Interactive Simulate Travel / Vacation Pause Slider */}
        <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center">
              <Plane className="w-3.5 h-3.5 mr-1 text-[#FF5A1F]" />
              Simulate Travel / Vacation Pause
            </span>
            <span className="text-xs font-extrabold text-[#FF5A1F] bg-[#FFF5F0] border border-[#FF5A1F]/30 px-2.5 py-0.5 rounded-full shadow-xs">
              {vacationDays} Days Pause
            </span>
          </div>

          <p className="text-[10px] text-slate-500">
            Slide to simulate sudden out-of-town trips or client visits:
          </p>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={vacationDays}
            onChange={handleSliderChange}
            className="w-full accent-[#FF5A1F] cursor-pointer"
          />

          <div className="flex justify-between text-[9px] font-semibold text-slate-400 px-1">
            <span>1 Day</span>
            <span>2 Days</span>
            <span>3 Days</span>
            <span>4 Days</span>
            <span>5 Days</span>
          </div>

          {/* Dynamic Real-time Extension Readout */}
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between shadow-xs">
            <span className="text-[11px] font-medium text-slate-600">
              Subscription Extended Until:
            </span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {extendedDateStr} (+{vacationDays} Days)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Auto-Rollover Guarantee Toggle & Pass Protection Rules */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Auto-Rollover Unused Credits
              </h4>
              <p className="text-[10px] text-slate-500">
                100% money protected if you skip before 10 PM
              </p>
            </div>
          </div>

          <button
            onClick={toggleAutoRollover}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${
              autoRolloverActive ? 'bg-[#10B981]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                autoRolloverActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Pass Rollover Guarantee Accordion (Replaces the 10 PM Cutoff FAQ which was moved to Tab 3) */}
        <div className="border-t border-slate-100 pt-2">
          <button
            onClick={() => {
              playPop();
              setExpandedFaq(!expandedFaq);
            }}
            className="w-full flex items-center justify-between text-left py-1 text-xs font-bold text-slate-800 hover:text-[#10B981] transition-colors"
          >
            <span className="flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              How does the 45-Day Flexible Pass work?
            </span>
            {expandedFaq ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedFaq && (
            <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed space-y-1.5 animate-in fade-in duration-150">
              <p>
                <strong>Zero Commitment Anxiety:</strong> Standard tiffin models charge upfront and forfeit missed lunches. With MealsOn's <strong>Pause Shield</strong>, every skipped meal rolls over into your 45-day wallet bank.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                <div className="bg-white p-2 rounded border border-slate-200 text-slate-700">
                  <span className="font-bold text-emerald-800 block">✓ No Expiry Rush</span>
                  Use your banked credits whenever you're back in town.
                </div>
                <div className="bg-white p-2 rounded border border-slate-200 text-slate-700">
                  <span className="font-bold text-emerald-800 block">✓ 1-Tap Vacation Pause</span>
                  Pause entire weeks without losing subscription perks.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
