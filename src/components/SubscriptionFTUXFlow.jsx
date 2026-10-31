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
  Building2,
  Calendar,
  Lock,
  Gift,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare, playShieldBankChime } from '../utils/audioDelight';

const TIERS = [
  {
    id: 160,
    label: 'Comfort',
    price: 160,
    subtext: 'Homestyle Tiffins, Dal Khichdi, Roti-Sabzi',
    sampleDish: "Rajshree's Bajari Bhakri Meal • ₹155",
    tag: 'Budget Friendly',
    badgeColor: 'bg-slate-100 text-slate-700'
  },
  {
    id: 250,
    label: 'Balanced',
    price: 250,
    subtext: 'Corporate Thalis, Paneer Bowls, Wraps',
    sampleDish: 'Paneer Tikka Quinoa Bowl • ₹230',
    tag: '🔥 MOST POPULAR',
    isPopular: true,
    badgeColor: 'bg-[#FFF5F0] text-[#FF5A1F] border border-[#FF5A1F]/30'
  },
  {
    id: 320,
    label: 'Macro Pro',
    price: 320,
    subtext: '30g+ Protein Bowls, Keto, Gourmet Salads',
    sampleDish: 'Grilled Tofu & Edamame Bowl • ₹310',
    tag: '30g+ Protein',
    badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }
];

const DURATIONS = [
  {
    id: 5,
    days: 5,
    label: '5-Meal Pass',
    sublabel: '1 Working Week',
    discountPct: 5,
    validityDays: 10,
    discountBadge: 'SAVE 5% + FREE DELIVERY',
    tag: null
  },
  {
    id: 10,
    days: 10,
    label: '10-Meal Pass',
    sublabel: '2 Working Weeks',
    discountPct: 10,
    validityDays: 20,
    discountBadge: 'SAVE 10% + FREE DELIVERY',
    tag: 'RECOMMENDED'
  },
  {
    id: 20,
    days: 20,
    label: '20-Meal Pass',
    sublabel: '4 Working Weeks',
    discountPct: 15,
    validityDays: 35,
    discountBadge: 'SAVE 15% + FREE DELIVERY',
    tag: '👑 MAX SAVINGS'
  }
];

