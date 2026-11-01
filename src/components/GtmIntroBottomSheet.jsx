import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Building2,
  Home,
  ArrowRightLeft,
  GripVertical,
  Repeat,
  RotateCcw,
  CheckCircle2,
  Flame,
  Zap,
  ChefHat
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';

const STORY_SCENES = [
  {
    id: 'tiers',
    title: '3 Culinary Craft Tiers',
    tagline: 'Choose your weekday lunch budget. Zero surge pricing.',
    categoryBadge: '1. CULINARY ALLOWANCE',
    accentColor: 'from-[#FF5A1F] to-[#E04812]',
    gradientBg: 'from-orange-50 via-white to-amber-50',
    stat: 'From ₹160/meal • Save up to ₹1,760',
    visual: {
      type: 'tiers',
      items: [
        { name: 'Rasoi', price: 160, tag: 'HOMESTYLE', desc: 'Roti, Dal Khichdi, Bhakri', icon: '🍲' },
        { name: 'Bistro', price: 250, tag: 'POPULAR', desc: 'Executive Thalis & Bowls', icon: '🥗', active: true },
        { name: "Chef's Table", price: 320, tag: 'SIGNATURE', desc: 'Artisanal • Pan-Asian • Soba', icon: '🍱' }
      ]
    }
  },
  {
    id: 'batching',
    title: '30-Min Office Pod Waves',
    tagline: 'Batch delivery to your corporate lobby unlocks 100% ₹0 Free Delivery.',
    categoryBadge: '2. ZERO DELIVERY FEE',
    accentColor: 'from-blue-600 to-indigo-600',
    gradientBg: 'from-indigo-50 via-white to-blue-50',
    stat: '100% Free Delivery • ₹40/meal Saved',
    visual: {
      type: 'batching',
      windows: [
        { label: '12:30–1:00 PM', name: 'Early Lunch', sub: 'Pre-meeting drop' },
        { label: '1:00–1:30 PM', name: 'Peak Pod Drop', sub: '65% Corporate Cluster', active: true },
        { label: '1:30–2:00 PM', name: 'Post-Standup', sub: 'Flexible lunch wave' }
      ]
    }
  },
  {
    id: 'planner',
    title: 'Smart Planner + My Vault',
    tagline: 'Auto-pilot lunches with 1-tap Swap, Drag-and-Drop Move, and Location Flip.',
    categoryBadge: '3. AUTONOMOUS WEEKLY PLANNER',
    accentColor: 'from-rose-500 to-orange-500',
    gradientBg: 'from-rose-50 via-white to-orange-50',
    stat: 'AI Auto-Pilot or 20-Dish Trusted Vault',
    visual: {
      type: 'planner',
      dish: 'Paneer Tikka Quinoa Bowl',
      kitchen: "Rajshree's Kitchen • 24g Protein • 460 kcal",
      price: 190,
      location: 'Cyber Park Tower B (Office)',
      actions: ['Swap', 'Move', 'Skip']
    }
  },
  {
    id: 'shield',
    title: '100% Pause Shield Protection',
    tagline: 'Plans change? Skip before 10 PM. 100% of your meal money is saved in wallet.',
    categoryBadge: '4. PAUSE SHIELD & BUFFER',
    accentColor: 'from-emerald-600 to-teal-600',
    gradientBg: 'from-emerald-50 via-white to-teal-50',
    stat: '20 to 35-Day Validity Buffer',
    visual: {
      type: 'shield',
      clock: '10:00 PM',
      refundText: '₹190 Saved in MealsOn Balance',
      bufferText: 'Valid across your 20-day pass buffer'
    }
  }
];

