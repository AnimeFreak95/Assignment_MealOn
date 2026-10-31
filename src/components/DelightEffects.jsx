import React, { useEffect, useState } from 'react';
import { Check, ShieldCheck, Sparkles, X, Heart, Star, Gift, Trophy } from 'lucide-react';

// Confetti blast particles
export function ConfettiCanvas({ active, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ['#FF5A1F', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];
    const shapes = ['square', 'circle', 'strip'];
    const newParticles = Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 40 + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 8 + 6,
      vx: (Math.random() - 0.5) * 180,
      vy: -Math.random() * 140 - 40,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
      gravity: 380,
      duration: 1.6 + Math.random() * 0.6,
      delay: Math.random() * 0.1,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute block animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: p.shape === 'strip' ? `${p.size * 2.2}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '9999px' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.95,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--vx': `${p.vx}px`,
            '--vy': `${p.vy}px`,
          }}
        />
      ))}
    </div>
  );
}

// Floating +1 Credit Banked badge targeting header
export function FloatingCreditBadge({ active, onComplete }) {
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1400);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex justify-center items-center">
      <div className="animate-float-to-header bg-[#ECFDF5] border-2 border-[#10B981] text-[#065F46] font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center space-x-1.5 backdrop-blur-md">
        <ShieldCheck className="w-4 h-4 text-[#10B981] animate-bounce" />
        <span className="text-[12px]">+1 Credit Banked! 🛡️</span>
        <span className="text-[10px] bg-[#10B981] text-white px-1.5 rounded font-bold">100% Value</span>
      </div>
    </div>
  );
}

// Delight Celebration Modal / Action Drawer for Big WOW moments
export function WowDelightModal({ modalData, onClose }) {
  if (!modalData) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-[370px] bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 text-center space-y-3 relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-6 duration-300">
        {/* Top glowing wave */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF5A1F] via-[#10B981] to-[#F59E0B]" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Icon / Emoji */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FFF5F0] border-2 border-[#FF5A1F]/30 flex items-center justify-center shadow-inner text-2xl relative">
          <span>{modalData.emoji || '🎉'}</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#10B981] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
            ✓
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {modalData.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {modalData.description}
          </p>
        </div>

        {/* Highlights / Stats Pill */}
        {modalData.highlights && (
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 text-left space-y-1">
            {modalData.highlights.map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          {modalData.ctaLabel || 'Awesome, Got It! ✨'}
        </button>
      </div>
    </div>
  );
}
