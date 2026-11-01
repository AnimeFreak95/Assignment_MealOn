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
  ChefHat,
  Wallet,
  X
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
  paymentMode = 'prepaid',
  onNavigateTab
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

  // State for undo toast
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Restore lunch (Undo skip)
  const handleUndoSkip = () => {
    if (secondsRemaining === 0) return; // Undo not allowed after 10 PM lock
    playSuccessChime();
    setTomorrowStatus('confirmed');
    setShowUndoToast(false);
  };

  // Step 1: Open Skip Confirmation Sheet
  const handleInitiateSkip = () => {
    playPop();
    setShowSwapCarousel(false);
    setShowSkipConfirmation(true);
  };

  // Step 2: Finalize Skip with user confirmation (Quota Preserved in Pass)
  const handleConfirmSkip = () => {
    playShieldBankChime();
    setTomorrowStatus('skipped');
    setShowSkipConfirmation(false);
    // In Quota Preservation model, meal is NOT consumed from pass; quota stays intact in pack!
    if (triggerFloatingCredit) triggerFloatingCredit();
    setShowUndoToast(true);
    if (onNotify) {
      if (paymentMode === 'prepaid') {
        onNotify(
          'Meal Quota Preserved! 🛡️',
          'Tomorrow lunch skipped. Meal stays in your pass pack (runway extended +1 day).',
          'success'
        );
      } else {
        onNotify(
          '10 PM Debit Canceled! ⚡',
          '₹0 charged to your bank. No wallet credit needed.',
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
                  className="py-2.5 px-2 min-h-[44px] rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[11px] transition-all active:scale-95 text-center flex items-center justify-center space-x-1"
                >
                  <span>🔄</span>
                  <span>Swap Dish</span>
                </button>
                <button
                  onClick={handleInitiateSkip}
                  className="py-2.5 px-2 min-h-[44px] rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] transition-all active:scale-95 text-center flex items-center justify-center space-x-1"
                >
                  <span>⏭️</span>
                  <span>{paymentMode === 'prepaid' ? 'Skip (Preserve)' : 'Skip (₹0)'}</span>
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
              <span className="text-[9px] font-extrabold bg-slate-800 text-white px-2 py-0.5 rounded-full flex items-center shadow-2xs">
                {paymentMode === 'prepaid' ? 'Quota Preserved' : 'Debit Canceled'}
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
                <span>{tomorrowStatus === 'skipped' ? 'Meal Skipped' : paymentMode === 'prepaid' ? 'Skip (Preserve)' : 'Skip & Pay ₹0'}</span>
              </button>
            </div>

            {/* Zero-Effort Subscription Assurance Subtext */}
            <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-500 font-medium pt-0.5">
              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
              <span>Auto-locks at 10 PM. No action needed if you want this lunch!</span>
            </div>
          </div>
        )}

        {/* Skipped Status Banner */}
        {tomorrowStatus === 'skipped' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 animate-in fade-in duration-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700">
                {paymentMode === 'prepaid' ? 'Meal quota preserved in pass (Runway extended)' : '10:00 PM auto-debit canceled (₹0 charged)'}
              </span>
            </div>
            {secondsRemaining > 0 && (
              <button
                onClick={handleUndoSkip}
                className="text-[11px] font-bold text-[#FF5A1F] hover:underline px-2 py-0.5 active:scale-95 transition-all"
              >
                Undo
              </button>
            )}
          </div>
        )}

        {/* Inline Swap Carousel with Smart Swap Guarantee */}
        {showSwapCarousel && (
          <div className="pt-1.5 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center">
                <span className="mr-1">🎯</span> Smart Swap: Similar-Value Match
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                100% Plan Covered • ₹0 Extra
              </span>
            </div>

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
      {/* D-UX7: Short Bottom Sheet Skip Confirmation */}
      {showSkipConfirmation && tomorrowStatus !== 'skipped' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skip-sheet-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-2xs transition-all"
          onClick={() => {
            playPop();
            setShowSkipConfirmation(false);
          }}
        >
          <div
            className="w-full max-w-[420px] bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 space-y-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Header row */}
            <div className="flex items-center justify-between">
              <h3 id="skip-sheet-title" className="text-base font-bold text-slate-900">
                Skip tomorrow's lunch?
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  playPop();
                  setShowSkipConfirmation(false);
                }}
                className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Meal row */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 truncate pr-2">
                {tomorrowMeal.name}
              </span>
              <span className="text-xs font-extrabold text-[#C2410C] shrink-0">
                ₹{tomorrowMeal.price}
              </span>
            </div>

            {/* 3. Outcome & Undo Lines (Quota Preservation) */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
                <span className="font-medium">
                  {paymentMode === 'prepaid'
                    ? 'Meal is NOT consumed. It stays in your pass pack (runway extended +1 day).'
                    : '10:00 PM auto-debit canceled. ₹0 charged to your bank.'}
                </span>
              </div>

              {paymentMode === 'prepaid' && (
                <div className="flex items-center space-x-2 text-slate-600 bg-emerald-50/60 p-2 rounded-xl border border-emerald-200/50">
                  <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] leading-snug">
                    <strong>Zero-Waste Safety Net:</strong> Any unconsumed meals at the end of your 20-day validity convert to wallet balance at pass rate.
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-slate-500">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>You can undo this anytime until 10 PM tonight.</span>
              </div>
            </div>

            {/* 5. Primary button & 6. Text button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmSkip}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center cta-bounce"
              >
                {paymentMode === 'prepaid' ? 'Skip Lunch (Keep in Pass Pack)' : 'Skip Lunch (Cancel ₹0 Debit)'}
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  setShowSkipConfirmation(false);
                }}
                className="w-full min-h-[44px] py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Keep my lunch
              </button>
            </div>

            {/* 7. Optional rollover link */}
            {onNavigateTab && (
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setShowSkipConfirmation(false);
                    onNavigateTab('wallet');
                  }}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-700 underline"
                >
                  How rollover works
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* D-UX7: Toast Notification with Undo */}
      {showUndoToast && (
        <div
          role="status"
          className="fixed bottom-20 left-4 right-4 z-50 max-w-[390px] mx-auto animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700">
            <span className="text-xs font-semibold">
              ₹{tomorrowMeal.price} added to balance
            </span>
            {secondsRemaining > 0 && (
              <button
                type="button"
                onClick={handleUndoSkip}
                className="text-xs font-extrabold text-[#FF5A1F] hover:text-[#FFA07A] ml-3 px-2 py-1 rounded transition-colors active:scale-95"
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
