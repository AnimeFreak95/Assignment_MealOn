import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Gift,
  CheckCircle2,
  Share2,
  Copy,
  ChevronRight,
  ShieldCheck,
  RotateCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';
import { MASTER_DISH_CATALOG } from '../data/mockData';

// 5 Balanced Digital Habit Perks (No physical treats, no 10:30 VIP)
export const WHEEL_REWARDS = [
  {
    id: 'tier_upgrade',
    name: 'Chef’s Table Upgrade',
    tag: 'CULINARY DISCOVERY',
    badge: 'WORTH ₹90',
    sliceLabel: 'Tier Upgrade',
    emoji: '🥗',
    color: '#10B981', // Emerald
    gradient: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    headline: '1-Meal Chef’s Table Pass Unlocked! 🥗',
    subtext: 'Upgrade your next scheduled lunch from Bistro to Chef’s Table (Zen Teriyaki Soba or Signature Craft Bowl) with ₹0 extra surcharge.',
    perkAction: 'Auto-applied to next Monday lunch',
    actionText: 'Apply to Monday Lunch'
  },
  {
    id: 'wallet_credit',
    name: '₹50 MealsOn Balance',
    tag: 'HARD CASHBACK',
    badge: '₹50 CREDITED',
    sliceLabel: '₹50 Balance',
    emoji: '💰',
    color: '#F59E0B', // Amber
    gradient: 'from-amber-500 to-orange-500',
    accentBg: 'bg-amber-50 text-amber-900 border-amber-300',
    headline: '₹50 Added to MealsOn Balance! 💰',
    subtext: '₹50 hard credit deposited into your wallet. Valid for 30 days and automatically deducts toward your next pass renewal.',
    perkAction: 'Credited directly to MealsOn Balance',
    actionText: 'View Wallet Balance'
  },
  {
    id: 'buffer_days',
    name: '+3 Days Pass Buffer',
    tag: 'ZERO EXPIRY STRESS',
    badge: '+3 DAYS VALIDITY',
    sliceLabel: '+3d Buffer',
    emoji: '🛡️',
    color: '#4F46E5', // Indigo
    gradient: 'from-indigo-500 to-blue-600',
    accentBg: 'bg-indigo-50 text-indigo-900 border-indigo-300',
    headline: '+3 Days Extended Pass Buffer! 🛡️',
    subtext: 'Your active pass validity buffer is extended by +3 calendar days. Enjoy complete flexibility for unplanned WFH days.',
    perkAction: 'Pass horizon extended to 23 days',
    actionText: 'Check Pass Buffer'
  },
  {
    id: 'coffee_shout',
    name: 'Desk-Mate Coffee Shout',
    tag: 'TEAM KARMA',
    badge: 'GIFT ₹40',
    sliceLabel: 'Coffee Shout',
    emoji: '☕',
    color: '#EC4899', // Pink
    gradient: 'from-pink-500 to-rose-600',
    accentBg: 'bg-pink-50 text-pink-900 border-pink-300',
    headline: 'Share a ₹40 Coffee with a Colleague! ☕',
    subtext: 'Send a 1-click digital coffee perk to a desk-mate or teammate on Slack/WhatsApp. Spread Friday cheer in Cyber Park.',
    perkAction: 'Gift link ready: mealson.in/gift/mo-coffee-7782',
    actionText: 'Copy Slack Gift Link'
  },
  {
    id: 'pass_discount',
    name: '15% Off Pass Renewal',
    tag: 'MAX SAVINGS',
    badge: 'SAVE UP TO ₹480',
    sliceLabel: '15% Off Pass',
    emoji: '🎟️',
    color: '#8B5CF6', // Purple
    gradient: 'from-purple-500 to-indigo-600',
    accentBg: 'bg-purple-50 text-purple-900 border-purple-300',
    headline: '15% Pass Renewal Voucher! 🎟️',
    subtext: 'Use promo code HABIT15 on your next 10 or 20-meal pass renewal. Locks in all-inclusive lunches from ₹185/meal.',
    perkAction: 'Promo code: HABIT15 copied to clipboard',
    actionText: 'Copy Code: HABIT15'
  }
];

