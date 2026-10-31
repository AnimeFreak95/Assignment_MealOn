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
  triggerFloatingCredit
}) {
  const [viewMode, setViewMode] = useState('inapp'); // 'inapp' | 'whatsapp'
  const [secondsRemaining, setSecondsRemaining] = useState(1 * 3600 + 48 * 60 + 12); // 01h : 48m : 12s
  const [showSwapCarousel, setShowSwapCarousel] = useState(false);
  const [tomorrowStatus, setTomorrowStatus] = useState('pending'); // 'pending' | 'confirmed' | 'swapped' | 'skipped'
  const [activeAlternativeId, setActiveAlternativeId] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(true);

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

  // Button 3: Skip & Bank Credit
  const handleSkipMeal = () => {
    playShieldBankChime();
    setTomorrowStatus('skipped');
    setShowSwapCarousel(false);
    setCredits((prev) => prev + 1);
    if (triggerFloatingCredit) triggerFloatingCredit();
    if (onNotify) {
      onNotify(
        'Credit Banked! 🛡️',
        '₹190 added to Pause Shield. Plan extended +1 day.',
        'warning'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5">
      {/* 1. Channel Switcher (Glanceable) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Channel Preview
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
                🥗 <strong>{tomorrowMeal.name}</strong> • Cyber Park (1:00 PM)
              </p>
              <p className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-1 rounded">
                ⏳ Modify or skip before 10:00 PM cutoff
              </p>

              {/* Quick Reply Buttons */}
              <div className="grid grid-cols-3 gap-1 pt-0.5">
                <button
                  onClick={handleKeepMeal}
                  className="py-1 px-1 rounded border border-[#25D366] bg-[#DCF8C6] text-emerald-950 font-bold text-[10px] transition-all active:scale-95 text-center truncate"
                >
                  ✅ Confirm
                </button>
                <button
                  onClick={() => {
                    playPop();
                    setShowSwapCarousel(true);
                  }}
                  className="py-1 px-1 rounded border border-slate-300 bg-slate-50 text-slate-800 font-bold text-[10px] transition-all active:scale-95 text-center truncate"
                >
                  🔄 Swap
                </button>
                <button
                  onClick={handleSkipMeal}
                  className="py-1 px-1 rounded border border-amber-300 bg-amber-50 text-amber-900 font-bold text-[10px] transition-all active:scale-95 text-center truncate"
                >
                  ⏭️ Skip
                </button>
              </div>
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
                  Office • 1:00 PM. Cut-off at 10:00 PM.
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

            {tomorrowStatus === 'confirmed' && (
              <span className="text-[9px] font-extrabold bg-[#10B981] text-white px-2 py-0.5 rounded-full flex items-center">
                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Confirmed
              </span>
            )}
            {tomorrowStatus === 'swapped' && (
              <span className="text-[9px] font-extrabold bg-[#FF5A1F] text-white px-2 py-0.5 rounded-full flex items-center">
                <RefreshCw className="w-2.5 h-2.5 mr-0.5" /> Swapped
              </span>
            )}
            {tomorrowStatus === 'skipped' && (
              <span className="text-[9px] font-extrabold bg-slate-600 text-white px-2 py-0.5 rounded-full flex items-center">
                <SkipForward className="w-2.5 h-2.5 mr-0.5" /> Skipped
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

        {/* 3 Interactive Action Buttons */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            onClick={handleKeepMeal}
            className={`py-2 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition-all active:scale-[0.96] cta-bounce ${
              tomorrowStatus === 'confirmed'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#10B981]/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm</span>
          </button>

          <button
            onClick={() => {
              playPop();
              setShowSwapCarousel(!showSwapCarousel);
            }}
            className="py-2 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 bg-[#FFF5F0] hover:bg-[#FFE6DC] text-[#FF5A1F] border border-[#FF5A1F]/40 transition-all active:scale-[0.96] cta-bounce"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Swap Dish</span>
          </button>

          <button
            onClick={handleSkipMeal}
            className={`py-2 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition-all active:scale-[0.96] cta-bounce ${
              tomorrowStatus === 'skipped'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip & Bank</span>
          </button>
        </div>

        {/* Skipped Banner */}
        {tomorrowStatus === 'skipped' && (
          <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-2.5 text-xs text-emerald-900 animate-in fade-in duration-200">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>₹190 Banked! Plan extended +1 day.</span>
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
                <div className="text-[11px] font-extrabold text-emerald-950 mt-0.5">0% Food Waste</div>
                <div className="text-[9px] text-emerald-800">Fresh night-before procurement</div>
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
              <div><strong className="text-emerald-800 block">6:00 AM</strong> Fresh Cook</div>
              <div><strong className="text-[#FF5A1F] block">12:30 PM</strong> Drop</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