export default function GtmIntroBottomSheet({ onClaimPass, onClose }) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  const activeScene = STORY_SCENES[currentSceneIdx];
  const SCENE_DURATION_MS = 4200;
  const TICK_INTERVAL_MS = 50;

  // Auto-advancing video story simulation
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / SCENE_DURATION_MS) * 100;
        if (next >= 100) {
          // Advance to next scene
          setCurrentSceneIdx((curr) => {
            const nextIdx = (curr + 1) % STORY_SCENES.length;
            if (!isMuted) playPop();
            return nextIdx;
          });
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, isMuted, currentSceneIdx]);

  const handleNextScene = () => {
    if (!isMuted) playPop();
    setProgress(0);
    setCurrentSceneIdx((prev) => (prev + 1) % STORY_SCENES.length);
  };

  const handlePrevScene = () => {
    if (!isMuted) playPop();
    setProgress(0);
    setCurrentSceneIdx((prev) => (prev - 1 + STORY_SCENES.length) % STORY_SCENES.length);
  };

  const handleToggleSound = (e) => {
    e.stopPropagation();
    playPop();
    setIsMuted(!isMuted);
  };

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    playPop();
    setIsPlaying(!isPlaying);
  };

  const handleClaimPassClick = () => {
    playSuccessChime();
    playCelebrationFanfare();
    if (onClaimPass) onClaimPass();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end justify-center p-0 animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-slate-900 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative animate-in slide-in-from-bottom duration-300 border-t border-slate-700">
        
        {/* Swipe-down sheet handle */}
        <div className="w-12 h-1 bg-slate-600/80 rounded-full mx-auto mt-2.5 mb-1" />

        {/* 1. Mobile Story Progress Bars (Top of Reel) */}
        <div className="px-3 pt-2 pb-1.5 flex items-center space-x-1.5 z-20">
          {STORY_SCENES.map((scene, idx) => {
            let fillWidth = '0%';
            if (idx < currentSceneIdx) fillWidth = '100%';
            else if (idx === currentSceneIdx) fillWidth = `${progress}%`;

            return (
              <div
                key={scene.id}
                onClick={() => {
                  playPop();
                  setCurrentSceneIdx(idx);
                  setProgress(0);
                }}
                className="flex-1 h-1 bg-slate-700/80 rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] transition-all duration-75"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* 2. Reel Header Bar: Live Badge + Controls */}
        <div className="px-3 py-1.5 flex items-center justify-between text-xs z-20">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 bg-red-600/90 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>15s Reel</span>
            </span>
            <span className="text-[10px] font-extrabold text-slate-300 truncate max-w-[170px]">
              MealsOn Scheduled Meals
            </span>
          </div>

          <div className="flex items-center space-x-1 text-slate-300">
            {/* Play/Pause */}
            <button
              onClick={handleTogglePlay}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Interactive Video Viewport (Tap Left / Right to Skip Stories) */}
        <div className="relative px-3 py-1.5 flex-1 min-h-[360px] select-none">
          {/* Invisible Touch Tap Zones for Story Navigation */}
          <div
            onClick={handlePrevScene}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
            title="Tap left to go back"
          />
          <div
            onClick={handleNextScene}
            className="absolute right-0 top-0 bottom-0 w-2/3 z-10 cursor-pointer"
            title="Tap right to skip ahead"
          />

          {/* Main Animated Card Frame */}
          <div
            className={`w-full h-full rounded-3xl bg-gradient-to-b ${activeScene.gradientBg} p-4 border border-slate-200/90 shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300`}
          >
            {/* Scene Header */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#FF5A1F] bg-[#FFF5F0] border border-[#FF5A1F]/30 px-2 py-0.5 rounded-full">
                  {activeScene.categoryBadge}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {currentSceneIdx + 1} of {STORY_SCENES.length}
                </span>
              </div>

              <h2 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                {activeScene.title}
              </h2>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-relaxed">
                {activeScene.tagline}
              </p>
            </div>

            {/* DYNAMIC SCENE VISUAL (Reflects Exact App Features) */}
            <div className="my-2.5 flex-1 flex items-center justify-center">
              {/* Scene 1: Culinary Craft Tiers */}
              {activeScene.visual.type === 'tiers' && (
                <div className="w-full space-y-1.5 animate-in zoom-in-95 duration-200">
                  {activeScene.visual.items.map((t) => (
                    <div
                      key={t.name}
                      className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between shadow-2xs ${
                        t.active
                          ? 'bg-[#FFF5F0] border-2 border-[#FF5A1F] shadow-sm ring-2 ring-[#FF5A1F]/20 scale-[1.02]'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl">{t.icon}</span>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-black text-slate-900">{t.name}</span>
                            <span className="text-[8px] font-extrabold text-[#FF5A1F] bg-white border border-[#FF5A1F]/30 px-1.5 py-0.2 rounded-full">
                              {t.tag}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {t.desc}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-[#FF5A1F]">₹{t.price}</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">/day</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Scene 2: 30-Min Office Pod Waves */}
              {activeScene.visual.type === 'batching' && (
                <div className="w-full space-y-1.5 animate-in zoom-in-95 duration-200">
                  <div className="bg-indigo-900 text-white rounded-2xl p-2.5 text-center shadow-sm">
                    <span className="text-[9px] font-bold text-indigo-300 block uppercase">
                      Lobby Batching Engine
                    </span>
                    <span className="text-xs font-black">1 Consolidated Rider Drop = ₹0 Delivery</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {activeScene.visual.windows.map((w) => (
                      <div
                        key={w.label}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          w.active
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400/30'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 mx-auto mb-1 ${w.active ? 'text-white' : 'text-indigo-600'}`} />
                        <span className="text-[10px] font-black block leading-tight">{w.label}</span>
                        <span className={`text-[8px] font-bold block mt-0.5 ${w.active ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {w.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center text-[10px] font-extrabold text-emerald-800">
                    🛵 Zero Rider Wait Time • Delivered Steaming Hot
                  </div>
                </div>
              )}

              {/* Scene 3: V2 Smart Planner Card with 3-Action Toolbar */}
              {activeScene.visual.type === 'planner' && (
                <div className="w-full bg-white rounded-2xl p-3 border border-slate-200 shadow-md space-y-2.5 animate-in zoom-in-95 duration-200">
                  {/* Location Flip Header */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold text-slate-800">Mon, 2 Nov</span>
                    <span className="bg-[#ECFDF5] text-[#065F46] border border-[#6EE7B7] px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                      <Building2 className="w-2.5 h-2.5 text-orange-600" />
                      <span>Cyber Park Tower B</span>
                      <span className="bg-white text-orange-700 px-1 rounded text-[8px] font-black">
                        ⇄ Flip
                      </span>
                    </span>
                  </div>

                  {/* Meal Details */}
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0 shadow-inner">
                      🥗
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {activeScene.visual.dish}
                      </h4>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">
                        {activeScene.visual.kitchen}
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-900">₹{activeScene.visual.price}</span>
                  </div>

                  {/* 3-Action Footer */}
                  <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-1.5 text-center text-[10px] font-bold text-slate-700">
                    <span className="flex items-center justify-center space-x-1 text-[#FF5A1F]">
                      <Repeat className="w-2.5 h-2.5" />
                      <span>Swap</span>
                    </span>
                    <span className="flex items-center justify-center space-x-1 text-slate-600">
                      <GripVertical className="w-2.5 h-2.5 text-slate-400" />
                      <span>Move</span>
                    </span>
                    <span className="flex items-center justify-center space-x-1 text-slate-600">
                      <span>Skip</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Scene 4: 10 PM Cut-off & Pause Shield */}
              {activeScene.visual.type === 'shield' && (
                <div className="w-full space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="bg-slate-900 text-white rounded-2xl p-2.5 text-center space-y-0.5">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                      ⏰ 10:00 PM Zero-Waste Cutoff
                    </span>
                    <span className="text-xs font-black">
                      Swap or skip free before kitchens marinate overnight
                    </span>
                  </div>

                  {/* Option B Skipped Card Mockup */}
                  <div className="bg-[#ECFDF5] border border-[#10B981] rounded-2xl p-2.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                      <div>
                        <span className="text-xs font-black text-emerald-950 block leading-tight">
                          {activeScene.visual.refundText}
                        </span>
                        <span className="text-[9px] font-medium text-emerald-700 block">
                          {activeScene.visual.bufferText}
                        </span>
                      </div>
                    </div>
                    <span className="bg-white text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs flex items-center space-x-1">
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Restore</span>
                    </span>
                  </div>

                  <div className="text-center text-[10px] font-bold text-slate-600">
                    🛡️ Zero Breakage • Zero Expired Meal Forfeitures
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Callout Bar of the Video Card */}
            <div className="bg-white/95 rounded-xl p-2 border border-slate-200/80 text-[10px] font-bold text-slate-800 flex items-center justify-between">
              <span className="text-[#FF5A1F] font-black">{activeScene.stat}</span>
              <span className="text-[9px] text-emerald-800 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                Verified Guarantee ✓
              </span>
            </div>
          </div>
        </div>

        {/* 4. Quick Feature Summary Bar */}
        <div className="px-4 py-1.5 grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold text-slate-300">
          <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
            <span className="block text-emerald-400 font-extrabold">₹0 Delivery</span>
            30-Min Batched Pods
          </div>
          <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
            <span className="block text-[#FF5A1F] font-extrabold">Craft Tiers</span>
            Rasoi • Bistro • Chef
          </div>
          <div className="bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
            <span className="block text-indigo-400 font-extrabold">Pause Shield</span>
            100% Wallet Rollover
          </div>
        </div>

        {/* 5. Mobile Thumb-Friendly CTA Footer (48px Touch Zone) */}
        <div className="p-3.5 pt-2 border-t border-slate-800 bg-slate-900 space-y-1.5">
          <button
            onClick={handleClaimPassClick}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF5A1F] via-[#FF7B47] to-[#FF5A1F] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-black text-xs shadow-lg transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Get Started with MealsOn Pass ➔</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-200 py-1 cursor-pointer"
          >
            Dismiss • Explore App First
          </button>
        </div>
      </div>
    </div>
  );
}
