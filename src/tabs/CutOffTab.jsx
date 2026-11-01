import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  RefreshCw,
  SkipForward,
  ShieldCheck,
  Flame,
  Star,
  MessageSquare,
  Smartphone,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  Leaf,
  ChefHat
} from 'lucide-react';
import { CUTOFF_ALTERNATIVES } from '../data/mockData';
import { playPop, playSuccessChime, playShieldBankChime } from '../utils/audioDelight';

export default function CutOffTab({
  playlist,
  setPlaylist,
  credits,
  setCredits,
  onNotify,
  triggerConfetti,
  triggerFloatingCredit,
  paymentMode = 'prepaid'
}) {
  const [viewMode, setViewMode] = useState('inapp'); // 'inapp' | 'whatsapp'
  const [demoTimePreset, setDemoTimePreset] = useState('open'); // 'open' | 'urgent' | 'locked'
  const [secondsRemaining, setSecondsRemaining] = useState(1 * 3600 + 48 * 60 + 12); // 01h : 48m : 12s
  const [showSwapCarousel, setShowSwapCarousel] = useState(false);
  const [tomorrowStatus, setTomorrowStatus] = useState('pending'); // 'pending' | 'confirmed' | 'swapped' | 'skipped'
  const [activeAlternativeId, setActiveAlternativeId] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(true);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  // Preset switcher handler
  const handleSetDemoPreset = (preset) => {
    playPop();
    setDemoTimePreset(preset);
    if (preset === 'open') setSecondsRemaining(1 * 3600 + 55 * 60); // 8:05 PM (~1h 55m remaining)
    if (preset === 'urgent') setSecondsRemaining(4 * 60 + 45); // 9:55 PM (4m 45s remaining)
    if (preset === 'locked') setSecondsRemaining(0); // 10:01 PM (Cutoff passed, kitchen locked)
  };

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}h : ${mins}m : ${secs}s`;
  };

  // Tomorrow's meal
  const tomorrowDay = playlist[0];
  const tomorrowMeal = tomorrowDay.options[tomorrowDay.currentIdx];

  // Button 1: Keep Meal (Confirmed)
  const handleKeepMeal = () => {
    playSuccessChime();
    setTomorrowStatus('confirmed');
    setShowSwapCarousel(false);
    if (triggerConfetti) triggerConfetti();
    if (onNotify) {
      onNotify('Meal Confirmed! 🥗', 'Tomorrow lunch locked for fresh cooking.', 'success');
    }
  };

  // Button 2: 1-Tap Swap Dish selection
  const handleSelectSwapAlternative = (alt) => {
    playSuccessChime();
    setPlaylist((prev) => {
      const next = [...prev];
      const mon = { ...next[0] };
      mon.options = [
        {
          id: alt.id,
          name: alt.name,
          kitchen: alt.kitchen,
          rating: alt.rating,
          reviews: 280,
          price: alt.price,
          kcal: alt.kcal,
          protein: alt.protein,
          isVeg: true,
          tag: alt.tag,
          image: alt.image,
          desc: alt.desc
        },
        ...mon.options.filter((o) => o.id !== alt.id)
      ];
      mon.currentIdx = 0;
      next[0] = mon;
      return next;
    });

    setActiveAlternativeId(alt.id);
    setTomorrowStatus('swapped');
    setShowSwapCarousel(false);
    if (onNotify) {
      onNotify('Dish Swapped! 🔄', `Tomorrow lunch swapped to ${alt.name}.`, 'success');
    }
  };

  // Step 1: Open Skip Confirmation Bar instead of 1-click skipping
  const handleInitiateSkip = () => {
    playPop();
    setShowSwapCarousel(false);
    setShowSkipConfirmation(true);
  };

  // Step 2: Finalize Skip with explicit user confirmation
  const handleConfirmSkip = () => {
    playShieldBankChime();
    setTomorrowStatus('skipped');
    setShowSkipConfirmation(false);
    if (paymentMode === 'prepaid') {
      setCredits((prev) => prev + 1);
      if (triggerFloatingCredit) triggerFloatingCredit();
      if (onNotify) {
        onNotify(
          '₹190 Banked to Balance! 🛡️',
          'Prepaid meal preserved in MealsOn Balance • Valid 60 days on renewal.',
          'warning'
        );
      }
    } else {
      // Mandate mode: ₹0 charged, 10 PM auto-debit canceled
      if (onNotify) {
        onNotify(
          '10 PM Debit Canceled! ⚡',
          '₹0 charged to your bank. No wallet credit issued since payment is per-meal.',
          'info'
        );
      }
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5">
      {/* Demo Clock Controller for Reviewers */}
      <div className="bg-slate-900/90 text-white rounded-xl p-2 flex items-center justify-between border border-slate-700 shadow-xs">
        <div className="flex items-center space-x-1.5">
          <span className="text-xs">⏰</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Demo Clock:</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleSetDemoPreset('open')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              demoTimePreset === 'open' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            8:05 PM (Open)
          </button>
          <button
            onClick={() => handleSetDemoPreset('urgent')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              demoTimePreset === 'urgent' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            9:55 PM (5m)
          </button>
          <button
            onClick={() => handleSetDemoPreset('locked')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              demoTimePreset === 'locked' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            10:01 PM (Locked)
          </button>
        </div>
      </div>

      {/* 1. Channel Switcher (Glanceable) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Channel Preview (8 PM Check-In)
          </span>

          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60 text-[10px] font-bold">
            <button
              onClick={() => {
                playPop();
                setViewMode('inapp');
              }}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all ${
                viewMode === 'inapp'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>In-App</span>
            </button>
            <button
              onClick={() => {
                playPop();
                setViewMode('whatsapp');
              }}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all ${
                viewMode === 'whatsapp'
                  ? 'bg-[#25D366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Preview Card */}
        {viewMode === 'whatsapp' ? (
          <div className="bg-[#EFEAE2] rounded-2xl p-2.5 border border-emerald-700/20 shadow-sm relative overflow-hidden animate-in fade-in duration-200">
            <div className="bg-[#075E54] -mx-2.5 -mt-2.5 p-2 px-3 text-white flex items-center justify-between text-xs font-semibold mb-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[9px]">
                  MO
                </div>
                <span className="text-[11px]">MealsOn Concierge</span>
              </div>
              <span className="text-[9px] text-emerald-200">8:00 PM</span>
            </div>

            <div className="bg-white rounded-lg p-2.5 shadow-xs border border-slate-200 text-xs text-slate-800 space-y-1.5">
              <p className="font-bold text-slate-900 text-xs">
                🔔 Tomorrow's Lunch Check-In
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                🥗 <strong>{tomorrowMeal.name}</strong> • Cyber Park (1:00 PM – 1:30 PM Pod)
              </p>
              <p className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-1 rounded">
                ⏳ Modify or skip before 10:00 PM cutoff
              </p>

              {/* Quick Action Buttons (Opt-out Exception Flow) */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  onClick={() => {
                    playPop();
                    setShowSwapCarousel(true);
                  }}
                  className="py-1.5 px-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[11px] transition-all active:scale-95 text-center flex items-center justify-center space-x-1"
                >
                  <span>🔄</span>
                  <span>Swap Dish</span>
                </button>
                <button
                  onClick={handleInitiateSkip}
                  className="py-1.5 px-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] transition-all active:scale-95 text-center flex items-center justify-center space-x-1"
                >
                  <span>⏭️</span>
                  <span>{paymentMode === 'prepaid' ? 'Skip & Bank' : 'Skip (₹0)'}</span>
                </button>
              </div>
              <p className="text-[9px] text-slate-500 text-center italic">
                ✓ Auto-locks at 10 PM. No action needed if you love this meal!
              </p>
            </div>
          </div>
        ) : (
          /* In-App Push Banner */
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2.5 border border-slate-700 shadow-md flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-[#FF5A1F] flex items-center justify-center shrink-0 text-white font-bold text-[10px]">
                MO
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  Tomorrow: {tomorrowMeal.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  Office • 1:00 PM – 1:30 PM Window. Cut-off at 10:00 PM.
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-amber-400 bg-amber-950/70 border border-amber-600/50 px-1.5 py-0.5 rounded">
              8:00 PM
            </span>
          </div>
        )}
      </div>

      {/* 2. Cut-Off Action Card (High Scannability) */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        {/* Live Ticking Countdown Badge */}
        <div className="bg-[#FFFBEB] border border-[#F59E0B]/40 rounded-xl p-2 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-xs font-bold text-amber-950">
              Cut-off: <strong className="font-mono">{formatCountdown(secondsRemaining)}</strong>
            </span>
          </div>
          <span className="text-[9px] font-extrabold bg-[#F59E0B] text-white px-2 py-0.5 rounded-full uppercase">
            Locks 10 PM
          </span>
        </div>

        {/* Tomorrow's Meal Card */}
        <div
          className={`p-3 rounded-2xl border transition-all ${
            tomorrowStatus === 'confirmed'
              ? 'bg-[#ECFDF5] border-[#10B981] ring-2 ring-[#10B981]/20'
              : tomorrowStatus === 'swapped'
              ? 'bg-[#FFF5F0] border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20'
              : tomorrowStatus === 'skipped'
              ? 'bg-slate-100 border-slate-300 opacity-75'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Tomorrow's Lunch (Mon)
            </span>

            {tomorrowStatus === 'swapped' ? (
              <span className="text-[9px] font-extrabold bg-[#FF5A1F] text-white px-2 py-0.5 rounded-full flex items-center">
                <RefreshCw className="w-2.5 h-2.5 mr-0.5" /> Swapped
              </span>
            ) : tomorrowStatus === 'skipped' ? (
              <span className="text-[9px] font-extrabold bg-slate-600 text-white px-2 py-0.5 rounded-full flex items-center">
                <SkipForward className="w-2.5 h-2.5 mr-0.5" /> Skipped
              </span>
            ) : (
              <span className="text-[9px] font-extrabold bg-[#10B981] text-white px-2 py-0.5 rounded-full flex items-center shadow-2xs">
                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Auto-Confirmed
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-3xl select-none">{tomorrowMeal.image}</span>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-900 leading-tight">
                {tomorrowMeal.name}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {tomorrowMeal.kitchen} • <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" /> {tomorrowMeal.rating}
              </p>

              {/* Macro Pills */}
              <div className="flex items-center space-x-1 mt-1.5">
                <span className="text-[9px] font-bold bg-[#ECFDF5] text-[#10B981] px-1.5 py-0.2 rounded-full border border-[#10B981]/20">
                  Veg
                </span>
                <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                  {tomorrowMeal.kcal} kcal
                </span>
                <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded-full border border-amber-200">
                  {tomorrowMeal.protein}g Protein
                </span>
                <span className="text-[9px] font-extrabold text-[#FF5A1F] ml-auto">
                  ₹{tomorrowMeal.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Post-10 PM Kitchen Lockout Banner */}
        {secondsRemaining === 0 ? (
          <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-center space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-center space-x-1.5 text-xs font-black text-red-950">
              <span>🔒 10:00 PM Cut-Off Reached</span>
            </div>
            <p className="text-[10px] text-red-800">
              Orders locked for morning wholesale procurement. Swaps and skips closed for tomorrow.
            </p>
          </div>
        ) : (
          /* 2 Exception Action Buttons (Zero-Friction Auto-Lock) */
          <div className="space-y-1.5 pt-0.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  playPop();
                  setShowSwapCarousel(!showSwapCarousel);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-[0.97] cta-bounce ${
                  showSwapCarousel
                    ? 'bg-[#FF5A1F] text-white shadow-sm'
                    : 'bg-[#FFF5F0] hover:bg-[#FFE6DC] text-[#FF5A1F] border border-[#FF5A1F]/40'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Swap Dish</span>
              </button>

              <button
                onClick={handleInitiateSkip}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-[0.97] cta-bounce ${
                  tomorrowStatus === 'skipped'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : showSkipConfirmation
                    ? 'bg-amber-200 text-amber-950 border-2 border-amber-500 ring-2 ring-amber-400/30'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>{tomorrowStatus === 'skipped' ? 'Meal Skipped' : paymentMode === 'prepaid' ? 'Skip & Bank ₹190' : 'Skip & Pay ₹0'}</span>
              </button>
            </div>

            {/* Zero-Effort Subscription Assurance Subtext */}
            <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-500 font-medium pt-0.5">
              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
              <span>Auto-locks at 10 PM. No action needed if you want this lunch!</span>
            </div>
          </div>
        )}

        {/* Interactive Confirmation Bar (Transparent Pre-Skip Breakdown) */}
        {showSkipConfirmation && tomorrowStatus !== 'skipped' && (
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 border-2 border-amber-400/80 rounded-2xl p-3 space-y-2.5 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header with Title and Dismiss */}
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/70">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm">🛡️</span>
                <span className="text-xs font-black text-amber-950">
                  Confirm Skip: {tomorrowMeal.name}
                </span>
              </div>
              <button
                onClick={() => {
                  playPop();
                  setShowSkipConfirmation(false);
                }}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-white/70 hover:bg-white rounded-md px-1.5 py-0.5 border border-slate-200 transition-colors"
              >
                ✕ Cancel
              </button>
            </div>

            {/* Information Grid: What happens when you skip */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-white/90 rounded-xl p-2 border border-amber-200/60 shadow-2xs">
                <span className="font-extrabold text-amber-900 block flex items-center">
                  💵 Financial Action
                </span>
                <p className="text-slate-700 mt-0.5 leading-snug">
                  {paymentMode === 'prepaid' ? (
                    <>
                      <strong>+₹190</strong> added to MealsOn Balance immediately.
                    </>
                  ) : (
                    <>
                      <strong>₹0 Charged</strong>. 10 PM UPI debit is canceled.
                    </>
                  )}
                </p>
              </div>

              <div className="bg-white/90 rounded-xl p-2 border border-amber-200/60 shadow-2xs">
                <span className="font-extrabold text-amber-900 block flex items-center">
                  ⏳ Cut-Off Deadline
                </span>
                <p className="text-slate-700 mt-0.5 leading-snug">
                  Locks at <strong>10:00 PM</strong> tonight. Kitchen prep starts at 6 AM.
                </p>
              </div>

              <div className="bg-white/90 rounded-xl p-2 border border-amber-200/60 shadow-2xs">
                <span className="font-extrabold text-amber-900 block flex items-center">
                  🔄 Rollover Policy
                </span>
                <p className="text-slate-700 mt-0.5 leading-snug">
                  {paymentMode === 'prepaid'
                    ? 'Valid 60 days on pass renewal (up to 25% off invoice).'
                    : 'No credit balance since payment is per-meal.'}
                </p>
              </div>

              <div className="bg-white/90 rounded-xl p-2 border border-amber-200/60 shadow-2xs">
                <span className="font-extrabold text-amber-900 block flex items-center">
                  🔁 Can I Undo?
                </span>
                <p className="text-slate-700 mt-0.5 leading-snug">
                  You can restore or swap until <strong>10:00 PM</strong> tonight.
                </p>
              </div>
            </div>

            {/* Action Bar inside Confirmation */}
            <div className="flex items-center space-x-2 pt-0.5">
              <button
                onClick={() => {
                  playPop();
                  setShowSkipConfirmation(false);
                }}
                className="flex-1 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all active:scale-[0.97]"
              >
                Keep My Lunch
              </button>

              <button
                onClick={handleConfirmSkip}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-sm transition-all active:scale-[0.97] flex items-center justify-center space-x-1 cta-bounce"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>
                  {paymentMode === 'prepaid' ? 'Confirm & Bank ₹190' : 'Confirm & Pay ₹0'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Skipped Banner */}
        {tomorrowStatus === 'skipped' && (
          <div className={`rounded-xl p-2.5 text-xs border animate-in fade-in duration-200 ${
            paymentMode === 'prepaid'
              ? 'bg-[#ECFDF5] border-[#10B981] text-emerald-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className={`w-4 h-4 shrink-0 ${paymentMode === 'prepaid' ? 'text-[#10B981]' : 'text-blue-600'}`} />
              <span>
                {paymentMode === 'prepaid'
                  ? '₹190 Saved in MealsOn Balance • Valid 60 days on pass renewal'
                  : '10:00 PM Auto-Debit Canceled • ₹0 charged to bank (No credit needed)'}
              </span>
            </div>
          </div>
        )}

        {/* Inline Swap Carousel */}
        {showSwapCarousel && (
          <div className="pt-1.5 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Equal-value replacements (₹190)
            </span>

            <div className="space-y-1.5">
              {CUTOFF_ALTERNATIVES.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => handleSelectSwapAlternative(alt)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-[#FF5A1F] hover:bg-[#FFF5F0]/50 transition-all cursor-pointer flex items-center justify-between active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl select-none">{alt.image}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{alt.name}</h4>
                      <p className="text-[9px] text-slate-500">{alt.kitchen} • {alt.kcal} kcal • {alt.protein}g P</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-white bg-[#FF5A1F] px-2 py-0.5 rounded shadow-xs">
                    Swap
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. 10 PM FAQ: Compact Visual Breakdown (Low Text, High Clarity) */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2">
        <button
          onClick={() => {
            playPop();
            setExpandedFaq(!expandedFaq);
          }}
          className="w-full flex items-center justify-between text-left py-0.5 text-xs font-bold text-slate-800 hover:text-[#FF5A1F] transition-colors"
        >
          <span className="flex items-center">
            <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-[#FF5A1F]" />
            Why a 10 PM cut-off?
          </span>
          {expandedFaq ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {expandedFaq && (
          <div className="pt-1 space-y-2 animate-in fade-in duration-150">
            {/* Visual 2-Stat Row */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#ECFDF5] border border-emerald-200 rounded-xl p-2">
                <span className="text-base">🥗</span>
                <div className="text-[11px] font-extrabold text-emerald-950 mt-0.5">&lt;3% Food Waste</div>
                <div className="text-[9px] text-emerald-800">Cuts 28% waste via 10 PM lock</div>
              </div>

              <div className="bg-[#FFF5F0] border border-[#FF5A1F]/30 rounded-xl p-2">
                <span className="text-base">🛡️</span>
                <div className="text-[11px] font-extrabold text-slate-900 mt-0.5">100% Rollover</div>
                <div className="text-[9px] text-slate-600">Zero penalty on skipped meals</div>
              </div>
            </div>

            {/* Micro Pipeline */}
            <div className="grid grid-cols-3 gap-1 text-center text-[9px] bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-slate-600">
              <div><strong className="text-amber-800 block">10:00 PM</strong> Lock-In</div>
              <div><strong className="text-emerald-800 block">6:00 AM</strong> Batch Cook</div>
              <div><strong className="text-[#FF5A1F] block">12:30–2:00 PM</strong> 30m Waves</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
