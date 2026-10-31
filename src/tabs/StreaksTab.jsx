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
  Coffee,
  Cookie,
  TrendingDown,
  PartyPopper,
  Trophy
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';

const AVATARS = [
  { name: 'Priya S.', initials: 'PS', bg: 'bg-rose-500' },
  { name: 'Arjun M.', initials: 'AM', bg: 'bg-blue-500' },
  { name: 'Tanvi K.', initials: 'TK', bg: 'bg-emerald-500' },
  { name: 'Rohan D.', initials: 'RD', bg: 'bg-amber-500' },
  { name: 'Neha V.', initials: 'NV', bg: 'bg-purple-500' },
];

export default function StreaksTab({ onNotify, triggerConfetti, onOpenWowModal }) {
  // Streak state
  const [streakCompleted, setStreakCompleted] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null); // 'brew' | 'brownie'
  const [isSimulatingStreak, setIsSimulatingStreak] = useState(false);

  // Pod state
  const [joinedPod, setJoinedPod] = useState(false);
  const [showUnitEconomics, setShowUnitEconomics] = useState(true);

  // Simulate Friday Delivery completion with big wow delight
  const handleSimulateFriday = () => {
    setIsSimulatingStreak(true);
    playPop();

    setTimeout(() => {
      setStreakCompleted(true);
      setIsSimulatingStreak(false);
      playCelebrationFanfare();
      if (triggerConfetti) triggerConfetti();

      if (onOpenWowModal) {
        onOpenWowModal({
          emoji: '🏆',
          title: '5/5 Weekly Streak Crushed! 🔥',
          description: 'You completed your Mon–Fri scheduled healthy lunch streak! Your free Friday treat is ready to claim.',
          highlights: [
            '5 Days of Clean Homestyle Food',
            'Zero Decision Fatigue all week',
            'Unlocked Complimentary Friday Gourmet Perk'
          ],
          ctaLabel: 'Pick Free Friday Treat 🎁'
        });
      }

      if (onNotify) {
        onNotify(
          '🎉 5/5 Streak Unlocked!',
          'Congratulations! Pick your free Friday celebratory treat below.',
          'success'
        );
      }
    }, 450);
  };

  const handleSelectReward = (rewardKey, rewardName) => {
    playSuccessChime();
    setSelectedReward(rewardKey);
    if (triggerConfetti) triggerConfetti();
    if (onNotify) {
      onNotify('Reward Claimed! 🎁', `${rewardName} will be dropped with Friday lunch.`, 'success');
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
        nextVal
          ? '₹0 delivery fee + 5% discount locked in. Pick up at Smart Locker.'
          : 'Reverted to individual doorstep delivery.',
        nextVal ? 'success' : 'info'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-4">
      {/* 1. Interactive 5-Day Habit Streak Tracker */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
        {streakCompleted && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FF5A1F]/30 via-emerald-400/20 to-transparent w-full h-1.5" />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF5A1F] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-[#FF5A1F]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Weekly Lunch Streak 🔥
              </h3>
              <p className="text-[10px] text-slate-500">
                Healthy consistent eating unlocks free Friday rewards
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border shadow-xs transition-all ${
              streakCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-in zoom-in-75'
                : 'bg-orange-50 text-[#FF5A1F] border-orange-200'
            }`}
          >
            {streakCompleted ? '5 / 5 Complete! 🎉' : '4 / 5 Days Completed'}
          </span>
        </div>

        {/* 5-Node Progress Tracker */}
        <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-200/80">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-4 right-4 top-4 h-1 bg-slate-200 z-0">
              <div
                className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#10B981] transition-all duration-700 ease-out"
                style={{ width: streakCompleted ? '100%' : '75%' }}
              />
            </div>

            {/* Nodes: Mon to Thu (Completed), Fri (Reward) */}
            {[
              { day: 'Mon', num: 1, done: true },
              { day: 'Tue', num: 2, done: true },
              { day: 'Wed', num: 3, done: true },
              { day: 'Thu', num: 4, done: true },
              { day: 'Fri', num: 5, done: streakCompleted, isReward: true }
            ].map((node) => {
              return (
                <div key={node.day} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      node.done
                        ? 'bg-[#10B981] text-white ring-4 ring-emerald-100 scale-105'
                        : node.isReward
                        ? 'bg-amber-100 text-amber-700 border-2 border-amber-400 ring-4 ring-amber-50 animate-bounce'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {node.done ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : node.isReward ? (
                      <Gift className="w-4 h-4 text-amber-600" />
                    ) : (
                      node.num
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-bold ${
                      node.done
                        ? 'text-emerald-700'
                        : node.isReward
                        ? 'text-amber-800 font-extrabold'
                        : 'text-slate-400'
                    }`}
                  >
                    {node.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Presentation Simulation CTA */}
        {!streakCompleted ? (
          <button
            onClick={handleSimulateFriday}
            disabled={isSimulatingStreak}
            className="w-full bg-gradient-to-r from-amber-500 via-[#FF5A1F] to-[#FF7B47] hover:from-amber-600 hover:to-[#E04812] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Simulate Friday Delivery Completion (Demo Mode)</span>
          </button>
        ) : (
          /* Celebratory State & Unlocked Friday Treat Selection */
          <div className="bg-[#ECFDF5] border border-[#10B981] rounded-2xl p-3.5 space-y-2.5 animate-in zoom-in-95 duration-200 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-2xl select-none animate-bounce">🎉</span>
              <div>
                <h4 className="text-xs font-extrabold text-emerald-950">
                  Friday Treat Unlocked! Pick your reward:
                </h4>
                <p className="text-[10px] text-emerald-800">
                  Complimentary perk bundled directly with your Friday lunch box
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Option A: Cold Brew */}
              <button
                onClick={() => handleSelectReward('brew', '☕ Free Cold Brew')}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cta-bounce ${
                  selectedReward === 'brew'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                    : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400 shadow-xs'
                }`}
              >
                <div className="text-2xl mb-1">☕</div>
                <div className="text-xs font-bold leading-tight">Free Cold Brew</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedReward === 'brew' ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  Zero sugar, slow-steeped Arabica
                </div>
                {selectedReward === 'brew' && (
                  <span className="mt-1.5 inline-block text-[9px] font-extrabold bg-white text-emerald-800 px-1.5 py-0.2 rounded shadow-xs">
                    Selected ✓
                  </span>
                )}
              </button>

              {/* Option B: Almond Brownie */}
              <button
                onClick={() => handleSelectReward('brownie', '🍫 High-Protein Almond Brownie')}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cta-bounce ${
                  selectedReward === 'brownie'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                    : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400 shadow-xs'
                }`}
              >
                <div className="text-2xl mb-1">🍫</div>
                <div className="text-xs font-bold leading-tight">Protein Brownie</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    selectedReward === 'brownie' ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  12g Whey, gluten-free almond flour
                </div>
                {selectedReward === 'brownie' && (
                  <span className="mt-1.5 inline-block text-[9px] font-extrabold bg-white text-emerald-800 px-1.5 py-0.2 rounded shadow-xs">
                    Selected ✓
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive "Office Pod Drop" (Batched Delivery Engine) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFF5F0] text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                🏢 Office Pod Drop • Cyber Park Tower B
              </h3>
              <p className="text-[10px] text-slate-500">
                1:00 PM Consolidated Eco-Delivery Wave
              </p>
            </div>
          </div>

          <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
            Active Pod
          </span>
        </div>

        {/* Live Colleague Counter & Avatar Stack */}
        <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center -space-x-2 overflow-hidden">
              {AVATARS.map((av, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full ${av.bg} text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white`}
                  title={av.name}
                >
                  {av.initials}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[8px] font-extrabold ring-2 ring-white">
                +7
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-800">
                12 colleagues scheduled
              </span>
              <span className="block text-[9px] text-slate-400">Cyber Park Tower B</span>
            </div>
          </div>

          {/* Pulsing Badge */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/70 border border-emerald-300 rounded-lg p-2 flex items-center justify-between text-xs animate-pulse">
            <span className="text-[11px] font-extrabold text-emerald-950 flex items-center">
              🎉 ₹0 Delivery Fee + 5% Pod Discount Unlocked!
            </span>
            <span className="text-[9px] font-bold bg-[#10B981] text-white px-1.5 py-0.5 rounded">
              Unlocked
            </span>
          </div>
        </div>

        {/* Interactive Join Pod Toggle Button */}
        <button
          onClick={handleTogglePod}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.97] cta-bounce ${
            joinedPod
              ? 'bg-[#10B981] text-white shadow-md ring-2 ring-emerald-300'
              : 'bg-[#FF5A1F] hover:bg-[#E04812] text-white shadow-md'
          }`}
        >
          {joinedPod ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Joined Pod #CyberTowerB (Saving ₹45)</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span>Join 1:00 PM Building Pod (Save ₹45)</span>
            </>
          )}
        </button>

        {/* Pickup Reception Desk Instructions when joined */}
        {joinedPod && (
          <div className="bg-[#FFF5F0] border border-[#FF5A1F]/30 rounded-xl p-2.5 text-xs text-slate-800 space-y-1 animate-in fade-in duration-200">
            <div className="font-bold text-[#FF5A1F] text-[11px] flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] mr-1.5" />
              Drop Point: Tower B Smart Locker / Reception Desk at 1:00 PM sharp
            </div>
            <p className="text-[10px] text-slate-600">
              Your bag is labeled with your name and QR code. Simply scan phone or enter OTP <strong>8842</strong> at Locker Bay 3.
            </p>
          </div>
        )}

        {/* PM Unit Economics View Toggle */}
        <div className="border-t border-slate-100 pt-2">
          <button
            onClick={() => {
              playPop();
              setShowUnitEconomics(!showUnitEconomics);
            }}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center text-[#FF5A1F]">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              PM Unit Economics View
            </span>
            {showUnitEconomics ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showUnitEconomics && (
            <div className="mt-2 bg-slate-900 text-white p-3 rounded-xl space-y-2 text-xs border border-slate-800 animate-in fade-in duration-150">
              <div className="flex items-start space-x-2">
                <span className="text-base select-none">📊</span>
                <div>
                  <div className="text-[11px] font-bold text-emerald-400">
                    Business Impact: 62% Last-Mile Cost Reduction
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                    Batching 12 orders into 1 fleet drop reduces last-mile cost per order by <strong>62%</strong> (from ₹65/order to ₹24/order), eliminating driver idle time while enabling high-margin group discounts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px] border-t border-slate-800">
                <div className="bg-slate-800/80 p-1.5 rounded">
                  <span className="text-slate-400 block text-[9px]">Solo Drops</span>
                  <span className="font-bold text-rose-400">₹65 / order</span>
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded">
                  <span className="text-slate-400 block text-[9px]">Pod Batched</span>
                  <span className="font-bold text-emerald-400">₹24 / order</span>
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded">
                  <span className="text-slate-400 block text-[9px]">Net Savings</span>
                  <span className="font-bold text-[#FF5A1F]">62% Saved</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
