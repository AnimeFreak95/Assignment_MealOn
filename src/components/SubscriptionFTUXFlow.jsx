import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Check,
  ChevronRight,
  ArrowLeft,
  Clock,
  Zap,
  Info,
  X,
  CreditCard,
  Gift,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';

const TIERS = [
  {
    id: 160,
    label: 'Comfort',
    price: 160,
    subtext: 'Homestyle • Dal Khichdi',
    sampleDish: "Rajshree's Bhakri • ₹155",
    tag: 'Budget',
  },
  {
    id: 250,
    label: 'Balanced',
    price: 250,
    subtext: 'Corporate Thalis • Bowls',
    sampleDish: 'Paneer Quinoa Bowl • ₹230',
    tag: 'POPULAR',
    isPopular: true,
  },
  {
    id: 320,
    label: 'Macro Pro',
    price: 320,
    subtext: '30g+ Protein • Keto Salads',
    sampleDish: 'Tofu Edamame Bowl • ₹310',
    tag: '30g+ Protein',
  }
];

const DURATIONS = [
  {
    id: 5,
    days: 5,
    label: '5-Meal Pass',
    sublabel: '1 Workweek',
    discountPct: 5,
    validityDays: 10,
    extraBufferDays: 5,
    discountBadge: '5% OFF + FREE DELIVERY',
    tag: null
  },
  {
    id: 10,
    days: 10,
    label: '10-Meal Pass',
    sublabel: '2 Workweeks',
    discountPct: 10,
    validityDays: 20,
    extraBufferDays: 10,
    discountBadge: '10% OFF + FREE DELIVERY',
    tag: 'RECOMMENDED'
  },
  {
    id: 20,
    days: 20,
    label: '20-Meal Pass',
    sublabel: '4 Workweeks',
    discountPct: 15,
    validityDays: 35,
    extraBufferDays: 15,
    discountBadge: '15% OFF + FREE DELIVERY',
    tag: 'MAX SAVINGS'
  }
];