export default function SubscriptionFTUXFlow({ onCompleteActivation, onClose }) {
  // Navigation: Stage 1 (Configurator) -> Stage 2 (Payment)
  const [stage, setStage] = useState(1);
  const [showFtuxInfo, setShowFtuxInfo] = useState(false);

  // Selections
  const [selectedTier, setSelectedTier] = useState(250); // Default ₹250
  const [selectedDuration, setSelectedDuration] = useState(10); // Default 10 Meals
  const [paymentOption, setPaymentOption] = useState('prepaid'); // 'prepaid' | 'mandate' | 'pluxee'
  const [pluxeeLinked, setPluxeeLinked] = useState(true);
  const [pluxeeLoadFull, setPluxeeLoadFull] = useState(true);

  // Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculations (with tabular numerals)
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
      {/* Top Header: Step Indicator & FTUX Info Pill */}
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F]">
              {stage === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
            </span>
            <h2 className="text-xs font-extrabold text-slate-900 leading-tight">
              {stage === 1 ? 'Customize Your Pass' : 'Payment & Activation'}
            </h2>
          </div>
        </div>

        {/* Right Info Drawer Toggle */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              playPop();
              setShowFtuxInfo(true);
            }}
            className="flex items-center space-x-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full border border-slate-200 transition-colors"
          >
            <Info className="w-3 h-3 text-[#FF5A1F]" />
            <span>FTUX Info</span>
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

      {/* STAGE 1: FIRST-TIME USER EXPERIENCE & PASS CONFIGURATOR */}
      {stage === 1 && (
        <div className="px-4 py-3 space-y-3.5 animate-in fade-in duration-200">
          {/* A. Compact FTUX Value Banner (Top Dark Card) */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-md border border-slate-700/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5A1F]/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-extrabold bg-[#FF5A1F]/20 text-[#FF7B47] border border-[#FF5A1F]/40 px-2 py-0.5 rounded-full flex items-center shadow-xs">
                ✨ NEW: FLEXIBLE SCHEDULED MEALS
              </span>
              <span className="text-[9px] text-slate-400 font-semibold">Zero Lock-In</span>
            </div>

            <h1 className="text-sm font-extrabold text-white tracking-tight leading-snug">
              Never Overpay or Lose a Skipped Meal
            </h1>

            {/* 3 Horizontal Pill Highlights */}
            <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-800 text-[9px] font-bold text-slate-200">
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 text-center leading-tight">
                <span className="block text-emerald-400">🛡️ Up to 35-Day</span> Validity Buffer
              </div>
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 text-center leading-tight">
                <span className="block text-amber-400">💰 Unused ₹</span> Rolls to Wallet
              </div>
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 text-center leading-tight">
                <span className="block text-[#FF5A1F]">⏰ Free Skip</span> till 10 PM
              </div>
            </div>
          </div>

          {/* B. Interactive Step 1: Select Daily Meal Allowance Tier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FF5A1F] text-white text-[10px] font-extrabold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                  Choose Daily Meal Allowance Cap
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">Pick cuisine level</span>
            </div>

            {/* 3-Column Segmented Card Selector */}
            <div className="grid grid-cols-3 gap-2">
              {TIERS.map((tier) => {
                const isSelected = selectedTier === tier.price;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleTierSelect(tier.price)}
                    className={`rounded-2xl p-2.5 cursor-pointer transition-all relative border flex flex-col justify-between cta-bounce ${
                      isSelected
                        ? 'bg-[#FFF5F0]/80 border-2 border-[#FF5A1F] shadow-sm ring-2 ring-[#FF5A1F]/20 scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top pill badge */}
                    {tier.isPopular ? (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-extrabold bg-[#FF5A1F] text-white px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-xs">
                        POPULAR
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                        {tier.tag}
                      </span>
                    )}

                    <div className="mt-1">
                      <div className="text-xs font-extrabold text-slate-900 leading-tight">
                        {tier.label}
                      </div>
                      <div className="text-sm font-extrabold text-[#FF5A1F] mt-0.5 tabular-nums">
                        ₹{tier.price}
                        <span className="text-[9px] font-medium text-slate-500">/meal</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-500 mt-1 leading-snug line-clamp-2">
                      {tier.subtext}
                    </p>

                    <div className="mt-1.5 pt-1 border-t border-slate-100 text-[8px] font-semibold text-slate-600 truncate">
                      {tier.sampleDish}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inline Helper Banner */}
            <div className="bg-[#FFFBEB] border border-amber-200/80 rounded-xl p-2 text-[10px] text-amber-900 flex items-start space-x-1.5">
              <span className="text-xs shrink-0 select-none">💡</span>
              <p className="leading-snug">
                Pick a dish cheaper than your <strong>₹{selectedTier} cap</strong>? The remaining balance goes straight to your MealsOn Wallet!
              </p>
            </div>
          </div>

          {/* C. Interactive Step 2: Select Pass Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FF5A1F] text-white text-[10px] font-extrabold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                  Select Pass Duration (5-Day Workweeks)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 font-bold">Free Delivery</span>
            </div>

            {/* 3 Vertical Selectable Radio Cards */}
            <div className="space-y-2">
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
                    className={`rounded-2xl p-3 border cursor-pointer transition-all flex items-center justify-between cta-bounce ${
                      isSelected
                        ? 'bg-white border-2 border-[#FF5A1F] shadow-sm ring-2 ring-[#FF5A1F]/15'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      {/* Custom Radio Circle */}
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border transition-all ${
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
                          <span className="text-[10px] text-slate-500">
                            ({dur.sublabel})
                          </span>
                          {dur.tag && (
                            <span className="text-[8px] font-extrabold bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30 px-1.5 py-0.2 rounded-full">
                              {dur.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5 mt-1">
                          <span className="text-[9px] font-bold bg-[#ECFDF5] text-emerald-800 px-1.5 py-0.2 rounded">
                            {dur.discountBadge}
                          </span>
                          <span className="text-[9px] font-medium text-slate-500">
                            ⏳ {dur.validityDays}d Buffer
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Readout */}
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 line-through tabular-nums">
                        ₹{baseVal}
                      </div>
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

          {/* D. Live Transparency & Savings Receipt Card (Auto-Updating) */}
          <div className="bg-[#F0FDF4] border border-dashed border-[#BBF7D0] rounded-2xl p-3 text-xs text-slate-800 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Base Meal Value ({selectedDuration} meals × ₹{selectedTier})</span>
              <span className="font-semibold text-slate-900 tabular-nums">₹{baseCost}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span>Pass Discount ({durationObj.discountPct}%)</span>
              <span className="tabular-nums">- ₹{discountAmount}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span>Scheduled Pass Delivery Fee ({selectedDuration} × ₹40)</span>
              <span>₹0 <span className="text-[9px] text-slate-400 font-normal line-through">₹{deliverySaved}</span></span>
            </div>

            <div className="border-t border-[#BBF7D0] pt-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Net Pass Price</span>
              <span className="text-base font-extrabold text-slate-950 tabular-nums">
                ₹{netPrice}
              </span>
            </div>

            {/* Total Savings Callout */}
            <div className="bg-[#DCFCE7] text-emerald-950 font-extrabold text-[10px] p-1.5 rounded-lg flex items-center justify-between">
              <span>🎉 You save ₹{totalPocketSavings} on this pass!</span>
              <span className="bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                MAX VALUE
              </span>
            </div>

            {/* Bonus Prepaid Callout */}
            <div className="text-[10px] text-emerald-800 font-bold flex items-center space-x-1 pt-0.5">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              <span>Pay upfront on next step to get <strong>+₹{bonusCredits}</strong> MealsOn Credits!</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: CONVERSION-OPTIMIZED PAYMENT SELECTION SCREEN */}
      {stage === 2 && (
        <div className="px-4 py-3 space-y-3.5 animate-in fade-in duration-200">
          {/* Summary Header of Selected Pass */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Active Pass Selection
              </span>
              <div className="text-xs font-extrabold text-slate-900">
                {selectedDuration} Meals Pass • ₹{selectedTier}/day Cap
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                {durationObj.validityDays} Calendar Days Buffer
              </span>
            </div>

            <button
              onClick={handleBackToConfig}
              className="text-[10px] font-bold text-[#FF5A1F] hover:underline bg-[#FFF5F0] border border-[#FF5A1F]/30 px-2 py-1 rounded-lg"
            >
              ← Edit Pass
            </button>
          </div>

          {/* Payment Option 1 (HERO FOCUS): Upfront Prepaid Pack */}
          <div
            onClick={() => {
              playPop();
              setPaymentOption('prepaid');
            }}
            className={`rounded-2xl p-3.5 border cursor-pointer transition-all relative ${
              paymentOption === 'prepaid'
                ? 'bg-[#ECFDF5]/50 border-2 border-[#10B981] shadow-md ring-2 ring-[#10B981]/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Top Right Floating Badge */}
            <span className="absolute -top-2 right-3 text-[9px] font-extrabold bg-[#10B981] text-white px-2 py-0.5 rounded-full shadow-xs">
              ⭐ RECOMMENDED • +5% EXTRA CREDITS
            </span>

            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border ${
                    paymentOption === 'prepaid'
                      ? 'border-[#10B981] bg-[#10B981]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {paymentOption === 'prepaid' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                    Pay Upfront (Prepaid Pass)
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Pay ₹{netPrice} once via UPI, Cards, or NetBanking
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                ₹{netPrice}
              </span>
            </div>

            {/* Value Prop Box inside Card */}
            <div className="mt-2.5 bg-white/80 border border-[#10B981]/30 rounded-xl p-2.5 text-[10px] text-slate-700 space-y-1.5">
              <div className="flex items-start space-x-1.5 font-bold text-emerald-900">
                <Gift className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span>Instant Bonus: Get <strong>+₹{bonusCredits} MealsOn Credits</strong> added to your in-app wallet immediately!</span>
              </div>
              <p className="text-slate-600 pl-5 leading-snug">
                Use credits for drinks, sides, or upgrading dishes above your ₹{selectedTier} cap.
              </p>
              <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold pl-5 pt-0.5">
                <ShieldCheck className="w-3 h-3 text-[#10B981] shrink-0" />
                <span>Protected by Pause Shield: 100% of unused meals safe for {durationObj.validityDays} days.</span>
              </div>
            </div>

            {/* Quick Payment Sub-Pills */}
            <div className="flex items-center gap-1.5 mt-2.5 pt-1.5 border-t border-emerald-100 overflow-x-auto hide-scrollbar">
              {['GPay', 'PhonePe', 'Visa / Mastercard', 'CRED Pay'].map((pill) => (
                <span
                  key={pill}
                  className="text-[9px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Payment Option 2: UPI AutoPay Mandate (10:00 PM Daily Cut-Off Deduction) */}
          <div
            onClick={() => {
              playPop();
              setPaymentOption('mandate');
            }}
            className={`rounded-2xl p-3.5 border cursor-pointer transition-all relative ${
              paymentOption === 'mandate'
                ? 'bg-[#EEF2FF]/50 border-2 border-[#4F46E5] shadow-md ring-2 ring-[#4F46E5]/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border ${
                    paymentOption === 'mandate'
                      ? 'border-[#4F46E5] bg-[#4F46E5]'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {paymentOption === 'mandate' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                    UPI AutoPay Mandate (Pay-As-You-Eat)
                  </h4>
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded inline-block mt-0.5">
                    ₹0 Upfront Today • Keep {durationObj.discountPct}% Pass Discount
                  </span>
                </div>
              </div>

              <span className="text-xs font-extrabold text-indigo-900 tabular-nums">
                ₹0 Today
              </span>
            </div>

            {/* Mandatory 10:00 PM Deduction Callout Box (Indigo/Amber Highlight) */}
            <div className="mt-2.5 bg-white border border-indigo-200 rounded-xl p-2.5 text-[10px] text-slate-700 space-y-1">
              <div className="flex items-start space-x-1.5 font-bold text-indigo-950">
                <Clock className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                <span>⏰ How 10:00 PM Billing Works:</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-5">
                You pay <strong>₹0 today</strong>. Money (<strong>₹{effectiveMealPrice}/meal</strong>) is automatically deducted from your UPI account at exactly <strong>10:00 PM</strong> the night before each scheduled delivery. <strong>If you skip a meal before 10:00 PM, ₹0 is deducted!</strong>
              </p>
              <p className="text-[9px] text-slate-400 italic pl-5 pt-0.5">
                Note: +5% Bonus MealsOn Credits apply only to Upfront Prepaid packs.
              </p>
            </div>
          </div>

          {/* Payment Option 3: Corporate Meal Cards (Pluxee / Sodexo / Zaggle) */}
          <div
            onClick={() => {
              playPop();
              setPaymentOption('pluxee');
            }}
            className={`rounded-2xl p-3.5 border cursor-pointer transition-all ${
              paymentOption === 'pluxee'
                ? 'bg-amber-50/50 border-2 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border ${
                    paymentOption === 'pluxee'
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {paymentOption === 'pluxee' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                    Pluxee (Sodexo) / Zaggle Meal Card
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Use your tax-free corporate food allowance
                  </p>
                </div>
              </div>

              <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                TAX FREE
              </span>
            </div>

            {/* Interactive Connected Card View */}
            {paymentOption === 'pluxee' && (
              <div className="mt-2.5 bg-white border border-amber-200 rounded-xl p-2.5 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-800 flex items-center">
                    <CreditCard className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Pluxee Card •••• 4821
                  </span>
                  <span className="font-bold text-emerald-700">Balance: ₹6,450</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-600">Load full ₹{netPrice} upfront:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPluxeeLoadFull(!pluxeeLoadFull);
                      playPop();
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      pluxeeLoadFull ? 'bg-[#10B981]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        pluxeeLoadFull ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                {pluxeeLoadFull && (
                  <p className="text-[9px] text-emerald-800 font-semibold">
                    🎉 +Get 5% (+₹{bonusCredits}) Bonus MealsOn Credits with full reload!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STICKY BOTTOM CHECKOUT CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] z-20">
        {stage === 1 ? (
          <button
            onClick={handleGoToPayment}
            className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5"
          >
            <span>Continue to Payment • ₹{netPrice}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCompleteCheckout}
            className={`w-full text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.97] cta-bounce flex items-center justify-center space-x-1.5 ${
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
              <span>Setup 10 PM UPI Mandate (₹0 Now) →</span>
            )}
            {paymentOption === 'pluxee' && (
              <span>Pay ₹{netPrice} via Pluxee Card →</span>
            )}
          </button>
        )}
      </div>

      {/* FTUX INFO DRAWER (SLIDE-IN MODAL) */}
      {showFtuxInfo && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-100 max-h-[85%] overflow-y-auto space-y-3.5 animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🥗</span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  How Scheduled Meals Work
                </h3>
              </div>
              <button
                onClick={() => setShowFtuxInfo(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="bg-[#FFF5F0] border border-[#FF5A1F]/30 p-2.5 rounded-xl">
                <h4 className="font-bold text-[#FF5A1F] flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  1. Zero Decision Fatigue
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Meals are pre-curated based on your nutritional goal and rotated across top cloud kitchens so you never eat the same meal twice in a week.
                </p>
              </div>

              <div className="bg-[#ECFDF5] border border-emerald-300 p-2.5 rounded-xl">
                <h4 className="font-bold text-emerald-900 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#10B981]" />
                  2. 35-Day Flexible Pause Buffer
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Working from home? Going on vacation? Skip anytime before 10:00 PM. 100% of your money stays safe in your Pause Shield wallet.
                </p>
              </div>

              <div className="bg-[#EEF2FF] border border-indigo-200 p-2.5 rounded-xl">
                <h4 className="font-bold text-indigo-950 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#4F46E5]" />
                  3. 10:00 PM Zero-Waste Cutoff
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Kitchens purchase fresh produce based only on confirmed orders. No cold stored food, zero kitchen waste, 40% lower delivery costs.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFtuxInfo(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md"
            >
              Got It, Back to Customizer
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS & PASS ACTIVATED MODAL */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[370px] bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 text-center space-y-3 relative overflow-hidden animate-in zoom-in-95 duration-250">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF5A1F] via-[#10B981] to-[#4F46E5]" />

            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border-2 border-[#10B981] flex items-center justify-center mx-auto text-2xl shadow-inner">
              🎉
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Pass Activated Successfully!
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Your Scheduled Meals pass is now active.
              </p>
            </div>

            {/* Active Pass Card Details */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  {selectedDuration} Meals • ₹{selectedTier}/meal Cap
                </span>
                <span className="text-[10px] font-extrabold bg-[#10B981] text-white px-1.5 py-0.2 rounded">
                  ACTIVE
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                Buffer Validity: <strong>{durationObj.validityDays} Calendar Days</strong>
              </div>

              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Wallet Balance:</span>
                <span className="font-bold text-emerald-700">
                  {selectedDuration} Meal Credits {paymentOption !== 'mandate' && `+ ₹${bonusCredits} Cash`}
                </span>
              </div>
            </div>

            {/* Primary Action Button linking to AI Auto-Pilot */}
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
