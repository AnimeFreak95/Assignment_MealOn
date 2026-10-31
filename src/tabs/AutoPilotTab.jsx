import React, { useState } from 'react';
import { Sparkles, RefreshCw, Star, Check, Flame, ChevronRight, Zap, ChefHat } from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';

const FILTER_CHIPS = [
  { id: 'protein', label: 'High Protein (>20g)', text: 'High-protein (>20g)' },
  { id: 'cal', label: '<500 Kcal', text: 'under 500 kcal' },
  { id: 'veg', label: 'Pure Veg', text: 'pure vegetarian' },
  { id: 'homestyle', label: 'Homestyle', text: 'homestyle ghar-ka-swad' },
  { id: 'budget', label: 'Budget <₹250', text: 'under ₹250/meal' },
];

export default function AutoPilotTab({
  playlist,
  setPlaylist,
  onLockInPlaylist,
  triggerConfetti,
  onNotify
}) {
  const [promptText, setPromptText] = useState(
    'High-protein vegetarian lunches under 500 kcal, no mushrooms, under ₹250/meal'
  );
  const [activeChips, setActiveChips] = useState(['protein', 'cal', 'veg', 'budget']);
  const [isLoading, setIsLoading] = useState(false);
  const [swappingDay, setSwappingDay] = useState(null);
  const [justSwappedDay, setJustSwappedDay] = useState(null);

  // Toggle filter chip and intelligently update prompt
  const toggleChip = (chipId) => {
    playPop();
    const isCurrentlyActive = activeChips.includes(chipId);
    let nextActive;
    if (isCurrentlyActive) {
      nextActive = activeChips.filter((c) => c !== chipId);
    } else {
      nextActive = [...activeChips, chipId];
    }
    setActiveChips(nextActive);

    // Update prompt text dynamically
    const parts = nextActive.map((id) => FILTER_CHIPS.find((c) => c.id === id)?.text).filter(Boolean);
    if (parts.length > 0) {
      setPromptText(`${parts.join(', ')}, no mushrooms`);
    } else {
      setPromptText('Healthy balanced lunch meals under ₹250/meal');
    }
  };

  // Trigger 600ms shimmer loading with delight
  const handleGenerate = () => {
    playSuccessChime();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onNotify) {
        onNotify('Curated 5-Day Menu! ✨', 'High-protein, multi-kitchen balanced lunches ready.', 'success');
      }
    }, 600);
  };

  // Cycle dish options for a specific day with sound & micro-badge
  const handleSwapDish = (dayIndex) => {
    playPop();
    setSwappingDay(dayIndex);
    setTimeout(() => {
      setPlaylist((prev) => {
        const next = [...prev];
        const dayItem = { ...next[dayIndex] };
        const totalOpts = dayItem.options.length;
        dayItem.currentIdx = (dayItem.currentIdx + 1) % totalOpts;
        next[dayIndex] = dayItem;
        return next;
      });
      setSwappingDay(null);
      setJustSwappedDay(dayIndex);
      playSuccessChime();
      setTimeout(() => setJustSwappedDay(null), 1600);
    }, 180);
  };

  const handleLockIn = () => {
    playCelebrationFanfare();
    if (triggerConfetti) triggerConfetti();
    onLockInPlaylist();
  };

  // Compute live stats for sticky footer
  const totalCost = playlist.reduce((sum, item) => {
    const meal = item.options[item.currentIdx];
    return sum + (meal ? meal.price : 0);
  }, 0);

  const avgProtein = Math.round(
    playlist.reduce((sum, item) => {
      const meal = item.options[item.currentIdx];
      return sum + (meal ? meal.protein : 0);
    }, 0) / (playlist.length || 1)
  );

  return (
    <div className="pb-28 px-4 pt-3 space-y-4">
      {/* 1. Interactive AI Prompt Box */}
      <div className="bg-white rounded-2xl p-4 border-2 border-[#FF5A1F] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/5 rounded-bl-full pointer-events-none" />

        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-[#FFF5F0] flex items-center justify-center text-[#FF5A1F]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center">
            AI Meal Playlist Auto-Pilot
            <span className="ml-2 text-[10px] font-semibold bg-[#FFF5F0] text-[#FF5A1F] px-1.5 py-0.5 rounded-full border border-[#FF5A1F]/30">
              GPT-4o Agent
            </span>
          </h2>
        </div>

        {/* Editable Prompt Area */}
        <div className="relative">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={2}
            className="w-full text-xs text-slate-800 bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F] resize-none font-medium leading-relaxed"
            placeholder="Describe your dietary goals, cuisine, calories, exclusions..."
          />
        </div>

        {/* Quick-toggle Dietary Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 hide-scrollbar">
          {FILTER_CHIPS.map((chip) => {
            const active = activeChips.includes(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => toggleChip(chip.id)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-all border cta-bounce ${
                  active
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                    : 'bg-[#F8FAFC] text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {active && <Check className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />}
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full mt-1 bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Curating 5-Day Multi-Kitchen Schedule...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate 5-Day Playlist ✨</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Interactive 5-Day Multi-Kitchen Schedule */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Mon – Fri Multi-Kitchen Schedule
            </h3>
            <p className="text-[11px] text-slate-400">Personalized lunch drops from top partner kitchens</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
            Fresh Cook Guarantee
          </span>
        </div>

        {isLoading ? (
          // 600ms Skeleton shimmer loading state
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-slate-200 rounded-md" />
                  <div className="h-4 w-12 bg-slate-200 rounded-md" />
                </div>
                <div className="h-5 w-48 bg-slate-200 rounded-md" />
                <div className="h-3 w-36 bg-slate-100 rounded-md" />
                <div className="flex space-x-2 pt-1">
                  <div className="h-5 w-16 bg-slate-100 rounded-full" />
                  <div className="h-5 w-20 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          playlist.map((dayItem, idx) => {
            const currentMeal = dayItem.options[dayItem.currentIdx];
            const isFading = swappingDay === idx;
            const isJustSwapped = justSwappedDay === idx;

            return (
              <div
                key={dayItem.day}
                className={`bg-white rounded-2xl p-3.5 border transition-all hover:border-[#FF5A1F]/30 relative ${
                  isFading
                    ? 'opacity-40 scale-[0.99]'
                    : isJustSwapped
                    ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 shadow-md'
                    : 'border-slate-200/90 shadow-sm opacity-100 scale-100'
                }`}
              >
                {/* Micro delight pop badge on swap */}
                {isJustSwapped && (
                  <div className="absolute -top-2.5 right-4 bg-[#FF5A1F] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center space-x-1 animate-in zoom-in-75">
                    <ChefHat className="w-3 h-3" />
                    <span>Chef Swapped! 🔄</span>
                  </div>
                )}

                {/* Day Badge & Delivery Time Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {dayItem.day} • {dayItem.slot.split('–')[0].trim()}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Option {dayItem.currentIdx + 1} of {dayItem.options.length}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#FF5A1F]">
                    ₹{currentMeal.price}
                  </span>
                </div>

                {/* Dish Name & Kitchen */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base select-none transition-transform hover:scale-125">{currentMeal.image}</span>
                      <h4 className="text-[13px] font-bold text-slate-900 leading-snug">
                        {currentMeal.name}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">{currentMeal.kitchen}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                        {currentMeal.rating}★
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {currentMeal.desc}
                    </p>
                  </div>
                </div>

                {/* Macro Pills & Swap Dish Button */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    {/* Veg Badge in #10B981 */}
                    <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded-full flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1" />
                      Veg
                    </span>

                    {/* Calories */}
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {currentMeal.kcal} kcal
                    </span>

                    {/* Protein */}
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-full flex items-center">
                      <Flame className="w-2.5 h-2.5 mr-0.5 text-amber-500 fill-amber-500" />
                      {currentMeal.protein}g Protein
                    </span>
                  </div>

                  {/* Interactive Swap Dish Button */}
                  <button
                    onClick={() => handleSwapDish(idx)}
                    className="flex items-center space-x-1 text-[11px] font-bold text-[#FF5A1F] hover:text-[#E04812] bg-[#FFF5F0] hover:bg-[#FFE6DC] border border-[#FF5A1F]/30 px-2.5 py-1 rounded-lg transition-all active:scale-90 cta-bounce"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Swap Dish ↻</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Footer: Total Stats & Lock In Button */}
      <div className="fixed bottom-[58px] left-0 right-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] z-20">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] font-semibold text-slate-500">
              5 Meals • Avg <strong className="text-slate-900 font-bold">{avgProtein}g</strong> Protein/day
            </div>
            <div className="text-xs text-slate-400">Zero Delivery Fees Applied</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Weekly</div>
            <div className="text-base font-extrabold text-[#FF5A1F]">₹{totalCost}</div>
          </div>
        </div>

        <button
          onClick={handleLockIn}
          className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
        >
          <span>Lock In Weekly Playlist</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
