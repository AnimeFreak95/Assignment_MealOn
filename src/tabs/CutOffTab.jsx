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
  const [expandedFaq, setExpandedFaq] = useState(true); // 10 PM Cutoff FAQ accordion

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

  // Tomorrow's meal is Monday (index 0) or current state
  const tomorrowDay = playlist[0];
  const tomorrowMeal = tomorrowDay.options[tomorrowDay.currentIdx];

  // Button 1: Keep Meal (Confirmed) with Delight
  const handleKeepMeal = () => {
    playSuccessChime();
    setTomorrowStatus('confirmed');
    setShowSwapCarousel(false);
    if (triggerConfetti) triggerConfetti();
    if (onNotify) {
      onNotify('Meal Confirmed! 🥗', 'Tomorrow lunch is locked in for kitchen prep.', 'success');
    }
  };

  // Button 2: 1-Tap Swap Dish selection with Delight
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

  // Button 3: Skip & Bank Credit with Delight
  const handleSkipMeal = () => {
    playShieldBankChime();
    setTomorrowStatus('skipped');
    setShowSwapCarousel(false);
    setCredits((prev) => prev + 1);
    if (triggerFloatingCredit) triggerFloatingCredit();
    if (onNotify) {
      onNotify(
        '100% Meal Credit Rolled Over! 🛡️',
        '₹190 banked into your Pause Shield. Plan end-date extended +1 day.',
        'warning'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-4">
      {/* 1. Simulated Lock-Screen / WhatsApp Notification Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Simulated Channel Preview
          </span>

          {/* Toggle between In-App and WhatsApp */}
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
              <span>In-App Sheet</span>
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
              <span>WhatsApp View</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Preview Card */}
        {viewMode === 'whatsapp' ? (
          <div className="bg-[#EFEAE2] rounded-2xl p-3 border border-emerald-700/20 shadow-sm relative overflow-hidden animate-in fade-in duration-200">
            <div className="bg-[#075E54] -mx-3 -mt-3 p-2 px-3 text-white flex items-center justify-between text-xs font-semibold mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                  MO
                </div>
                <span>MealsOn Concierge • Verified</span>
              </div>
              <span className="text-[10px] text-emerald-200">8:00 PM</span>
            </div>

            {/* Chat Bubble */}
            <div className="bg-white rounded-lg p-3 shadow-xs border border-slate-200 text-xs text-slate-800 space-y-2">
              <p className="font-semibold text-slate-900 leading-snug">
                🔔 <strong>MealsOn 8:00 PM Check-In</strong>
              </p>
              <p className="text-[11px] text-slate-600">
                Hi Sachin! Tomorrow’s scheduled lunch is:
                <br />
                🥗 <strong>{tomorrowMeal.name}</strong> from {tomorrowMeal.kitchen}
                <br />
                📍 Delivering to <strong>Cyber Park Tower B (1:00 PM)</strong>
              </p>
              <p className="text-[10px] text-amber-700 font-semibold bg-amber-50 p-1.5 rounded border border-amber-200">
                ⏳ Modify before 10:00 PM cut-off. Skip with zero penalty.
              </p>

              {/* WhatsApp Quick Reply Buttons */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={handleKeepMeal}
                  className="w-full text-center py-1.5 px-3 rounded-md border border-[#25D366] bg-[#DCF8C6] hover:bg-[#cbf4b1] text-emerald-900 font-bold text-[11px] transition-all active:scale-95"
                >
                  ✅ Confirm Delivery
                </button>
                <button
                  onClick={() => {
                    playPop();
                    setShowSwapCarousel(true);
                  }}
                  className="w-full text-center py-1.5 px-3 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-[11px] transition-all active:scale-95"
                >
                  🔄 Swap Tomorrow's Dish
                </button>
                <button
                  onClick={handleSkipMeal}
                  className="w-full text-center py-1.5 px-3 rounded-md border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-[11px] transition-all active:scale-95"
                >
                  ⏭️ Skip & Bank Credit (Rolls over)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* In-App Lock-Screen Push Banner */
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 border border-slate-700 shadow-md animate-in fade-in duration-200">
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF5A1F] flex items-center justify-center shrink-0 text-white font-bold text-xs mt-0.5 shadow-sm shadow-[#FF5A1F]/40">
                MO
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    MealsOn Push Notification
                  </span>
                  <span className="text-[10px] text-slate-400">8:00 PM</span>
                </div>
                <p className="text-xs font-semibold text-white mt-0.5 leading-snug">
                  🔔 Tomorrow's lunch: {tomorrowMeal.name}
                </p>
                <p className="text-[10px] text-slate-300">
                  Office • 1:00 PM. Modify or Skip before 10:00 PM kitchen cut-off.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Cut-Off Action Card / Drawer */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {/* Live Ticking Countdown Badge in Amber */}
        <div className="bg-[#FFFBEB] border border-[#F59E0B]/40 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs font-bold text-amber-900">
              ⏳ Cut-off in <strong className="font-mono text-amber-950 font-extrabold">{formatCountdown(secondsRemaining)}</strong>
            </span>
          </div>
          <span className="text-[9px] font-bold bg-[#F59E0B] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            Locks 10:00 PM
          </span>
        </div>

        {/* Tomorrow's Scheduled Meal Card */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            tomorrowStatus === 'confirmed'
              ? 'bg-[#ECFDF5] border-[#10B981] shadow-sm ring-2 ring-[#10B981]/20'
              : tomorrowStatus === 'swapped'
              ? 'bg-[#FFF5F0] border-[#FF5A1F] shadow-sm ring-2 ring-[#FF5A1F]/20'
              : tomorrowStatus === 'skipped'
              ? 'bg-slate-100 border-slate-300 opacity-70'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tomorrow's Scheduled Lunch (Mon)
            </span>

            {/* Status Badges */}
            {tomorrowStatus === 'confirmed' && (
              <span className="text-[10px] font-extrabold bg-[#10B981] text-white px-2 py-0.5 rounded-full flex items-center shadow-xs animate-in zoom-in-75">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
              </span>
            )}
            {tomorrowStatus === 'swapped' && (
              <span className="text-[10px] font-extrabold bg-[#FF5A1F] text-white px-2 py-0.5 rounded-full flex items-center shadow-xs animate-in zoom-in-75">
                <RefreshCw className="w-3 h-3 mr-1" /> Swapped!
              </span>
            )}
            {tomorrowStatus === 'skipped' && (
              <span className="text-[10px] font-extrabold bg-slate-600 text-white px-2 py-0.5 rounded-full flex items-center shadow-xs animate-in zoom-in-75">
                <SkipForward className="w-3 h-3 mr-1" /> Skipped (No Delivery)
              </span>
            )}
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-3xl select-none transition-transform hover:scale-110">{tomorrowMeal.image}</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {tomorrowMeal.name}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {tomorrowMeal.kitchen} • <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline -mt-0.5" /> {tomorrowMeal.rating}★
              </p>
              <p className="text-[10px] text-slate-400 mt-1">{tomorrowMeal.desc}</p>

              {/* Macro Pills */}
              <div className="flex items-center space-x-1.5 mt-2">
                <span className="text-[9px] font-bold bg-[#ECFDF5] text-[#10B981] px-1.5 py-0.5 rounded-full border border-[#10B981]/20">
                  Veg
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                  {tomorrowMeal.kcal} kcal
                </span>
                <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200">
                  {tomorrowMeal.protein}g Protein
                </span>
                <span className="text-[9px] font-bold text-[#FF5A1F] ml-auto">
                  ₹{tomorrowMeal.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Interactive Action Buttons */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {/* Button 1: Keep Meal (Confirmed) */}
          <button
            onClick={handleKeepMeal}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.97] cta-bounce ${
              tomorrowStatus === 'confirmed'
                ? 'bg-[#10B981] text-white shadow-md ring-2 ring-emerald-300'
                : 'bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#10B981]/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>✅ Keep Meal (Confirmed)</span>
          </button>

          {/* Button 2: 1-Tap Swap Dish */}
          <button
            onClick={() => {
              playPop();
              setShowSwapCarousel(!showSwapCarousel);
            }}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 bg-[#FFF5F0] hover:bg-[#FFE6DC] text-[#FF5A1F] border border-[#FF5A1F]/40 transition-all active:scale-[0.97] cta-bounce"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${showSwapCarousel ? 'rotate-180' : ''} transition-transform`} />
            <span>🔄 1-Tap Swap Dish {showSwapCarousel ? '(Collapse)' : ''}</span>
          </button>

          {/* Button 3: Skip & Bank Credit */}
          <button
            onClick={handleSkipMeal}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.97] cta-bounce ${
              tomorrowStatus === 'skipped'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <SkipForward className="w-4 h-4 text-amber-600 shrink-0" />
            <span>⏭️ Skip & Bank Credit (Pause Shield)</span>
          </button>
        </div>

        {/* Skipped Confirmation Banner */}
        {tomorrowStatus === 'skipped' && (
          <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-3 text-xs text-emerald-900 animate-in fade-in zoom-in-95 duration-200 shadow-xs">
            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-950 font-bold">
                  100% Meal Credit (₹190) rolled over!
                </strong>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Your Pause Shield balance increased to <strong>{credits} Credits</strong>. Your subscription plan end-date has been extended by +1 day automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inline Carousel of 3 Equal-Value Alternatives */}
        {showSwapCarousel && (
          <div className="pt-2 border-t border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Choose an equal-value replacement (₹190)
              </span>
              <span className="text-[10px] text-slate-400">Fresh cook kitchens</span>
            </div>

            <div className="space-y-2">
              {CUTOFF_ALTERNATIVES.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => handleSelectSwapAlternative(alt)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#FF5A1F] hover:bg-[#FFF5F0]/50 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform">
                      {alt.image}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF5A1F] transition-colors">
                        {alt.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {alt.kitchen} • {alt.kcal} kcal • {alt.protein}g Protein
                      </p>
                    </div>
                  </div>

                  <button className="text-[11px] font-bold text-white bg-[#FF5A1F] group-hover:bg-[#E04812] px-2.5 py-1 rounded-lg transition-colors shadow-xs">
                    Swap
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. 10 PM Cut-Off FAQ Accordion (Moved here from 4th page per user requirement) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <button
          onClick={() => {
            playPop();
            setExpandedFaq(!expandedFaq);
          }}
          className="w-full flex items-center justify-between text-left py-0.5 text-xs font-bold text-slate-800 hover:text-[#FF5A1F] transition-colors"
        >
          <span className="flex items-center">
            <HelpCircle className="w-4 h-4 mr-2 text-[#FF5A1F]" />
            Why a 10 PM cut-off? (Zero Waste Guarantee)
          </span>
          {expandedFaq ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {expandedFaq && (
          <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start space-x-2">
              <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Zero-Waste Supply Chain:</strong> Our partner cloud kitchens order fresh local produce and slow-marinate high-protein ingredients at 10 PM sharp based exclusively on confirmed meals. This eliminates 28% food waste and guarantees freshly cooked lunches rather than cold pre-packaged food.
              </p>
            </div>

            <div className="flex items-start space-x-2 pt-1 border-t border-slate-200/60">
              <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
              <p>
                <strong>100% Financial Protection:</strong> If you skip before 10 PM, 100% of your meal value (₹190) is converted into a <strong>Pause Shield Credit</strong> that automatically rolls over to extend your subscription, with zero penalty fees.
              </p>
            </div>

            {/* Kitchen Prep Timeline Micro-Graphic */}
            <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] space-y-1 mt-1">
              <div className="font-bold text-slate-800 text-[10px] flex items-center">
                <ChefHat className="w-3 h-3 mr-1 text-[#FF5A1F]" />
                Fresh Cooking Pipeline:
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="bg-slate-100 p-1 rounded font-medium text-slate-600">
                  <span className="font-bold text-amber-700 block">10:00 PM</span>
                  Order Lock
                </div>
                <div className="bg-slate-100 p-1 rounded font-medium text-slate-600">
                  <span className="font-bold text-emerald-700 block">6:00 AM</span>
                  Fresh Sourcing
                </div>
                <div className="bg-slate-100 p-1 rounded font-medium text-slate-600">
                  <span className="font-bold text-[#FF5A1F] block">12:30 PM</span>
                  Pod Dispatch
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
