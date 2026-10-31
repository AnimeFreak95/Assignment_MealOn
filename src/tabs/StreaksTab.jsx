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
  TrendingDown
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
  const [streakCompleted, setStreakCompleted] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isSimulatingStreak, setIsSimulatingStreak] = useState(false);

  const [joinedPod, setJoinedPod] = useState(false);
  const [showUnitEconomics, setShowUnitEconomics] = useState(true);

  // Simulate Friday Delivery
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
          title: '5/5 Streak Crushed! 🔥',
          description: 'You completed your full Mon–Fri scheduled healthy lunch streak!',
          highlights: [
            '5 Days of Clean Homestyle Food',
            'Zero Daily Decision Fatigue',
            'Unlocked Complimentary Friday Gourmet Perk'
          ],
          ctaLabel: 'Pick Free Friday Treat 🎁'
        });
      }

      if (onNotify) {
        onNotify('🎉 5/5 Streak Unlocked!', 'Pick your free Friday celebratory treat below.', 'success');
      }
    }, 400);
  };

  const handleSelectReward = (rewardKey, rewardName) => {
    playSuccessChime();
    setSelectedReward(rewardKey);
    if (triggerConfetti) triggerConfetti();
    if (onNotify) {
      onNotify('Perk Claimed! 🎁', `${rewardName} added to Friday drop.`, 'success');
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
        nextVal ? '₹0 delivery + 5% discount unlocked. Smart Locker drop.' : 'Reverted to solo doorstep.',
        nextVal ? 'success' : 'info'
      );
    }
  };

  return (
    <div className="pb-28 px-4 pt-3 space-y-3.5">
      {/* 1. Habit Streak Tracker (Visual, Compact) */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5 relative overflow-hidden">
        {streakCompleted && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FF5A1F]/30 via-emerald-400/20 to-transparent w-full h-1.5" />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF5A1F] flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-[#FF5A1F]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">
              Weekly Habit Streak 🔥
            </h3>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-xs transition-all ${
              streakCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-orange-50 text-[#FF5A1F] border-orange-200'
            }`}
          >
            {streakCompleted ? '5/5 Complete! 🎉' : '4/5 Days Complete'}
          </span>
        </div>

        {/* 5-Node Tracker */}
        <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-3 right-3 top-3.5 h-1 bg-slate-200 z-0">
              <div
                className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#10B981] transition-all duration-700 ease-out"
                style={{ width: streakCompleted ? '100%' : '75%' }}
              />
            </div>

            {[
              { day: 'Mon', done: true },
              { day: 'Tue', done: true },
              { day: 'Wed', done: true },
              { day: 'Thu', done: true },
              { day: 'Fri', done: streakCompleted, isReward: true }
            ].map((node) => (
              <div key={node.day} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    node.done
                      ? 'bg-[#10B981] text-white ring-2 ring-emerald-100 scale-105'
                      : node.isReward
                      ? 'bg-amber-100 text-amber-700 border-2 border-amber-400 ring-2 ring-amber-100 animate-bounce'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {node.done ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : node.isReward ? (
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                  ) : null}
                </div>
                <span
                  className={`text-[9px] mt-1 font-bold ${
                    node.done ? 'text-emerald-700' : node.isReward ? 'text-amber-800 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  {node.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Simulation CTA */}
        {!streakCompleted ? (
          <button
            onClick={handleSimulateFriday}
            disabled={isSimulatingStreak}
            className="w-full bg-gradient-to-r from-amber-500 via-[#FF5A1F] to-[#FF7B47] hover:from-amber-600 hover:to-[#E04812] text-white text-xs font-bold py-2 px-3 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Simulate Friday Delivery (Demo)</span>
          </button>
        ) : (
          /* Unlocked Reward Selection */
          <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-2.5 space-y-2 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl select-none">🎉</span>
              <h4 className="text-xs font-extrabold text-emerald-950">
                Friday Treat Unlocked! Choose one:
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSelectReward('brew', '☕ Cold Brew')}
                className={`p-2 rounded-xl border text-left transition-all active:scale-95 cta-bounce ${
                  selectedReward === 'brew'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <div className="text-lg">☕</div>
                <div className="text-[11px] font-bold">Cold Brew</div>
                <div className={`text-[9px] ${selectedReward === 'brew' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  Slow-steeped Arabica
                </div>
              </button>

              <button
                onClick={() => handleSelectReward('brownie', '🍫 Protein Brownie')}
                className={`p-2 rounded-xl border text-left transition-all active:scale-95 cta-bounce ${
                  selectedReward === 'brownie'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <div className="text-lg">🍫</div>
                <div className="text-[11px] font-bold">Protein Brownie</div>
                <div className={`text-[9px] ${selectedReward === 'brownie' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  12g Whey, gluten-free
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Office Pod Drop (Compact, Visual) */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFF5F0] text-[#FF5A1F] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 leading-tight">
                Cyber Park Pod • 1:00 PM Wave
              </h3>
            </div>
          </div>

          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full">
            12 Colleagues
          </span>
        </div>

        {/* Avatar Stack & Pulsing Badge */}
        <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {AVATARS.map((av, idx) => (
              <div
                key={idx}
                className={`w-5 h-5 rounded-full ${av.bg} text-white flex items-center justify-center text-[8px] font-bold ring-1.5 ring-white`}
              >
                {av.initials}
              </div>
            ))}
            <div className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[7px] font-extrabold ring-1.5 ring-white">
              +7
            </div>
          </div>

          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-md animate-pulse">
            🎉 ₹0 Delivery + 5% Off
          </span>
        </div>

        {/* Join Pod CTA */}
        <button
          onClick={handleTogglePod}
          className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-[0.97] cta-bounce ${
            joinedPod
              ? 'bg-[#10B981] text-white shadow-md'
              : 'bg-[#FF5A1F] hover:bg-[#E04812] text-white shadow-md'
          }`}
        >
          {joinedPod ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Joined Pod #TowerB (Saving ₹45)</span>
            </>
          ) : (
            <>
              <Users className="w-3.5 h-3.5" />
              <span>Join 1:00 PM Pod (Save ₹45)</span>
            </>
          )}
        </button>

        {/* Instructions when joined */}
        {joinedPod && (
          <div className="bg-[#FFF5F0] border border-[#FF5A1F]/30 rounded-xl p-2 text-xs text-slate-800 flex items-center justify-between animate-in fade-in duration-200">
            <span className="text-[10px]">
              📍 <strong>Smart Locker Bay 3:</strong> Use OTP <strong>8842</strong>
            </span>
            <span className="text-[9px] font-bold text-[#FF5A1F] bg-[#FFF5F0] border border-[#FF5A1F]/40 px-1.5 py-0.2 rounded">
              1:00 PM Sharp
            </span>
          </div>
        )}

        {/* PM Unit Economics View */}
        <div className="border-t border-slate-100 pt-1.5">
          <button
            onClick={() => {
              playPop();
              setShowUnitEconomics(!showUnitEconomics);
            }}
            className="w-full flex items-center justify-between text-[10px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center text-[#FF5A1F]">
              <TrendingDown className="w-3 h-3 mr-1" />
              PM Economics: 62% Last-Mile Savings
            </span>
            {showUnitEconomics ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>

          {showUnitEconomics && (
            <div className="mt-1.5 bg-slate-900 text-white p-2.5 rounded-xl space-y-1.5 text-xs animate-in fade-in duration-150">
              <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                <div className="bg-slate-800 p-1.5 rounded">
                  <span className="text-slate-400 block text-[8px]">Solo Drop</span>
                  <span className="font-bold text-rose-400">₹65</span>
                </div>
                <div className="bg-slate-800 p-1.5 rounded">
                  <span className="text-slate-400 block text-[8px]">Batched Pod</span>
                  <span className="font-bold text-emerald-400">₹24</span>
                </div>
                <div className="bg-slate-800 p-1.5 rounded">
                  <span className="text-slate-400 block text-[8px]">Saved</span>
                  <span className="font-bold text-[#FF5A1F]">62%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
