import React, { useState } from 'react';
import StatusBar from './components/StatusBar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import { ConfettiCanvas, FloatingCreditBadge, WowDelightModal } from './components/DelightEffects';
import { isSoundEnabled, setSoundEnabled, playPop, playCelebrationFanfare } from './utils/audioDelight';
import SubscriptionFTUXFlow from './components/SubscriptionFTUXFlow';
import GtmIntroBottomSheet from './components/GtmIntroBottomSheet';
import GtmCampaignHub from './components/GtmCampaignHub';

import AutoPilotTab from './tabs/AutoPilotTab';
import RoutingTab from './tabs/RoutingTab';
import CutOffTab from './tabs/CutOffTab';
import WalletTab from './tabs/WalletTab';
import StreaksTab from './tabs/StreaksTab';

import { INITIAL_PLAYLIST } from './data/mockData';
import {
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Flame,
  RotateCcw,
  Volume2,
  VolumeX,
  Ticket,
  Layers,
  Play
} from 'lucide-react';

export default function App() {
  const [appMode, setAppMode] = useState('dashboard'); // 'dashboard' | 'ftux' | 'gtm'
  const [activeTab, setActiveTab] = useState('autopilot');
  const [credits, setCredits] = useState(14);
  const [playlist, setPlaylist] = useState(INITIAL_PLAYLIST);
  const [toast, setToast] = useState(null);
  const [showIntroSheet, setShowIntroSheet] = useState(false);

  // Delight Effects State
  const [confettiActive, setConfettiActive] = useState(false);
  const [floatingCreditActive, setFloatingCreditActive] = useState(false);
  const [wowModal, setWowModal] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    setSoundEnabled(nextVal);
    if (nextVal) playPop();
  };

  const showToast = (title, message = '', type = 'success') => {
    setToast({ title, message, type });
  };

  const triggerConfetti = () => {
    setConfettiActive(true);
  };

  const triggerFloatingCredit = () => {
    setFloatingCreditActive(true);
  };

  const handleLockInPlaylist = () => {
    showToast(
      'Weekly Playlist Locked In! ✨',
      '5 personalized lunches scheduled. Now verify your hybrid office/home routing.',
      'success'
    );
    setActiveTab('routing');
  };

  const handleCompleteActivation = (passData) => {
    setCredits(passData.meals);
    setAppMode('dashboard');
    setActiveTab('autopilot');
    triggerConfetti();
    playCelebrationFanfare();
    showToast(
      'Pass Activated! 🎉',
      `${passData.meals} Meal Credits loaded (${passData.validityDays}d buffer). Now curating your playlist!`,
      'success'
    );
  };

  const resetAllState = () => {
    setCredits(14);
    setPlaylist(INITIAL_PLAYLIST);
    setActiveTab('autopilot');
    setAppMode('dashboard');
    setShowIntroSheet(false);
    setConfettiActive(false);
    setFloatingCreditActive(false);
    setWowModal(null);
    showToast('Prototype Reset', 'Restored default 14 credits and initial playlist schedule.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-2 sm:p-6 lg:p-8 font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Top Presentation Bar for PM Walkthrough */}
      <div className="w-full max-w-[1100px] mb-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF7B47] flex items-center justify-center shadow-md shadow-[#FF5A1F]/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-extrabold text-white tracking-tight">
                MealsOn Scheduled Meals — Product Prototype & GTM
              </h1>
              <span className="text-[10px] font-bold bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/40 px-2 py-0.5 rounded-full">
                Entain PM Case
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Complete FTUX Pass Configurator, Multi-Channel GTM Acquisition Simulator & Interactive Flow
            </p>
          </div>
        </div>

        {/* Quick Jump Buttons & Controls */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {/* Video Teaser Sheet Button */}
          <button
            onClick={() => {
              playPop();
              setShowIntroSheet(true);
            }}
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-600/40 hover:bg-amber-900/40 flex items-center space-x-1 cta-bounce"
          >
            <Play className="w-3 h-3 text-amber-400" />
            <span>🎬 Video Teaser</span>
          </button>

          {/* GTM Simulator Mode */}
          <button
            onClick={() => {
              playPop();
              setAppMode('gtm');
            }}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center space-x-1 border cta-bounce ${
              appMode === 'gtm'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                : 'bg-purple-950/40 text-purple-300 border-purple-600/40 hover:bg-purple-900/40'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>📣 GTM Hub</span>
          </button>

          {/* FTUX & Pass Checkout Mode */}
          <button
            onClick={() => {
              playPop();
              setAppMode('ftux');
            }}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center space-x-1 border cta-bounce ${
              appMode === 'ftux'
                ? 'bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] text-white border-[#FF5A1F] shadow-sm'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40'
            }`}
          >
            <Ticket className="w-3 h-3" />
            <span>🎟️ Pass Flow</span>
          </button>

          {/* 5 Core Feature Tabs */}
          {[
            { id: 'autopilot', label: 'Auto-Pilot', icon: Sparkles },
            { id: 'routing', label: 'Routing', icon: MapPin },
            { id: 'cutoff', label: '8PM Cut-Off', icon: Clock },
            { id: 'wallet', label: 'Wallet', icon: ShieldCheck },
            { id: 'streaks', label: 'Streaks', icon: Flame },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playPop();
                setAppMode('dashboard');
                setActiveTab(item.id);
              }}
              className={`text-[11px] font-bold px-2 py-1.5 rounded-lg transition-all flex items-center space-x-1 border cta-bounce ${
                appMode === 'dashboard' && activeTab === item.id
                  ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          ))}

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Mute App Chimes' : 'Enable Delight Chimes'}
            className={`p-1.5 rounded-lg border transition-all ${
              soundOn
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/50'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Reset State Button */}
          <button
            onClick={resetAllState}
            title="Reset All Prototype State"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 ml-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Centered Mobile Device Frame (420px x 880px) */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF5A1F]/20 via-[#10B981]/15 to-[#4F46E5]/15 rounded-[38px] blur-xl opacity-75 pointer-events-none" />

        <div className="relative w-full max-w-[420px] w-[390px] sm:w-[420px] h-[880px] bg-[#F8FAFC] rounded-[36px] border-[8px] border-[#1E293B] shadow-2xl overflow-hidden flex flex-col text-slate-900 select-none">
          {/* Confetti Canvas Overlay */}
          <ConfettiCanvas
            active={confettiActive}
            onComplete={() => setConfettiActive(false)}
          />

          {/* Floating +1 Credit Badge */}
          <FloatingCreditBadge
            active={floatingCreditActive}
            onComplete={() => setFloatingCreditActive(false)}
          />

          {/* Wow Delight Celebration Modal */}
          <WowDelightModal
            modalData={wowModal}
            onClose={() => setWowModal(null)}
          />

          {/* Video / GIF Intro Bottom Sheet Modal */}
          {showIntroSheet && (
            <GtmIntroBottomSheet
              onClaimPass={() => {
                setShowIntroSheet(false);
                setAppMode('ftux');
              }}
              onClose={() => setShowIntroSheet(false)}
            />
          )}

          {/* Top Notch / Camera pill */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-[#1E293B] rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 ml-10" />
          </div>

          {/* Sticky Top Status Bar */}
          <StatusBar />

          {/* Toast Notification Container */}
          <Toast toast={toast} onClose={() => setToast(null)} />

          {/* VIEW MODE 1: GTM CAMPAIGN HUB */}
          {appMode === 'gtm' ? (
            <main className="flex-1 overflow-y-auto bg-[#F8FAFC] hide-scrollbar relative">
              <GtmCampaignHub
                onTriggerFtux={() => setAppMode('ftux')}
                onTriggerIntroSheet={() => setShowIntroSheet(true)}
                onClose={() => setAppMode('dashboard')}
              />
            </main>
          ) : appMode === 'ftux' ? (
            /* VIEW MODE 2: SUBSCRIPTION FTUX FLOW */
            <main className="flex-1 overflow-y-auto bg-[#F8FAFC] hide-scrollbar relative">
              <SubscriptionFTUXFlow
                onCompleteActivation={handleCompleteActivation}
                onClose={() => setAppMode('dashboard')}
              />
            </main>
          ) : (
            /* VIEW MODE 3: 5-TAB SCHEDULED PLANNER */
            <>
              <Header
                credits={credits}
                onNavigateTab={(tab) => {
                  setAppMode('dashboard');
                  setActiveTab(tab);
                }}
                notificationCount={1}
                onBellClick={() => setActiveTab('cutoff')}
                onOpenFtux={() => setAppMode('ftux')}
              />

              <main className="flex-1 overflow-y-auto bg-[#F8FAFC] hide-scrollbar relative">
                {activeTab === 'autopilot' && (
                  <AutoPilotTab
                    playlist={playlist}
                    setPlaylist={setPlaylist}
                    onLockInPlaylist={handleLockInPlaylist}
                    triggerConfetti={triggerConfetti}
                    onNotify={showToast}
                  />
                )}

                {activeTab === 'routing' && (
                  <RoutingTab
                    playlist={playlist}
                    setPlaylist={setPlaylist}
                    onNotify={showToast}
                  />
                )}

                {activeTab === 'cutoff' && (
                  <CutOffTab
                    playlist={playlist}
                    setPlaylist={setPlaylist}
                    credits={credits}
                    setCredits={setCredits}
                    onNotify={showToast}
                    triggerConfetti={triggerConfetti}
                    triggerFloatingCredit={triggerFloatingCredit}
                  />
                )}

                {activeTab === 'wallet' && (
                  <WalletTab
                    credits={credits}
                    setCredits={setCredits}
                    onNotify={showToast}
                    triggerConfetti={triggerConfetti}
                  />
                )}

                {activeTab === 'streaks' && (
                  <StreaksTab
                    onNotify={showToast}
                    triggerConfetti={triggerConfetti}
                    onOpenWowModal={setWowModal}
                  />
                )}
              </main>

              <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </>
          )}
        </div>
      </div>

      {/* Presenter Footer Helper */}
      <div className="mt-4 text-center text-xs text-slate-400 max-w-[640px]">
        <p className="leading-relaxed">
          <strong className="text-slate-200">GTM Simulator Active:</strong> Test Push, WhatsApp & SMS acquisition triggers with direct CTAs into the pass customizer.
        </p>
      </div>
    </div>
  );
}
