import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-tangerine-500 shrink-0" />,
  };

  return (
    <div className="absolute top-16 left-3 right-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-700/60 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 overflow-hidden">
          {icons[toast.type] || icons.success}
          <div className="truncate">
            <p className="font-semibold text-slate-100">{toast.title}</p>
            {toast.message && (
              <p className="text-[11px] text-slate-300 line-clamp-1">{toast.message}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
