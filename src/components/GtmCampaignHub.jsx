import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  Smartphone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  BarChart3,
  Flame,
  X,
  Play
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audioDelight';

export default function GtmCampaignHub({ onTriggerFtux, onTriggerIntroSheet, onClose }) {
  const [activeChannel, setActiveChannel] = useState('push'); // 'push' | 'whatsapp' | 'sms' | 'userflow' | 'kpis'

  const handleCtaClick = () => {
    playSuccessChime();
    if (onTriggerFtux) onTriggerFtux();
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] flex flex-col relative text-slate-900 pb-28 font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A1F]">
            GTM Strategy & Acquisition
          </span>
          <h2 className="text-xs font-extrabold text-slate-900 leading-tight">
            Multi-Channel Acquisition Simulator
          </h2>
        </div>

        <div className="flex items-center space-x-1.5">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3.5">
        {/* Channel Navigation Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { id: 'push', label: 'Push Alert', icon: Bell },
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
            { id: 'sms', label: 'SMS Link', icon: Smartphone },
            { id: 'userflow', label: 'Userflow Chart', icon: Layers },
            { id: 'kpis', label: 'Post-Launch KPIs', icon: BarChart3 },
          ].map((ch) => {
            const Icon = ch.icon;
            const isSelected = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  playPop();
                  setActiveChannel(ch.id);
                }}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 border cta-bounce ${
                  isSelected
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* CHANNEL 1: PUSH NOTIFICATION SIMULATION */}
        {activeChannel === 'push' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-[#FF5A1F] uppercase tracking-wider">
                Midday Trigger • 11:15 AM Weekdays
              </span>
              <p className="text-xs text-slate-600">
                Pushed to users who placed ≥3 solo orders in the past 14 days, targeting lunchtime decision fatigue before hunger peaks.
              </p>
            </div>

            {/* Lock Screen Push Preview Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 border border-slate-700 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-4 rounded bg-[#FF5A1F] text-white flex items-center justify-center font-bold text-[8px]">
                    MO
                  </div>
                  <span className="font-bold text-slate-300">MEALSON</span>
                </div>
                <span>11:15 AM</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  🥱 Still spending 20 mins deciding lunch today?
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Let MealsOn Auto-Pilot handle it. 5 days of fresh, high-protein chef bowls delivered right to your desk. Save ₹400 on delivery fees!
                </p>
              </div>

              {/* Actionable CTA Button inside Push Notification */}
              <button
                onClick={handleCtaClick}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <span>Set Up 1-Tap Pass (Save ₹400) →</span>
              </button>
            </div>

            {/* Trigger Video Sheet Alternative */}
            <button
              onClick={() => {
                playPop();
                if (onTriggerIntroSheet) onTriggerIntroSheet();
              }}
              className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-[#FF5A1F] text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Preview In-App Video / GIF Introduction Sheet</span>
            </button>
          </div>
        )}

        {/* CHANNEL 2: WHATSAPP INTERACTIVE MESSAGE */}
        {activeChannel === 'whatsapp' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-[#25D366] uppercase tracking-wider">
                WhatsApp Business API (Verified Concierge)
              </span>
              <p className="text-xs text-slate-600">
                Triggered for tech park users with high opt-in rates (78% open rate, 28% CTR).
              </p>
            </div>

            {/* WhatsApp Chat View Mockup */}
            <div className="bg-[#EFEAE2] rounded-2xl p-3 border border-emerald-700/20 shadow-sm space-y-2">
              <div className="bg-[#075E54] -mx-3 -mt-3 p-2 px-3 text-white flex items-center justify-between text-xs font-semibold mb-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[9px]">
                    MO
                  </div>
                  <span>MealsOn Concierge • Verified</span>
                </div>
                <span className="text-[10px] text-emerald-200">11:15 AM</span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200 text-xs text-slate-800 space-y-2">
                <p className="font-bold text-slate-900 leading-snug">
                  🥗 <strong>Introducing: MealsOn Flexible Scheduled Meals</strong>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Hi Sachin! Tired of daily surge delivery fees and last-minute lunch delays?
                  <br /><br />
                  We've launched the <strong>Scheduled Meals Pass</strong> for Cyber Park Tower B:
                  <br />
                  • <strong>Curated Menus:</strong> High-protein bowls from top kitchens.
                  <br />
                  • <strong>Pause Shield:</strong> Skip by 10 PM with 100% money back.
                  <br />
                  • <strong>Dual Routing:</strong> Office or Home auto-swapped to calendar.
                  <br /><br />
                  🎁 <strong>Launch Offer:</strong> Get <strong>+5% extra wallet cash</strong> on your first pass!
                </p>

                {/* WhatsApp Quick Reply Buttons with Actionable CTAs */}
                <div className="space-y-1 pt-1">
                  <button
                    onClick={handleCtaClick}
                    className="w-full text-center py-1.5 px-2 rounded-lg border border-[#25D366] bg-[#DCF8C6] hover:bg-[#cbf4b1] text-emerald-950 font-bold text-[11px] transition-all active:scale-95 flex items-center justify-center space-x-1"
                  >
                    <span>🎟️ Customize My Pass (From ₹152/meal)</span>
                  </button>

                  <button
                    onClick={handleCtaClick}
                    className="w-full text-center py-1.5 px-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-[11px] transition-all active:scale-95"
                  >
                    🏢 Join Cyber Park Tower B Pod
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHANNEL 3: SMS SMART-LINK CAMPAIGN */}
        {activeChannel === 'sms' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                SMS Smart-Link (DND Compliant)
              </span>
              <p className="text-xs text-slate-600">
                Short, punchy broadcast with high deliverability and 1-tap deeplink URL.
              </p>
            </div>

            {/* iOS Message Mockup */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2">
              <div className="text-center text-[10px] text-slate-400 font-medium">
                Today 11:15 AM • SMS from VM-MEALON
              </div>

              <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-3 text-xs text-slate-800 space-y-1.5">
                <p className="leading-relaxed">
                  Hi Sachin, why pay ₹50 delivery fees everyday? Lock your 5-day office lunch pass starting ₹152/meal with 100% money rollover protection.
                </p>
                <div
                  onClick={handleCtaClick}
                  className="bg-white p-2 rounded-xl border border-slate-300 cursor-pointer hover:border-[#FF5A1F] transition-colors"
                >
                  <span className="text-blue-600 font-bold underline text-[11px] block">
                    mealson.in/pass?ref=sms_pm
                  </span>
                  <span className="text-[9px] text-slate-500">
                    Tap to open MealsOn Pass Configurator
                  </span>
                </div>
              </div>

              <button
                onClick={handleCtaClick}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <span>Simulate Tapping SMS Link →</span>
              </button>
            </div>
          </div>
        )}

        {/* CHANNEL 4: GTM USERFLOW CHART */}
        {activeChannel === 'userflow' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold text-[#FF5A1F] uppercase tracking-wider">
                End-to-End GTM Funnel Map
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-0.5">
                Acquisition ➔ Onboarding ➔ Recurring Habit
              </h3>
            </div>

            {/* Visual Step-by-Step Flow Chart */}
            <div className="space-y-2">
              {[
                {
                  step: '1. Discovery & Hook',
                  desc: 'Push (11:15 AM) / WhatsApp / SMS / In-App Video Sheet',
                  color: 'border-l-4 border-l-[#FF5A1F] bg-white',
                  badge: 'ACQUISITION'
                },
                {
                  step: '2. FTUX Pass Customizer',
                  desc: 'Pick Tier (₹160 / ₹250 / ₹320) + Duration (5 / 10 / 20 days) with live savings receipt',
                  color: 'border-l-4 border-l-amber-500 bg-white',
                  badge: 'CONFIG'
                },
                {
                  step: '3. Conversion Checkout',
                  desc: 'Choose Upfront Prepaid (+5% cash bonus) OR ₹0 10 PM UPI AutoPay Mandate',
                  color: 'border-l-4 border-l-[#10B981] bg-white',
                  badge: 'PAYMENT'
                },
                {
                  step: '4. Pass Activated Handoff',
                  desc: 'Wallet balance loaded with meal credits + celebratory fanfare',
                  color: 'border-l-4 border-l-emerald-600 bg-white',
                  badge: 'ACTIVATION'
                },
                {
                  step: '5. Auto-Pilot Menu & Routing',
                  desc: '5-Day multi-kitchen rotation + Office/Home calendar sync',
                  color: 'border-l-4 border-l-blue-500 bg-white',
                  badge: 'HABIT'
                },
                {
                  step: '6. Night-Before Check-In',
                  desc: '8 PM WhatsApp reminder + 10 PM zero-waste skip cutoff (100% money back)',
                  color: 'border-l-4 border-l-indigo-600 bg-white',
                  badge: 'PAUSE SHIELD'
                },
                {
                  step: '7. Streaks & Pods Retention',
                  desc: '5/5 habit treat (Cold Brew) + 62% last-mile fleet batching discount',
                  color: 'border-l-4 border-l-purple-600 bg-white',
                  badge: 'RETENTION'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border border-slate-200 shadow-xs ${item.color} flex items-start justify-between`}
                >
                  <div>
                    <div className="text-[11px] font-extrabold text-slate-900">
                      {item.step}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-[8px] font-extrabold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded shrink-0 ml-2">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCtaClick}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FF5A1F] text-white font-bold text-xs shadow-md"
            >
              Launch Step 2: Pass Customizer →
            </button>
          </div>
        )}

        {/* CHANNEL 5: POST-LAUNCH KPIS & IMPACT FRAMEWORK */}
        {activeChannel === 'kpis' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                Measurement Framework
              </span>
              <h3 className="text-xs font-bold text-slate-900 mt-0.5">
                North Star: Weekly Scheduled Meals Completed (WSMC)
              </h3>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">FTUX Conversion</span>
                <div className="text-base font-extrabold text-[#FF5A1F]">≥38%</div>
                <p className="text-[9px] text-slate-500">Benchmark: 12% on regular food promo</p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">D30 Repeat Rate</span>
                <div className="text-base font-extrabold text-emerald-700">≥62%</div>
                <p className="text-[9px] text-slate-500">Benchmark: 24% on single orders</p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Last-Mile Cost</span>
                <div className="text-base font-extrabold text-indigo-700">-62%</div>
                <p className="text-[9px] text-slate-500">₹65 solo drop ➔ ₹24 pod batch</p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Kitchen Waste</span>
                <div className="text-base font-extrabold text-teal-700">≤4%</div>
                <p className="text-[9px] text-slate-500">Zero-waste 10 PM night lock-in</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
