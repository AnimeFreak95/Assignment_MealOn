import React, { useState } from 'react';
import { MapPin, Building2, Home, Calendar, Clock, Check, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';
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

  // Toggle delivery address between office and home for a given day index
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
      // Find Thursday (index 3) and switch to Home if it was Office
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
        onNotify('Calendar Synced 📅', 'Detected "WFH - Sprint Planning" on Thursday. Switched to Home automatically.', 'info');
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

  // Compute summary stats
  const officeCount = playlist.filter((d) => d.location === 'office').length;
  const homeCount = playlist.filter((d) => d.location === 'home').length;

  return (
    <div className="pb-28 px-4 pt-3 space-y-4">
      {/* Title & Route Summary Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-[#FFF5F0] flex items-center justify-center text-[#FF5A1F]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Hybrid Split-Location Routing
            </h2>
            <p className="text-[11px] text-slate-500">
              Deliver lunch where you actually work each day
            </p>
          </div>
        </div>

        {/* Visual Route Summary Bar */}
        <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80 mt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center text-[#FF5A1F]">
              <Building2 className="w-3.5 h-3.5 mr-1" />
              {officeCount} Office Days
            </span>
            <span className="flex items-center text-emerald-600">
              <Home className="w-3.5 h-3.5 mr-1" />
              {homeCount} Home Days
            </span>
          </div>

          {/* Progress bar split */}
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
      </div>

      {/* Smart Calendar Sync Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Google / Outlook Calendar Sync
              </h4>
              <p className="text-[10px] text-slate-500">
                Auto-adapts delivery when WFH / OOO is detected
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleCalendar}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none cta-bounce ${
              calendarSyncActive ? 'bg-[#FF5A1F]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                calendarSyncActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Inline Alert Banner when Calendar Sync is active */}
        {calendarSyncActive && autoSwitchedThursday && (
          <div className="bg-[#FFF5F0] border border-[#FF5A1F]/30 rounded-xl p-2.5 text-xs text-slate-800 animate-in fade-in duration-200 shadow-xs">
            <div className="flex items-start space-x-2">
              <span className="text-sm select-none">📅</span>
              <div className="flex-1">
                <p className="text-[11px] leading-relaxed">
                  Detected <strong className="text-slate-900">"WFH - Sprint Planning"</strong> on Thursday!
                  Switched Thursday's delivery from <span className="font-semibold text-[#FF5A1F]">Cyber Park Office</span> to <span className="font-semibold text-emerald-700">Green Valley Home</span> automatically.
                </p>
                <button
                  onClick={handleUndoThursday}
                  className="mt-1 text-[11px] font-bold text-[#FF5A1F] hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo & Keep at Office</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5-Day Horizontal Pill Selector */}
      <div className="flex items-center justify-between space-x-1.5 bg-slate-100/90 p-1 rounded-xl">
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
              className={`flex-1 py-1.5 px-1 rounded-lg text-center transition-all cta-bounce ${
                isSelected
                  ? 'bg-white shadow-sm font-bold text-slate-900 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700 font-semibold text-[11px]'
              }`}
            >
              <div className="text-[11px]">{d.dayCode}</div>
              <div
                className={`text-[9px] font-bold mt-0.5 px-1 rounded-full inline-block ${
                  isOffice ? 'bg-[#FFF5F0] text-[#FF5A1F]' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {isOffice ? 'Office' : 'Home'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Day-to-Location Cards */}
      <div className="space-y-3">
        {playlist.map((dayItem, index) => {
          const isOffice = dayItem.location === 'office';
          const meal = dayItem.options[dayItem.currentIdx];

          return (
            <div
              key={dayItem.day}
              className={`bg-white rounded-2xl p-3.5 border transition-all ${
                isOffice
                  ? 'border-slate-200 hover:border-[#FF5A1F]/40'
                  : 'border-slate-200 hover:border-emerald-300'
              } shadow-sm`}
            >
              {/* Day Header & 1-Tap Toggle */}
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900">{dayItem.day}</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">({dayItem.dateStr})</span>
                </div>

                {/* 1-Tap Toggle Switch between Office and Home */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => {
                      if (!isOffice) toggleDayLocation(index);
                    }}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cta-bounce ${
                      isOffice
                        ? 'bg-[#FF5A1F] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
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
                      !isOffice
                        ? 'bg-[#10B981] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Home className="w-3 h-3" />
                    <span>Home</span>
                  </button>
                </div>
              </div>

              {/* Delivery Address Card Details */}
              <div
                className={`p-2.5 rounded-xl border mb-2 flex items-center justify-between cursor-pointer transition-colors active:scale-[0.99] ${
                  isOffice
                    ? 'bg-[#FFF5F0]/60 border-[#FF5A1F]/20 text-slate-900'
                    : 'bg-emerald-50/50 border-emerald-200/50 text-slate-900'
                }`}
                onClick={() => toggleDayLocation(index)}
              >
                <div className="flex items-start space-x-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isOffice ? 'bg-[#FF5A1F] text-white' : 'bg-[#10B981] text-white'
                    }`}
                  >
                    {isOffice ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center">
                      {isOffice ? SAVED_LOCATIONS.office.name : SAVED_LOCATIONS.home.name}
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ml-1.5 ${
                          isOffice ? 'bg-[#FF5A1F]/10 text-[#FF5A1F]' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOffice ? 'Cyber Park Pod Drop' : 'Doorstep Drop'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {isOffice ? SAVED_LOCATIONS.office.address : SAVED_LOCATIONS.home.address}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-400 underline">Tap to flip</span>
              </div>

              {/* 15-Minute Delivery Window Dropdown & Meal preview */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center space-x-1 text-slate-600">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-medium">Slot:</span>
                  <select
                    value={dayItem.slot}
                    onChange={(e) => changeSlot(index, e.target.value)}
                    className="text-[11px] font-semibold text-slate-900 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                  >
                    {TIME_WINDOWS.map((tw) => (
                      <option key={tw} value={tw}>
                        {tw}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-[10px] font-medium text-slate-500 truncate max-w-[130px]">
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
