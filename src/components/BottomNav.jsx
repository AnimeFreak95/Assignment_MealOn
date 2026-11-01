import React from 'react';
import { Sparkles, MapPin, Clock, ShieldCheck, Flame } from 'lucide-react';

const TABS = [
  { id: 'autopilot', label: 'Planner', icon: Sparkles },
  { id: 'cutoff', label: 'Cut-Off', icon: Clock, badge: 'Live' },
  { id: 'wallet', label: 'Wallet', icon: ShieldCheck },
  { id: 'streaks', label: 'Loyalty', icon: Flame, badge: '🔥' },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1 pb-[max(0.375rem,env(safe-area-inset-bottom))] sticky bottom-0 z-30 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 min-h-[48px] rounded-xl transition-all relative ${
              isActive
                ? 'text-[#FF5A1F]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#FFF5F0] text-[#FF5A1F] scale-105 shadow-xs'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {tab.badge && !isActive && (
                <span className="absolute -top-1 -right-1 text-[8px] bg-amber-500 text-white font-extrabold px-1 rounded-full leading-tight">
                  {tab.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                isActive ? 'font-bold text-[#FF5A1F]' : 'font-medium text-slate-500'
              }`}
            >
              {tab.label}
            </span>

            {isActive && (
              <span className="w-1.5 h-1.5 bg-[#FF5A1F] rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
