import React, { useState } from 'react';
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
  ArrowRightLeft
} from 'lucide-react';
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

  // Drag-and-Drop & Shift Slider State
  const [draggedDayIndex, setDraggedDayIndex] = useState(null);
  const [dragOverDayIndex, setDragOverDayIndex] = useState(null);
  const [activeShiftDay, setActiveShiftDay] = useState(null);
  const [shiftSliderVal, setShiftSliderVal] = useState(0);

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

  // Trigger shimmer loading with delight
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

  // Shift/Swap entire meal between two days (e.g. Tuesday -> Monday)
  const handleShiftMeal = (sourceIdx, targetIdx) => {
    if (sourceIdx === targetIdx || sourceIdx == null || targetIdx == null) return;
    const sourceDay = playlist[sourceIdx]?.day;
    const targetDay = playlist[targetIdx]?.day;

    setPlaylist((prev) => {
      const next = [...prev];
      const source = next[sourceIdx];
      const target = next[targetIdx];

      // Swap the meal data (options & current selection) while preserving the day/slot structure
      const newSource = {
        ...source,
        options: target.options,
        currentIdx: target.currentIdx,
      };
      const newTarget = {
        ...target,
        options: source.options,
        currentIdx: source.currentIdx,
      };

      next[sourceIdx] = newSource;
      next[targetIdx] = newTarget;
      return next;
    });

    playSuccessChime();
    setJustSwappedDay(targetIdx);
    setActiveShiftDay(null);
    setTimeout(() => setJustSwappedDay(null), 1600);

    if (onNotify) {
      onNotify(
        'Meal Shifted! 🔄',
        `Shifted ${sourceDay}'s meal to ${targetDay}.`,
        'success'
      );
    }
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
    <div className="pb-28 px-4 pt-3 space-y-3.5">
      {/* 1. Concise AI Prompt Box (Less Text, High Visual Impact) */}
      <div className="bg-white rounded-2xl p-3.5 border-2 border-[#FF5A1F] shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFF5F0] flex items-center justify-center text-[#FF5A1F]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              AI Playlist Auto-Pilot
            </h2>
          </div>
          <span className="text-[10px] font-bold bg-[#FFF5F0] text-[#FF5A1F] px-2 py-0.5 rounded-full border border-[#FF5A1F]/30">
            Smart Agent
          </span>
        </div>

        {/* Editable Prompt Area */}
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={2}
          className="w-full text-xs text-slate-800 bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F] resize-none font-medium leading-snug"
          placeholder="Describe your dietary goals..."
        />

        {/* Quick-toggle Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 hide-scrollbar">
          {FILTER_CHIPS.map((chip) => {
            const active = activeChips.includes(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => toggleChip(chip.id)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all border cta-bounce ${
                  active
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                    : 'bg-[#F8FAFC] text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {active && <Check className="w-2.5 h-2.5 inline mr-1 -mt-0.5 stroke-[3]" />}
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full mt-1 bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Curating 5-Day Menu...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate 5-Day Playlist ✨</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Streamlined Mon–Fri Schedule (Reduced Text Density) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-800">
            Mon – Fri Schedule
          </h3>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
            Fresh Kitchen Drops
          </span>
        </div>

        {/* Tip Pill for Drag & Shift */}
        <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/90 px-2.5 py-1.5 rounded-xl text-[10px] text-amber-900 shadow-2xs">
          <div className="flex items-center space-x-1.5">
            <GripVertical className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Shift Meals:</strong> Drag cards or use the <strong>Shift slider ⠿</strong> on the right to swap days (e.g. Tue ➔ Mon)
            </span>
          </div>
        </div>

        {isLoading ? (
          // Shimmer loading state
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-slate-200 rounded-md" />
                  <div className="h-4 w-10 bg-slate-200 rounded-md" />
                </div>
                <div className="h-5 w-40 bg-slate-200 rounded-md" />
                <div className="flex space-x-2 pt-1">
                  <div className="h-4 w-12 bg-slate-100 rounded-full" />
                  <div className="h-4 w-16 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          playlist.map((dayItem, idx) => {
            const currentMeal = dayItem.options[dayItem.currentIdx];
            const isFading = swappingDay === idx;
            const isJustSwapped = justSwappedDay === idx;
            const isDragging = draggedDayIndex === idx;
            const isDragOver = dragOverDayIndex === idx && draggedDayIndex !== idx;

            return (
              <div
                key={dayItem.day}
                draggable={true}
                onDragStart={(e) => {
                  setDraggedDayIndex(idx);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', String(idx));
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverDayIndex !== idx) {
                    setDragOverDayIndex(idx);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverDayIndex === idx) {
                    setDragOverDayIndex(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const source =
                    draggedDayIndex !== null
                      ? draggedDayIndex
                      : parseInt(e.dataTransfer.getData('text/plain'), 10);
                  if (!isNaN(source) && source !== idx) {
                    handleShiftMeal(source, idx);
                  }
                  setDraggedDayIndex(null);
                  setDragOverDayIndex(null);
                }}
                onDragEnd={() => {
                  setDraggedDayIndex(null);
                  setDragOverDayIndex(null);
                }}
                className={`bg-white rounded-2xl p-3 border transition-all relative ${
                  isDragging
                    ? 'opacity-40 border-dashed border-[#FF5A1F] scale-[0.98]'
                    : isDragOver
                    ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/30 bg-[#FFF5F0]/70 scale-[1.01] shadow-md'
                    : isFading
                    ? 'opacity-40 scale-[0.99]'
                    : isJustSwapped
                    ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20 shadow-md'
                    : 'border-slate-200/90 shadow-sm opacity-100 scale-100 hover:border-[#FF5A1F]/40'
                }`}
              >
                {/* Drag-over dropzone overlay */}
                {isDragOver && (
                  <div className="absolute inset-0 bg-[#FFF5F0]/95 rounded-2xl border-2 border-dashed border-[#FF5A1F] flex flex-col items-center justify-center z-20 p-2 animate-in fade-in">
                    <ArrowRightLeft className="w-5 h-5 text-[#FF5A1F] animate-bounce mb-1" />
                    <span className="text-xs font-extrabold text-[#FF5A1F]">
                      Drop here to swap with {playlist[draggedDayIndex]?.day}!
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {playlist[draggedDayIndex]?.options[playlist[draggedDayIndex]?.currentIdx]?.name}
                    </span>
                  </div>
                )}

                {/* Micro delight pop badge on swap */}
                {isJustSwapped && (
                  <div className="absolute -top-2 right-3 bg-[#FF5A1F] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center space-x-1 animate-in zoom-in-75 z-10">
                    <ChefHat className="w-3 h-3" />
                    <span>Shifted! 🔄</span>
                  </div>
                )}

                {/* Day Badge, Price & Drag Handle */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {dayItem.day} • {dayItem.slot.split('–')[0].trim()}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {dayItem.currentIdx + 1}/{dayItem.options.length}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-[#FF5A1F]">
                      ₹{currentMeal.price}
                    </span>

                    {/* Drag & Drop Shift Slider Handle at Right Corner */}
                    <button
                      type="button"
                      title="Drag to swap or tap to open Day Shifter Slider"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPop();
                        if (activeShiftDay === idx) {
                          setActiveShiftDay(null);
                        } else {
                          setActiveShiftDay(idx);
                          // Default target is previous day (e.g. Tuesday -> Monday) or next day
                          setShiftSliderVal(idx === 0 ? 1 : idx - 1);
                        }
                      }}
                      className={`p-1 px-1.5 rounded-lg border flex items-center space-x-1 transition-all cursor-grab active:cursor-grabbing cta-bounce ${
                        activeShiftDay === idx
                          ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs ring-1 ring-[#FF5A1F]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                      <SlidersHorizontal className="w-2.5 h-2.5 text-[#FF5A1F] group-hover:text-white" />
                      <span className="text-[9px] font-extrabold">Shift</span>
                    </button>
                  </div>
                </div>

                {/* In-Card Day Shifter Slider & 1-Tap Swapper */}
                {activeShiftDay === idx && (
                  <div className="my-2.5 p-2.5 bg-gradient-to-r from-[#FFF5F0] to-[#FFF1EB] rounded-xl border border-[#FF5A1F]/30 animate-in fade-in slide-in-from-top-1 shadow-inner">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1">
                        <ArrowRightLeft className="w-3 h-3 text-[#FF5A1F]" />
                        <span className="text-[10px] font-extrabold text-slate-900">
                          Shift {dayItem.day}'s Meal to another day:
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-[#FF5A1F] bg-white border border-[#FF5A1F]/30 px-1.5 py-0.5 rounded-md">
                        Drag or Tap
                      </span>
                    </div>

                    {/* Interactive Slider */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 px-1">
                        {playlist.map((d, dIdx) => (
                          <span
                            key={d.day}
                            className={shiftSliderVal === dIdx ? 'text-[#FF5A1F] font-extrabold' : ''}
                          >
                            {d.dayCode || d.day.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={shiftSliderVal}
                        onChange={(e) => {
                          playPop();
                          setShiftSliderVal(parseInt(e.target.value, 10));
                        }}
                        className="w-full accent-[#FF5A1F] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Target Day Preview & Quick CTA */}
                    <div className="mt-2 pt-2 border-t border-[#FF5A1F]/20 flex items-center justify-between">
                      <div className="text-[10px] text-slate-700">
                        Shift to: <strong className="text-slate-950 font-bold">{playlist[shiftSliderVal]?.day}</strong>
                        <span className="text-[9px] text-slate-500 block truncate max-w-[150px]">
                          Swaps with: {playlist[shiftSliderVal]?.options[playlist[shiftSliderVal]?.currentIdx]?.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveShiftDay(null);
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={shiftSliderVal === idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShiftMeal(idx, shiftSliderVal);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cta-bounce flex items-center space-x-1 shadow-xs ${
                            shiftSliderVal === idx
                              ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                              : 'bg-[#FF5A1F] hover:bg-[#E04812] text-white'
                          }`}
                        >
                          <span>Shift to {playlist[shiftSliderVal]?.dayCode || playlist[shiftSliderVal]?.day.slice(0, 3)} ➔</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick 1-Tap Day Buttons */}
                    <div className="grid grid-cols-5 gap-1 mt-2">
                      {playlist.map((targetDay, tIdx) => {
                        const isSelf = tIdx === idx;
                        const isSelected = shiftSliderVal === tIdx;
                        return (
                          <button
                            key={targetDay.day}
                            type="button"
                            disabled={isSelf}
                            onClick={(e) => {
                              e.stopPropagation();
                              playPop();
                              setShiftSliderVal(tIdx);
                              handleShiftMeal(idx, tIdx);
                            }}
                            className={`py-1 rounded-md text-[9px] font-bold border transition-all text-center ${
                              isSelf
                                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {targetDay.dayCode || targetDay.day.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dish Name & Kitchen Rating (Text trimmed for elegance) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl select-none">{currentMeal.image}</span>
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