// Helper to calculate SVG Sector Path
function getSectorPath(centerX, centerY, radius, startAngle, endAngle) {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export default function HabitSpinWheelModal({
  isOpen,
  onClose,
  onRewardClaimed,
  triggerConfetti,
  onNotify,
  credits,
  setCredits,
  playlist,
  setPlaylist,
  onNavigateTab,
  onOpenFtux
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [wonReward, setWonReward] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const tickIntervalRef = useRef(null);

  if (!isOpen) return null;

  const totalSlices = WHEEL_REWARDS.length;
  const sliceAngle = 360 / totalSlices; // 72 degrees each

  const handleSpin = () => {
    if (isSpinning) return;
    playPop();
    setIsSpinning(true);
    setWonReward(null);
    setCopiedLink(false);
    setIsApplying(false);

    // Pick random target slice (0 to 4)
    const targetSliceIdx = Math.floor(Math.random() * totalSlices);
    const targetReward = WHEEL_REWARDS[targetSliceIdx];

    // Pointer is at the top (0° / 12 o'clock).
    // In our SVG layout, slice i spans [i * 72°, (i + 1) * 72°].
    // Center of slice i is i * 72° + 36°.
    // To bring slice i under the top pointer (0°):
    // Wheel must rotate such that its center aligns with 360° - (i * 72° + 36°).
    const centerOffset = targetSliceIdx * sliceAngle + sliceAngle / 2;
    const extraSpins = 360 * 6; // 6 full 360° revolutions
    const targetRotation = extraSpins + (360 - centerOffset);

    // Reset rotation baseline
    setRotationDegrees(targetRotation);

    // Sound effect ticks during spin
    let tickCount = 0;
    tickIntervalRef.current = setInterval(() => {
      tickCount++;
      if (tickCount < 28) {
        playPop();
      } else {
        clearInterval(tickIntervalRef.current);
      }
    }, 140);

    // After 4.2s spin completes
    setTimeout(() => {
      clearInterval(tickIntervalRef.current);
      setIsSpinning(false);
      setWonReward(targetReward);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onRewardClaimed) onRewardClaimed(targetReward);

      if (onNotify) {
        onNotify(
          `Perk Won: ${targetReward.name}! 🎉`,
          targetReward.perkAction,
          'success'
        );
      }
    }, 4200);
  };

  const handleActionClick = () => {
    if (!wonReward || isApplying) return;
    playSuccessChime();
    setIsApplying(true);
    setCopiedLink(true);

    if (wonReward.id === 'wallet_credit') {
      if (setCredits) {
        setCredits((prev) => prev + 1);
      }
      if (onNotify) {
        onNotify('₹50 Added to MealsOn Balance! 💰', 'Deposited into your MealsOn Balance. Redirecting to Wallet...', 'success');
      }
      setTimeout(() => {
        onClose();
        if (onNavigateTab) onNavigateTab('wallet');
      }, 900);
      return;
    }

    if (wonReward.id === 'tier_upgrade') {
      if (setPlaylist) {
        setPlaylist((prev) => {
          const next = [...prev];
          if (next[0]) {
            const upgradedDish = MASTER_DISH_CATALOG?.find((d) => d.id === 'vd12') || {
              id: 'vd12',
              name: 'Zen Teriyaki Soba Bowl (Chef’s Table)',
              kitchen: 'Zen Asian Bowls',
              rating: 4.8,
              price: 235,
              kcal: 475,
              protein: 25,
              category: 'light',
              isVeg: true,
              tag: 'Chef’s Table',
              image: '🍜',
              desc: 'Buckwheat Japanese soba noodles, grilled sesame teriyaki tofu cubes, tender edamame pods.'
            };
            next[0] = {
              ...next[0],
              selectedDishId: upgradedDish.id,
              isUpgraded: true,
              options: [upgradedDish, ...(next[0].options || []).filter((o) => o.id !== upgradedDish.id)]
            };
          }
          return next;
        });
      }
      if (onNotify) {
        onNotify('Chef’s Table Upgraded! 🥗', 'Zen Teriyaki Soba applied to Monday lunch (₹0 extra). Opening Planner...', 'success');
      }
      setTimeout(() => {
        onClose();
        if (onNavigateTab) onNavigateTab('autopilot');
      }, 900);
      return;
    }

    if (wonReward.id === 'buffer_days') {
      if (onNotify) {
        onNotify('+3 Days Extended Buffer! 🛡️', 'Pass validity buffer extended to 23 days. Opening Wallet...', 'success');
      }
      setTimeout(() => {
        onClose();
        if (onNavigateTab) onNavigateTab('wallet');
      }, 900);
      return;
    }

    if (wonReward.id === 'coffee_shout') {
      const link = 'https://mealson.in/gift/mo-coffee-7782';
      try {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(link).catch(() => {});
        }
      } catch (err) {
        console.error(err);
      }
      if (onNotify) {
        onNotify('Gift Link Copied! ☕', 'Share mealson.in/gift/mo-coffee-7782 on Slack or WhatsApp with your desk-mate.', 'success');
      }
      setTimeout(() => {
        setIsApplying(false);
      }, 1500);
      return;
    }

    if (wonReward.id === 'pass_discount') {
      try {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText('HABIT15').catch(() => {});
        }
      } catch (err) {
        console.error(err);
      }
      if (onNotify) {
        onNotify('Promo Code Copied! 🎟️', 'Code HABIT15 copied! Opening Pass Configurator...', 'success');
      }
      setTimeout(() => {
        onClose();
        if (onOpenFtux) {
          onOpenFtux();
        } else if (onNavigateTab) {
          onNavigateTab('wallet');
        }
      }, 900);
      return;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-wheel-title"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 text-center relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-20 disabled:opacity-40"
          aria-label="Close habit wheel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient Top Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FF5A1F]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="space-y-1 relative z-10 shrink-0 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>4/5 WORKWEEK MILESTONE UNLOCKED</span>
          </span>
          <h2 id="habit-wheel-title" className="text-base font-black text-white tracking-tight">
            Friday Lunch Roulette 🎡
          </h2>
          <p className="text-[11px] text-slate-400 font-medium">
            100% Guaranteed Digital Perks • Zero Food Waste
          </p>
        </div>

        {/* =========================================================================
            WHEEL & POINTER STAGE
           ========================================================================= */}
        <div className="relative my-2 flex items-center justify-center shrink-0">
          {/* Wheel Pointer at Top (Points down onto the winning sector) */}
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <div className="w-5 h-6 bg-amber-400 text-slate-950 font-black rounded-b-md shadow-lg shadow-amber-500/50 flex items-center justify-center text-[10px] ring-2 ring-white">
              ▼
            </div>
          </div>

          {/* Glowing Wheel Outer Rim */}
          <div className="w-[276px] h-[276px] rounded-full p-2 bg-gradient-to-tr from-amber-500 via-[#FF5A1F] to-emerald-500 shadow-2xl shadow-orange-500/30 flex items-center justify-center relative ring-4 ring-slate-800">
            {/* Rotating SVG Wheel */}
            <svg
              className="w-full h-full rounded-full transition-transform"
              viewBox="0 0 300 300"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transition: isSpinning
                  ? 'transform 4.2s cubic-bezier(0.12, 0.88, 0.18, 1)'
                  : 'none'
              }}
            >
              {WHEEL_REWARDS.map((slice, idx) => {
                const startAngle = idx * sliceAngle;
                const endAngle = (idx + 1) * sliceAngle;
                const pathData = getSectorPath(150, 150, 145, startAngle, endAngle);

                // Label center angle
                const midAngle = startAngle + sliceAngle / 2;
                const textRad = ((midAngle - 90) * Math.PI) / 180;
                const textDist = 98;
                const textX = 150 + textDist * Math.cos(textRad);
                const textY = 150 + textDist * Math.sin(textRad);

                return (
                  <g key={slice.id}>
                    {/* Slice Sector */}
                    <path
                      d={pathData}
                      fill={slice.color}
                      stroke="#0F172A"
                      strokeWidth="2.5"
                    />

                    {/* Emoji + High-Visibility Label in Slice */}
                    <text
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      stroke="#0F172A"
                      strokeWidth="1.2"
                      paintOrder="stroke fill"
                      fontSize="12.5"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                      className="select-none pointer-events-none font-sans tracking-tight"
                    >
                      <tspan x={textX} dy="-11" fontSize="19">{slice.emoji}</tspan>
                      <tspan x={textX} dy="19" fontSize="12" fontWeight="900">{slice.sliceLabel}</tspan>
                    </text>
                  </g>
                );
              })}

              {/* Decorative Wheel Border Studs */}
              {[...Array(20)].map((_, i) => {
                const rad = ((i * 18 - 90) * Math.PI) / 180;
                const cx = 150 + 140 * Math.cos(rad);
                const cy = 150 + 140 * Math.sin(rad);
                return <circle key={i} cx={cx} cy={cy} r="2" fill="#FFFFFF" opacity="0.85" />;
              })}
            </svg>

            {/* Central Spin Hub Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-16 h-16 rounded-full bg-slate-900 border-4 border-amber-400 text-white shadow-xl flex flex-col items-center justify-center font-black text-[11px] leading-tight active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed group hover:bg-slate-800"
                aria-label="Spin the wheel"
              >
                {isSpinning ? (
                  <RotateCw className="w-5 h-5 text-amber-400 animate-spin" />
                ) : (
                  <>
                    <span className="text-amber-400 text-[10px] tracking-wider uppercase">TAP TO</span>
                    <span className="text-white text-xs font-black">SPIN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            OUTCOME STAGE: POST-SPIN WINNING CARD OR HELPER HINT
           ========================================================================= */}
        <div className="mt-2 flex-1 overflow-y-auto space-y-2 text-left relative z-10">
          {wonReward ? (
            <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700 space-y-2 animate-in zoom-in-95 duration-250 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl select-none">{wonReward.emoji}</span>
                  <div>
                    <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider block">
                      {wonReward.tag}
                    </span>
                    <h3 className="text-xs font-black text-white leading-tight">
                      {wonReward.name}
                    </h3>
                  </div>
                </div>
                <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  {wonReward.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                {wonReward.subtext}
              </p>

              {/* Action Button */}
              <div className="pt-1 flex items-center gap-1.5">
                <button
                  onClick={handleActionClick}
                  disabled={isApplying}
                  className="flex-1 min-h-[44px] bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-80"
                >
                  {isApplying ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span>
                        {wonReward.id === 'wallet_credit'
                          ? 'Opening Wallet...'
                          : wonReward.id === 'tier_upgrade'
                          ? 'Opening Planner...'
                          : wonReward.id === 'buffer_days'
                          ? 'Opening Wallet...'
                          : wonReward.id === 'pass_discount'
                          ? 'Opening Pass Flow...'
                          : 'Slack Link Copied!'}
                      </span>
                    </>
                  ) : copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>{wonReward.id === 'pass_discount' ? 'Code Copied! (HABIT15)' : wonReward.id === 'coffee_shout' ? 'Slack Link Copied!' : 'Perk Activated!'}</span>
                    </>
                  ) : (
                    <>
                      <span>{wonReward.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                  title="Re-spin (Demo Mode)"
                  aria-label="Re-spin wheel for demonstration"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Pre-spin instruction box */
            <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/70 text-center space-y-1">
              <p className="text-xs text-slate-300 font-medium">
                Tap <strong>SPIN</strong> to unlock your guaranteed Friday habit perk!
              </p>
              <div className="grid grid-cols-3 gap-1 pt-0.5 text-[9px] text-slate-400">
                <span>🥗 Tier Upgrade</span>
                <span>💰 ₹50 Balance</span>
                <span>🛡️ +3d Buffer</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Dismiss */}
        <div className="pt-2 shrink-0">
          <button
            onClick={onClose}
            disabled={isSpinning}
            className="text-xs font-bold text-slate-400 hover:text-white py-1 cursor-pointer transition-colors"
          >
            {wonReward ? 'Done • Return to Habit Tree' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
