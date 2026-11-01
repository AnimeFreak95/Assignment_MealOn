import React, { useState } from 'react';
import {
  Flame,
  Gift,
  Users,
  Building2,
  CheckCircle2,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Leaf,
  Fuel,
  IndianRupee,
  Clock,
  Info,
  PackageCheck,
  SunMedium,
  Shield,
  HelpCircle,
  Share2,
  Trophy,
  Coffee,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';

const AVATARS = [
  { name: 'Priya S.', initials: 'PS', bg: 'bg-rose-500', role: 'Engineering' },
  { name: 'Arjun M.', initials: 'AM', bg: 'bg-blue-500', role: 'Design' },
  { name: 'Tanvi K.', initials: 'TK', bg: 'bg-emerald-500', role: 'Product' },
  { name: 'Rohan D.', initials: 'RD', bg: 'bg-amber-500', role: 'Analytics' },
  { name: 'Neha V.', initials: 'NV', bg: 'bg-purple-500', role: 'HR' },
];

export default function StreaksTab({ onNotify, triggerConfetti, onOpenWowModal }) {
  // Day simulation: 1 (Mon) to 5 (Fri)
  const [currentDay, setCurrentDay] = useState(4); // Default to Thu (4/5) for engaging demo
  const [streakCompleted, setStreakCompleted] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // 4/5 Flexible Workweek Rule (Protected Skip State)
  const [hasWednesdaySkip, setHasWednesdaySkip] = useState(true); // Demonstrates Protected Skip by default

  // Friday Location Adaptation: 'office' | 'wfh'
  const [fridayLocation, setFridayLocation] = useState('office');
  const [wfhRewardChoice, setWfhRewardChoice] = useState('roll_monday'); // 'roll_monday' | 'wallet_credit'

  // Corporate Tower Pod Co-op State
  const [coopOrders, setCoopOrders] = useState(44); // 44 / 50 orders
  const COOP_GOAL = 50;
  const [showCoopFtuxModal, setShowCoopFtuxModal] = useState(false);
  const [coopUnlocked, setCoopUnlocked] = useState(false);

  // Office Pod & Unit Economics state
  const [joinedPod, setJoinedPod] = useState(true);
  const [showImpactDetails, setShowImpactDetails] = useState(false);
  const [showUnitEconomics, setShowUnitEconomics] = useState(false);

  // Impact Timeframe filter
  const [impactTimeframe, setImpactTimeframe] = useState('allTime'); // 'allTime' | 'thisMonth'

  // Handler for Day change
  const handleSelectDay = (dayIndex) => {
    playPop();
    setCurrentDay(dayIndex);
    if (dayIndex === 5) {
      triggerStreakWin();
    } else {
      setStreakCompleted(false);
      setSelectedReward(null);
    }
  };

  const triggerStreakWin = () => {
    setStreakCompleted(true);
    setCurrentDay(5);
    playCelebrationFanfare();
    if (triggerConfetti) triggerConfetti();

    if (onOpenWowModal) {
      onOpenWowModal({
        emoji: '🌳',
        title: hasWednesdaySkip ? 'Silver Bloom Unlocked! 🌸' : 'Golden Bloom Achieved! ✨',
        description: hasWednesdaySkip
          ? '4 of 5 workweek meals completed with 1 Protected Skip! Your Friday treat is unlocked.'
          : '5 of 5 perfect clean week! You unlocked the Friday treat + ₹50 Consistency Bonus.',
        highlights: [
          hasWednesdaySkip ? '1 Protected Skip used (Zero streak penalty)' : '5/5 Perfect Meal Adherence',
          'Zero Daily Lunch Decision Fatigue',
          fridayLocation === 'office'
            ? 'Free Treat bundled in Friday 1:00 PM Pod Drop (₹0 delivery cost!)'
            : 'Smart WFH Perk: Rolled to Monday or converted to wallet credit'
        ],
        ctaLabel: 'Claim Friday Perk 🎁'
      });
    }

    if (onNotify) {
      onNotify(
        hasWednesdaySkip ? '🌸 Silver Bloom Unlocked!' : '✨ Golden Bloom Achieved!',
        'Pick your Friday treat — protected by the 4/5 Flexible Workweek Rule.',
        'success'
      );
    }
  };

  // Simulate Friday Completion button
  const handleSimulateFriday = () => {
    setIsSimulating(true);
    playPop();

    setTimeout(() => {
      setIsSimulating(false);
      triggerStreakWin();
    }, 350);
  };

  const handleSelectReward = (rewardKey, rewardName, rewardType) => {
    playSuccessChime();
    setSelectedReward(rewardKey);
    if (triggerConfetti) triggerConfetti();
    if (onNotify) {
      onNotify(
        `${rewardName} Claimed! 🎁`,
        fridayLocation === 'office'
          ? `Bundled in Friday lunch box with ₹0 delivery fee (${rewardType}).`
          : `WFH Reward adapted: ${wfhRewardChoice === 'roll_monday' ? 'Delivering Monday to Office Pod' : '₹50 added to MealsOn Balance'}.`,
        'success'
      );
    }
  };

  // Co-op Order Simulator (+1 colleague order)
  const handleAddCoopOrder = () => {
    playPop();
    const nextCount = Math.min(coopOrders + 1, COOP_GOAL);
    setCoopOrders(nextCount);

    if (nextCount === COOP_GOAL && !coopUnlocked) {
      setCoopUnlocked(true);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onNotify) {
        onNotify(
          '🎉 Tower B Goal Unlocked! 🏢',
          '50 collective orders reached! Free Friday Gourmet Brownie & Juice Crate unlocked for Floor 4 pantry.',
          'success'
        );
      }
    } else {
      if (onNotify) {
        onNotify(
          'Colleague Joined! 🤝',
          `Tower B is now at ${nextCount}/${COOP_GOAL} orders. Only ${COOP_GOAL - nextCount} to go!`,
          'info'
        );
      }
    }
  };

  const handleNudgeColleagues = () => {
    playSuccessChime();
    if (onNotify) {
      onNotify(
        'Nudge Copied! 📢',
        'Shareable link copied: "Hey Tower B! 6 more MealsOn scheduled orders unlocks Friday Office Pantry Brownies 🍩"',
        'success'
      );
    }
  };

  const handleTogglePod = () => {
    const nextVal = !joinedPod;
    setJoinedPod(nextVal);
    if (nextVal) {
      playSuccessChime();
      if (triggerConfetti) triggerConfetti();
    } else {
      playPop();
    }

    if (onNotify) {
      onNotify(
        nextVal ? 'Joined Tower B Pod! 🏢' : 'Left Pod',
        nextVal ? '₹0 delivery + batch carbon savings unlocked.' : 'Reverted to solo doorstep drop.',
        nextVal ? 'success' : 'info'
      );
    }
  };

  // Stage labels for the tree
  const treeStageLabels = {
    1: { title: 'Day 1 (Mon): Earthen Sprout 🌱', subtitle: 'A tiny green seed sprouts in fertile terracotta' },
    2: { title: 'Day 2 (Tue): Fresh Twin Leaves 🍃', subtitle: 'Two glossy leaves taking strong root' },
    3: {
      title: hasWednesdaySkip ? 'Day 3 (Wed): Protected Skip 🛡️' : 'Day 3 (Wed): Branching Sapling 🌿',
      subtitle: hasWednesdaySkip
        ? 'Planned skip before 10 PM • Quota saved in pass & streak protected'
        : 'Woody trunk forming steady mid-week momentum'
    },
    4: { title: 'Day 4 (Thu): Budding Canopy 🌸', subtitle: 'Lush green foliage with budding blossom clusters' },
    5: {
      title: hasWednesdaySkip ? 'Day 5 (Fri): Silver Bloom 🌸🎁' : 'Day 5 (Fri): Golden Blooming Bonsai 🌳✨',
      subtitle: hasWednesdaySkip
        ? '4/5 Flexible workweek complete! Friday treat unlocked'
        : '5/5 Perfect clean week! Friday treat + ₹50 consistency bonus'
    }
  };

  // Impact Ledger values
  const impactStats = impactTimeframe === 'allTime' ? {
    savings: '₹3,120',
    savingsSub: '48 scheduled orders vs ₹65 on-demand fee',
    fuel: '18.4 L',
    fuelSub: '320 km solo bike trips replaced by batch drop',
    carbon: '14.2 kg',
    carbonSub: 'Equivalent to 1 mature urban tree offset for 7 months',
    time: '6.5 Hrs',
    timeSub: 'Saved from 20 mins/day lunch scrolling'
  } : {
    savings: '₹780',
    savingsSub: '12 scheduled lunches this month',
    fuel: '4.6 L',
    fuelSub: '80 km rider transit eliminated via batching',
    carbon: '3.6 kg',
    carbonSub: 'Equivalent to charging 420 smartphones',
    time: '1.6 Hrs',
    timeSub: 'Zero lunch app browsing & delivery tracking'
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5">
      {/* =========================================================================
          FEATURE 1: "HEALTHY WEEK" STREAK — 4/5 FLEXIBLE HABIT TREE
         ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
        {streakCompleted && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FF5A1F]/30 via-emerald-400/20 to-transparent w-full h-1.5" />
        )}

        {/* Header with Title & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Healthy Week Habit Tree
                </h3>
                <span className="text-[10px] bg-emerald-100 text-[#047857] font-bold px-1.5 py-0.2 rounded-full flex items-center">
                  <Shield className="w-2.5 h-2.5 mr-0.5" /> 4/5 Flexible
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                4 of 5 meals blooms your tree • 1 Free Protected Skip allowed
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-xs transition-all ${
              streakCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-orange-50 text-[#C2410C] border-orange-200'
            }`}
          >
            {streakCompleted
              ? (hasWednesdaySkip ? '4/5 Bloomed! 🌸' : '5/5 Golden Bloom! ✨')
              : `${currentDay}/5 Days`}
          </span>
        </div>

        {/* 4/5 Rule Explainer Pill */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[10px] text-emerald-900">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs">🛡️</span>
            <span>
              <strong>Zero-Penalty Skip:</strong> Client lunch or WFH? 1 planned skip won't kill your streak.
            </span>
          </div>
          <button
            onClick={() => {
              playPop();
              setHasWednesdaySkip(!hasWednesdaySkip);
            }}
            className="text-[9px] font-extrabold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs hover:bg-emerald-50 transition-colors shrink-0"
            title="Toggle Protected Skip demo on Wednesday"
          >
            {hasWednesdaySkip ? 'Simulate 5/5 Full' : 'Simulate 4/5 + Skip'}
          </button>
        </div>

        {/* Dynamic Habit Tree Growth Container */}
        <div className="bg-gradient-to-b from-emerald-50/50 via-slate-50 to-white rounded-2xl p-4 border border-emerald-100/80 relative flex flex-col items-center justify-center min-h-[200px]">
          {/* Top Status Capsule */}
          <div className="w-full flex items-center justify-between text-[10px] mb-2 px-1">
            <div className="flex items-center space-x-1 font-bold text-emerald-800">
              <SunMedium className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />
              <span>{treeStageLabels[currentDay].title}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold">
              Step {currentDay} of 5
            </span>
          </div>

          {/* THE GROWING HABIT TREE SVG */}
          <div className="w-full max-w-[240px] h-[145px] flex items-center justify-center transition-all duration-700 ease-out relative">
            <svg viewBox="0 0 220 150" className="w-full h-full drop-shadow-sm select-none">
              <defs>
                <linearGradient id="potGradTree" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#9A3412" />
                </linearGradient>
                <linearGradient id="leafGradTree" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="goldenBloomTree" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="40%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="silverBloomTree" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FDF2F8" />
                  <stop offset="40%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#DB2777" />
                </linearGradient>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Sun & Dew Background */}
              <circle cx="110" cy="55" r="48" fill="url(#sunGlow)" opacity={currentDay >= 3 ? 0.35 : 0.15} />

              {/* Terracotta Bonsai Pot & Soil Bed */}
              <ellipse cx="110" cy="132" rx="42" ry="7" fill="#78350F" opacity="0.25" />
              <path d="M 78 114 L 142 114 L 135 133 L 85 133 Z" fill="url(#potGradTree)" rx="2" />
              <ellipse cx="110" cy="114" rx="32" ry="5" fill="#451A03" />
              <rect x="76" y="111" width="68" height="4.5" rx="2" fill="#F97316" />

              {/* STAGE 1 (Mon): Tiny Tender Sprout */}
              {currentDay >= 1 && (
                <g className="transition-all duration-500 ease-out">
                  <path d="M 110 114 Q 110 102 110 94" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 110 96 Q 118 90 121 96 Q 115 101 110 98" fill="url(#leafGradTree)" />
                  <circle cx="110" cy="94" r="1.5" fill="#A7F3D0" />
                </g>
              )}

              {/* STAGE 2 (Tue): Twin Leaf Stem with Dew Drops */}
              {currentDay >= 2 && (
                <g className="transition-all duration-500 ease-out">
                  <path d="M 110 100 Q 101 92 97 97 Q 104 103 110 101" fill="url(#leafGradTree)" />
                  <circle cx="122" cy="94" r="1.8" fill="#E0F2FE" opacity="0.9" />
                  <circle cx="98" cy="95" r="1.5" fill="#E0F2FE" opacity="0.9" />
                </g>
              )}

              {/* STAGE 3 (Wed): Woody Trunk / Protected Shield */}
              {currentDay >= 3 && (
                <g className="transition-all duration-500 ease-out">
                  <path d="M 110 114 Q 108 88 103 76 Q 98 66 93 64" stroke="#78350F" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <path d="M 106 82 Q 116 75 125 70" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="91" cy="62" r="14" fill="url(#leafGradTree)" opacity="0.95" />
                  <circle cx="127" cy="68" r="12" fill="url(#leafGradTree)" opacity="0.95" />
                  <circle cx="106" cy="65" r="10" fill="#047857" opacity="0.8" />
                  {hasWednesdaySkip && (
                    <g transform="translate(142, 60)">
                      <circle cx="0" cy="0" r="11" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
                      <text x="-5" y="4" fontSize="10">🛡️</text>
                    </g>
                  )}
                </g>
              )}

              {/* STAGE 4 (Thu): Lush Bonsai Canopy & Pink Budding Blossoms */}
              {currentDay >= 4 && (
                <g className="transition-all duration-500 ease-out">
                  <path d="M 103 76 Q 110 58 110 46" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <circle cx="110" cy="44" r="18" fill="#10B981" />
                  <circle cx="128" cy="52" r="13" fill="#059669" />
                  <circle cx="88" cy="50" r="13" fill="#34D399" />
                  <circle cx="110" cy="34" r="12" fill="#6EE7B7" opacity="0.9" />
                  <circle cx="105" cy="38" r="2.5" fill="#F472B6" />
                  <circle cx="121" cy="42" r="2.5" fill="#F472B6" />
                  <circle cx="86" cy="46" r="2.5" fill="#F472B6" />
                </g>
              )}

              {/* STAGE 5 (Fri - Payoff): Bloom (Silver or Golden) */}
              {currentDay >= 5 && (
                <g className="animate-in zoom-in-75 duration-700">
                  <circle
                    cx="110"
                    cy="52"
                    r="48"
                    fill={hasWednesdaySkip ? 'url(#silverBloomTree)' : 'url(#goldenBloomTree)'}
                    opacity="0.25"
                    className="animate-pulse"
                  />
                  <circle cx="110" cy="36" r="19" fill={hasWednesdaySkip ? 'url(#silverBloomTree)' : 'url(#goldenBloomTree)'} />
                  <circle cx="82" cy="50" r="16" fill={hasWednesdaySkip ? '#F472B6' : '#FBBF24'} />
                  <circle cx="138" cy="50" r="16" fill={hasWednesdaySkip ? '#EC4899' : '#F59E0B'} />
                  <circle cx="100" cy="60" r="14" fill={hasWednesdaySkip ? '#FBCFE8' : '#FCD34D'} />
                  <circle cx="122" cy="60" r="14" fill={hasWednesdaySkip ? '#F472B6' : '#FBBF24'} />
                  <circle cx="110" cy="22" r="10" fill={hasWednesdaySkip ? '#FDF2F8' : '#FEF08A'} />

                  <text x="150" y="36" fontSize="13">✨</text>
                  <text x="56" y="42" fontSize="13">✨</text>
                  <text x="104" y="16" fontSize="12">{hasWednesdaySkip ? '🌸' : '🌟'}</text>

                  {/* Friday Gift Parcel */}
                  <rect x="102" y="118" width="16" height="14" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
                  <line x1="110" y1="118" x2="110" y2="132" stroke="#FEF08A" strokeWidth="2.5" />
                  <line x1="102" y1="125" x2="118" y2="125" stroke="#FEF08A" strokeWidth="2.5" />
                  <circle cx="110" cy="117" r="2.5" fill="#FEF08A" />
                  <text x="122" y="129" fontSize="9">🎁</text>
                </g>
              )}
            </svg>
          </div>

          {/* Subtitle description */}
          <p className="text-[10px] text-slate-500 text-center font-medium mt-1">
            {treeStageLabels[currentDay].subtitle}
          </p>

          {/* Interactive Day Stepper (Mon -> Fri) */}
          <div className="w-full mt-2.5 pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-6 right-6 top-3 h-1 bg-slate-200 z-0">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-[#FF5A1F] to-[#10B981] transition-all duration-500 ease-out"
                  style={{ width: `${((currentDay - 1) / 4) * 100}%` }}
                />
              </div>

              {[
                { day: 'Mon', num: 1, label: 'Sprout' },
                { day: 'Tue', num: 2, label: 'Leaves' },
                {
                  day: 'Wed',
                  num: 3,
                  label: hasWednesdaySkip ? 'Skip 🛡️' : 'Sapling',
                  isShield: hasWednesdaySkip
                },
                { day: 'Thu', num: 4, label: 'Canopy' },
                { day: 'Fri', num: 5, label: 'Bloom 🎁', isPayoff: true }
              ].map((node) => {
                const isPassed = node.num <= currentDay;
                const isCurrent = node.num === currentDay;

                return (
                  <button
                    key={node.day}
                    onClick={() => handleSelectDay(node.num)}
                    className="flex flex-col items-center relative z-10 group active:scale-90 transition-transform cursor-pointer"
                    title={`Click to preview Day ${node.num} (${node.day})`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                        isCurrent
                          ? node.isPayoff
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 scale-110'
                            : 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110'
                          : isPassed
                          ? node.isShield
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                            : 'bg-[#10B981] text-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed && !node.isPayoff && !node.isShield ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : node.isShield ? (
                        <Shield className="w-3 h-3 text-emerald-700" />
                      ) : node.isPayoff ? (
                        <Gift className="w-3 h-3" />
                      ) : (
                        node.num
                      )}
                    </div>
                    <span
                      className={`text-[9px] mt-1 font-bold ${
                        isCurrent
                          ? 'text-emerald-700 font-extrabold'
                          : isPassed
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {node.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Demo Trigger Button or Reward Claim Box */}
        {!streakCompleted ? (
          <button
            onClick={handleSimulateFriday}
            disabled={isSimulating}
            className="w-full bg-gradient-to-r from-emerald-600 via-[#10B981] to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Simulate Friday Delivery (Bloom Tree & Claim Treat)</span>
          </button>
        ) : (
          /* UNLOCKED FRIDAY REWARD SELECTION + LOCATION ADAPTATION */
          <div className="bg-[#ECFDF5] border border-[#10B981] rounded-2xl p-3.5 space-y-3 animate-in zoom-in-95 duration-200 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl select-none">🎁</span>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950">
                    {hasWednesdaySkip ? 'Silver Bloom Completed! (4/5 Meals)' : 'Golden Bloom Completed! (5/5 Meals)'}
                  </h4>
                  <p className="text-[10px] text-emerald-800 font-medium">
                    {hasWednesdaySkip
                      ? '1 Protected Skip used. Free Friday treat unlocked!'
                      : 'Perfect clean week. Free treat + ₹50 consistency bonus unlocked!'}
                  </p>
                </div>
              </div>
            </div>

            {/* LOCATION-ADAPTIVE REWARD SELECTOR (Office Pod vs WFH) */}
            <div className="bg-white/90 border border-emerald-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-700 flex items-center">
                  <Building2 className="w-3 h-3 mr-1 text-[#FF5A1F]" /> Friday Delivery Location:
                </span>
                <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                  <button
                    onClick={() => { playPop(); setFridayLocation('office'); }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      fridayLocation === 'office'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    🏢 Office Pod
                  </button>
                  <button
                    onClick={() => { playPop(); setFridayLocation('wfh'); }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      fridayLocation === 'wfh'
                        ? 'bg-white text-[#FF5A1F] shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    🏠 WFH (Home)
                  </button>
                </div>
              </div>

              {/* Location Adaptive Message */}
              {fridayLocation === 'office' ? (
                <div className="bg-emerald-50 rounded-lg p-2 text-[10px] text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center">
                    <PackageCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                    Physical treat packed into 1:00 PM Tower B batch drop
                  </span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    ₹0 Courier Fee
                  </span>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 space-y-1.5">
                  <div className="text-[10px] text-orange-950 font-bold flex items-center justify-between">
                    <span>🏠 WFH Friday Detected: Smart Margin Adaptation</span>
                    <span className="text-[8px] bg-orange-200/80 text-orange-900 px-1.5 py-0.2 rounded font-extrabold">
                      Protects ₹0 Delivery
                    </span>
                  </div>
                  <p className="text-[9px] text-orange-800 leading-tight">
                    Suburban solo deliveries don't support cold-chain treats. Choose how you'd like your perk:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      onClick={() => { playPop(); setWfhRewardChoice('roll_monday'); }}
                      className={`p-1.5 rounded-lg border text-left text-[9px] font-bold transition-all ${
                        wfhRewardChoice === 'roll_monday'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-orange-200'
                      }`}
                    >
                      <div>📦 Roll to Monday</div>
                      <div className={`text-[8px] font-normal ${wfhRewardChoice === 'roll_monday' ? 'text-emerald-100' : 'text-slate-500'}`}>
                        Delivered in Monday Office Pod box
                      </div>
                    </button>
                    <button
                      onClick={() => { playPop(); setWfhRewardChoice('wallet_credit'); }}
                      className={`p-1.5 rounded-lg border text-left text-[9px] font-bold transition-all ${
                        wfhRewardChoice === 'wallet_credit'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-orange-200'
                      }`}
                    >
                      <div>💳 ₹50 Wallet Credit</div>
                      <div className={`text-[8px] font-normal ${wfhRewardChoice === 'wallet_credit' ? 'text-emerald-100' : 'text-slate-500'}`}>
                        Added to MealsOn Balance instantly
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Duality of Choice: Clean Fuel vs Cheat Treat */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleSelectReward('protein', '🍫 Whey Protein Bar', 'Clean Fuel')}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cta-bounce flex flex-col justify-between cursor-pointer ${
                  selectedReward === 'protein'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                    : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🍫</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${selectedReward === 'protein' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-50 text-emerald-700'}`}>
                      CLEAN FUEL
                    </span>
                  </div>
                  <div className="text-[11px] font-extrabold mt-1">Fudgy Protein Bar</div>
                  <div className={`text-[9px] mt-0.5 ${selectedReward === 'protein' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    15g Whey • 0g Added Sugar (Shelf-Stable)
                  </div>
                </div>
                {selectedReward === 'protein' && (
                  <span className="text-[9px] font-bold text-emerald-200 mt-2 flex items-center">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Perk Confirmed
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSelectReward('coldbrew', '☕ Nitro Cold Brew Can', 'Cheat Treat')}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cta-bounce flex flex-col justify-between cursor-pointer ${
                  selectedReward === 'coldbrew'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                    : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">☕</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${selectedReward === 'coldbrew' ? 'bg-emerald-700 text-emerald-100' : 'bg-amber-50 text-amber-700'}`}>
                      CHEAT TREAT
                    </span>
                  </div>
                  <div className="text-[11px] font-extrabold mt-1">Nitro Cold Brew Can</div>
                  <div className={`text-[9px] mt-0.5 ${selectedReward === 'coldbrew' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Ambient Sealed Can • Arabica
                  </div>
                </div>
                {selectedReward === 'coldbrew' && (
                  <span className="text-[9px] font-bold text-emerald-200 mt-2 flex items-center">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Perk Confirmed
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          FEATURE 2: CORPORATE TOWER POD CO-OP (COMMUNITY RETENTION ENGINE)
         ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 text-white shadow-md space-y-3.5 relative overflow-hidden border border-slate-700">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF5A1F]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Title & "How it works" CTA */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-base">🏢</span>
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Cyber Park Tower B • Co-op
              </h3>
              <span className="text-[9px] bg-[#FF5A1F] text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                Team Goal
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium">
              Colleagues ordering together to unlock Friday team perks
            </p>
          </div>

          {/* DEDICATED FTUX / "HOW IT WORKS" BUTTON */}
          <button
            onClick={() => {
              playPop();
              setShowCoopFtuxModal(true);
            }}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20 transition-all cursor-pointer shrink-0"
          >
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>How Co-op Works</span>
          </button>
        </div>

        {/* Collective Milestone Target Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 space-y-2.5 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🍩</span>
              <div>
                <div className="font-extrabold text-white text-xs leading-tight flex items-center">
                  <span>Friday Floor 4 Pantry Snack Crate</span>
                  {coopUnlocked && (
                    <span className="ml-1.5 text-[8px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.2 rounded">
                      UNLOCKED! 🎉
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">
                  {COOP_GOAL} collective Tower B lunches by Thursday 10 PM
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-[#FF5A1F]">
                {coopOrders}
              </span>
              <span className="text-xs text-slate-400 font-bold">/{COOP_GOAL}</span>
            </div>
          </div>

          {/* Animated Collective Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  coopUnlocked
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                    : 'bg-gradient-to-r from-amber-400 via-[#FF5A1F] to-emerald-400'
                }`}
                style={{ width: `${(coopOrders / COOP_GOAL) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold">
              <span>{Math.round((coopOrders / COOP_GOAL) * 100)}% Reached</span>
              <span>
                {coopOrders >= COOP_GOAL
                  ? 'Goal Achieved! Delivered Friday 1:00 PM'
                  : `${COOP_GOAL - coopOrders} more orders needed by 10 PM`}
              </span>
            </div>
          </div>

          {/* Colleague Avatars & Activity */}
          <div className="pt-1 flex items-center justify-between border-t border-slate-700/60 text-[10px]">
            <div className="flex items-center space-x-2">
              <div className="flex items-center -space-x-1.5 overflow-hidden">
                {AVATARS.map((av, idx) => (
                  <div
                    key={idx}
                    className={`w-5 h-5 rounded-full ${av.bg} text-white flex items-center justify-center text-[8px] font-bold ring-1.5 ring-slate-800`}
                    title={`${av.name} (${av.role})`}
                  >
                    {av.initials}
                  </div>
                ))}
                <div className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[7px] font-extrabold ring-1.5 ring-slate-800">
                  +18
                </div>
              </div>
              <span className="text-slate-300 font-medium text-[9px]">
                You + 22 Tower B colleagues active
              </span>
            </div>

            <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-1.5 py-0.5 rounded">
              Self-Funded by Batching
            </span>
          </div>
        </div>

        {/* Interactive Co-op Action Row */}
        <div className="grid grid-cols-2 gap-2 relative z-10 pt-0.5">
          {/* Action 1: Simulate Colleague Joining */}
          <button
            onClick={handleAddCoopOrder}
            disabled={coopOrders >= COOP_GOAL}
            className={`py-2 px-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 cursor-pointer ${
              coopOrders >= COOP_GOAL
                ? 'bg-emerald-600/50 text-white/70 border border-emerald-500/50 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Simulate Colleague (+1)</span>
          </button>

          {/* Action 2: Share / Nudge Coworkers */}
          <button
            onClick={handleNudgeColleagues}
            className="bg-[#FF5A1F] hover:bg-[#E04812] text-white py-2 px-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <Share2 className="w-3 h-3 shrink-0" />
            <span>Nudge Colleagues</span>
          </button>
        </div>

        {/* Economics Logic Explainer Note */}
        <p className="text-[9px] text-slate-400 text-center relative z-10 leading-tight">
          💡 <strong>How it's free:</strong> 50 batch orders save ₹2,050 in courier dispatches. That logistics surplus 100% funds the Friday snack crate with zero individual cost!
        </p>
      </div>

      {/* =========================================================================
          FEATURE 3: IMPACT & SAVINGS LEDGER (COST, FUEL & CARBON DASHBOARD)
         ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {/* Header + Timeframe Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#047857] flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Impact & Savings Ledger 🌱
                </h3>
                <span className="text-[8px] font-extrabold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                  Sample 3-Month Projection
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Compounding batching metrics based on 48 scheduled orders
              </p>
            </div>
          </div>

          {/* Timeframe Pill */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-[10px] font-bold">
            <button
              onClick={() => { playPop(); setImpactTimeframe('thisMonth'); }}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                impactTimeframe === 'thisMonth'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => { playPop(); setImpactTimeframe('allTime'); }}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                impactTimeframe === 'allTime'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>

        {/* 4 Core Impact Cards */}
        <div className="grid grid-cols-2 gap-2">
          {/* 1. Direct Delivery Cost Saved */}
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <IndianRupee className="w-3 h-3 mr-0.5 text-emerald-600" /> Wallet Shield
              </span>
              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                100% Free Drops
              </span>
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              {impactStats.savings}
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">
              {impactStats.savingsSub}
            </p>
          </div>

          {/* 2. Fuel Conserved */}
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Fuel className="w-3 h-3 mr-0.5 text-amber-600" /> Fuel Conserved
              </span>
              <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                Batch Runs
              </span>
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              {impactStats.fuel}
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">
              {impactStats.fuelSub}
            </p>
          </div>

          {/* 3. Carbon Emissions Averted */}
          <div className="bg-[#ECFDF5] border border-emerald-200 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                <Leaf className="w-3 h-3 mr-0.5 text-emerald-600" /> CO₂ Offset
              </span>
              <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                Planetary Win
              </span>
            </div>
            <div className="text-lg font-extrabold text-emerald-950">
              {impactStats.carbon}
            </div>
            <p className="text-[9px] text-emerald-800 leading-tight">
              {impactStats.carbonSub}
            </p>
          </div>

          {/* 4. Time Reclaimed */}
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Clock className="w-3 h-3 mr-0.5 text-blue-600" /> Time Reclaimed
              </span>
              <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                Cognitive Win
              </span>
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              {impactStats.time}
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">
              {impactStats.timeSub}
            </p>
          </div>
        </div>

        {/* Explainer: How Batch Delivery Works */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
          <button
            onClick={() => {
              playPop();
              setShowImpactDetails(!showImpactDetails);
            }}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center">
              <Info className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              How do scheduled streaks save fuel & emissions?
            </span>
            {showImpactDetails ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {showImpactDetails && (
            <div className="mt-2 text-[10px] text-slate-600 space-y-1.5 pt-1.5 border-t border-slate-200 animate-in fade-in duration-150">
              <p>
                🛵 <strong>Standard On-Demand Delivery:</strong> Each lunch order dispatches 1 individual bike across 4–7 km in peak traffic, generating ~320g of CO₂ and ₹55–₹70 in fuel/labor costs per meal.
              </p>
              <p>
                🏢 <strong>Scheduled Pod Batching:</strong> By knowing your Mon–Fri schedule at 10:00 PM, 1 single electric courier brings 15–20 meals to your office tower at 1:00 PM in one consolidated drop, cutting transit emissions by <strong>78%</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          OFFICE POD & BATCH DELIVERY ENGINE (PHYSICAL COURIER HUB)
         ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFF5F0] text-[#FF5A1F] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Cyber Park Pod • 1:00 PM Wave
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Tower B Consolidated Drop Point
              </p>
            </div>
          </div>

          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full">
            12 Colleagues Active
          </span>
        </div>

        {/* Join Pod Toggle */}
        <button
          onClick={handleTogglePod}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-[0.97] cta-bounce cursor-pointer ${
            joinedPod
              ? 'bg-[#10B981] text-white shadow-md'
              : 'bg-[#FF5A1F] hover:bg-[#E04812] text-white shadow-md'
          }`}
        >
          {joinedPod ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active in Pod #TowerB (Smart Locker Bay 3)</span>
            </>
          ) : (
            <>
              <Users className="w-3.5 h-3.5" />
              <span>Join 1:00 PM Tower B Batch Pod</span>
            </>
          )}
        </button>

        {/* PM Economics Dropdown */}
        <div className="border-t border-slate-100 pt-1.5">
          <button
            onClick={() => {
              playPop();
              setShowUnitEconomics(!showUnitEconomics);
            }}
            className="w-full flex items-center justify-between text-[10px] font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center text-[#FF5A1F]">
              <TrendingDown className="w-3 h-3 mr-1" />
              PM Unit Economics: Why batching funds the Friday free treat
            </span>
            {showUnitEconomics ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>

          {showUnitEconomics && (
            <div className="mt-1.5 bg-slate-900 text-white p-3 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[8px] uppercase">Solo Drop</span>
                  <span className="font-bold text-rose-400 text-sm">₹65</span>
                  <span className="text-[7px] text-slate-400 block">per individual meal</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[8px] uppercase">Pod Batch</span>
                  <span className="font-bold text-emerald-400 text-sm">₹24</span>
                  <span className="text-[7px] text-slate-400 block">per consolidated drop</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-slate-400 block text-[8px] uppercase">Margin Saved</span>
                  <span className="font-bold text-[#FF5A1F] text-sm">63%</span>
                  <span className="text-[7px] text-slate-400 block">funds user reward</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 text-center leading-tight">
                💡 <strong>The Margin Loop:</strong> Slashing last-mile delivery costs from ₹65 to ₹24 across 5 meals saves ₹205 in courier logistics. This surplus easily funds the ₹45 wholesale Friday treat with positive net margins!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          FIRST-TIME USER EXPERIENCE (FTUX) MODAL: HOW TOWER CO-OP WORKS
         ========================================================================= */}
      {showCoopFtuxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                playPop();
                setShowCoopFtuxModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5A1F] flex items-center justify-center text-xl shadow-xs">
                🏢
              </div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight pt-1">
                How Tower Co-op Works
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Win together as a building. Free treats unlocked by teamwork!
              </p>
            </div>

            {/* 3 Step Interactive FTUX Explainer */}
            <div className="space-y-2.5 text-xs">
              {/* Step 1 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">
                    Order Together, Save Together
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Every colleague in Cyber Park Tower B who schedules a lunch adds <strong>+1 order</strong> to the collective weekly target.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">
                    Unlock Friday Office Pantry Treats
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    When the building hits <strong>50 orders</strong> by Thursday 10:00 PM, MealsOn delivers a shared crate of <strong>Artisan Brownies or Juices</strong> to Floor 4 pantry!
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">
                    Zero Extra Cost (Self-Funded)
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Batching 50 orders in one courier drop saves ₹2,050 in logistics. That surplus completely finances the office pantry snack drop!
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Primary CTA */}
            <button
              onClick={() => {
                playSuccessChime();
                setShowCoopFtuxModal(false);
              }}
              className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Got it, Let's Hit 50 Orders! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
