import React, { useState } from 'react';
import StatusBar from './components/StatusBar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import { ConfettiCanvas, FloatingCreditBadge, WowDelightModal } from './components/DelightEffects';
import { isSoundEnabled, setSoundEnabled, playPop, playCelebrationFanfare } from './utils/audioDelight';
import SubscriptionFTUXFlow from './components/PassOnboardingFlow';
import GtmIntroBottomSheet from './components/GtmIntroBottomSheet';
import GtmCampaignHub from './components/GtmCampaignHub';

import AutoPilotTab from './tabs/AutoPilotTab';
import RoutingTab from './tabs/RoutingTab';
import CutOffTab from './tabs/CutOffTab';
import WalletTab from './tabs/WalletTab';
import StreaksTab from './tabs/StreaksTab';

import { INITIAL_PLAYLIST, SAVED_LOCATIONS } from './data/mockData';
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

class PrototypeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Prototype error boundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center space-y-3 bg-white rounded-3xl m-4 border border-rose-200 shadow-xl animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Prototype Restored</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            A temporary component state glitch was caught and neutralized.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="w-full py-2.5 px-4 bg-[#FF5A1F] hover:bg-[#E04812] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Resume Prototype View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [appMode, setAppMode] = useState('dashboard'); // 'dashboard' | 'ftux' | 'gtm'
  const [activeTab, setActiveTab] = useState('autopilot');
  const [credits, setCredits] = useState(14);
  const [paymentMode, setPaymentMode] = useState('prepaid'); // 'prepaid' | 'mandate'
  const [playlist, setPlaylist] = useState(INITIAL_PLAYLIST);
  const [savedLocations, setSavedLocations] = useState(SAVED_LOCATIONS);
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
      '5 personalized lunches scheduled across your office & home locations.',
      'success'
    );
  };

  const handleCompleteActivation = (passData) => {
    setCredits(passData.meals);
    if (passData.paymentOption) {
      setPaymentMode(passData.paymentOption === 'mandate' ? 'mandate' : 'prepaid');
    }
    if (passData.locations) {
      setSavedLocations(passData.locations);
    }
    setAppMode('dashboard');
    setActiveTab('autopilot');
    triggerConfetti();
    playCelebrationFanfare();
    showToast(
      'Pass & Hubs Activated! 🎉',
      `${passData.paymentOption === 'mandate' ? `${passData.meals} meals activated` : `${passData.meals} Meal Credits loaded`} (${passData.validityDays}d buffer) • Locations verified within kitchen cluster.`,
      'success'
    );
  };

  const resetAllState = () => {
    setCredits(14);
    setPaymentMode('prepaid');
    setPlaylist(INITIAL_PLAYLIST);
    setSavedLocations(SAVED_LOCATIONS);
    setActiveTab('autopilot');
    setAppMode('dashboard');
    setShowIntroSheet(false);
    setConfettiActive(false);
    setFloatingCreditActive(false);
    setWowModal(null);
    showToast('Prototype Reset', 'Restored default 14 credits and initial playlist schedule.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-0 sm:p-6 lg:p-8 font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Top Presentation Bar for PM Walkthrough - hidden on small mobile screens to prevent clutter */}
      <div className="w-full max-w-[1100px] mb-4 hidden sm:flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md">
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

          {/* Active Payment Rail Switcher for PM Test / Walkthrough */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-[10px]">
            <button
              onClick={() => {
                playPop();
                setPaymentMode('prepaid');
                showToast('Payment Rail: Prepaid Pass', 'Skipped meals are kept in your pass pack (runway extended within 20d buffer).', 'info');
              }}
              className={`px-2 py-1 rounded font-bold transition-all ${
                paymentMode === 'prepaid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Prepaid Pass: Skipped meals preserve quota in pack; safety net triggers at cycle end"
            >
              💰 Prepaid Pass
            </button>
            <button
              onClick={() => {
                playPop();
                setPaymentMode('mandate');
                showToast('Payment Rail: UPI AutoPay Mandate', 'Skipped meals cancel 10 PM debit (₹0 charged, no wallet credit).', 'info');
              }}
              className={`px-2 py-1 rounded font-bold transition-all ${
                paymentMode === 'mandate' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="UPI Mandate: Skipped meals cancel 10 PM debit (₹0 charged)"
            >
              ⚡ UPI Mandate
            </button>
          </div>

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

          {/* 4 Core Feature Tabs */}
          {[
            { id: 'autopilot', label: 'Planner', icon: Sparkles },
            { id: 'cutoff', label: 'Cut-Off', icon: Clock },
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

      {/* Main Centered Mobile Device Frame (Responsive on mobile, 420px x 880px on desktop) */}
      <div className="relative w-full sm:w-auto flex justify-center">
        <div className="hidden sm:block absolute -inset-1 bg-gradient-to-tr from-[#FF5A1F]/20 via-[#10B981]/15 to-[#4F46E5]/15 rounded-[38px] blur-xl opacity-75 pointer-events-none" />

        <div className="relative w-full sm:max-w-[420px] sm:w-[420px] min-h-screen sm:min-h-[880px] sm:h-[880px] h-[100dvh] bg-[#F8FAFC] sm:rounded-[36px] sm:border-[8px] sm:border-[#1E293B] shadow-2xl overflow-hidden flex flex-col text-slate-900 select-none">
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

          {/* Top Notch / Camera pill - shown only on simulated desktop frame */}
          <div className="hidden sm:flex absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-[#1E293B] rounded-full z-50 items-center justify-center">
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
                onOpenIntroSheet={() => setShowIntroSheet(true)}
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
                onOpenIntroSheet={() => setShowIntroSheet(true)}
              />

              <main className="flex-1 overflow-y-auto bg-[#F8FAFC] hide-scrollbar relative">
                <PrototypeErrorBoundary>
                  {activeTab === 'autopilot' && (
                    <AutoPilotTab
                      playlist={playlist}
                      setPlaylist={setPlaylist}
                      onLockInPlaylist={handleLockInPlaylist}
                      triggerConfetti={triggerConfetti}
                      onNotify={showToast}
                      paymentMode={paymentMode}
                      savedLocations={savedLocations}
                      onNavigateTab={setActiveTab}
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
                      paymentMode={paymentMode}
                      onNavigateTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'wallet' && (
                    <WalletTab
                      credits={credits}
                      setCredits={setCredits}
                      onNotify={showToast}
                      triggerConfetti={triggerConfetti}
                      paymentMode={paymentMode}
                      setPaymentMode={setPaymentMode}
                    />
                  )}

                  {activeTab === 'streaks' && (
                    <StreaksTab
                      credits={credits}
                      setCredits={setCredits}
                      playlist={playlist}
                      setPlaylist={setPlaylist}
                      onNavigateTab={setActiveTab}
                      onOpenFtux={() => setAppMode('ftux')}
                      onNotify={showToast}
                      triggerConfetti={triggerConfetti}
                      onOpenWowModal={setWowModal}
                    />
                  )}
                </PrototypeErrorBoundary>
              </main>

              <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </>
          )}
        </div>
      </div>

      {/* Presenter Footer Helper */}
      <div className="mt-4 text-center text-xs text-slate-400 max-w-[640px] px-4">
        <p className="leading-relaxed">
          <strong className="text-slate-200">GTM Simulator Active:</strong> Test Push, WhatsApp & SMS acquisition triggers with direct CTAs into the pass customizer.
        </p>
      </div>
    </div>
  );
}
