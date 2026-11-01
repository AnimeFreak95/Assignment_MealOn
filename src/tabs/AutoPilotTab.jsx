import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  RefreshCw,
  Star,
  Check,
  Flame,
  ChevronRight,
  GripVertical,
  ArrowRightLeft,
  Heart,
  Plus,
  ShieldCheck,
  AlertCircle,
  Building2,
  Home,
  Clock,
  Wand2,
  Repeat,
  SkipForward,
  X,
  MapPin,
  Move,
  RotateCcw,
  Calendar,
  LayoutList,
  CalendarDays
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';
import { MASTER_DISH_CATALOG, INITIAL_VAULT_IDS, SAVED_LOCATIONS } from '../data/mockData';
import FoodVaultModal from '../components/FoodVaultModal';

const TIME_WINDOWS = [
  '12:30 PM – 1:00 PM',
  '1:00 PM – 1:30 PM',
  '1:30 PM – 2:00 PM'
];

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
  onNotify,
  paymentMode = 'prepaid'
}) {
  // Planner Mode: 'ai' vs 'vault'
  const [plannerMode, setPlannerMode] = useState('ai');
  const [vaultIds, setVaultIds] = useState(INITIAL_VAULT_IDS);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [fridayWildcard, setFridayWildcard] = useState(true);

  // Modal / Picker States
  const [multiSwapModalDay, setMultiSwapModalDay] = useState(null);
  const [swapModalFilter, setSwapModalFilter] = useState('curated'); // 'curated' | 'vault'
  const [activeSlotPickerDay, setActiveSlotPickerDay] = useState(null);
  const [confirmSkipDayIndex, setConfirmSkipDayIndex] = useState(null);

  const [promptText, setPromptText] = useState(
    'High-protein veg lunches under 500 kcal, no mushrooms'
  );
  const [activeChips, setActiveChips] = useState(['protein', 'cal', 'homestyle']);
  const [isLoading, setIsLoading] = useState(false);
  const [justSwappedDay, setJustSwappedDay] = useState(null);

  // Drag-and-Drop State
  const [draggedDayIndex, setDraggedDayIndex] = useState(null);
  const [dragOverDayIndex, setDragOverDayIndex] = useState(null);
  const [activeShiftDay, setActiveShiftDay] = useState(null);

  // View Layout: 'cards' vs 'calendar'
  const [viewLayout, setViewLayout] = useState('cards');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(0); // 0-4 for Mon-Fri
  const [calendarSyncActive, setCalendarSyncActive] = useState(true);
  const [autoSwitchedThursday, setAutoSwitchedThursday] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState('3-2'); // '3-2' | '4-1' | 'office' | 'home'

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
      onNotify('Location Updated 📍', `${playlist[index].day} lunch flipped to ${targetLocName}.`, 'info');
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
      dayItem.isVaultScheduled = vaultIds.includes(newDish.id);
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

  // Skip & Bank credit (Initiate confirmation or restore directly)
  const handleSkipDay = (dayIndex) => {
    playPop();
    const isCurrentlySkipped = playlist[dayIndex].status === 'skipped';
    
    // If currently skipped, clicking restores immediately
    if (isCurrentlySkipped) {
      setPlaylist((prev) => {
        const next = [...prev];
        next[dayIndex] = {
          ...next[dayIndex],
          status: 'scheduled'
        };
        return next;
      });
      setConfirmSkipDayIndex(null);
      if (onNotify) {
        onNotify(
          'Meal Restored! 🥗',
          `${playlist[dayIndex].day} lunch restored to your weekly schedule.`,
          'info'
        );
      }
      return;
    }

    // If not skipped, open confirmation bar with complete breakdown
    setConfirmSkipDayIndex(dayIndex);
  };

  // Confirm Skip Action
  const handleExecuteSkip = (dayIndex) => {
    playPop();
    setPlaylist((prev) => {
      const next = [...prev];
      next[dayIndex] = {
        ...next[dayIndex],
        status: 'skipped'
      };
      return next;
    });
    setConfirmSkipDayIndex(null);

    if (onNotify) {
      const dishPrice = playlist[dayIndex]?.options[playlist[dayIndex]?.currentIdx]?.price || 190;
      if (paymentMode === 'prepaid') {
        onNotify(
          `${playlist[dayIndex].day} Lunch Skipped 🛡️`,
          `₹${dishPrice} preserved in MealsOn Balance • Valid 60 days on renewal.`,
          'success'
        );
      } else {
        onNotify(
          `${playlist[dayIndex].day} Debit Canceled! ⚡`,
          `10 PM auto-debit canceled. ₹0 charged to bank (No wallet credit issued).`,
          'info'
        );
      }
    }
  };

  // Get 5 swap candidates for a specific day (curated or vault)
  const getSwapCandidates = (currentDishId) => {
    if (swapModalFilter === 'vault') {
      const vList = vaultDishes.filter((d) => d.id !== currentDishId);
      return vList.length > 0 ? vList : MASTER_DISH_CATALOG.filter((d) => d.id !== currentDishId).slice(0, 5);
    }
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
    setDraggedDayIndex(null);
    setDragOverDayIndex(null);
    if (onNotify) {
      onNotify('Meals Swapped! 🔄', `Moved ${sourceDay}'s meal to ${targetDay}.`, 'info');
    }
  };

  // Calculate live totals
  const totalCost = playlist.reduce((acc, day) => {
    if (day.status === 'skipped') return acc;
    const meal = day.options[day.currentIdx] || day.options[0];
    return acc + (meal?.price || 0);
  }, 0);

  const activeMealsCount = playlist.filter((d) => d.status !== 'skipped').length;
  const officeDaysCount = playlist.filter((d) => d.location === 'office' && d.status !== 'skipped').length;
  const homeDaysCount = playlist.filter((d) => d.location === 'home' && d.status !== 'skipped').length;
  const skippedDaysCount = playlist.filter((d) => d.status === 'skipped').length;

  // Calendar Auto-Sync toggle
  const handleToggleCalendarSync = () => {
    const nextState = !calendarSyncActive;
    setCalendarSyncActive(nextState);
    playPop();
    if (nextState) {
      setPlaylist((prev) => {
        const next = [...prev];
        if (next[3]) {
          next[3] = {
            ...next[3],
            location: 'home',
            slot: '1:30 PM – 2:00 PM'
          };
        }
        return next;
      });
      setAutoSwitchedThursday(true);
      if (onNotify) {
        onNotify('Google Calendar Synced 📅', 'Detected Thursday WFH event ("Sprint Planning - Remote"). Rerouted to Home (1:30–2:00 PM).', 'info');
      }
    } else {
      setAutoSwitchedThursday(false);
      if (onNotify) {
        onNotify('Calendar Sync Paused', 'Manual scheduling enabled for all days.', 'info');
      }
    }
  };

  // Revert Thursday WFH switch
  const handleRevertThursday = () => {
    playPop();
    setPlaylist((prev) => {
      const next = [...prev];
      if (next[3]) {
        next[3] = {
          ...next[3],
          location: 'office',
          slot: '1:00 PM – 1:30 PM'
        };
      }
      return next;
    });
    setAutoSwitchedThursday(false);
    if (onNotify) {
      onNotify('Reverted to Office 🏢', 'Thursday lunch set to Cyber Park Tower B (1:00–1:30 PM).', 'info');
    }
  };

  // Apply default recurring routine (e.g. 3-2 = Mon-Wed Office, Thu-Fri Home)
  const applyRecurringRoutine = (pattern) => {
    setSelectedRoutine(pattern);
    playSuccessChime();
    setPlaylist((prev) => {
      return prev.map((day, idx) => {
        let targetLoc = 'office';
        if (pattern === '3-2') {
          targetLoc = idx < 3 ? 'office' : 'home';
        } else if (pattern === '4-1') {
          targetLoc = idx < 4 ? 'office' : 'home';
        } else if (pattern === 'home') {
          targetLoc = 'home';
        } else if (pattern === 'office') {
          targetLoc = 'office';
        }
        const defaultSlot = SAVED_LOCATIONS[targetLoc]?.defaultSlot || (targetLoc === 'office' ? '1:00 PM – 1:30 PM' : '1:30 PM – 2:00 PM');
        return {
          ...day,
          location: targetLoc,
          slot: defaultSlot
        };
      });
    });
    const label = pattern === '3-2' ? 'Mon–Wed Office • Thu–Fri Home' : pattern === '4-1' ? 'Mon–Thu Office • Fri Home' : pattern === 'office' ? 'All Days Office' : 'All Days Home';
    if (onNotify) {
      onNotify('Default Routine Applied ✨', `Set ${label} across all weeks.`, 'success');
    }
  };

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
    <div className="space-y-3.5 px-4 pt-3 pb-0 relative">
      {/* Food Vault Modal */}
      <FoodVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        vaultIds={vaultIds}
        onToggleVaultDish={handleToggleVaultDish}
        onNotify={onNotify}
      />

      <div className="space-y-3.5 animate-in fade-in duration-200">
        {/* Main Title + View Switcher (Cards vs Calendar) */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {viewLayout === 'cards' ? 'Your week' : 'Pass Calendar'}
            </h1>
            <p className="text-[11px] font-medium text-slate-500">
              {viewLayout === 'cards' ? 'Nov 3 – Nov 7 • Mon to Fri' : 'Nov 2026 • 20-Day Buffer Runway'}
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* View Switcher: [Cards] | [Calendar] */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 flex items-center shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setViewLayout('cards');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  viewLayout === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  setViewLayout('calendar');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  viewLayout === 'calendar'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {viewLayout === 'cards' ? (
          <div className="space-y-3.5">
            {/* Interactive Mini Week Date Strip */}
            <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-1.5">
              {playlist.map((dayItem, idx) => {
                const isOffice = dayItem.location === 'office';
                const isSkipped = dayItem.status === 'skipped';
                const isThursdaySync = idx === 3 && autoSwitchedThursday;
                return (
                  <button
                    key={dayItem.day}
                    type="button"
                    onClick={() => {
                      playPop();
                      const el = document.getElementById(`meal-card-${idx}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center transition-all border text-center cursor-pointer ${
                      isSkipped
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : isOffice
                        ? 'bg-blue-50/70 border-blue-200 text-blue-900 hover:bg-blue-100/70'
                        : 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-100/70'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{dayItem.day.slice(0, 3)}</span>
                    <span className="text-xs font-black text-slate-900">{idx + 3}</span>
                    <span className="text-[10px] mt-0.5">
                      {isSkipped ? '🛡️' : isThursdaySync ? '⚡' : isOffice ? '🏢' : '🏠'}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setViewLayout('calendar');
                }}
                className="px-2 py-2 rounded-xl bg-slate-100 hover:bg-[#FFF5F0] hover:text-[#FF5A1F] text-slate-600 border border-slate-200 text-[10px] font-extrabold flex flex-col items-center justify-center transition-all cta-bounce shrink-0 cursor-pointer"
                title="Open full monthly calendar & routing"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="mt-0.5 whitespace-nowrap">Month</span>
              </button>
            </div>

            {/* TOP-LEVEL MODE SWITCHER: AI MODE VS MY VAULT (At Top, Not In Card Input Field) */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                playPop();
                setPlannerMode('ai');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                plannerMode === 'ai'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${plannerMode === 'ai' ? 'text-[#FF5A1F]' : 'text-slate-400'}`} />
              <span>✨ AI Smart Planner</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPop();
                setPlannerMode('vault');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                plannerMode === 'vault'
                  ? 'bg-white text-rose-600 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${plannerMode === 'vault' ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>💖 My Food Vault ({vaultIds.length})</span>
            </button>
          </div>

          {/* 1. Planner Card (Clean Content based on Selected Top-Level Mode) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
            {/* Header: Clean Title based on Mode */}
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center space-x-2">
                {plannerMode === 'ai' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                    <h2 className="text-sm font-extrabold text-slate-900">
                      Smart planner
                    </h2>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <h2 className="text-sm font-extrabold text-slate-900">
                      My Food Vault
                    </h2>
                  </>
                )}
              </div>
              <span className={`text-[10px] font-bold ${plannerMode === 'ai' ? 'text-slate-400' : 'text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full'}`}>
                {plannerMode === 'ai' ? 'AI Auto-Pilot' : `${vaultIds.length} Dishes Approved`}
              </span>
            </div>

            {/* Content for AI Mode (Exact Match from Screenshot) */}
            {plannerMode === 'ai' ? (
              <div className="space-y-3 animate-in fade-in duration-150">
                {/* Prompt Box */}
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3">
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
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
                  className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-2 cursor-pointer"
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
            ) : (
              /* Content for My Food Vault Mode in V2 */
              <div className="space-y-3 animate-in fade-in duration-150">
                {/* Vault Summary & Stats Card */}
                <div className="bg-gradient-to-r from-rose-50/80 via-white to-orange-50/50 border border-rose-200 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100/80 border border-rose-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-rose-600" />
                      <span>Zero-Surprise Guarantee</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsVaultModalOpen(true)}
                      className="text-[11px] font-extrabold text-rose-600 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Manage 20 Dishes</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-snug">
                    Schedule 5 meals strictly rotated from your <strong>{vaultIds.length} approved favorites</strong>. Zero unwanted ingredients, zero repeats.
                  </p>

                  {/* Vault Stats Bar */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-rose-100 text-center">
                    <div className="bg-white/80 rounded-xl p-1.5 border border-rose-100/60">
                      <span className="text-[9px] text-slate-400 block font-semibold">Avg Cal</span>
                      <span className="text-xs font-black text-slate-800">{vaultAvgKcal} kcal</span>
                    </div>
                    <div className="bg-white/80 rounded-xl p-1.5 border border-rose-100/60">
                      <span className="text-[9px] text-slate-400 block font-semibold">Avg Protein</span>
                      <span className="text-xs font-black text-emerald-700">{vaultAvgProtein}g P</span>
                    </div>
                    <div className="bg-white/80 rounded-xl p-1.5 border border-rose-100/60">
                      <span className="text-[9px] text-slate-400 block font-semibold">Avg Price</span>
                      <span className="text-xs font-black text-[#FF5A1F]">₹{vaultAvgPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Friday Wildcard Toggle */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-bold text-slate-700">
                      Friday AI Discovery Wildcard
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playPop();
                      setFridayWildcard(!fridayWildcard);
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      fridayWildcard ? 'bg-[#FF5A1F]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        fridayWildcard ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Vault CTA Button */}
                <button
                  onClick={handleShuffleVaultSchedule}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-rose-500 to-[#FF5A1F] hover:from-rose-600 hover:to-[#E04812] text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Rotating Vault Schedule...</span>
                    </div>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Auto-Shuffle from Vault ({vaultIds.length} Dishes)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mobile UX Helper Tip Banner */}
          <div className="flex items-center justify-between px-2 py-0.5 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <span>💡</span>
              <span>Tap <strong>Move</strong> to shift days, or <strong>Flip</strong> to switch Home/Office</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">1-Tap Controls</span>
          </div>

          {/* Active Drag-and-Drop Banner Indicator */}
          {draggedDayIndex !== null && (
            <div className="bg-amber-100/90 border border-amber-300 rounded-2xl p-2.5 text-center text-xs font-bold text-amber-900 animate-pulse flex items-center justify-center space-x-2 shadow-xs">
              <GripVertical className="w-4 h-4 text-amber-700" />
              <span>
                Dragging <strong>{playlist[draggedDayIndex]?.day}</strong>'s meal. Drop on any other day card to swap days!
              </span>
            </div>
          )}

          {/* 2. Meal Cards List (Matching Screenshot Design Language + Mobile Ergonomics) */}
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
                const isBeingDragged = draggedDayIndex === idx;
                const isDragOverTarget = dragOverDayIndex === idx && draggedDayIndex !== null && draggedDayIndex !== idx;

                return (
                  <div
                    key={dayItem.day}
                    id={`meal-card-${idx}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedDayIndex !== null && draggedDayIndex !== idx) {
                        setDragOverDayIndex(idx);
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverDayIndex === idx) setDragOverDayIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedDayIndex !== null) {
                        handleShiftMeal(draggedDayIndex, idx);
                      }
                    }}
                    className={`bg-white rounded-3xl p-4 border transition-all shadow-xs space-y-3 relative overflow-hidden ${
                      isBeingDragged
                        ? 'opacity-40 border-[#FF5A1F] border-dashed ring-2 ring-[#FF5A1F]/30 scale-[0.98]'
                        : isDragOverTarget
                        ? 'border-2 border-dashed border-[#FF5A1F] bg-orange-50/70 ring-4 ring-[#FF5A1F]/20 scale-[1.01]'
                        : isSkipped
                        ? 'opacity-70 border-slate-300 bg-slate-50/70'
                        : isJustSwapped
                        ? 'border-[#10B981] ring-2 ring-[#10B981]/20 shadow-md'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Visual Drop Target Overlay Banner */}
                    {isDragOverTarget && (
                      <div className="absolute inset-0 bg-[#FF5A1F]/10 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-3xl border-2 border-dashed border-[#FF5A1F] pointer-events-none">
                        <div className="bg-[#FF5A1F] text-white text-xs font-black px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 animate-bounce">
                          <ArrowRightLeft className="w-4 h-4" />
                          <span>Drop here to swap with {playlist[draggedDayIndex]?.dayCode}!</span>
                        </div>
                      </div>
                    )}

                    {/* Header Row: Date & VISIBLY CLICKABLE Location CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-800">
                          {dayItem.dayCode}, {dayItem.dateStr}
                        </span>
                        {dayItem.isVaultScheduled && (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                            <Heart className="w-2.5 h-2.5 fill-current" />
                            <span>Vault</span>
                          </span>
                        )}
                      </div>

                      {/* REDESIGNED VISIBLY CLICKABLE LOCATION CTA BUTTON */}
                      <button
                        type="button"
                        onClick={() => toggleDayLocation(idx)}
                        title="Click to flip between Home and Office"
                        className={`group relative flex items-center space-x-1.5 py-1.5 px-3 rounded-full text-[11px] font-extrabold border transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer cta-bounce ${
                          isHome
                            ? 'bg-[#ECFDF5] text-[#065F46] border-[#6EE7B7] hover:bg-[#D1FAE5] hover:border-[#34D399]'
                            : 'bg-[#FFF7ED] text-[#9A3412] border-[#FDBA74] hover:bg-[#FFEDD5] hover:border-[#FB923C]'
                        }`}
                      >
                        <span className="flex items-center space-x-1">
                          {isHome ? (
                            <Home className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
                          )}
                          <span className="font-extrabold">{isHome ? 'Green Valley Apt' : 'Cyber Park Tower B'}</span>
                        </span>

                        {/* Interactive Flip Tag with icon */}
                        <span className={`inline-flex items-center space-x-0.5 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border shadow-2xs transition-transform group-hover:scale-105 ${
                          isHome
                            ? 'bg-white text-emerald-700 border-emerald-300'
                            : 'bg-white text-orange-700 border-orange-300'
                        }`}>
                          <ArrowRightLeft className="w-2.5 h-2.5" />
                          <span>Flip</span>
                        </span>
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

                    {/* Middle Content Row: Round Avatar + Details + PROMINENT PRICE BADGE */}
                    <div className="flex items-start justify-between space-x-2">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {/* Round Avatar with gray circle background */}
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {currentMeal.image}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-extrabold text-slate-900 leading-snug truncate">
                            {currentMeal.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {currentMeal.kitchen}
                          </p>
                          {/* Clean Macro Badges on Mobile */}
                          <div className="flex items-center space-x-1.5 mt-1">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md flex items-center space-x-0.5">
                              <span>🔥 {currentMeal.protein}g Protein</span>
                            </span>
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {currentMeal.kcal} kcal
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Standalone Price Badge with Pass Included tag (Brought from V1) */}
                      <div className="text-right shrink-0 pt-0.5">
                        <div className="text-sm font-black text-slate-900">
                          ₹{currentMeal.price}
                        </div>
                        <span className="text-[9px] font-extrabold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                          ✓ In Pass
                        </span>
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
                          className="text-[10px] font-extrabold text-[#FF5A1F] hover:underline flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>{activeSlotPickerDay === idx ? 'Close' : 'Change Window →'}</span>
                        </button>
                      </div>

                      {/* Expandable 30-Min Slot Selector */}
                      {activeSlotPickerDay === idx && (
                        <div className="grid grid-cols-3 gap-1.5 pt-1 animate-in fade-in duration-150">
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
                                className={`py-1.5 px-1 rounded-xl text-[9px] font-extrabold border transition-all text-center cursor-pointer ${
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

                    {/* Move / Shift Drawer (Large, Thumb-Friendly Alternate for Drag-and-Drop) */}
                    {activeShiftDay === idx && (
                      <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-[#FF5A1F]/30 space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-slate-900 flex items-center space-x-1">
                            <GripVertical className="w-3.5 h-3.5 text-[#FF5A1F]" />
                            <span>Shift {dayItem.dayCode}'s meal to:</span>
                          </span>
                          <button
                            onClick={() => setActiveShiftDay(null)}
                            className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                          {playlist.map((d, dIdx) => (
                            <button
                              key={d.day}
                              disabled={dIdx === idx}
                              onClick={() => handleShiftMeal(idx, dIdx)}
                              className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                                dIdx === idx
                                  ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                                  : 'bg-white text-slate-800 hover:bg-[#FF5A1F] hover:text-white border-slate-200 shadow-2xs active:scale-95'
                              }`}
                            >
                              {d.dayCode}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ======================================================== */}
                    {/* BOTTOM TOOLBAR: CONDITIONAL BASED ON SKIPPED STATE       */}
                    {/* ======================================================== */}
                    {isSkipped ? (
                      /* OPTION B: PRD-ALIGNED MINIMAL SKIPPED STATE */
                      <div className="bg-emerald-50/90 border-t border-emerald-200 -mx-4 -mb-4 p-3 rounded-b-3xl flex items-center justify-between animate-in fade-in duration-150">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-xs font-black text-emerald-950 block leading-tight">
                              {paymentMode === 'prepaid'
                                ? `Meal Skipped • ₹${currentMeal.price} Saved`
                                : '10 PM Debit Canceled • ₹0 Charged'}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-700">
                              {paymentMode === 'prepaid'
                                ? 'Credited to MealsOn Balance • Valid 60 days on renewal (max 25% offset).'
                                : 'Per-meal mandate auto-debit canceled for this day.'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSkipDay(idx)}
                          className="bg-white hover:bg-emerald-100 text-emerald-800 font-black text-xs px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs transition-all active:scale-95 shrink-0 cta-bounce cursor-pointer flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3 h-3 text-emerald-600" />
                          <span>Restore</span>
                        </button>
                      </div>
                    ) : (
                      /* REGULAR 3-ACTION TOOLBAR: Swap, Move, Skip */
                      <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200/90 -mx-4 -mb-4 mt-2">
                        {/* 1. Swap (Opens 4-5 alternative choices, including Vault items) */}
                        <button
                          type="button"
                          onClick={() => {
                            playPop();
                            setMultiSwapModalDay(idx);
                          }}
                          className="py-3 text-xs font-bold text-slate-700 hover:text-[#FF5A1F] hover:bg-slate-50/80 rounded-bl-3xl flex items-center justify-center space-x-1.5 transition-colors active:scale-95 cta-bounce cursor-pointer"
                        >
                          <Repeat className="w-3.5 h-3.5 text-slate-500" />
                          <span>Swap</span>
                        </button>

                        {/* 2. Move (DRAG-AND-DROP CONTROLLER WITH GRIP ICON) */}
                        <button
                          type="button"
                          draggable={true}
                          onDragStart={(e) => {
                            playPop();
                            e.dataTransfer.setData('text/plain', String(idx));
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggedDayIndex(idx);
                          }}
                          onDragEnd={() => {
                            setDraggedDayIndex(null);
                            setDragOverDayIndex(null);
                          }}
                          onClick={() => {
                            playPop();
                            setActiveShiftDay(activeShiftDay === idx ? null : idx);
                          }}
                          title="Drag this button to drop onto another day, or tap to choose"
                          className="group py-3 text-xs font-bold text-slate-700 hover:text-[#FF5A1F] hover:bg-orange-50/60 flex items-center justify-center space-x-1.5 transition-colors active:scale-95 cta-bounce cursor-grab active:cursor-grabbing select-none"
                        >
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5A1F] transition-colors" />
                          <span>Move</span>
                        </button>

                        {/* 3. Skip (Banks Credit) */}
                        <button
                          type="button"
                          onClick={() => handleSkipDay(idx)}
                          className={`py-3 text-xs font-bold transition-colors active:scale-95 rounded-br-3xl flex items-center justify-center space-x-1.5 cta-bounce cursor-pointer ${
                            confirmSkipDayIndex === idx
                              ? 'bg-amber-100 text-amber-900 font-extrabold'
                              : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50/80'
                          }`}
                        >
                          <SkipForward className="w-3.5 h-3.5 text-slate-500" />
                          <span>{paymentMode === 'prepaid' ? 'Skip & Bank' : 'Skip (₹0)'}</span>
                        </button>
                      </div>
                    )}

                    {/* Inline Confirmation Bar for Card (Pre-Skip Transparency) */}
                    {confirmSkipDayIndex === idx && day.status !== 'skipped' && (
                      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 border-t-2 border-amber-300 p-3 rounded-b-3xl space-y-2 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-1 border-b border-amber-200/60">
                          <span className="text-xs font-black text-amber-950 flex items-center space-x-1">
                            <span>🛡️</span>
                            <span>Confirm Skip: {day.day} Lunch ({currentMeal.name})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              playPop();
                              setConfirmSkipDayIndex(null);
                            }}
                            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-white/80 rounded px-1.5 py-0.5 border border-slate-200"
                          >
                            ✕ Cancel
                          </button>
                        </div>

                        {/* 4 Informational Pills */}
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="bg-white/90 p-1.5 rounded-lg border border-amber-200/50">
                            <span className="font-extrabold text-amber-900 block">💵 Financial Action</span>
                            <span className="text-slate-700">
                              {paymentMode === 'prepaid' ? `+₹${currentMeal.price} saved to Balance` : '₹0 debited at 10 PM'}
                            </span>
                          </div>
                          <div className="bg-white/90 p-1.5 rounded-lg border border-amber-200/50">
                            <span className="font-extrabold text-amber-900 block">⏳ 10 PM Cut-off</span>
                            <span className="text-slate-700">Free modifications before 10 PM</span>
                          </div>
                          <div className="bg-white/90 p-1.5 rounded-lg border border-amber-200/50">
                            <span className="font-extrabold text-amber-900 block">🔄 Rollover Expiry</span>
                            <span className="text-slate-700">
                              {paymentMode === 'prepaid' ? 'Valid 60 days on renewal' : 'No credit created'}
                            </span>
                          </div>
                          <div className="bg-white/90 p-1.5 rounded-lg border border-amber-200/50">
                            <span className="font-extrabold text-amber-900 block">↩️ Undo Policy</span>
                            <span className="text-slate-700">Can restore anytime before lock-in</span>
                          </div>
                        </div>

                        {/* Confirm CTA */}
                        <div className="flex items-center space-x-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              playPop();
                              setConfirmSkipDayIndex(null);
                            }}
                            className="flex-1 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs"
                          >
                            Keep Lunch
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExecuteSkip(idx)}
                            className="flex-1 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs flex items-center justify-center space-x-1 cta-bounce"
                          >
                            <SkipForward className="w-3 h-3" />
                            <span>{paymentMode === 'prepaid' ? `Confirm & Bank ₹${currentMeal.price}` : 'Confirm & Pay ₹0'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 📅 FULL MULTI-WEEK CALENDAR VIEW & HYBRID ROUTING HUB     */
        /* ======================================================== */
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* 1. Pass Runway & Buffer Horizon Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-4 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#FF5A1F]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Pass Runway & Horizon
                  </span>
                  <h3 className="text-sm font-black text-white">
                    14 Meals Left • Valid through Nov 26
                  </h3>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30 px-2.5 py-1 rounded-full">
                20-Day Buffer
              </span>
            </div>

            {/* Multi-Location Split Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">🏢 Office (Cyber Park)</span>
                <span className="text-sm font-black text-blue-300">{officeDaysCount} Drops</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">🏠 Home (Green Valley)</span>
                <span className="text-sm font-black text-emerald-300">{homeDaysCount} Drops</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">🛡️ Rollover Saved</span>
                <span className="text-sm font-black text-amber-300">₹{skippedDaysCount * 190}</span>
              </div>
            </div>
          </div>

          {/* 2. Google Calendar Auto-Reroute Intelligence Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Google Calendar Auto-Reroute
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Auto-detects WFH events & flips address at 8 PM prior
                  </span>
                </div>
              </div>

              {/* Toggle button */}
              <button
                type="button"
                onClick={handleToggleCalendarSync}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  calendarSyncActive ? 'bg-[#FF5A1F]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    calendarSyncActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {calendarSyncActive && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-2.5 text-xs text-blue-900 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">⚡</span>
                  <div>
                    <p className="font-bold text-[11px] leading-tight">
                      Thu, Nov 6: Detected WFH ("Sprint Planning - Remote")
                    </p>
                    <p className="text-[10px] text-blue-700">
                      {autoSwitchedThursday
                        ? 'Auto-switched to Home (Green Valley Apt • 1:30–2:00 PM)'
                        : 'Manually kept at Office (Cyber Park Tower B • 1:00–1:30 PM)'}
                    </p>
                  </div>
                </div>

                {autoSwitchedThursday ? (
                  <button
                    type="button"
                    onClick={handleRevertThursday}
                    className="text-[10px] font-extrabold text-blue-700 hover:text-blue-900 bg-white border border-blue-300 px-2 py-1 rounded-lg shrink-0 transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Undo</span>
                  </button>
                ) : (
                  <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    Overridden
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 3. Interactive Monthly Calendar Grid (November 2026) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  November 2026 Schedule
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Tap any weekday to view meal, flip location, or skip
                </p>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold">
                <span className="flex items-center space-x-1 text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Office</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Home</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>Skip</span>
                </span>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-black text-[10px] text-slate-400 pb-1 border-b border-slate-100">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span className="text-slate-300">S</span>
              <span className="text-slate-300">S</span>
            </div>

            {/* Week 1: Active Pass Week (Nov 3 - 7 + weekend Nov 8-9) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">
                <span>Week 1 (Active Meal Playlist)</span>
                <span className="text-[#FF5A1F]">Current Week</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {playlist.map((dayItem, idx) => {
                  const isSelected = selectedCalendarDay === idx;
                  const isOffice = dayItem.location === 'office';
                  const isSkipped = dayItem.status === 'skipped';
                  const isThursdaySync = idx === 3 && autoSwitchedThursday;
                  const meal = dayItem.options[dayItem.currentIdx] || dayItem.options[0];

                  return (
                    <button
                      key={dayItem.day}
                      type="button"
                      onClick={() => {
                        playPop();
                        setSelectedCalendarDay(idx);
                      }}
                      className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all border cursor-pointer relative ${
                        isSelected
                          ? 'ring-2 ring-[#FF5A1F] border-[#FF5A1F] bg-orange-50/50 shadow-xs'
                          : isSkipped
                          ? 'bg-slate-50 border-slate-200 text-slate-400'
                          : isOffice
                          ? 'bg-blue-50/60 border-blue-200 text-blue-900 hover:bg-blue-100/50'
                          : 'bg-emerald-50/60 border-emerald-200 text-emerald-900 hover:bg-emerald-100/50'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-900">{idx + 3}</span>
                      <span className="text-[10px] mt-0.5">
                        {isSkipped ? '🛡️' : isThursdaySync ? '⚡' : isOffice ? '🏢' : '🏠'}
                      </span>
                      <span className="text-[8px] font-extrabold truncate w-full text-center mt-0.5 leading-tight text-slate-600">
                        {isSkipped ? 'Skip' : meal.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
                {/* Weekend Sat 8 & Sun 9 */}
                <div className="py-2 px-1 rounded-xl bg-slate-50 border border-slate-100/80 text-center flex flex-col items-center justify-center opacity-40">
                  <span className="text-xs font-semibold text-slate-400">8</span>
                  <span className="text-[9px] text-slate-400">☕</span>
                </div>
                <div className="py-2 px-1 rounded-xl bg-slate-50 border border-slate-100/80 text-center flex flex-col items-center justify-center opacity-40">
                  <span className="text-xs font-semibold text-slate-400">9</span>
                  <span className="text-[9px] text-slate-400">☕</span>
                </div>
              </div>
            </div>

            {/* Week 2: Pass Buffer Runway (Nov 10 - 16) */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">
                <span>Week 2 (Pass Buffer Runway)</span>
                <span className="text-slate-500">Scheduled Ahead</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[10, 11, 12, 13, 14].map((d, dIdx) => (
                  <div
                    key={d}
                    className="py-2 px-1 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-xs font-bold text-slate-700">{d}</span>
                    <span className="text-[10px] mt-0.5">{dIdx < 3 ? '🏢' : '🏠'}</span>
                    <span className="text-[8px] font-semibold text-slate-400 mt-0.5">Pass</span>
                  </div>
                ))}
                <div className="py-2 px-1 rounded-xl bg-slate-50 border border-slate-100/80 text-center flex flex-col items-center justify-center opacity-40">
                  <span className="text-xs font-semibold text-slate-400">15</span>
                  <span className="text-[9px] text-slate-400">☕</span>
                </div>
                <div className="py-2 px-1 rounded-xl bg-slate-50 border border-slate-100/80 text-center flex flex-col items-center justify-center opacity-40">
                  <span className="text-xs font-semibold text-slate-400">16</span>
                  <span className="text-[9px] text-slate-400">☕</span>
                </div>
              </div>
            </div>

            {/* Week 3 & 4 (Expiry Buffer Horizon) */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">
                <span>Buffer Boundary</span>
                <span className="text-rose-600 font-extrabold">Nov 26 Expiry (20d Buffer)</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[17, 18, 19, 20, 21].map((d) => (
                  <div
                    key={d}
                    className="py-1.5 px-1 rounded-lg bg-slate-50 border border-slate-100 text-center"
                  >
                    <span className="text-[11px] font-medium text-slate-500">{d}</span>
                  </div>
                ))}
                <div className="py-1.5 px-1 rounded-lg bg-slate-50 opacity-40 text-center text-[11px] text-slate-400">22</div>
                <div className="py-1.5 px-1 rounded-lg bg-slate-50 opacity-40 text-center text-[11px] text-slate-400">23</div>
              </div>
            </div>
          </div>

          {/* 4. Selected Day Inspector & Quick Action Card */}
          {selectedCalendarDay !== null && playlist[selectedCalendarDay] && (
            <div className="bg-white rounded-3xl p-4 border-2 border-[#FF5A1F]/30 shadow-md space-y-3 animate-in fade-in">
              {/* Header with Date & Day */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-base">
                    {playlist[selectedCalendarDay].location === 'office' ? '🏢' : '🏠'}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {playlist[selectedCalendarDay].day}, Nov {selectedCalendarDay + 3}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-500">
                      {playlist[selectedCalendarDay].status === 'skipped'
                        ? '🛡️ Skipped • ₹190 Preserved in MealsOn Balance'
                        : `Scheduled • ${playlist[selectedCalendarDay].location === 'office' ? 'Cyber Park Tower B' : 'Green Valley Apt'}`}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    playlist[selectedCalendarDay].status === 'skipped'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-orange-50 text-[#FF5A1F] border-orange-200'
                  }`}
                >
                  {playlist[selectedCalendarDay].status === 'skipped' ? 'Skipped 🛡️' : 'Active Lunch'}
                </span>
              </div>

              {/* Dish Info */}
              {(() => {
                const dayItem = playlist[selectedCalendarDay];
                const currentMeal = dayItem.options[dayItem.currentIdx] || dayItem.options[0];
                return (
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{currentMeal.image}</span>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 leading-tight">
                          {currentMeal.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {currentMeal.kitchen} • {currentMeal.protein}g Protein • {currentMeal.kcal} kcal
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 block">₹{currentMeal.price}</span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        In Pass
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* 1-Tap Delivery Address Switcher */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Delivery Address (1-Tap Flip)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (playlist[selectedCalendarDay].location !== 'office') {
                        toggleDayLocation(selectedCalendarDay);
                      }
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2 ${
                      playlist[selectedCalendarDay].location === 'office'
                        ? 'bg-blue-50/80 border-blue-400 text-blue-950 font-black shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 shrink-0 ${playlist[selectedCalendarDay].location === 'office' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <span className="text-[11px] block truncate font-bold">🏢 Cyber Park</span>
                      <span className="text-[9px] text-slate-500 block">Office Pod</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (playlist[selectedCalendarDay].location !== 'home') {
                        toggleDayLocation(selectedCalendarDay);
                      }
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2 ${
                      playlist[selectedCalendarDay].location === 'home'
                        ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-black shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className={`w-4 h-4 shrink-0 ${playlist[selectedCalendarDay].location === 'home' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <span className="text-[11px] block truncate font-bold">🏠 Green Valley</span>
                      <span className="text-[9px] text-slate-500 block">Residence</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 30-Min Delivery Window Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    30-Min Delivery Wave
                  </label>
                  <span className="text-[9px] font-bold text-slate-400">Batched hot drops</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_WINDOWS.map((tw) => {
                    const isSelectedSlot = playlist[selectedCalendarDay].slot === tw;
                    return (
                      <button
                        key={tw}
                        type="button"
                        onClick={() => selectTimeSlot(selectedCalendarDay, tw)}
                        className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all text-center cursor-pointer ${
                          isSelectedSlot
                            ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {tw.replace(' PM', '').replace(' – ', '-')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Action Buttons (Skip & Swap) */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (playlist[selectedCalendarDay].status === 'skipped') {
                      handleSkipDay(selectedCalendarDay);
                    } else if (confirmSkipDayIndex === selectedCalendarDay) {
                      handleExecuteSkip(selectedCalendarDay);
                    } else {
                      setConfirmSkipDayIndex(selectedCalendarDay);
                    }
                  }}
                  className={`py-2.5 px-3 rounded-xl border font-extrabold text-xs active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    confirmSkipDayIndex === selectedCalendarDay && playlist[selectedCalendarDay].status !== 'skipped'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm animate-pulse'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>
                    {playlist[selectedCalendarDay].status === 'skipped'
                      ? 'Restore Meal'
                      : confirmSkipDayIndex === selectedCalendarDay
                      ? paymentMode === 'prepaid'
                        ? 'Click to Confirm Bank ₹190'
                        : 'Click to Confirm Pay ₹0'
                      : paymentMode === 'prepaid'
                      ? 'Skip & Bank ₹190'
                      : 'Skip & Pay ₹0'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setMultiSwapModalDay(selectedCalendarDay);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-orange-50 border border-orange-200 text-[#FF5A1F] font-extrabold text-xs hover:bg-orange-100 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Swap Dish</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. Set Recurring Hybrid Routine Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A1F]">
                Weekly Routine Automation
              </span>
              <h4 className="text-xs font-black text-slate-900">
                Set Recurring Hybrid Work Pattern
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                Applies your preferred office vs home schedule to all future AI meal generations
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '3-2', label: '3 Office • 2 Home', desc: 'Mon–Wed Cyber Park • Thu–Fri Home' },
                { id: '4-1', label: '4 Office • 1 Home', desc: 'Mon–Thu Cyber Park • Fri Home' },
                { id: 'office', label: '100% Office', desc: 'All 5 days at Cyber Park Tower B' },
                { id: 'home', label: '100% Home', desc: 'All 5 days at Green Valley Apt' }
              ].map((pat) => (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => applyRecurringRoutine(pat.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedRoutine === pat.id
                      ? 'bg-[#FFF5F0] border-[#FF5A1F] shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <span className={`text-[11px] font-extrabold block ${selectedRoutine === pat.id ? 'text-[#FF5A1F]' : 'text-slate-800'}`}>
                    {pat.label}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium block leading-tight mt-0.5">
                    {pat.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Office Pod Batching Unit Economics Explainer */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-3.5 text-xs text-emerald-950 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h5 className="font-extrabold text-[11px] leading-tight">
                Why Batch Delivery is 100% Free
              </h5>
              <p className="text-[10px] text-emerald-700 leading-relaxed mt-0.5">
                MealsOn batches 5+ deliveries to Cyber Park Tower B in 30-min milk-run windows, saving ₹40/drop. That savings is directly passed to you as free delivery on every meal pass!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>

      {/* ======================================================== */}
      {/* 4–5 OPTION SWAP MODAL / BOTTOM SHEET WITH VAULT FILTER   */}
      {/* ======================================================== */}
      {multiSwapModalDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in duration-150">
          <div className="w-full max-w-[420px] bg-white rounded-t-3xl p-4 pb-8 space-y-3.5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
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
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source Filter Tabs: Curated vs My Vault */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setSwapModalFilter('curated');
                }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  swapModalFilter === 'curated'
                    ? 'bg-white text-slate-900 font-extrabold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Chef Curated (5)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setSwapModalFilter('vault');
                }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  swapModalFilter === 'vault'
                    ? 'bg-rose-500 text-white font-extrabold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>From My Vault ({vaultDishes.length})</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              {swapModalFilter === 'vault' ? (
                <span>Pick from your <strong>pre-approved favorite vault dishes</strong>:</span>
              ) : (
                <span>Select one of the <strong>5 chef-curated alternatives</strong> under your ₹250 pass cap:</span>
              )}
            </p>

            {/* List of Alternative Dishes */}
            <div className="space-y-2.5">
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
                        {vaultIds.includes(candidate.id) && (
                          <span className="text-[8px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-1 py-0.2 rounded flex items-center gap-0.5">
                            <Heart className="w-2 h-2 fill-current" />
                            <span>Vault</span>
                          </span>
                        )}
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
                      className="bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
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

      {/* Sticky Bottom Footer Docked Directly Above BottomNav */}
      <div className="sticky bottom-0 -mx-4 mt-6 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-semibold text-slate-600">
            {activeMealsCount} of 5 Lunches • Avg <strong className="text-slate-900 font-bold">{avgProtein}g</strong> Protein
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-[#FF5A1F]">₹{totalCost}</span>
          </div>
        </div>

        <button
          onClick={handleLockIn}
          className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <span>Lock In Weekly Playlist</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
