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
  AlertCircle
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';
import { MASTER_DISH_CATALOG, INITIAL_VAULT_IDS } from '../data/mockData';
import FoodVaultModal from '../components/FoodVaultModal';

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
  // Mode: 'ai' (AI Auto-Pilot) vs 'vault' (My Food Vault)
  const [schedulerMode, setSchedulerMode] = useState('vault'); // Default to Vault to highlight user curation
  const [vaultIds, setVaultIds] = useState(INITIAL_VAULT_IDS);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [fridayWildcard, setFridayWildcard] = useState(true);

  const [promptText, setPromptText] = useState(
    'High-protein vegetarian lunches under 500 kcal, no mushrooms, under ₹250/meal'
  );
  const [activeChips, setActiveChips] = useState(['protein', 'cal', 'veg', 'budget']);
  const [isLoading, setIsLoading] = useState(false);
  const [swappingDay, setSwappingDay] = useState(null);
  const [justSwappedDay, setJustSwappedDay] = useState(null);

  // Drag-and-Drop & Shift Slider State
  const [draggedDayIndex, setDraggedDayIndex] = useState(null);
  const [dragOverDayIndex, setDragOverDayIndex] = useState(null);
  const [activeShiftDay, setActiveShiftDay] = useState(null);
  const [shiftSliderVal, setShiftSliderVal] = useState(0);

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

  // Toggle dish in/out of vault
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
      // Pick 5 distinct dishes from vault (or fewer if vault < 5)
      const shuffledVault = [...vaultDishes].sort(() => 0.5 - Math.random());
      
      setPlaylist((prev) => {
        return prev.map((dayItem, idx) => {
          let chosenDish;
          let isWildcardSlot = idx === 4 && fridayWildcard; // Friday Wildcard

          if (isWildcardSlot) {
            // Pick a high-rated dish from outside the vault or special treat
            const wildcardCandidates = MASTER_DISH_CATALOG.filter((d) => !vaultIds.includes(d.id));
            chosenDish = wildcardCandidates[Math.floor(Math.random() * wildcardCandidates.length)] || shuffledVault[idx % shuffledVault.length];
          } else {
            chosenDish = shuffledVault[idx % shuffledVault.length] || MASTER_DISH_CATALOG[idx];
          }

          // Build candidate options: chosenDish + other vault items for quick swapping
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
          isWildcard: false
        }));
      });
      setIsLoading(false);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onNotify) {
        onNotify('AI Discovery Plan Curated! ✨', 'High-protein, multi-kitchen balanced lunches ready.', 'success');
      }
    }, 500);
  };

  // Cycle dish options for a specific day
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
      setTimeout(() => setJustSwappedDay(null), 1400);
    }, 160);
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
    }, 0) / playlist.length
  );

  const avgKcal = Math.round(
    playlist.reduce((acc, day) => {
      const meal = day.options[day.currentIdx] || day.options[0];
      return acc + (meal?.kcal || 0);
    }, 0) / playlist.length
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
    <div className="space-y-4 pb-20">
      {/* Food Vault Modal */}
      <FoodVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        vaultIds={vaultIds}
        onToggleVaultDish={handleToggleVaultDish}
        onNotify={onNotify}
      />

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

      {/* Weekday Schedule List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {schedulerMode === 'vault' ? '💖 Vault Weekly Schedule' : '🤖 AI Curated Schedule'}
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">
            Drag card or tap Swap ↻
          </span>
        </div>

        {isLoading ? (
          // Shimmer Skeleton
          <div className="space-y-2.5 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-slate-200 h-24">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-2.5 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          playlist.map((dayItem, idx) => {
            const currentMeal = dayItem.options[dayItem.currentIdx] || dayItem.options[0];
            const isSwapping = swappingDay === idx;
            const isJustSwapped = justSwappedDay === idx;
            const isDragging = draggedDayIndex === idx;
            const isDragOver = dragOverDayIndex === idx;

            const isVaultItem = dayItem.isVaultScheduled ?? (schedulerMode === 'vault' && idx !== 4);
            const isWildcardItem = dayItem.isWildcard ?? (schedulerMode === 'vault' && idx === 4 && fridayWildcard);

            return (
              <div
                key={dayItem.day}
                draggable
                onDragStart={() => setDraggedDayIndex(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverDayIndex(idx);
                }}
                onDragEnd={() => {
                  if (draggedDayIndex !== null && dragOverDayIndex !== null) {
                    handleShiftMeal(draggedDayIndex, dragOverDayIndex);
                  }
                  setDraggedDayIndex(null);
                  setDragOverDayIndex(null);
                }}
                className={`bg-white rounded-2xl p-3 border transition-all duration-200 shadow-xs relative ${
                  isJustSwapped
                    ? 'border-[#10B981] bg-[#ECFDF5]/30 scale-[1.01]'
                    : isDragOver
                    ? 'border-[#FF5A1F] bg-[#FFF5F0] border-dashed ring-2 ring-[#FF5A1F]/30'
                    : isDragging
                    ? 'opacity-40 border-slate-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header: Day, Location & Source Badge */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-800">{dayItem.day}</span>
                        <span className="text-[10px] text-slate-600 font-semibold">• {dayItem.dateStr}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-semibold block">{dayItem.slot}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Source Pill */}
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

                    {/* Location Badge */}
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        dayItem.location === 'office'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {dayItem.location === 'office' ? '🏢 Office' : '🏠 Home'}
                    </span>
                  </div>
                </div>

                {/* Dish Name & Kitchen Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl select-none p-1 bg-slate-50 rounded-lg">{currentMeal.image}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {currentMeal.name}
                      </h4>
                      <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-slate-500">
                        <span className="font-medium text-slate-600">{currentMeal.kitchen}</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-600 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                          {currentMeal.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900">₹{currentMeal.price}</span>
                  </div>
                </div>

                {/* Macro Pills & Swap Dish Button */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] font-extrabold bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30 px-1.5 py-0.5 rounded-full">
                      Veg
                    </span>
                    <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                      {currentMeal.kcal} kcal
                    </span>
                    <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded-full flex items-center">
                      <Flame className="w-2.5 h-2.5 mr-0.5 text-amber-500 fill-amber-500" />
                      {currentMeal.protein}g
                    </span>
                  </div>

                  <button
                    onClick={() => handleSwapDish(idx)}
                    className="flex items-center space-x-1 text-[10px] font-bold text-[#FF5A1F] hover:text-[#E04812] bg-[#FFF5F0] hover:bg-[#FFE6DC] border border-[#FF5A1F]/30 px-2 py-0.5 rounded-lg transition-all active:scale-90 cta-bounce"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Swap ↻</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Footer */}
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
