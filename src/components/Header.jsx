import React from 'react';
import { ShieldCheck, Bell, Sparkles, Ticket } from 'lucide-react';

export default function Header({
  credits,
  onNavigateTab,
  notificationCount = 1,
  onBellClick,
  onOpenFtux
}) {
  return (
    <header className="px-3.5 py-2.5 bg-white border-b border-slate-200/80 sticky top-[28px] z-30 flex items-center justify-between shadow-xs">
      {/* Brand Logo */}
      <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => onNavigateTab('autopilot')}>
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF7B47] flex items-center justify-center shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-lg font-extrabold tracking-tight text-[#FF5A1F]">Meals</span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">On</span>
          </div>
          <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block -mt-1">
            Scheduled Meals
          </span>
        </div>
      </div>

      {/* Right Controls: Pass FTUX + Pause Shield Pill + Bell */}
      <div className="flex items-center space-x-1.5">
        {onOpenFtux && (
          <button
            onClick={onOpenFtux}
            title="Open Subscription FTUX Pass Flow"
            className="flex items-center space-x-1 bg-[#FFF5F0] hover:bg-[#FFE6DC] text-[#FF5A1F] px-2 py-1 rounded-full border border-[#FF5A1F]/30 transition-all text-[10px] font-bold"
          >
            <Ticket className="w-3 h-3" />
            <span>Pass Flow</span>
          </button>
        )}

        {/* Pause Shield: XX Credits */}
        <button
          onClick={() => onNavigateTab('wallet')}
          title="Open Pause Shield Wallet"
          className="flex items-center space-x-1 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#10B981] px-2 py-1 rounded-full border border-[#10B981]/25 transition-all shadow-xs group"
        >
          <ShieldCheck className="w-3 h-3 text-[#10B981] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-tight">
            Shield: <strong className="font-extrabold text-[#065F46]">{credits}</strong>
          </span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onBellClick || (() => onNavigateTab('cutoff'))}
          title="8 PM Cut-Off Notifications"
          className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5A1F] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
}
