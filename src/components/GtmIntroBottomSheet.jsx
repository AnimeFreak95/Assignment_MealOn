import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Clock, ChevronRight, Play, Pause, Flame, Gift } from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audioDelight';

const SLIDES = [
  {
    id: 1,
    title: 'Tired of Daily Lunch Scrolling?',
    subtitle: 'White-collar workers waste 20+ mins daily picking lunch at 12:15 PM.',
    badge: '1. THE MIDDAY FRICTION',
    visualEmoji: '🥱',
    accentColor: 'from-amber-500/20 to-orange-500/10',
    stat: '22 Mins Wasted Daily',
    highlight: 'Surge delivery fees (₹50+) & 45-min peak rain/traffic delays.'
  },
  {
    id: 2,
    title: 'Curate Once, Eat Fresh All Week',
    subtitle: 'Pre-schedule homestyle bowls rotated across verified cloud kitchens.',
    badge: '2. ZERO-DECISION EATING',
    visualEmoji: '🥗',
    accentColor: 'from-[#FF5A1F]/20 to-amber-500/10',
    stat: '100% Fresh Night-Before Prep',
    highlight: 'High-protein, macro-balanced, 0% repetitive menus.'
  },
  {
    id: 3,
    title: '100% Money Rollover Guarantee',
    subtitle: 'Plans change? Skip before 10 PM. 100% of your money rolls over.',
    badge: '3. PAUSE SHIELD PROTECTION',
    visualEmoji: '🛡️',
    accentColor: 'from-emerald-500/20 to-teal-500/10',
    stat: 'Up to 35-Day Validity Buffer',
    highlight: 'Zero expiry rush. Banked credits extend your subscription automatically.'
  }
];

export default function GtmIntroBottomSheet({ onClaimPass, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play timer (video/story carousel simulation)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeSlideData = SLIDES[currentSlide];

  const handleNext = () => {
    playPop();
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleClaim = () => {
    playSuccessChime();
    if (onClaimPass) onClaimPass();
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 overflow-hidden flex flex-col max-h-[90%] animate-in slide-in-from-bottom duration-300">
        {/* Story Progress Indicators */}
        <div className="px-4 pt-3 flex space-x-1.5 z-10">
          {SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => {
                playPop();
                setCurrentSlide(idx);
              }}
              className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'bg-[#FF5A1F] w-full'
                    : currentSlide > idx
                    ? 'bg-slate-400 w-full'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Controls */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
            <span className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider">
              Introducing Scheduled Meals
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              title={isPlaying ? 'Pause Video Teaser' : 'Play Video Teaser'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Animated Teaser Frame (Simulated Video/GIF Graphic) */}
        <div className="px-4 py-2">
          <div
            className={`rounded-2xl p-4 bg-gradient-to-br ${activeSlideData.accentColor} border border-slate-200 text-center relative overflow-hidden transition-all duration-300`}
          >
            {/* Big Graphic Emoji with bounce */}
            <div className="w-16 h-16 rounded-2xl bg-white/90 shadow-md flex items-center justify-center mx-auto text-3xl mb-2.5 animate-in zoom-in-75 duration-200">
              {activeSlideData.visualEmoji}
            </div>

            <span className="text-[9px] font-extrabold text-[#FF5A1F] bg-[#FFF5F0] border border-[#FF5A1F]/30 px-2 py-0.5 rounded-full inline-block mb-1">
              {activeSlideData.badge}
            </span>

            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug">
              {activeSlideData.title}
            </h3>

            <p className="text-xs text-slate-600 mt-1 max-w-[280px] mx-auto leading-relaxed">
              {activeSlideData.subtitle}
            </p>

            {/* Key Stat Callout */}
            <div className="mt-3 bg-white/95 rounded-xl p-2 border border-slate-200/80 text-[11px] font-bold text-slate-800 flex items-center justify-between">
              <span className="text-[#FF5A1F]">{activeSlideData.stat}</span>
              <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded">
                Verified Benefit
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="px-4 py-1.5 grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold text-slate-700">
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="block text-emerald-700 font-extrabold">₹0 Delivery</span>
            Save ₹40/meal
          </div>
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="block text-[#FF5A1F] font-extrabold">10 PM Cutoff</span>
            Free night skip
          </div>
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="block text-indigo-700 font-extrabold">Dual Address</span>
            Office & Home
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 pt-2 border-t border-slate-100 bg-white space-y-2">
          <button
            onClick={handleClaim}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
          >
            <span>Explore Scheduled Meals Pass →</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 py-1"
          >
            Maybe Later • Remind Me Tomorrow
          </button>
        </div>
      </div>
    </div>
  );
}
