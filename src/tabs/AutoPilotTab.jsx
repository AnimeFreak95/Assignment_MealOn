import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  RefreshCw,
  Star,
  Check,
  Flame,
  ChevronRight,
  ChefHat,
  GripVertical,
  SlidersHorizontal,
  ArrowRightLeft,
  Heart,
  Plus,
  Dice5,
  ShieldCheck,
  AlertCircle,
  Building2,
  Home,
  Clock,
  Wand2,
  Repeat,
  SkipForward,
  X,
  MapPin
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';
import { MASTER_DISH_CATALOG, INITIAL_VAULT_IDS, SAVED_LOCATIONS } from '../data/mockData';
import FoodVaultModal from '../components/FoodVaultModal';

const FILTER_CHIPS = [
  { id: 'protein', label: '💪 High protein', text: 'High-protein (>20g)' },
  { id: 'cal', label: '🔥 Under 500 kcal', text: 'under 500 kcal' },
  { id: 'homestyle', label: '🍲 Homestyle', text: 'homestyle ghar-ka-swad' },
  { id: 'budget', label: '🏷️ Under ₹250', text: 'under ₹250/meal' },
];

export default function AutoPilotTab({
  playlist,
  setPlaylist,
  onLockInPlaylist,
  triggerConfetti,
  onNotify
}) {
  // View Version Comparison: 'v2' (New Screenshot UI) vs 'v1' (Classic View)
  const [viewVersion, setViewVersion] = useState('v2');

  // Mode for V1: 'ai' vs 'vault'
  const [schedulerMode, setSchedulerMode] = useState('vault');
  const [vaultIds, setVaultIds] = useState(INITIAL_VAULT_IDS);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [fridayWildcard, setFridayWildcard] = useState(true);

  // Modal / Picker States
  const [multiSwapModalDay, setMultiSwapModalDay] = useState(null);
  const [activeSlotPickerDay, setActiveSlotPickerDay] = useState(null);

  const [promptText, setPromptText] = useState(
    'High-protein veg lunches under 500 kcal, no mushrooms'
  );
  const [activeChips, setActiveChips] = useState(['protein', 'cal', 'homestyle']);
  const [isLoading, setIsLoading] = useState(false);
  const [justSwappedDay, setJustSwappedDay] = useState(null);

  // Drag-and-Drop & Shift Slider State
  const [draggedDayIndex, setDraggedDayIndex] = useState(null);
  const [dragOverDayIndex, setDragOverDayIndex] = useState(null);
  const [activeShiftDay, setActiveShiftDay] = useState(null);

  // Calculate vault statistics
  const vaultDishes = useMemo(() => {
    return vaultIds.map((id) => MASTER_DISH_CATALOG.find((d) => d.id === id)).filter(Boolean);
  }, [vaultIds]);

  const vaultAvgKcal = useMemo(() => {
    if (!vaultDishes.length) return 0;
    return Math.round(vaultDishes.reduce((acc, d) => acc + d.kcal, 0) / vaultDishes.length);
  }, [vaultDishes]);

  const vaultAvgProtein = useMemo(() => {
    if (!vaultDishes.length) return 0;
    return Math.round(vaultDishes.reduce((acc, d) => acc + d.protein, 0) / vaultDishes.length);
  }, [vaultDishes]);

  const vaultAvgPrice = useMemo(() => {
    if (!vaultDishes.length) return 0;
    return Math.round(vaultDishes.reduce((acc, d) => acc + d.price, 0) / vaultDishes.length);
  }, [vaultDishes]);

  // Toggle dish in vault
  const handleToggleVaultDish = (dishId) => {
    setVaultIds((prev) => {
      if (prev.includes(dishId)) {
        return prev.filter((id) => id !== dishId);
      } else {
        if (prev.length >= 20) return prev;
        return [...prev, dishId];
      }
    });
  };

  // Shuffle schedule from vault dishes
  const handleShuffleVaultSchedule = () => {
    playSuccessChime();
    setIsLoading(true);

    setTimeout(() => {
      const shuffledVault = [...vaultDishes].sort(() => 0.5 - Math.random());
      
      setPlaylist((prev) => {
        return prev.map((dayItem, idx) => {
          let chosenDish;
          let isWildcardSlot = idx === 4 && fridayWildcard; // Friday Wildcard

          if (isWildcardSlot) {
            const wildcardCandidates = MASTER_DISH_CATALOG.filter((d) => !vaultIds.includes(d.id));
            chosenDish = wildcardCandidates[Math.floor(Math.random() * wildcardCandidates.length)] || shuffledVault[idx % shuffledVault.length];
          } else {
            chosenDish = shuffledVault[idx % shuffledVault.length] || MASTER_DISH_CATALOG[idx];
          }

          const remainingVault = vaultDishes.filter((d) => d.id !== chosenDish.id);
          const alt1 = remainingVault[0] || MASTER_DISH_CATALOG[(idx + 1) % MASTER_DISH_CATALOG.length];
          const alt2 = remainingVault[1] || MASTER_DISH_CATALOG[(idx + 2) % MASTER_DISH_CATALOG.length];

          return {
            ...dayItem,
            isVaultScheduled: !isWildcardSlot,
            isWildcard: isWildcardSlot,
            currentIdx: 0,
            options: [chosenDish, alt1, alt2]
          };
        });
      });

      setIsLoading(false);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onNotify) {
        onNotify('Vault Plan Generated! 💖', '5-day balanced lunch rotation ready from your approved vault.', 'success');
      }
    }, 400);
  };

  // Toggle filter chip and update prompt
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

    const parts = nextActive.map((id) => FILTER_CHIPS.find((c) => c.id === id)?.text).filter(Boolean);
    if (parts.length > 0) {
      setPromptText(`${parts.join(', ')}, no mushrooms`);
    } else {
      setPromptText('Healthy balanced lunch meals under ₹250/meal');
    }
  };

  // Trigger shimmer loading with delight for AI mode
  const handleGenerateAI = () => {
    playSuccessChime();
    setIsLoading(true);
    setTimeout(() => {
      setPlaylist((prev) => {
        return prev.map((dayItem, idx) => ({
          ...dayItem,
          isVaultScheduled: false,
          isWildcard: idx === 4 && fridayWildcard
        }));
      });
      setIsLoading(false);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onNotify) {
        onNotify('Week Re-Planned! ✨', 'High-protein, multi-kitchen balanced lunches ready.', 'success');
      }
    }, 500);
  };

  // 1-Click Toggle location between Office and Home
  const toggleDayLocation = (index) => {
    playPop();
    setPlaylist((prev) => {
      const next = [...prev];
      const currentLoc = next[index].location;
      const newLoc = currentLoc === 'office' ? 'home' : 'office';
      const defaultSlot = SAVED_LOCATIONS[newLoc]?.defaultSlot || (newLoc === 'office' ? '1:00 PM – 1:30 PM' : '1:30 PM – 2:00 PM');
      next[index] = {
        ...next[index],
        location: newLoc,
        slot: next[index].slot || defaultSlot
      };
      return next;
    });

    const targetLocName = playlist[index].location === 'office' ? 'Green Valley Apt (Home)' : 'Cyber Park Tower B (Office)';
    if (onNotify) {
      onNotify('Location Updated 📍', `${playlist[index].day} lunch set to ${targetLocName}.`, 'info');
    }
  };

  // Select 30-min time slot
  const selectTimeSlot = (index, slotStr) => {
    playPop();
    setPlaylist((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        slot: slotStr
      };
      return next;
    });
    setActiveSlotPickerDay(null);
    if (onNotify) {
      onNotify('Slot Updated ⏰', `${playlist[index].day} delivery set to ${slotStr}.`, 'success');
    }
  };

  // Swap dish with chosen alternative from 4-5 options
  const handleSelectSwapDish = (dayIndex, newDish) => {
    playSuccessChime();
    setPlaylist((prev) => {
      const next = [...prev];
      const dayItem = { ...next[dayIndex] };
      const currentDish = dayItem.options[dayItem.currentIdx] || dayItem.options[0];
      const remainingOpts = dayItem.options.filter((d) => d.id !== newDish.id && d.id !== currentDish.id);
      dayItem.options = [newDish, currentDish, ...remainingOpts];
      dayItem.currentIdx = 0;
      next[dayIndex] = dayItem;
      return next;
    });
    setMultiSwapModalDay(null);
    setJustSwappedDay(dayIndex);
    if (triggerConfetti) triggerConfetti();
    setTimeout(() => setJustSwappedDay(null), 1600);
    if (onNotify) {
      onNotify('Dish Swapped! 🥗', `Swapped ${playlist[dayIndex].day} lunch to ${newDish.name}.`, 'success');
    }
  };

  // Skip & Bank credit
  const handleSkipDay = (dayIndex) => {
    playPop();
    const isCurrentlySkipped = playlist[dayIndex].status === 'skipped';
    setPlaylist((prev) => {
      const next = [...prev];
      next[dayIndex] = {
        ...next[dayIndex],
        status: isCurrentlySkipped ? 'scheduled' : 'skipped'
      };
      return next;
    });

    if (onNotify) {
      if (!isCurrentlySkipped) {
        onNotify('Meal Skipped & Banked! 🛡️', `₹190 credit preserved in your MealsOn Wallet. Pass extended +1 day.`, 'success');
      } else {
        onNotify('Meal Restored! 🥗', `${playlist[dayIndex].day} lunch restored to your weekly schedule.`, 'info');
      }
    }
  };

  // Get 5 swap candidates for a specific day
  const getSwapCandidates = (currentDishId) => {
    const list = MASTER_DISH_CATALOG.filter((d) => d.id !== currentDishId);
    return list.slice(0, 5);
  };

  // Shift/Swap entire meal between two days
  const handleShiftMeal = (sourceIdx, targetIdx) => {
    if (sourceIdx === targetIdx || sourceIdx == null || targetIdx == null) return;
    const sourceDay = playlist[sourceIdx]?.day;
    const targetDay = playlist[targetIdx]?.day;

    setPlaylist((prev) => {
      const next = [...prev];
      const source = next[sourceIdx];
      const target = next[targetIdx];

      const newSource = {
        ...source,
        options: target.options,
        currentIdx: target.currentIdx,
        isVaultScheduled: target.isVaultScheduled,
        isWildcard: target.isWildcard
      };
      const newTarget = {
        ...target,
        options: source.options,
        currentIdx: source.currentIdx,
        isVaultScheduled: source.isVaultScheduled,
        isWildcard: source.isWildcard
      };

      next[sourceIdx] = newSource;
      next[targetIdx] = newTarget;
      return next;
    });

    playSuccessChime();
    setActiveShiftDay(null);
    if (onNotify) {
      onNotify('Meals Swapped! 🔄', `Moved ${sourceDay}'s meal to ${targetDay}.`, 'info');
    }
  };

  // Calculate live totals
  const totalCost = playlist.reduce((acc, day) => {
    const meal = day.options[day.currentIdx] || day.options[0];
    return acc + (meal?.price || 0);
  }, 0);

  const avgProtein = Math.round(
    playlist.reduce((acc, day) => {
      const meal = day.options[day.currentIdx] || day.options[0];
      return acc + (meal?.protein || 0);
    }, 0) / (playlist.length || 1)
  );

  const handleLockIn = () => {
    playCelebrationFanfare();
    if (triggerConfetti) triggerConfetti();
    if (onLockInPlaylist) onLockInPlaylist();
    if (onNotify) {
      onNotify('Weekly Playlist Locked! 🔒', 'Your kitchen orders are scheduled.', 'success');
    }
  };

  return (
    <div className="space-y-3.5 pb-24">
      {/* Food Vault Modal */}
      <FoodVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        vaultIds={vaultIds}
        onToggleVaultDish={handleToggleVaultDish}
        onNotify={onNotify}
      />

      {/* Version Comparison Selector (New V2 vs Classic V1) */}
      <div className="flex items-center justify-between bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => {
            playPop();
            setViewVersion('v2');
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
            viewVersion === 'v2'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>✨ V2: Your Week (New UI)</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setViewVersion('v1');
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            viewVersion === 'v1'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>📋 V1: Classic View</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* V2: NEW FEATURE SECTION (DIRECTLY FROM SCREENSHOT DESIGN) */}
      {/* ======================================================== */}
      {viewVersion === 'v2' ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Title: Your week */}
          <div className="flex items-center justify-between px-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Your week
            </h1>
            <span className="text-[10px] font-extrabold text-[#FF5A1F] bg-[#FFF5F0] border border-[#FF5A1F]/30 px-2 py-0.5 rounded-full">
              5 Meals • ₹0 Delivery
            </span>
          </div>

          {/* 1. Smart Planner Top Card (Exact Match from Screenshot) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  Smart planner
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">AI Auto-Pilot</span>
            </div>

            {/* Prompt Box */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={2}
                className="w-full text-xs text-slate-800 bg-transparent focus:outline-none resize-none font-medium leading-relaxed placeholder-slate-400"
                placeholder="Describe your dietary goals..."
              />
            </div>

            {/* Chips Row (White bg, orange border, orange text) */}
            <div className="flex items-center gap-2 overflow-x-auto py-0.5 hide-scrollbar">
              {FILTER_CHIPS.map((chip) => {
                const active = activeChips.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    onClick={() => toggleChip(chip.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cta-bounce ${
                      active
                        ? 'bg-white border-[#FF5A1F] text-[#FF5A1F] shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Solid Orange CTA: Re-plan open days */}
            <button
              onClick={handleGenerateAI}
              disabled={isLoading}
              className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Re-planning your open days...</span>
                </div>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Re-plan open days</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Meal Cards List (Matching Screenshot Design Language) */}
          <div className="space-y-3.5">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border border-slate-200 h-32" />
                ))}
              </div>
            ) : (
              playlist.map((dayItem, idx) => {
                const currentMeal = dayItem.options[dayItem.currentIdx] || dayItem.options[0];
                const isHome = dayItem.location === 'home';
                const isSkipped = dayItem.status === 'skipped';
                const isFriday = idx === 4;
                const isJustSwapped = justSwappedDay === idx;

                return (
                  <div
                    key={dayItem.day}
                    className={`bg-white rounded-3xl p-4 border transition-all shadow-xs space-y-3 relative overflow-hidden ${
                      isSkipped
                        ? 'opacity-60 border-slate-300 bg-slate-50/60'
                        : isJustSwapped
                        ? 'border-[#10B981] ring-2 ring-[#10B981]/20 shadow-md'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Header Row: Date & 1-Click Location Pill */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {dayItem.dayCode}, {dayItem.dateStr}
                      </span>

                      {/* 1-Click Location Flip Button */}
                      <button
                        type="button"
                        onClick={() => toggleDayLocation(idx)}
                        title="1-tap to flip between Home and Office"
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center space-x-1.5 transition-all active:scale-95 border cta-bounce ${
                          isHome
                            ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] hover:bg-[#D1FAE5]'
                            : 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5] hover:bg-[#FFEDD5]'
                        }`}
                      >
                        {isHome ? (
                          <>
                            <Home className="w-3.5 h-3.5" />
                            <span>Green Valley Apt</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Cyber Park Tower B</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Friday AI Discovery Wildcard Highlight */}
                    {isFriday && fridayWildcard && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl px-2.5 py-1 text-[10px] text-amber-900 font-bold flex items-center justify-between">
                        <span className="flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>Friday AI Discovery Wildcard (Surprise Chef Treat)</span>
                        </span>
                        <span className="text-[9px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded-full font-black">
                          SURPRISE ✨
                        </span>
                      </div>
                    )}

                    {/* Middle Content Row: Round Avatar + Details */}
                    <div className="flex items-center space-x-3">
                      {/* Round Avatar with gray circle background */}
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {currentMeal.image}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug truncate">
                          {currentMeal.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {currentMeal.kitchen} • {currentMeal.protein}g • {currentMeal.kcal} kcal • ₹{currentMeal.price}
                        </p>
                      </div>
                    </div>

                    {/* 30-Minute Time Slot CTA & Inline Selector */}
                    <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-2 px-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                          <span className="text-slate-500 font-medium">Slot:</span>
                          <strong className="text-slate-900 font-extrabold">
                            {dayItem.slot || '1:00 PM – 1:30 PM'}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveSlotPickerDay(activeSlotPickerDay === idx ? null : idx)
                          }
                          className="text-[10px] font-extrabold text-[#FF5A1F] hover:underline flex items-center space-x-0.5"
                        >
                          <span>{activeSlotPickerDay === idx ? 'Close' : 'Change Window →'}</span>
                        </button>
                      </div>

                      {/* Expandable 30-Min Slot Selector */}
                      {activeSlotPickerDay === idx && (
                        <div className="grid grid-cols-3 gap-1 pt-1 animate-in fade-in duration-150">
                          {[
                            { id: '12:30 PM – 1:00 PM', label: '12:30–1:00 PM' },
                            { id: '1:00 PM – 1:30 PM', label: '1:00–1:30 PM (Pod)' },
                            { id: '1:30 PM – 2:00 PM', label: '1:30–2:00 PM' }
                          ].map((tw) => {
                            const isCurrentSlot = dayItem.slot === tw.id;
                            return (
                              <button
                                key={tw.id}
                                type="button"
                                onClick={() => selectTimeSlot(idx, tw.id)}
                                className={`py-1 px-1 rounded-lg text-[9px] font-extrabold border transition-all text-center ${
                                  isCurrentSlot
                                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {tw.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Move / Shift Drawer (if active) */}
                    {activeShiftDay === idx && (
                      <div className="p-2.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-[#FF5A1F]/30 space-y-1.5 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-extrabold text-slate-900">
                            Move {dayItem.day}'s meal to:
                          </span>
                          <button
                            onClick={() => setActiveShiftDay(null)}
                            className="text-slate-400 hover:text-slate-600 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {playlist.map((d, dIdx) => (
                            <button
                              key={d.day}
                              disabled={dIdx === idx}
                              onClick={() => handleShiftMeal(idx, dIdx)}
                              className={`py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                dIdx === idx
                                  ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                                  : 'bg-white text-slate-800 hover:bg-[#FF5A1F] hover:text-white border-slate-200 shadow-2xs'
                              }`}
                            >
                              {d.dayCode}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skipped Notice */}
                    {isSkipped && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-1.5 px-2 text-[10px] text-emerald-800 font-bold flex items-center justify-between">
                        <span>🛡️ Meal Skipped. ₹190 credited to MealsOn Wallet.</span>
                        <span className="text-[9px] underline cursor-pointer" onClick={() => handleSkipDay(idx)}>
                          Undo
                        </span>
                      </div>
                    )}

                    {/* Bottom 3-Action Toolbar (Exact 3-column split from screenshot) */}
                    <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200/90 -mx-4 -mb-4 mt-2">
                      {/* 1. Swap (Opens 4-5 alternative choices) */}
                      <button
                        type="button"
                        onClick={() => {
                          playPop();
                          setMultiSwapModalDay(idx);
                        }}
                        className="py-2.5 text-xs font-bold text-slate-700 hover:text-[#FF5A1F] hover:bg-slate-50/80 rounded-bl-3xl flex items-center justify-center space-x-1.5 transition-colors active:scale-95 cta-bounce"
                      >
                        <Repeat className="w-3.5 h-3.5 text-slate-500" />
                        <span>Swap</span>
                      </button>

                      {/* 2. Move (Day Shifter) */}
                      <button
                        type="button"
                        onClick={() => {
                          playPop();
                          setActiveShiftDay(activeShiftDay === idx ? null : idx);
                        }}
                        className="py-2.5 text-xs font-bold text-slate-700 hover:text-[#FF5A1F] hover:bg-slate-50/80 flex items-center justify-center space-x-1.5 transition-colors active:scale-95 cta-bounce"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                        <span>Move</span>
                      </button>

                      {/* 3. Skip (Banks Credit) */}
                      <button
                        type="button"
                        onClick={() => handleSkipDay(idx)}
                        className={`py-2.5 text-xs font-bold transition-colors active:scale-95 rounded-br-3xl flex items-center justify-center space-x-1.5 cta-bounce ${
                          isSkipped
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50/80'
                        }`}
                      >
                        <SkipForward className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isSkipped ? 'Skipped ✓' : 'Skip'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* V1: CLASSIC FEATURE SECTION (PRESERVED FOR COMPARISON)   */
        /* ======================================================== */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Hero Mode Selector: AI Auto-Pilot vs. My Food Vault */}
          <div className="bg-slate-900 rounded-2xl p-1.5 shadow-md border border-slate-800">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  playPop();
                  setSchedulerMode('vault');
                }}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  schedulerMode === 'vault'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${schedulerMode === 'vault' ? 'fill-white text-white' : 'text-rose-400'}`} />
                <span>My Food Vault ({vaultIds.length}/20)</span>
              </button>

              <button
                onClick={() => {
                  playPop();
                  setSchedulerMode('ai');
                }}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  schedulerMode === 'ai'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Auto-Pilot</span>
              </button>
            </div>
          </div>

          {/* Mode B Surface: My Food Vault Controller */}
          {schedulerMode === 'vault' ? (
            <div className="bg-gradient-to-br from-rose-50/80 via-white to-orange-50/60 rounded-2xl p-4 border border-rose-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                      Zero-Surprise Guarantee
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {vaultIds.length} of 20 Approved
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-slate-900 mt-1">
                    Lunches from Your Trusted Vault
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Every meal is pre-vetted by you. Anti-monotony auto-shuffle ensures zero repeats.
                  </p>
                </div>

                <button
                  onClick={() => {
                    playPop();
                    setIsVaultModalOpen(true);
                  }}
                  className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 hover:border-rose-400 text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Manage Vault</span>
                </button>
              </div>

              {/* Quick Metrics Bar across the Vault */}
              <div className="grid grid-cols-3 gap-2 bg-white/90 p-2.5 rounded-xl border border-rose-100 text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block font-medium">Avg Calories</span>
                  <strong className="text-slate-800 font-extrabold text-xs">{vaultAvgKcal} kcal</strong>
                </div>
                <div className="border-x border-slate-100">
                  <span className="text-slate-400 block font-medium">Avg Protein</span>
                  <strong className="text-amber-600 font-extrabold text-xs">{vaultAvgProtein}g</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Avg Dish Price</span>
                  <strong className="text-emerald-700 font-extrabold text-xs">₹{vaultAvgPrice}</strong>
                </div>
              </div>

              {/* Friday Wildcard Toggle */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold text-[11px]">Friday AI Discovery Wildcard (1 surprise chef treat)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setFridayWildcard(!fridayWildcard);
                  }}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    fridayWildcard ? 'bg-orange-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      fridayWildcard ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Re-shuffle CTA */}
              <button
                onClick={handleShuffleVaultSchedule}
                disabled={isLoading}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Dice5 className="w-4 h-4" />
                <span>Auto-Shuffle 5-Day Plan from My Vault</span>
              </button>
            </div>
          ) : (
            /* Mode A Surface: AI Auto-Pilot Controller */
            <div className="bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 rounded-2xl p-4 border border-orange-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                  <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    AI Meal Playlist Auto-Pilot
                  </h2>
                </div>
                <span className="text-[10px] font-bold bg-[#FF5A1F]/10 text-[#FF5A1F] px-2 py-0.5 rounded-full border border-[#FF5A1F]/20">
                  5-Day Discovery
                </span>
              </div>

              {/* Dynamic AI Prompt Box */}
              <div className="relative">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F] text-slate-800 placeholder-slate-400 font-medium leading-relaxed resize-none transition-all"
                  placeholder="E.g., High-protein veg lunches under 500 kcal, no mushrooms, under ₹250/meal"
                />
              </div>

              {/* Preset Filter Chips */}
              <div className="flex flex-wrap gap-1.5">
                {FILTER_CHIPS.map((chip) => {
                  const active = activeChips.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      onClick={() => toggleChip(chip.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-95 flex items-center space-x-1 ${
                        active
                          ? 'bg-[#FF5A1F] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateAI}
                disabled={isLoading}
                className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 5-Day Auto-Pilot Plan</span>
              </button>
            </div>
          )}

          {/* Weekday Schedule List (Classic V1) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {schedulerMode === 'vault' ? '💖 Vault Weekly Schedule' : '🤖 AI Curated Schedule'}
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                Tap Swap ↻ or Move ⠿
              </span>
            </div>

            {playlist.map((dayItem, idx) => {
              const currentMeal = dayItem.options[dayItem.currentIdx] || dayItem.options[0];
              const isVaultItem = dayItem.isVaultScheduled ?? (schedulerMode === 'vault' && idx !== 4);
              const isWildcardItem = dayItem.isWildcard ?? (schedulerMode === 'vault' && idx === 4 && fridayWildcard);

              return (
                <div
                  key={dayItem.day}
                  className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-extrabold text-slate-900">{dayItem.day}</span>
                      <span className="text-[10px] text-slate-500">• {dayItem.dateStr}</span>
                      <span className="text-[10px] text-slate-600 font-semibold">• {dayItem.slot}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {isWildcardItem ? (
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Wildcard
                        </span>
                      ) : isVaultItem ? (
                        <span className="text-[9px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" /> Vault
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold bg-orange-100 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> AI Pick
                        </span>
                      )}

                      <button
                        onClick={() => toggleDayLocation(idx)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          dayItem.location === 'office'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {dayItem.location === 'office' ? '🏢 Office' : '🏠 Home'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{currentMeal.image}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {currentMeal.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {currentMeal.kitchen} • {currentMeal.protein}g P • {currentMeal.kcal} kcal
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">₹{currentMeal.price}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {dayItem.slot || '1:00 PM – 1:30 PM'}
                    </span>
                    <button
                      onClick={() => setMultiSwapModalDay(idx)}
                      className="text-[10px] font-extrabold text-[#FF5A1F] hover:underline"
                    >
                      Swap Dish ↻
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4–5 OPTION SWAP MODAL / BOTTOM SHEET                     */}
      {/* ======================================================== */}
      {multiSwapModalDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in duration-150">
          <div className="w-full max-w-[420px] bg-white rounded-t-3xl p-4 space-y-3.5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#FF5A1F] uppercase tracking-wider">
                  Dish Replacement
                </span>
                <h3 className="text-sm font-black text-slate-900">
                  Swap {playlist[multiSwapModalDay]?.day}'s Lunch
                </h3>
              </div>
              <button
                onClick={() => setMultiSwapModalDay(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Select one of the <strong>5 chef-curated alternatives</strong> under your ₹250 pass cap:
            </p>

            {/* List of 5 Alternative Dishes */}
            <div className="space-y-2">
              {getSwapCandidates(playlist[multiSwapModalDay]?.options[playlist[multiSwapModalDay]?.currentIdx]?.id).map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => handleSelectSwapDish(multiSwapModalDay, candidate)}
                  className="bg-[#F8FAFC] hover:bg-[#FFF5F0] border border-slate-200 hover:border-[#FF5A1F] rounded-2xl p-3 flex items-center justify-between transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                      {candidate.image}
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF5A1F] transition-colors leading-tight">
                          {candidate.name}
                        </h4>
                        <span className="text-[8px] font-bold bg-[#ECFDF5] text-[#10B981] px-1.5 py-0.2 rounded">
                          Veg
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-[10px] text-slate-500 mt-0.5">
                        <span>{candidate.kitchen}</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-600 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                          {candidate.rating}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-600 mt-1">
                        <span className="bg-white border border-slate-200 px-1.5 py-0.2 rounded text-[9px]">
                          {candidate.kcal} kcal
                        </span>
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded text-[9px]">
                          🔥 {candidate.protein}g Protein
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-xs font-black text-slate-900 mb-1">
                      ₹{candidate.price}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSwapDish(multiSwapModalDay, candidate);
                      }}
                      className="bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg shadow-xs transition-all active:scale-95"
                    >
                      Swap ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Footer */}
      <div className="fixed bottom-[58px] left-0 right-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 px-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] z-20">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] font-semibold text-slate-600">
            5 Lunches • Avg <strong className="text-slate-900 font-bold">{avgProtein}g</strong> Protein
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-[#FF5A1F]">₹{totalCost}</span>
          </div>
        </div>

        <button
          onClick={handleLockIn}
          className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
        >
          <span>Lock In Weekly Playlist</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
