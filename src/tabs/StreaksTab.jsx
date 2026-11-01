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
  ArrowRight,
  Medal,
  Award,
  Crown,
  UserCheck,
  AlertCircle,
  Settings,
  Sliders,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';

const AVATARS = [
  { name: 'Priya S.', initials: 'PS', bg: 'bg-rose-500', role: 'Engineering', orders: 4 },
  { name: 'Arjun M.', initials: 'AM', bg: 'bg-blue-500', role: 'Design', orders: 3 },
  { name: 'Tanvi K.', initials: 'TK', bg: 'bg-emerald-500', role: 'Product', orders: 4 },
  { name: 'Rohan D.', initials: 'RD', bg: 'bg-amber-500', role: 'Analytics', orders: 2 },
  { name: 'Neha V.', initials: 'NV', bg: 'bg-purple-500', role: 'HR', orders: 3 },
];

export default function StreaksTab({ onNotify, triggerConfetti, onOpenWowModal }) {
  // SUB-TAB NAVIGATION: 'tree' (My Habit Tree) | 'tribe' (Tower Tribe)
  const [activeSubTab, setActiveSubTab] = useState('tribe'); // Default to 'tribe' for direct inspection of new UI

  // --- HABIT TREE STATE ---
  const [currentDay, setCurrentDay] = useState(4); // Default to Thu (4/5)
  const [streakCompleted, setStreakCompleted] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasWednesdaySkip, setHasWednesdaySkip] = useState(true);
  const [fridayLocation, setFridayLocation] = useState('office');
  const [wfhRewardChoice, setWfhRewardChoice] = useState('roll_monday');

  // --- TOWER TRIBE THREE INDEPENDENT USER STATES ---
  // State 1: Participation Opt-In
  const [isOptedInToTribe, setIsOptedInToTribe] = useState(true);
  // State 2: Individual Activity (At least 1 scheduled lunch completed this week)
  const [hasCompletedLunchThisWeek, setHasCompletedLunchThisWeek] = useState(true);
  // State 3: Claim Availability
  const [isClaimWindowOpen, setIsClaimWindowOpen] = useState(true); // Open for demo testing
  const [claimStatus, setClaimStatus] = useState('idle'); // 'idle' | 'claiming' | 'claimed'
  const [claimedReceipt, setClaimedReceipt] = useState(null);
  const [showClaimCelebrationModal, setShowClaimCelebrationModal] = useState(false);

  // Collective Progress Counter (Screenshot baseline: 44 orders)
  const [tribeOrders, setTribeOrders] = useState(44);

  // Modals & Drawers
  const [showTribeFtuxModal, setShowTribeFtuxModal] = useState(false);
  const [showHowItWorksEconomics, setShowHowItWorksEconomics] = useState(false);
  const [showManageParticipation, setShowManageParticipation] = useState(false);
  const [showPrototypeControls, setShowPrototypeControls] = useState(false);

  // Office Pod & Impact state
  const [joinedPod, setJoinedPod] = useState(true);
  const [showImpactDetails, setShowImpactDetails] = useState(false);
  const [impactTimeframe, setImpactTimeframe] = useState('allTime');

  // Milestone Definitions (Single source of truth)
  const MILESTONES = [
    { tier: 1, name: 'Bronze Pod', target: 25, credits: 25, icon: '🥉' },
    { tier: 2, name: 'Silver Tribe', target: 50, credits: 50, icon: '🥈' },
    { tier: 3, name: 'Gold Champion', target: 75, credits: 75, icon: '🥇' },
  ];

  // Current unlocked tier calculation
  const currentUnlockedTier = tribeOrders >= 75 ? 3 : tribeOrders >= 50 ? 2 : tribeOrders >= 25 ? 1 : 0;
  const currentUnlockedCredits = currentUnlockedTier === 3 ? 75 : currentUnlockedTier === 2 ? 50 : currentUnlockedTier === 1 ? 25 : 0;
  const ordersNeededForSilver = Math.max(0, 50 - tribeOrders);
  const ordersNeededForGold = Math.max(0, 75 - tribeOrders);

  // Determine user's claim eligibility
  const isEligibleToClaim = isOptedInToTribe && hasCompletedLunchThisWeek && currentUnlockedTier > 0;
  const isRewardClaimableNow = isEligibleToClaim && isClaimWindowOpen && claimStatus === 'idle';

  // Claim Handler with animated celebration modal
  const handleClaimFridayFuel = () => {
    if (claimStatus !== 'idle' || !isRewardClaimableNow) return;

    playPop();
    setClaimStatus('claiming');

    // Simulate verified transaction settlement
    setTimeout(() => {
      const receipt = {
        amount: currentUnlockedCredits,
        tierName: currentUnlockedTier === 3 ? 'Gold Champion' : currentUnlockedTier === 2 ? 'Silver Tribe' : 'Bronze Pod',
        destination: 'MealsOn Balance',
        claimedAt: 'Friday, 10:02 PM',
        validityDays: 30,
        expiryDate: 'Dec 1, 2026',
        maxRedemption: '25% off pass renewal'
      };

      setClaimStatus('claimed');
      setClaimedReceipt(receipt);
      setShowClaimCelebrationModal(true);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();

      if (onNotify) {
        onNotify(
          `₹${currentUnlockedCredits} Friday Fuel Credited! 🎉`,
          'Added to MealsOn Balance. Valid for 30 days.',
          'success'
        );
      }
    }, 600);
  };

  // Co-op Order Simulator (+1 colleague order in prototype controls)
  const handleAddTribeOrder = () => {
    playPop();
    const nextCount = Math.min(tribeOrders + 1, 90);
    setTribeOrders(nextCount);

    if (nextCount === 50) {
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onNotify) {
        onNotify(
          '🥈 Silver Tribe Milestone Unlocked! 🎉',
          '50 collective orders reached! Every eligible member unlocks ₹50 Friday Fuel Credit.',
          'success'
        );
      }
    } else if (nextCount === 75) {
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
      if (onNotify) {
        onNotify(
          '🥇 Gold Champion Milestone Unlocked! 🏆',
          '75 collective orders reached! ₹75 Friday Fuel Credit unlocked for the tower!',
          'success'
        );
      }
    }
  };

  const handleResetDemo = () => {
    playPop();
    setTribeOrders(44);
    setIsOptedInToTribe(true);
    setHasCompletedLunchThisWeek(true);
    setIsClaimWindowOpen(true);
    setClaimStatus('idle');
    setClaimedReceipt(null);
    setShowClaimCelebrationModal(false);
    if (onNotify) {
      onNotify('Demo Reset', 'Tower Tribe reset to default 44-order state.', 'info');
    }
  };

  const handleNudgeColleagues = () => {
    playSuccessChime();
    if (onNotify) {
      onNotify(
        'Nudge Copied! 📢',
        `Shareable link copied: "Hey Tower B! We are ${ordersNeededForSilver} orders away from unlocking the ₹50 Friday Fuel Credit on MealsOn ⚡"`,
        'success'
      );
    }
  };

  // Habit Tree Handlers
  const handleSelectDay = (dayIndex) => {
    playPop();
    setCurrentDay(dayIndex);
    if (dayIndex === 5) {
      setStreakCompleted(true);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();
    } else {
      setStreakCompleted(false);
      setSelectedReward(null);
    }
  };

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
    <div className="pb-36 px-4 pt-3 space-y-4 max-w-md mx-auto">
      {/* =========================================================================
          TOP SEGMENTED SUB-TAB TOGGLE: [🌱 My Habit Tree] vs [🏢 Tower Tribe]
         ========================================================================= */}
      <nav aria-label="Loyalty sub-sections" className="bg-slate-200/90 p-1 rounded-2xl flex items-center shadow-2xs">
        <button
          onClick={() => {
            playPop();
            setActiveSubTab('tree');
          }}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-sm font-extrabold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeSubTab === 'tree'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-selected={activeSubTab === 'tree'}
          role="tab"
        >
          <Leaf className={`w-4 h-4 ${activeSubTab === 'tree' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>My Habit Tree</span>
          <span className="text-[10px] bg-emerald-100 text-[#047857] px-1.5 py-0.2 rounded-full font-bold">
            4/5
          </span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveSubTab('tribe');
          }}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-sm font-extrabold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeSubTab === 'tribe'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-selected={activeSubTab === 'tribe'}
          role="tab"
        >
          <Building2 className={`w-4 h-4 ${activeSubTab === 'tribe' ? 'text-[#FF5A1F]' : 'text-slate-400'}`} />
          <span>Tower Tribe</span>
          {currentUnlockedTier > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-extrabold">
              ₹{currentUnlockedCredits}
            </span>
          )}
        </button>
      </nav>

      {/* =========================================================================
          SUB-TAB 2: TOWER TRIBE (RE-ARCHITECTED HIERARCHY AS PER BRIEF)
         ========================================================================= */}
      {activeSubTab === 'tribe' && (
        <main className="space-y-4 animate-in fade-in duration-200">
          {/* ---------------------------------------------------------------------
              1. SIMPLIFIED TOWER HEADER (NO BADGE SQUEEZING)
             --------------------------------------------------------------------- */}
          <header className="flex flex-col space-y-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  Cyber Park Tower B Tower Tribe
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Collective tech-park milestones • Friday Fuel Credits
                </p>
              </div>

              {/* How it works button (Discoverable but secondary) */}
              <button
                onClick={() => {
                  playPop();
                  setShowTribeFtuxModal(true);
                }}
                className="ml-2 min-h-[44px] px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center space-x-1 transition-colors cursor-pointer shrink-0"
                aria-label="How Tower Tribe works"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>How it works</span>
              </button>
            </div>
          </header>

          {/* ---------------------------------------------------------------------
              2. HERO: COLLECTIVE PROGRESS (NAVY CONTAINER, 0-75 CONTINUUM)
             --------------------------------------------------------------------- */}
          <section
            aria-labelledby="collective-progress-heading"
            className="bg-slate-900 rounded-2xl p-4 text-white shadow-md space-y-3.5 border border-slate-800 relative overflow-hidden"
          >
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF5A1F]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row: This Week's Hero Numbers */}
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  THIS WEEK
                </span>
                <div id="collective-progress-heading" className="text-2xl font-black text-white tracking-tight leading-tight">
                  {tribeOrders} tower orders
                </div>
              </div>

              {/* Next Milestone Hero Highlight */}
              <div className="text-right">
                <span className="inline-block text-xs font-black text-[#F59E0B] bg-amber-950/80 border border-amber-600/60 px-2.5 py-1 rounded-lg">
                  {ordersNeededForSilver > 0
                    ? `${ordersNeededForSilver} more orders to Silver`
                    : ordersNeededForGold > 0
                    ? `${ordersNeededForGold} more orders to Gold`
                    : '🎉 Max Gold Tier Reached!'}
                </span>
              </div>
            </div>

            {/* Continuous Milestone Ladder (0 - 75 orders) */}
            <div className="space-y-2 relative z-10 pt-1">
              {/* Progress Bar Track */}
              <div
                role="progressbar"
                aria-valuenow={tribeOrders}
                aria-valuemin={0}
                aria-valuemax={75}
                aria-label="Tower orders progress toward Gold milestone"
                className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/80"
              >
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 via-[#FF5A1F] to-[#10B981]"
                  style={{ width: `${Math.min((tribeOrders / 75) * 100, 100)}%` }}
                />
              </div>

              {/* 3 Evenly Distributed Milestone Markers */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                {MILESTONES.map((m) => {
                  const isAchieved = tribeOrders >= m.target;
                  const isNext = !isAchieved && (
                    (m.tier === 2 && tribeOrders >= 25 && tribeOrders < 50) ||
                    (m.tier === 3 && tribeOrders >= 50 && tribeOrders < 75) ||
                    (m.tier === 1 && tribeOrders < 25)
                  );

                  return (
                    <div
                      key={m.tier}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isAchieved
                          ? 'bg-emerald-950/50 border-emerald-500/80 text-white'
                          : isNext
                          ? 'bg-slate-800/90 border-[#F59E0B] text-white shadow-xs'
                          : 'bg-slate-850 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        {/* State Tag */}
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          {isAchieved ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-500 text-white rounded flex items-center">
                              <Check className="w-2.5 h-2.5 mr-0.5 stroke-[3]" /> Unlocked
                            </span>
                          ) : isNext ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded">
                              Next Goal
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-500 uppercase">
                              Upcoming
                            </span>
                          )}
                        </div>

                        {/* Reward Amount Prominent */}
                        <div className={`text-base font-black ${isAchieved ? 'text-emerald-300' : isNext ? 'text-amber-300' : 'text-slate-300'}`}>
                          ₹{m.credits}
                        </div>
                        <div className="text-[11px] font-extrabold text-white mt-0.5">
                          {m.name}
                        </div>
                      </div>

                      {/* Threshold secondary */}
                      <div className="text-[10px] text-slate-400 font-semibold mt-1">
                        {m.target} orders
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Unlocked Status Footer */}
            <div className="pt-1 border-t border-slate-800 text-xs flex items-center justify-between text-slate-300 relative z-10">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shrink-0 animate-pulse" />
                <span>
                  Current Unlocked Tier:{' '}
                  <strong className="text-white font-extrabold">
                    {currentUnlockedTier > 0 ? `₹${currentUnlockedCredits} / eligible member` : 'None yet (Working to Bronze)'}
                  </strong>
                </span>
              </span>

              {ordersNeededForSilver > 0 && (
                <span className="text-[11px] text-amber-400 font-bold">
                  Target: 50 for ₹50
                </span>
              )}
            </div>
          </section>

          {/* ---------------------------------------------------------------------
              3. SEPARATE USER STATES: "YOUR FRIDAY FUEL" (DEDICATED REWARD CARD)
             --------------------------------------------------------------------- */}
          <section
            aria-labelledby="your-friday-fuel-heading"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A1F] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h2 id="your-friday-fuel-heading" className="text-sm font-extrabold text-slate-900 leading-tight">
                    YOUR FRIDAY FUEL
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Personal eligibility & credit settlement
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  claimStatus === 'claimed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : isRewardClaimableNow
                    ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse'
                    : isOptedInToTribe
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {claimStatus === 'claimed'
                  ? 'Claimed ✅'
                  : isRewardClaimableNow
                  ? 'Ready to Claim'
                  : isOptedInToTribe
                  ? 'Opted-In'
                  : 'Not Opted-In'}
              </span>
            </div>

            {/* --- STATE 1: USER IS NOT OPTED-IN --- */}
            {!isOptedInToTribe && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-2.5">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Your tower lunches already count toward the building meter. <strong>Opt in</strong> to become eligible for Friday Fuel credits and appear on the leaderboard.
                </p>
                <button
                  onClick={() => {
                    playSuccessChime();
                    setIsOptedInToTribe(true);
                    if (onNotify) onNotify('Opted In! 🚀', 'You are now eligible for Friday Fuel credits.', 'success');
                  }}
                  className="w-full min-h-[48px] bg-[#FF5A1F] hover:bg-[#E04812] text-white text-sm font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>Opt in for Friday Fuel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* --- STATE 2: OPTED-IN, BUT ACTIVITY REQUIREMENT UNMET (0 LUNCHES) --- */}
            {isOptedInToTribe && !hasCompletedLunchThisWeek && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    You’re opted in! To claim this week's unlocked Friday Fuel, you must complete at least <strong>1 scheduled lunch</strong> before Friday.
                  </p>
                </div>
                <button
                  onClick={() => {
                    playPop();
                    setActiveSubTab('tree');
                  }}
                  className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>View Meal Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* --- STATE 3: OPTED-IN, ACTIVITY MET, TIER UNLOCKED, CLAIM WINDOW NOT OPEN YET --- */}
            {isOptedInToTribe && hasCompletedLunchThisWeek && currentUnlockedTier > 0 && !isClaimWindowOpen && claimStatus === 'idle' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                <div className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bronze Unlocked (₹25 Earned)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are eligible! Your credit will become claimable when Friday rewards officially open (10:00 PM).
                </p>
              </div>
            )}

            {/* --- STATE 4: REWARD IS CLAIMABLE RIGHT NOW (DEDICATED CLAIM CARD) --- */}
            {isRewardClaimableNow && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-xl p-3.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                      REWARD READY
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      ₹{currentUnlockedCredits} Friday Fuel Credit
                    </h3>
                  </div>
                  <div className="text-2xl">🎁</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Earned via <strong>Cyber Park Tower B</strong> milestones. Added directly to your <strong>MealsOn Balance</strong> when claimed.
                </p>

                {/* Explicit Single-Tap Claim CTA */}
                <button
                  onClick={handleClaimFridayFuel}
                  disabled={claimStatus === 'claiming'}
                  className="w-full min-h-[48px] bg-[#FF5A1F] hover:bg-[#E04812] text-white text-sm font-extrabold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                >
                  {claimStatus === 'claiming' ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Adding credit to MealsOn Balance…</span>
                    </>
                  ) : (
                    <>
                      <span>Claim ₹{currentUnlockedCredits} Credit</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center font-medium">
                  Valid for 30 days. Use toward up to 25% of any pass renewal.
                </p>
              </div>
            )}

            {/* --- STATE 5: ALREADY CLAIMED (CONFIRMED RECEIPT STATE) --- */}
            {claimStatus === 'claimed' && claimedReceipt && (
              <div className="bg-slate-50 border border-emerald-300 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-800 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    ₹{claimedReceipt.amount} Added to MealsOn Balance
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-1.5 py-0.5 rounded">
                    Confirmed
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Credited Account:</span>
                    <strong className="text-slate-900">{claimedReceipt.destination}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid For:</span>
                    <strong className="text-slate-900">{claimedReceipt.validityDays} Days (Expires {claimedReceipt.expiryDate})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Redemption:</span>
                    <span className="text-slate-700">{claimedReceipt.maxRedemption}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playPop();
                    if (onNotify) onNotify('MealsOn Balance', 'Current balance includes your ₹25 Friday Fuel credit.', 'info');
                  }}
                  className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer mt-1"
                >
                  View MealsOn Balance
                </button>
              </div>
            )}

            {/* Secondary Option: Manage Participation (Opt Out) */}
            {isOptedInToTribe && (
              <div className="pt-1 text-right">
                <button
                  onClick={() => setShowManageParticipation(!showManageParticipation)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-medium underline transition-colors"
                >
                  Manage participation
                </button>

                {showManageParticipation && (
                  <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 animate-in fade-in duration-150">
                    <p className="text-slate-600 text-[11px]">
                      Opting out stops credit claiming and hides your name on the leaderboard. Your tower lunch deliveries will still contribute to the building's collective meter.
                    </p>
                    <button
                      onClick={() => {
                        playPop();
                        setIsOptedInToTribe(false);
                        setShowManageParticipation(false);
                        if (onNotify) onNotify('Opted Out', 'Tribe credit claiming paused.', 'info');
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Confirm Opt-Out of Friday Fuel
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ---------------------------------------------------------------------
              4. NUDGE COLLEAGUES (SECONDARY TO CLAIMING)
             --------------------------------------------------------------------- */}
          <section
            aria-labelledby="nudge-section-heading"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 id="nudge-section-heading" className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  TEAM ACCELERATOR
                </h3>
                <div className="text-sm font-extrabold text-slate-900">
                  {ordersNeededForSilver} more orders to Silver Tier
                </div>
              </div>
              <Share2 className="w-4 h-4 text-slate-400" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Invite your Tower B colleagues to schedule their lunch before 10 PM. Hitting 50 orders increases everyone’s credit to <strong>₹50</strong>.
            </p>

            <button
              onClick={handleNudgeColleagues}
              className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Copy Slack / WhatsApp Nudge Message</span>
            </button>
          </section>

          {/* ---------------------------------------------------------------------
              5. TOWER LEADERBOARD (SCROLLABLE, HONORS PRIVACY & PARTICIPATION)
             --------------------------------------------------------------------- */}
          <section
            aria-labelledby="leaderboard-heading"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 id="leaderboard-heading" className="text-sm font-extrabold text-slate-900 leading-tight">
                  Tower B Tribe Leaderboard
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Rankings based on lunches scheduled this workweek
                </p>
              </div>
              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                23 Members
              </span>
            </div>

            {/* Department Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#F8FAFC] border border-slate-200/80 p-2.5 rounded-xl">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">1st Place</span>
                <span className="font-extrabold text-slate-900 text-xs block">Engineering</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">18 orders</span>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200/80 p-2.5 rounded-xl">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">2nd Place</span>
                <span className="font-extrabold text-slate-900 text-xs block">Product</span>
                <span className="text-[11px] text-[#FF5A1F] font-bold block mt-0.5">14 orders</span>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200/80 p-2.5 rounded-xl">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">3rd Place</span>
                <span className="font-extrabold text-slate-900 text-xs block">Analytics</span>
                <span className="text-[11px] text-amber-600 font-bold block mt-0.5">12 orders</span>
              </div>
            </div>

            {/* Colleague Member Roster */}
            <div className="space-y-1.5 pt-1">
              {AVATARS.map((av, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-7 h-7 rounded-full ${av.bg} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                      {av.initials}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{av.name}</div>
                      <div className="text-[10px] text-slate-500">{av.role}</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {av.orders} lunches
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------------------------
              6. PROTOTYPE CONTROLS (SEPARATED FROM MEMBER-FACING ACTIONS)
             --------------------------------------------------------------------- */}
          <aside
            aria-label="Prototype developer sandbox"
            className="bg-slate-100 border border-slate-300 rounded-2xl p-3.5 space-y-2 text-xs"
          >
            <button
              onClick={() => setShowPrototypeControls(!showPrototypeControls)}
              className="w-full flex items-center justify-between font-bold text-slate-700 cursor-pointer"
            >
              <span className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Prototype / Evaluator Controls</span>
              </span>
              {showPrototypeControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showPrototypeControls && (
              <div className="pt-2 border-t border-slate-200 space-y-2 animate-in fade-in duration-150">
                <p className="text-[11px] text-slate-500">
                  Simulate state transitions without altering production business rules:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {/* +1 Simulated Order */}
                  <button
                    onClick={handleAddTribeOrder}
                    className="py-2 px-2.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 text-[11px] hover:bg-slate-50 flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Add 1 Tower Order ({tribeOrders})</span>
                  </button>

                  {/* Toggle Claim Window */}
                  <button
                    onClick={() => {
                      playPop();
                      setIsClaimWindowOpen(!isClaimWindowOpen);
                    }}
                    className="py-2 px-2.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 text-[11px] hover:bg-slate-50"
                  >
                    Claim Window: {isClaimWindowOpen ? 'OPEN' : 'CLOSED'}
                  </button>

                  {/* Toggle User Activity */}
                  <button
                    onClick={() => {
                      playPop();
                      setHasCompletedLunchThisWeek(!hasCompletedLunchThisWeek);
                    }}
                    className="py-2 px-2.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 text-[11px] hover:bg-slate-50"
                  >
                    My Activity: {hasCompletedLunchThisWeek ? '1+ Lunch (Eligible)' : '0 Lunches'}
                  </button>

                  {/* Reset Demo */}
                  <button
                    onClick={handleResetDemo}
                    className="py-2 px-2.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 text-[11px] hover:bg-slate-50 flex items-center justify-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Reset to 44 Orders</span>
                  </button>
                </div>
              </div>
            )}
          </aside>
        </main>
      )}

      {/* =========================================================================
          SUB-TAB 1: MY HABIT TREE (PERSONAL HABIT PROGRESSION)
         ========================================================================= */}
      {activeSubTab === 'tree' && (
        <section aria-labelledby="habit-tree-section" className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
            {streakCompleted && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FF5A1F]/30 via-emerald-400/20 to-transparent w-full h-1.5" />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="habit-tree-section" className="text-sm font-extrabold text-slate-900 leading-tight">
                    Healthy Week Habit Tree
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    4 of 5 meals blooms your tree • 1 Free Protected Skip
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-300">
                {hasWednesdaySkip ? '4/5 Flexible' : '5/5 Full'}
              </span>
            </div>

            {/* Tree Growth SVG */}
            <div className="bg-gradient-to-b from-emerald-50/50 via-slate-50 to-white rounded-2xl p-4 border border-emerald-100 flex flex-col items-center justify-center min-h-[180px]">
              <div className="w-full flex items-center justify-between text-xs mb-2 px-1">
                <span className="font-bold text-emerald-800 flex items-center">
                  <SunMedium className="w-3.5 h-3.5 text-amber-500 mr-1 animate-spin" style={{ animationDuration: '12s' }} />
                  {treeStageLabels[currentDay].title}
                </span>
                <span className="text-xs text-slate-400 font-semibold">Step {currentDay} of 5</span>
              </div>

              {/* Day stepper */}
              <div className="flex items-center justify-between w-full pt-3 border-t border-slate-200">
                {[
                  { day: 'Mon', num: 1 },
                  { day: 'Tue', num: 2 },
                  { day: 'Wed', num: 3, isShield: hasWednesdaySkip },
                  { day: 'Thu', num: 4 },
                  { day: 'Fri', num: 5, isPayoff: true }
                ].map((node) => {
                  const isPassed = node.num <= currentDay;
                  const isCurrent = node.num === currentDay;

                  return (
                    <button
                      key={node.day}
                      onClick={() => handleSelectDay(node.num)}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-[#FF5A1F] text-white ring-4 ring-orange-100 scale-110'
                            : isPassed
                            ? 'bg-[#10B981] text-white'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {node.isShield ? <Shield className="w-3.5 h-3.5" /> : node.isPayoff ? <Gift className="w-3.5 h-3.5" /> : node.num}
                      </div>
                      <span className="text-[10px] mt-1 font-bold text-slate-600">{node.day}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Impact Ledger */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Impact & Savings Ledger 🌱
                </h3>
                <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                  Sample 3-Month Projection
                </span>
              </div>

              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-bold">
                <button
                  onClick={() => setImpactTimeframe('thisMonth')}
                  className={`px-2 py-0.5 rounded-md ${impactTimeframe === 'thisMonth' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setImpactTimeframe('allTime')}
                  className={`px-2 py-0.5 rounded-md ${impactTimeframe === 'allTime' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                >
                  All-Time
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-xl">
                <span className="text-slate-500 text-[10px] font-bold block uppercase">Wallet Shield</span>
                <span className="text-base font-extrabold text-slate-900 block">{impactStats.savings}</span>
                <span className="text-[10px] text-slate-500">{impactStats.savingsSub}</span>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-xl">
                <span className="text-slate-500 text-[10px] font-bold block uppercase">Fuel Conserved</span>
                <span className="text-base font-extrabold text-slate-900 block">{impactStats.fuel}</span>
                <span className="text-[10px] text-slate-500">{impactStats.fuelSub}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          REWARD CLAIM CELEBRATION MODAL (MATCHING GIF MOTION SPECIFICATION)
         ========================================================================= */}
      {showClaimCelebrationModal && claimedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="claim-celebration-title"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-800 text-center relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowClaimCelebrationModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close celebration modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Orange Confirmation Medallion */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF5A1F] to-[#E04812] text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/20 animate-in zoom-in-50 duration-300">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            {/* Celebration Title & Mint Amount */}
            <div className="space-y-1">
              <h3 id="claim-celebration-title" className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                Friday Fuel Credited
              </h3>
              <div className="text-4xl font-black text-[#10B981] tracking-tight">
                ₹{claimedReceipt.amount}
              </div>
              <p className="text-xs text-slate-300 font-medium pt-0.5">
                Added to <strong>{claimedReceipt.destination}</strong>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Milestone:</span>
                <strong className="text-white">{claimedReceipt.tierName}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Valid For:</span>
                <strong className="text-emerald-400">{claimedReceipt.validityDays} Days</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Expires On:</span>
                <span className="text-slate-400">{claimedReceipt.expiryDate}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-700">
                <span>Redemption:</span>
                <span className="text-slate-300">{claimedReceipt.maxRedemption}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  playPop();
                  setShowClaimCelebrationModal(false);
                  if (onNotify) onNotify('MealsOn Balance', `Balance credited with ₹${claimedReceipt.amount}.`, 'info');
                }}
                className="w-full min-h-[48px] bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-sm py-3 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                View MealsOn Balance
              </button>

              <button
                onClick={() => setShowClaimCelebrationModal(false)}
                className="w-full min-h-[44px] text-xs font-bold text-slate-400 hover:text-white py-2 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          HOW IT WORKS BOTTOM SHEET (ORDERED AS PER SECTION 4 OF BRIEF)
         ========================================================================= */}
      {showTribeFtuxModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowTribeFtuxModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close how it works"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5A1F] flex items-center justify-center text-xl font-bold">
                🏢
              </div>
              <h2 id="how-it-works-title" className="text-base font-extrabold text-slate-900 tracking-tight">
                How Tower Tribe Works
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pool orders with Tower B colleagues to earn Friday Fuel cashback!
              </p>
            </div>

            {/* Step-by-Step in Exact Required Order */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-relaxed">
                  <strong>Building contribution:</strong> Every scheduled lunch delivered to Cyber Park Tower B grows the shared total, whether you’ve opted in yet or not.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-relaxed">
                  <strong>Qualification:</strong> Opt in and complete at least <strong>1 scheduled lunch</strong> that week to qualify for credit claiming.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-relaxed">
                  <strong>Progressive Milestones:</strong> Higher tower milestones unlock higher Friday Fuel credits:<br />
                  • 25 orders: <strong>₹25</strong> 🥉<br />
                  • 50 orders: <strong>₹50</strong> 🥈<br />
                  • 75 orders: <strong>₹75</strong> 🥇
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <p className="leading-relaxed">
                  <strong>Credit Destination & Rules:</strong> Eligible rewards go directly to <strong>MealsOn Balance</strong>. Credits are valid for 30 days and cover up to 25% of pass renewals.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-900 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>WFH Protected:</strong> Working from home on other days does not penalize your eligibility.
                </span>
              </div>
            </div>

            {/* Secondary Collapsible: Logistics Savings Math */}
            <div className="border-t border-slate-200 pt-2">
              <button
                onClick={() => setShowHowItWorksEconomics(!showHowItWorksEconomics)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <span>How is Friday Fuel funded?</span>
                {showHowItWorksEconomics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHowItWorksEconomics && (
                <p className="mt-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl leading-relaxed">
                  Consolidating 50 lunches into 1 milk-run delivery saves ₹2,050 in bike courier transit. That logistics surplus completely funds the Friday member credits!
                </p>
              )}
            </div>

            <button
              onClick={() => setShowTribeFtuxModal(false)}
              className="w-full min-h-[48px] bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Got it! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
