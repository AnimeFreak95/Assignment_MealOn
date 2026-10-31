import React from 'react';
import { ShieldCheck, Bell, Sparkles } from 'lucide-react';

export default function Header({ credits, onNavigateTab, notificationCount = 1, onBellClick }) {
  return (
    <header className="px-4 py-3 bg-white border-b border-slate-200/80 sticky top-[28px] z-30 flex items-center justify-between shadow-xs">
      {/* Brand Logo */}
      <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => onNavigateTab('autopilot')}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF7B47] flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-[20px] font-extrabold tracking-tight text-[#FF5A1F]">Meals</span>
            <span className="text-[20px] font-extrabold tracking-tight text-slate-900">On</span>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block -mt-1">
            Scheduled Meals
          </span>
        </div>
      </div>

      {/* Right Controls: Pause Shield Pill + Bell */}
      <div className="flex items-center space-x-2">
        {/* Pause Shield: XX Credits */}
        <button
          onClick={() => onNavigateTab('wallet')}
          title="Open Pause Shield Wallet"
          className="flex items-center space-x-1.5 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#10B981] px-2.5 py-1 rounded-full border border-[#10B981]/25 transition-all shadow-xs group"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold tracking-tight">
            Pause Shield: <strong className="font-extrabold text-[#065F46]">{credits}</strong>
          </span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onBellClick || (() => onNavigateTab('cutoff'))}
          title="8 PM Cut-Off Notifications"
          className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5A1F] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
}