export default function SubscriptionFTUXFlow({ onCompleteActivation, onClose }) {
  const [stage, setStage] = useState(1);
  const [showFtuxInfo, setShowFtuxInfo] = useState(false);

  // Selections
  const [selectedTier, setSelectedTier] = useState(250);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedLunchSlot, setSelectedLunchSlot] = useState('1:00 PM – 1:30 PM');
  const [paymentOption, setPaymentOption] = useState('prepaid'); // 'prepaid' | 'mandate' | 'pluxee'
  const [pluxeeLoadFull, setPluxeeLoadFull] = useState(true);

  // Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dynamic calculations
  const durationObj = DURATIONS.find((d) => d.days === selectedDuration) || DURATIONS[1];
  const tierObj = TIERS.find((t) => t.price === selectedTier) || TIERS[1];

  const baseCost = selectedDuration * selectedTier;
  const discountRate = durationObj.discountPct / 100;
  const netPrice = Math.round(baseCost * (1 - discountRate));
  const discountAmount = baseCost - netPrice;
  const deliverySaved = selectedDuration * 40;
  const totalPocketSavings = discountAmount + deliverySaved;
  const effectiveMealPrice = Math.round(netPrice / selectedDuration);
  const bonusCredits = Math.round(netPrice * 0.05);

  const handleTierSelect = (tierPrice) => {
    playPop();
    setSelectedTier(tierPrice);
  };

  const handleDurationSelect = (days) => {
    playPop();
    setSelectedDuration(days);
  };

  const handleGoToPayment = () => {
    playSuccessChime();
    setStage(2);
  };

  const handleBackToConfig = () => {
    playPop();
    setStage(1);
  };

  const handleCompleteCheckout = () => {
    playCelebrationFanfare();
    setShowSuccessModal(true);
  };

  const handleProceedToAutoPilot = () => {
    playSuccessChime();
    setShowSuccessModal(false);
    if (onCompleteActivation) {
      onCompleteActivation({
        meals: selectedDuration,
        tier: selectedTier,
        netPrice,
        bonusCredits: paymentOption === 'mandate' ? 0 : bonusCredits,
        validityDays: durationObj.validityDays
      });
    }
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] flex flex-col relative text-slate-900 pb-28 font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Top Header: Step Indicator & FAQ Toggle */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          {stage === 2 && (
            <button
              onClick={handleBackToConfig}
              className="p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A1F]">
              {stage === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
            </span>
            <h2 className="text-xs font-extrabold text-slate-900 leading-tight">
              {stage === 1 ? 'Customize Your Pass' : 'Payment & Activation'}
            </h2>
          </div>
        </div>

        {/* Right FAQ Link */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              playPop();
              setShowFtuxInfo(true);
            }}
            className="flex items-center space-x-1 text-[10px] font-bold text-slate-600 hover:text-[#FF5A1F] bg-slate-100 px-2 py-1 rounded-full border border-slate-200 transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-[#FF5A1F]" />
            <span>FAQ</span>
          </button>

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

      {/* STAGE 1: PASS CONFIGURATOR */}
      {stage === 1 && (
        <div className="px-4 py-3 space-y-3 animate-in fade-in duration-200">
          {/* A. DYNAMIC FTUX HERO CARD (Updates Live based on Selected Plan) */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-md border border-slate-700/80 relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5A1F]/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-extrabold bg-[#FF5A1F]/20 text-[#FF7B47] border border-[#FF5A1F]/40 px-2 py-0.5 rounded-full flex items-center shadow-xs">
                ✨ {durationObj.label.toUpperCase()} CONFIGURATION
              </span>
              <span className="text-[10px] font-bold text-emerald-400">
                Save ₹{totalPocketSavings}
              </span>
            </div>

            <h1 className="text-sm font-extrabold text-white tracking-tight leading-snug">
              {selectedDuration} Lunches • {durationObj.validityDays} Calendar Days Buffer
            </h1>

            {/* Visual Flex Buffer Bar */}
            <div className="mt-2 bg-slate-800/90 p-2 rounded-xl border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-slate-300">🍽️ {selectedDuration} Meals Ordered</span>
                <span className="text-emerald-400">🛡️ +{durationObj.extraBufferDays} Free Rollover Days</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#FF5A1F] h-full"
                  style={{ width: `${(selectedDuration / durationObj.validityDays) * 100}%` }}
                />
                <div
                  className="bg-[#10B981] h-full"
                  style={{ width: `${(durationObj.extraBufferDays / durationObj.validityDays) * 100}%` }}
                />
              </div>
            </div>

            {/* Dynamic Real-Time Plan Highlights */}
            <div className="grid grid-cols-3 gap-1.5 mt-2 text-[9px] font-bold text-slate-200">
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 text-center truncate">
                <span className="block text-emerald-400">🛡️ {durationObj.validityDays} Days</span> Safe Validity
              </div>
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 text-center truncate">
                <span className="block text-amber-400">🚚 ₹{deliverySaved} Free</span> Delivery Waived
              </div>
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 text-center truncate">
                <span className="block text-[#FF5A1F]">⏰ 10 PM Free</span> Skip Guarantee
              </div>
            </div>
          </div>

          {/* B. Step 1: Select Meal Allowance Tier (3-Column Segmented Visual) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                1. Daily Meal Allowance
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Max Cap</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TIERS.map((tier) => {
                const isSelected = selectedTier === tier.price;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleTierSelect(tier.price)}
                    className={`rounded-2xl p-2.5 cursor-pointer transition-all relative border flex flex-col justify-between cta-bounce ${
                      isSelected
                        ? 'bg-[#FFF5F0]/90 border-2 border-[#FF5A1F] shadow-sm ring-2 ring-[#FF5A1F]/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {tier.isPopular ? (
                      <span className="text-[8px] font-extrabold text-[#FF5A1F] bg-[#FFF5F0] border border-[#FF5A1F]/30 px-1.5 py-0.2 rounded-full self-start mb-1">
                        MOST POPULAR
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">
                        {tier.tag}
                      </span>
                    )}

                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {tier.label}
                      </div>
                      <div className="text-sm font-extrabold text-[#FF5A1F] mt-0.5 tabular-nums">
                        ₹{tier.price}
                        <span className="text-[9px] font-medium text-slate-500">/d</span>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-500 mt-1 font-medium truncate">
                      {tier.subtext}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Micro Pill Helper */}
            <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl px-2.5 py-1.5 text-[10px] text-amber-900 flex items-center justify-between">
              <span>💡 Pick a meal under ₹{selectedTier}? Balance rolls to Wallet</span>
              <span className="font-bold text-[#FF5A1F]">100% Retained</span>
            </div>
          </div>

          {/* C. Step 2: Select Duration Cards */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                2. Pass Duration
              </span>
              <span className="text-[10px] font-bold text-emerald-700">₹0 Delivery</span>
            </div>

            <div className="space-y-1.5">
              {DURATIONS.map((dur) => {
                const isSelected = selectedDuration === dur.days;
                const baseVal = dur.days * selectedTier;
                const discAmt = Math.round(baseVal * (dur.discountPct / 100));
                const finalPassPrice = baseVal - discAmt;
                const costPerMeal = Math.round(finalPassPrice / dur.days);

                return (
                  <div
                    key={dur.id}
                    onClick={() => handleDurationSelect(dur.days)}
                    className={`rounded-2xl p-2.5 px-3 border cursor-pointer transition-all flex items-center justify-between cta-bounce ${
                      isSelected
                        ? 'bg-white border-2 border-[#FF5A1F] shadow-sm ring-2 ring-[#FF5A1F]/15'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'border-[#FF5A1F] bg-[#FF5A1F]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-extrabold text-slate-900">
                            {dur.label}
                          </span>
                          {dur.tag && (
                            <span className="text-[8px] font-extrabold bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30 px-1.5 py-0.2 rounded-full">
                              {dur.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5 mt-0.5 text-[9px]">
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                            {dur.discountBadge}
                          </span>
                          <span className="text-slate-400">• {dur.validityDays}d Buffer</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                        ₹{finalPassPrice}
                      </div>
                      <div className="text-[9px] font-bold text-[#FF5A1F] tabular-nums">
                        ₹{costPerMeal}/meal
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. Step 3: Preferred 30-Min Lunch Window (Batched Milk-Run Drop) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center">
                <span>3. 30-Min Drop Window</span>
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded-full">
                Eco-Batching ₹0 Fee
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '12:30 PM – 1:00 PM', label: '12:30 – 1:00 PM', sub: 'Early Lunch' },
                { id: '1:00 PM – 1:30 PM', label: '1:00 – 1:30 PM', sub: '🔥 Peak Pod', badge: 'Default' },
                { id: '1:30 PM – 2:00 PM', label: '1:30 – 2:00 PM', sub: 'Post-Standup' }
              ].map((slot) => {
                const isSelected = selectedLunchSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      playPop();
                      setSelectedLunchSlot(slot.id);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cta-bounce ${
                      isSelected
                        ? 'bg-indigo-50/90 border-2 border-indigo-600 shadow-xs ring-1 ring-indigo-600/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-extrabold text-slate-900 leading-tight">
                      {slot.label}
                    </div>
                    <div className="text-[9px] font-bold text-indigo-600 mt-0.5">
                      {slot.sub}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-slate-500 italic px-0.5">
              💡 30-min windows batch deliveries into your office lobby, eliminating delivery charges.
            </p>
          </div>

          {/* D. Live Savings Receipt Card (Visual Design Language) */}
          <div className="bg-[#F0FDF4] border border-dashed border-[#BBF7D0] rounded-2xl p-3 text-xs text-slate-800 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>{selectedDuration} Meals × ₹{selectedTier} Cap</span>
              <span className="font-semibold tabular-nums">₹{baseCost}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span>Pass Discount ({durationObj.discountPct}%) + Free Delivery</span>
              <span className="tabular-nums font-bold">- ₹{totalPocketSavings}</span>
            </div>

            <div className="border-t border-[#BBF7D0] pt-1 mt-1 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Net Pass Price</span>
              <span className="text-base font-extrabold text-slate-950 tabular-nums">
                ₹{netPrice}
              </span>
            </div>

            {/* Visual Prepaid Bonus Callout */}
            <div className="bg-white/90 border border-[#10B981]/30 rounded-xl p-1.5 px-2 text-[10px] text-emerald-900 font-bold flex items-center justify-between mt-1">
              <span className="flex items-center">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                Prepaid Bonus Perk:
              </span>
              <span className="bg-[#ECFDF5] text-[#10B981] px-1.5 py-0.5 rounded font-extrabold">
                +₹{bonusCredits} Extra Wallet Cash
              </span>
            </div>
          </div>

          {/* Small FAQ Anchor Link */}
          <div className="text-center pt-0.5">
            <button
              onClick={() => {
                playPop();
                setShowFtuxInfo(true);
              }}
              className="text-[10px] font-bold text-slate-500 hover:text-[#FF5A1F] transition-colors inline-flex items-center space-x-1"
            >
              <span>Have questions about 10 PM cut-off or rollovers?</span>
              <span className="text-[#FF5A1F] underline flex items-center">
                View FAQ <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: PAYMENT SELECTION (VISUAL SOLUTIONS, LESS TEXT) */}
      {stage === 2 && (
        <div className="px-4 py-3 space-y-3 animate-in fade-in duration-200">
          {/* Summary Strip */}
          <div className="bg-white rounded-2xl p-2.5 px-3 border border-slate-200 flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs font-extrabold text-slate-900">
                {selectedDuration} Meals • ₹{selectedTier}/day Cap
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                {durationObj.validityDays} Calendar Days Buffer
              </span>
            </div>

            <button
              onClick={handleBackToConfig}
              className="text-[10px] font-bold text-[#FF5A1F] hover:underline bg-[#FFF5F0] border border-[#FF5A1F]/30 px-2 py-0.5 rounded-lg"
            >
              Edit
            </button>
          </div>

          {/* Payment Option 1: Prepaid Pass (Visual Badges, Minimal Text) */}
          <div
            onClick={() => {
              playPop();
              setPaymentOption('prepaid');
            }}
            className={`rounded-2xl p-3 border cursor-pointer transition-all relative ${
              paymentOption === 'prepaid'
                ? 'bg-[#ECFDF5]/60 border-2 border-[#10B981] shadow-md ring-2 ring-[#10B981]/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="absolute -top-2 right-3 text-[8px] font-extrabold bg-[#10B981] text-white px-2 py-0.5 rounded-full shadow-xs">
              RECOMMENDED • +5% BONUS
            </span>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    paymentOption === 'prepaid' ? 'border-[#10B981] bg-[#10B981]' : 'border-slate-300 bg-white'
                  }`}
                >
                  {paymentOption === 'prepaid' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Pay Upfront (Prepaid)
                  </h4>
                  <span className="text-[10px] text-slate-500">One-time payment</span>
                </div>
              </div>

              <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                ₹{netPrice}
              </span>
            </div>

            {/* Visual 3-Pill Benefit Row (No Text Blocks!) */}
            <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-bold">
              <div className="bg-white p-1.5 rounded-lg border border-[#10B981]/30 text-emerald-900">
                🎁 +₹{bonusCredits} Cash
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-[#10B981]/30 text-emerald-900">
                🛡️ {durationObj.validityDays}d Pause Safe
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-[#10B981]/30 text-emerald-900">
                ⚡ Instant UPI
              </div>
            </div>

            {/* Quick Payment Rails */}
            <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-emerald-100/80">
              {['GPay', 'PhonePe', 'Card', 'CRED'].map((rail) => (
                <span key={rail} className="text-[8px] font-bold text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                  {rail}
                </span>
              ))}
            </div>
          </div>

          {/* Payment Option 2: UPI AutoPay Mandate (Visual Step Flow, No Paragraphs) */}
          <div
            onClick={() => {
              playPop();
              setPaymentOption('mandate');
            }}
            className={`rounded-2xl p-3 border cursor-pointer transition-all ${
              paymentOption === 'mandate'
                ? 'bg-[#EEF2FF]/60 border-2 border-[#4F46E5] shadow-md ring-2 ring-[#4F46E5]/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    paymentOption === 'mandate' ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-slate-300 bg-white'
                  }`}
                >
                  {paymentOption === 'mandate' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    UPI AutoPay (Pay-As-You-Eat)
                  </h4>
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1 rounded">
                    Keep {durationObj.discountPct}% Pass Discount
                  </span>
                </div>
              </div>

              <span className="text-xs font-extrabold text-indigo-900">
                ₹0 Today
              </span>
            </div>

            {/* VISUAL 3-STEP FLOW: Communicates 10 PM billing with icons instead of long text! */}
            <div className="bg-white border border-indigo-200/80 rounded-xl p-2 space-y-1.5">
              <div className="text-[10px] font-extrabold text-indigo-950 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-[#4F46E5]" />
                10:00 PM Deduction Timeline:
              </div>

              <div className="grid grid-cols-3 gap-1 text-[9px] text-center">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                  <span className="block font-bold text-slate-800">1. ₹0 Now</span>
                  Setup Mandate
                </div>
                <div className="bg-indigo-50/80 p-1.5 rounded border border-indigo-100">
                  <span className="block font-bold text-indigo-900">2. 10 PM Lock</span>
                  ₹{effectiveMealPrice} deducted
                </div>
                <div className="bg-emerald-50/80 p-1.5 rounded border border-emerald-100">
                  <span className="block font-bold text-emerald-900">3. Skip Free</span>
                  ₹0 if skipped
                </div>
              </div>
            </div>
          </div>

          {/* Payment Option 3: Corporate Meal Card */}
          <div
            onClick={() => {
              playPop();
              setPaymentOption('pluxee');
            }}
            className={`rounded-2xl p-3 border cursor-pointer transition-all ${
              paymentOption === 'pluxee'
                ? 'bg-amber-50/50 border-2 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    paymentOption === 'pluxee' ? 'border-amber-500 bg-amber-500' : 'border-slate-300 bg-white'
                  }`}
                >
                  {paymentOption === 'pluxee' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Pluxee (Sodexo) / Zaggle
                  </h4>
                  <span className="text-[9px] text-slate-500">Tax-Free Meal Allowance</span>
                </div>
              </div>

              <span className="text-[8px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                TAX FREE
              </span>
            </div>

            {/* Linked Card Preview */}
            {paymentOption === 'pluxee' && (
              <div className="mt-2 bg-white border border-amber-200 rounded-xl p-2 flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-800 flex items-center">
                  <CreditCard className="w-3 h-3 mr-1 text-amber-600" />
                  Pluxee •••• 4821
                </span>
                <span className="text-emerald-700 font-extrabold">Balance: ₹6,450</span>
              </div>
            )}
          </div>

          {/* Small FAQ Anchor Link */}
          <div className="text-center pt-0.5">
            <button
              onClick={() => {
                playPop();
                setShowFtuxInfo(true);
              }}
              className="text-[10px] font-bold text-slate-500 hover:text-[#FF5A1F] transition-colors inline-flex items-center space-x-1"
            >
              <span>Have questions about billing?</span>
              <span className="text-[#FF5A1F] underline flex items-center">
                View FAQ <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM CHECKOUT CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 px-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] z-20">
        {stage === 1 ? (
          <button
            onClick={handleGoToPayment}
            className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
          >
            <span>Continue to Payment • ₹{netPrice}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCompleteCheckout}
            className={`w-full text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5 ${
              paymentOption === 'prepaid'
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                : paymentOption === 'mandate'
                ? 'bg-gradient-to-r from-[#4F46E5] to-[#4338CA]'
                : 'bg-gradient-to-r from-amber-600 to-amber-700'
            }`}
          >
            {paymentOption === 'prepaid' && (
              <span>Pay ₹{netPrice} & Claim +₹{bonusCredits} Credits →</span>
            )}
            {paymentOption === 'mandate' && (
              <span>Setup 10 PM UPI Mandate (₹0 Today) →</span>
            )}
            {paymentOption === 'pluxee' && (
              <span>Pay ₹{netPrice} via Pluxee →</span>
            )}
          </button>
        )}
      </div>

      {/* FTUX & BILLING FAQ DRAWER (SLIDE-IN MODAL) */}
      {showFtuxInfo && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-3xl p-4 shadow-2xl border-t border-slate-100 max-h-[85%] overflow-y-auto space-y-3 animate-in slide-in-from-bottom duration-250">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">❓</span>
                <h3 className="text-xs font-extrabold text-slate-900">
                  Scheduled Meals & Billing FAQ
                </h3>
              </div>
              <button
                onClick={() => setShowFtuxInfo(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clean Visual Q&A Cards */}
            <div className="space-y-2 text-xs">
              <div className="bg-[#FFF5F0] border border-[#FF5A1F]/30 p-2.5 rounded-xl">
                <h4 className="font-bold text-[#FF5A1F] flex items-center text-[11px]">
                  ⏰ What is the 10:00 PM cutoff?
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                  Partner cloud kitchens marinate and prepare zero-waste fresh ingredients overnight. You can swap dishes or skip for free before 10 PM.
                </p>
              </div>

              <div className="bg-[#ECFDF5] border border-emerald-200 p-2.5 rounded-xl">
                <h4 className="font-bold text-emerald-900 flex items-center text-[11px]">
                  🛡️ What happens when I skip a meal?
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                  100% of your meal value rolls over into your Pause Shield wallet. Your pass validity automatically extends by +1 day with zero fee.
                </p>
              </div>

              <div className="bg-[#EEF2FF] border border-indigo-200 p-2.5 rounded-xl">
                <h4 className="font-bold text-indigo-950 flex items-center text-[11px]">
                  💳 How does UPI AutoPay Mandate work?
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                  You pay ₹0 today. Deduction happens at 10:00 PM only for confirmed meals. If skipped before 10 PM, ₹0 is debited.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFtuxInfo(false)}
              className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Back to Pass Configurator
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS & PASS ACTIVATED MODAL */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[360px] bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 text-center space-y-3 relative overflow-hidden animate-in zoom-in-95 duration-250">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF5A1F] via-[#10B981] to-[#4F46E5]" />

            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] border-2 border-[#10B981] flex items-center justify-center mx-auto text-2xl shadow-inner">
              🎉
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Pass Activated Successfully!
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedDuration} Meals • {durationObj.validityDays} Days Buffer
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs flex items-center justify-between">
              <span className="text-slate-600">Loaded into Wallet:</span>
              <span className="font-extrabold text-emerald-700">
                {selectedDuration} Credits {paymentOption !== 'mandate' && `+ ₹${bonusCredits}`}
              </span>
            </div>

            <button
              onClick={handleProceedToAutoPilot}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Build My AI Weekly Meal Playlist ✨</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
