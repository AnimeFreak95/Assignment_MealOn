import React, { useState } from 'react';
import { MapPin, Building2, Home, Calendar, Clock, Check, RotateCcw } from 'lucide-react';
import { SAVED_LOCATIONS } from '../data/mockData';
import { playPop, playSuccessChime } from '../utils/audioDelight';

const TIME_WINDOWS = [
  '12:30 PM – 12:45 PM',
  '1:00 PM – 1:15 PM',
  '1:30 PM – 1:45 PM',
  '2:00 PM – 2:15 PM'
];

export default function RoutingTab({ playlist, setPlaylist, onNotify }) {
  const [calendarSyncActive, setCalendarSyncActive] = useState(false);
  const [autoSwitchedThursday, setAutoSwitchedThursday] = useState(false);
  const [selectedPillDay, setSelectedPillDay] = useState(0);

  // Toggle delivery address between office and home
  const toggleDayLocation = (index) => {
    playPop();
    setPlaylist((prev) => {
      const next = [...prev];
      const currentLoc = next[index].location;
      const newLoc = currentLoc === 'office' ? 'home' : 'office';
      const defaultSlot = SAVED_LOCATIONS[newLoc].defaultSlot;
      next[index] = {
        ...next[index],
        location: newLoc,
        slot: defaultSlot
      };
      return next;
    });
  };

  // Change 15-min delivery slot
  const changeSlot = (index, slot) => {
    playPop();
    setPlaylist((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], slot };
      return next;
    });
  };

  // Calendar Sync Toggle
  const handleToggleCalendar = () => {
    const nextState = !calendarSyncActive;
    setCalendarSyncActive(nextState);
    playSuccessChime();

    if (nextState) {
      setPlaylist((prev) => {
        const next = [...prev];
        if (next[3]) {
          next[3] = {
            ...next[3],
            location: 'home',
            slot: '1:30 PM – 1:45 PM'
          };
        }
        return next;
      });
      setAutoSwitchedThursday(true);
      if (onNotify) {
        onNotify('Calendar Synced 📅', 'Thursday switched to Home for WFH event.', 'info');
      }
    } else {
      setAutoSwitchedThursday(false);
    }
  };

  // Undo Calendar switch for Thursday
  const handleUndoThursday = () => {
    playPop();
    setPlaylist((prev) => {
      const next = [...prev];
      if (next[3]) {
        next[3] = {
          ...next[3],
          location: 'office',
          slot: '1:00 PM – 1:15 PM'
        };
      }
      return next;
    });
    setAutoSwitchedThursday(false);
    if (onNotify) {
      onNotify('Reverted', 'Thursday reset to Office delivery.', 'info');
    }
  };

  // Summary counts
  const officeCount = playlist.filter((d) => d.location === 'office').length;
  const homeCount = playlist.filter((d) => d.location === 'home').length;

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5">
      {/* Route Summary Bar (Clean & Visual) */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center text-[#FF5A1F]">
            <Building2 className="w-3.5 h-3.5 mr-1" />
            {officeCount} Office Days
          </span>
          <span className="flex items-center text-emerald-600">
            <Home className="w-3.5 h-3.5 mr-1" />
            {homeCount} Home Days
          </span>
        </div>

        {/* Visual Route Bar */}
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="bg-[#FF5A1F] h-full transition-all duration-300"
            style={{ width: `${(officeCount / 5) * 100}%` }}
          />
          <div
            className="bg-[#10B981] h-full transition-all duration-300"
            style={{ width: `${(homeCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Smart Calendar Sync Card (Sleek, Glanceable) */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Calendar Auto-Reroute
              </h4>
              <p className="text-[10px] text-slate-500">Auto-flips to Home when WFH detected</p>
            </div>
          </div>

          <button
            onClick={handleToggleCalendar}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 focus:outline-none cta-bounce ${
              calendarSyncActive ? 'bg-[#FF5A1F]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                calendarSyncActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Compact Alert Banner */}
        {calendarSyncActive && autoSwitchedThursday && (
          <div className="bg-[#FFF5F0] border border-[#FF5A1F]/30 rounded-xl p-2 text-xs text-slate-800 flex items-center justify-between animate-in fade-in duration-200">
            <span className="text-[11px]">
              📅 <strong>Thursday WFH:</strong> Rerouted to Home
            </span>
            <button
              onClick={handleUndoThursday}
              className="text-[10px] font-bold text-[#FF5A1F] hover:underline flex items-center ml-2 shrink-0"
            >
              <RotateCcw className="w-2.5 h-2.5 mr-0.5" /> Undo
            </button>
          </div>
        )}
      </div>

      {/* 5-Day Horizontal Pill Selector */}
      <div className="flex items-center justify-between space-x-1.5 bg-slate-100 p-1 rounded-xl">
        {playlist.map((d, index) => {
          const isSelected = selectedPillDay === index;
          const isOffice = d.location === 'office';

          return (
            <button
              key={d.dayCode}
              onClick={() => {
                playPop();
                setSelectedPillDay(index);
              }}
              className={`flex-1 py-1 rounded-lg text-center transition-all cta-bounce ${
                isSelected
                  ? 'bg-white shadow-xs font-bold text-slate-900 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700 font-semibold text-[11px]'
              }`}
            >
              <div className="text-[10px]">{d.dayCode}</div>
              <div
                className={`text-[9px] font-extrabold mt-0.5 px-1 rounded-full inline-block ${
                  isOffice ? 'bg-[#FFF5F0] text-[#FF5A1F]' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {isOffice ? 'Office' : 'Home'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Streamlined Day Cards */}
      <div className="space-y-2.5">
        {playlist.map((dayItem, index) => {
          const isOffice = dayItem.location === 'office';
          const meal = dayItem.options[dayItem.currentIdx];

          return (
            <div
              key={dayItem.day}
              className={`bg-white rounded-2xl p-3 border transition-all ${
                isOffice ? 'border-slate-200 hover:border-[#FF5A1F]/40' : 'border-slate-200 hover:border-emerald-300'
              } shadow-sm`}
            >
              {/* Day Header & Office/Home Segmented Switch */}
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-900">
                  {dayItem.day} <span className="text-[10px] font-medium text-slate-400">({dayItem.dateStr})</span>
                </span>

                {/* 1-Tap Toggle Switch */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => {
                      if (!isOffice) toggleDayLocation(index);
                    }}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cta-bounce ${
                      isOffice ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Building2 className="w-3 h-3" />
                    <span>Office</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isOffice) toggleDayLocation(index);
                    }}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cta-bounce ${
                      !isOffice ? 'bg-[#10B981] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Home className="w-3 h-3" />
                    <span>Home</span>
                  </button>
                </div>
              </div>

              {/* Minimal Destination Banner (Tap to flip) */}
              <div
                onClick={() => toggleDayLocation(index)}
                className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors active:scale-[0.99] ${
                  isOffice
                    ? 'bg-[#FFF5F0]/60 border-[#FF5A1F]/20 text-slate-900'
                    : 'bg-emerald-50/50 border-emerald-200/50 text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      isOffice ? 'bg-[#FF5A1F] text-white' : 'bg-[#10B981] text-white'
                    }`}
                  >
                    {isOffice ? <Building2 className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                  </div>
                  <span className="text-xs font-bold">
                    {isOffice ? SAVED_LOCATIONS.office.name : SAVED_LOCATIONS.home.name}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-slate-400">1-Tap Flip</span>
              </div>

              {/* Time Window Dropdown & Meal label */}
              <div className="flex items-center justify-between pt-1.5 text-xs">
                <div className="flex items-center space-x-1 text-slate-600">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-medium">Slot:</span>
                  <select
                    value={dayItem.slot}
                    onChange={(e) => changeSlot(index, e.target.value)}
                    className="text-[10px] font-semibold text-slate-900 bg-slate-100 border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                  >
                    {TIME_WINDOWS.map((tw) => (
                      <option key={tw} value={tw}>
                        {tw}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-[10px] font-medium text-slate-500 truncate max-w-[140px]">
                  {meal.image} {meal.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
