import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-slate-800 text-xs font-semibold select-none bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50">
      <span className="tracking-tight text-[13px] font-bold">9:41</span>
      <div className="flex items-center space-x-2">
        <span className="text-[11px] font-bold tracking-wider text-slate-700">5G</span>
        <Wifi className="w-3.5 h-3.5 text-slate-700" strokeWidth={2.5} />
        <div className="flex items-center">
          <Battery className="w-4 h-4 text-slate-800 fill-slate-800" />
        </div>
      </div>
    </div>
  );
}
