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
  ArrowRight,
  Receipt,
  Play,
  MapPin,
  Building2,
  Home,
  AlertTriangle
} from 'lucide-react';
import { playPop, playSuccessChime, playCelebrationFanfare } from '../utils/audioDelight';
import { SAVED_LOCATIONS } from '../data/mockData';

const HOME_OPTIONS = [
  {
    id: 'green_valley',
    name: 'Green Valley Apt',
    address: 'Flat 402, Tower 4, Park Lane, Sector 50',
    distanceKm: 4.2,
    defaultSlot: '1:30 PM – 2:00 PM',
    type: 'Residence (In-Cluster)',
    isEligible: true,
    tag: 'RECOMMENDED • IN-CLUSTER'
  },
  {
    id: 'whitefield',
    name: 'Whitefield High Gardens',
    address: 'Tower C, Phase 2, Outer Ring Road Expy',
    distanceKm: 11.8,
    defaultSlot: '1:30 PM – 2:00 PM',
    type: 'Suburban Outlier',
    isEligible: false,
    tag: 'OUT OF GEOFENCE (>7 KM)'
  }
];

const TIERS = [
  {
    id: 160,
    label: 'Rasoi',
    price: 160,
    badge: 'Homestyle',
    description: 'Homestyle comfort meals · Dal Khichdi, Phulkas, Curries & Regional Thalis (e.g. Rajshree\'s Bhakri)',
  },
  {
    id: 250,
    label: 'Bistro',
    price: 250,
    badge: 'Most popular',
    isPopular: true,
    description: 'Corporate Thalis, High-Protein Bowls & Fresh Salads (e.g. Paneer Quinoa Bowl)',
  },
  {
    id: 320,
    label: "Chef's Table",
    price: 320,
    badge: "Chef's choice",
    description: 'Artisanal, Pan-Asian Bowls, Grill Platters & Gourmet Specials (e.g. Zen Teriyaki Soba)',
  }
];

const DURATIONS = [
  {
    id: 5,
    days: 5,
    label: '5 lunches',
    discountPct: 5,
    validityDays: 10,
    extraBufferDays: 5,
    tag: null
  },
  {
    id: 10,
    days: 10,
    label: '10 lunches',
    discountPct: 10,
    validityDays: 20,
    extraBufferDays: 10,
    tag: 'Recommended'
  },
  {
    id: 20,
    days: 20,
    label: '20 lunches',
    discountPct: 15,
    validityDays: 35,
    extraBufferDays: 15,
    tag: 'Best value'
  }
];

const SLOTS = [
  { id: '12:30 PM – 1:00 PM', time: '12:30 – 1:00 PM', label: 'Early lunch' },
  { id: '1:00 PM – 1:30 PM', time: '1:00 – 1:30 PM', label: 'Peak pod' },
  { id: '1:30 PM – 2:00 PM', time: '1:30 – 2:00 PM', label: 'Post-standup' }
];

const formatINR = (val) => Number(val).toLocaleString('en-IN');

export default function SubscriptionFTUXFlow({ onCompleteActivation, onOpenIntroSheet, onClose }) {
  const [stage, setStage] = useState(1);
  const [showFtuxInfo, setShowFtuxInfo] = useState(false);

  // Selections
  const [selectedTier, setSelectedTier] = useState(250);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedLunchSlot, setSelectedLunchSlot] = useState('1:00 PM – 1:30 PM');
  const [paymentOption, setPaymentOption] = useState('prepaid'); // 'prepaid' | 'mandate' | 'pluxee'
  const [pluxeeLoadFull, setPluxeeLoadFull] = useState(true);

  // Home Address Selection for Stage 3
  const [selectedHomeId, setSelectedHomeId] = useState('green_valley');
  const selectedHome = HOME_OPTIONS.find((h) => h.id === selectedHomeId) || HOME_OPTIONS[0];

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

  const handleBackStage = () => {
    playPop();
    if (stage === 3) setStage(2);
    else if (stage === 2) setStage(1);
  };

  const handleCompleteCheckout = () => {
    playCelebrationFanfare();
    setShowSuccessModal(true);
  };

  const handleContinueToLocations = () => {
    playSuccessChime();
    setShowSuccessModal(false);
    setStage(3);
  };

  const handleConfirmLocationsAndFinish = () => {
    playCelebrationFanfare();
    const finalLocations = {
      office: SAVED_LOCATIONS.office,
      home: {
        id: 'home',
        label: '🏠 Home',
        name: selectedHome.name,
        address: selectedHome.address,
        defaultSlot: selectedHome.defaultSlot,
        type: 'Residence',
        distanceKm: selectedHome.distanceKm,
        isEligible: selectedHome.isEligible
      }
    };
    if (onCompleteActivation) {
      onCompleteActivation({
        meals: selectedDuration,
        tier: selectedTier,
        netPrice,
        bonusCredits: paymentOption === 'mandate' ? 0 : bonusCredits,
        validityDays: durationObj.validityDays,
        paymentOption,
        locations: finalLocations
      });
    }
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] flex flex-col relative text-slate-900 pb-0 font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Top Header: Step Indicator & Help Trigger */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 sticky top-0 z-30 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {stage > 1 ? (
              <button
                type="button"
                onClick={handleBackStage}
                aria-label="Back to previous step"
                className="w-11 h-11 -ml-2 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : onClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-11 h-11 -ml-2 flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              {stage === 1
                ? 'Customize your pass'
                : stage === 2
                ? 'Payment & activation'
                : 'Delivery hubs & hybrid geofence'}
            </h2>
          </div>

          {/* Right: Help (opens Story & FAQ sheet) */}
          <button
            type="button"
            onClick={() => {
              playPop();
              setShowFtuxInfo(true);
            }}
            className="w-11 h-11 -mr-2 text-slate-600 hover:text-[#C2410C] rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Help & FAQ"
            title="Help & FAQ"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Segment Progress Bar */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>
              {stage === 1
                ? 'Step 1 of 3: Pass config'
                : stage === 2
                ? 'Step 2 of 3: Payment method'
                : 'Step 3 of 3: Delivery hubs'}
            </span>
            <span>{stage === 1 ? '33%' : stage === 2 ? '66%' : '100%'}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
            <div className={`h-full rounded-full ${stage >= 1 ? 'bg-[#FF5A1F]' : 'bg-slate-200'}`} />
            <div className={`h-full rounded-full ${stage >= 2 ? 'bg-[#FF5A1F]' : 'bg-slate-200'}`} />
            <div className={`h-full rounded-full ${stage >= 3 ? 'bg-[#FF5A1F]' : 'bg-slate-200'}`} />
          </div>
        </div>
      </div>

      {/* STAGE 1: PASS CONFIGURATOR */}
      {stage === 1 && (
        <div className="px-4 py-3.5 space-y-4 pb-28 animate-in fade-in duration-200">
          {/* Summary Card (replaces dark hero) */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedDuration} lunches, valid for {durationObj.validityDays} days
              </h3>
              <span className="text-xs font-bold text-[#047857] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                Save ₹{formatINR(totalPocketSavings)}*
              </span>
            </div>

            {/* Two-colour progress bar: Lunches + Extra buffer days */}
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#FF5A1F] h-full transition-all duration-300"
                  style={{ width: `${(selectedDuration / durationObj.validityDays) * 100}%` }}
                />
                <div
                  className="bg-[#10B981] h-full transition-all duration-300"
                  style={{ width: `${(durationObj.extraBufferDays / durationObj.validityDays) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A1F] inline-block" />
                  <span>{selectedDuration} lunches</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                  <span>{durationObj.extraBufferDays} extra days</span>
                </span>
              </div>
            </div>

            {/* Benefit line */}
            <div className="pt-1.5 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span>Skip free until 10 PM the night before</span>
              <span className="text-xs text-slate-500">*incl. free delivery</span>
            </div>
          </div>

          {/* 1. Your budget per lunch */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              Your budget per lunch
            </h4>

            {/* Tier Tiles */}
            <div className="grid grid-cols-3 gap-2">
              {TIERS.map((tier) => {
                const isSelected = selectedTier === tier.price;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleTierSelect(tier.price)}
                    className={`rounded-xl p-2.5 text-left transition-all relative border flex flex-col justify-between min-h-[96px] cta-bounce cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF5F0] border-2 border-[#FF5A1F] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Badge & Selection check */}
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        tier.isPopular
                          ? 'bg-[#FF5A1F]/10 text-[#C2410C] font-extrabold'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tier.badge}
                      </span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {tier.label}
                      </div>
                      <div className="text-sm font-extrabold text-[#C2410C] mt-0.5 tabular-nums">
                        ₹{formatINR(tier.price)}
                        <span className="text-xs font-normal text-slate-600">/meal</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Shared dynamic description (Full text, no ellipsis) */}
            <p className="text-xs text-slate-600 leading-snug px-0.5">
              {tierObj.description}
            </p>

            {/* Neutral callout */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-700 flex items-center justify-between">
              <span>Pick a dish under ₹{formatINR(selectedTier)} and the difference goes to your wallet.</span>
              <span className="font-bold text-[#C2410C] shrink-0 ml-2">100% retained</span>
            </div>
          </div>

          {/* 2. Number of lunches */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                Number of lunches
              </h4>
              <span className="text-xs font-semibold text-[#047857]">
                Free delivery on every pass
              </span>
            </div>

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
                    className={`rounded-xl p-3 border cursor-pointer transition-all flex items-center justify-between cta-bounce ${
                      isSelected
                        ? 'bg-[#FFF5F0] border-2 border-[#FF5A1F] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Radio Indicator */}
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
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">
                            {dur.label}
                          </span>
                          {dur.tag && (
                            <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-emerald-200 px-1.5 py-0.2 rounded-full">
                              {dur.tag}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 mt-0.5">
                          {dur.discountPct}% off · valid for {dur.validityDays} days
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        ₹{formatINR(finalPassPrice)}
                      </div>
                      <div className="text-xs font-bold text-[#C2410C] tabular-nums">
                        ₹{formatINR(costPerMeal)}/meal
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Delivery window (30 min) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              Delivery window (30 min)
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((slot) => {
                const isSelected = selectedLunchSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      playPop();
                      setSelectedLunchSlot(slot.id);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all relative cta-bounce cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF5F0] border-2 border-[#FF5A1F] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#C2410C] absolute top-2 right-2" />
                    )}
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {slot.time}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {slot.label}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-600 px-0.5">
              On office days, deliveries are batched to your lobby.
            </p>
          </div>

          {/* 4. Price breakdown (Single clean container, no nested card boxes) */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              Price
            </h4>

            {/* Line 1: Allowance */}
            <div className="flex items-center justify-between text-slate-700">
              <span>{selectedDuration} lunches × ₹{formatINR(selectedTier)}</span>
              <span className="font-semibold text-slate-900 tabular-nums">₹{formatINR(baseCost)}</span>
            </div>

            {/* Line 2: Pass Discount */}
            <div className="flex items-center justify-between text-[#047857]">
              <span>{durationObj.discountPct}% off</span>
              <span className="tabular-nums font-semibold">−₹{formatINR(discountAmount)}</span>
            </div>

            {/* Line 3: Delivery */}
            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery ({selectedDuration} × ₹40)</span>
              <div className="flex items-center space-x-1.5">
                <span className="line-through text-slate-400 tabular-nums">₹{formatINR(deliverySaved)}</span>
                <span className="font-bold text-[#047857]">Free</span>
              </div>
            </div>

            {/* Divider & Total */}
            <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">
                  Total
                </span>
                <span className="text-xs text-slate-600">
                  ₹{formatINR(effectiveMealPrice)} per lunch, all-inclusive
                </span>
              </div>
              <span className="text-base font-extrabold text-slate-950 tabular-nums">
                ₹{formatINR(netPrice)}
              </span>
            </div>

            {/* Clean benefit lines below total (no boxes) */}
            <div className="pt-1.5 space-y-1 text-xs">
              <div className="text-[#047857] font-semibold">
                You save ₹{formatINR(totalPocketSavings)} (₹{formatINR(discountAmount)} off + ₹{formatINR(deliverySaved)} free delivery)
              </div>
              <div className="text-slate-700 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Pay upfront: +₹{formatINR(bonusCredits)} wallet cash (5%)</span>
              </div>
            </div>

            {/* Contextual FAQ link */}
            <div className="pt-1 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setShowFtuxInfo(true);
                }}
                className="text-xs text-slate-600 hover:text-[#C2410C] transition-colors inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>Questions about cut-off or rollovers?</span>
                <span className="text-[#C2410C] font-semibold underline inline-flex items-center">
                  View FAQ <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: PAYMENT SELECTION (VISUAL SOLUTIONS, LESS TEXT) */}
      {stage === 2 && (
        <div className="px-4 py-3 space-y-3 pb-28 animate-in fade-in duration-200">
          {/* Summary Strip */}
          <div className="bg-white rounded-2xl p-2.5 px-3 border border-slate-200 flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs font-extrabold text-slate-900">
                {selectedDuration} Meals • {tierObj.label} (₹{formatINR(selectedTier)}/meal)
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                valid for {durationObj.validityDays} days
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
                ₹{formatINR(netPrice)}
              </span>
            </div>

            {/* Visual 3-Pill Benefit Row (No Text Blocks!) */}
            <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-bold">
              <div className="bg-white p-1.5 rounded-lg border border-[#10B981]/30 text-emerald-900">
                🎁 +₹{formatINR(bonusCredits)} Cash
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
                  ₹{formatINR(effectiveMealPrice)} deducted
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

      {/* STAGE 3: LOCATION HUBS & HYBRID GEOFENCE SETUP */}
      {stage === 3 && (
        <div className="px-4 py-3 space-y-3 pb-28 animate-in fade-in duration-200">
          {/* A. Compact Glanceable Hero */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-3 text-white flex items-center justify-between shadow-xs border border-slate-700/80">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full uppercase">
                  3-2 Hybrid Ready
                </span>
                <span className="text-[10px] text-slate-300 font-bold">100% ₹0 Delivery</span>
              </div>
              <h2 className="text-xs font-black text-white mt-0.5">
                Your Delivery Hubs
              </h2>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">
              📍
            </div>
          </div>

          {/* B. Primary Office Location Card (Office Pod) */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                    Office Pod (Workplace)
                  </h3>
                  <span className="text-[10px] text-slate-500">Cyber Park Tower B, Sector 62</span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                Verified Pod
              </span>
            </div>

            {/* 3 Visual Micro-Pills */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold">
              <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100 text-slate-700 flex flex-col items-center justify-center">
                <Clock className="w-3 h-3 text-blue-600 mb-0.5" />
                <span>1:00 PM Drop</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100 text-slate-700 flex flex-col items-center justify-center">
                <Lock className="w-3 h-3 text-indigo-600 mb-0.5" />
                <span>Smart Locker</span>
              </div>
              <div className="bg-emerald-50 rounded-lg p-1.5 border border-emerald-100 text-emerald-800 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 mb-0.5" />
                <span>₹0 Batch Fee</span>
              </div>
            </div>
          </div>

          {/* C. Primary Residence / Home with Visual Geofence Gauge */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                    Home Address (WFH Days)
                  </h3>
                  <span className="text-[10px] text-slate-500">7 km cluster serviceability</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-400">Tap to toggle</span>
            </div>

            {/* 2 Segmented Quick-Choice Cards */}
            <div className="grid grid-cols-2 gap-2">
              {HOME_OPTIONS.map((opt) => {
                const isSelected = selectedHomeId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      playPop();
                      setSelectedHomeId(opt.id);
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? opt.isEligible
                          ? 'bg-emerald-50/70 border-2 border-emerald-500 shadow-2xs'
                          : 'bg-rose-50/70 border-2 border-rose-500 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-900 truncate">
                        {opt.name}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          opt.isEligible ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-rose-500 ring-2 ring-rose-200'
                        }`}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 block truncate mt-0.5">
                      {opt.address}
                    </span>
                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-bold">
                      <span className={opt.isEligible ? 'text-emerald-700' : 'text-rose-700'}>
                        {opt.distanceKm} km
                      </span>
                      <span className={`px-1 rounded text-[8px] ${opt.isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {opt.isEligible ? 'In-Cluster' : '> 7 km'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Cluster Distance Bar */}
            <div className={`p-2 rounded-xl border space-y-1.5 ${
              selectedHome.isEligible ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-extrabold">
                <span className="flex items-center text-slate-800">
                  <MapPin className={`w-3 h-3 mr-1 ${selectedHome.isEligible ? 'text-emerald-600' : 'text-rose-600'}`} />
                  Distance: <strong>{selectedHome.distanceKm} km</strong>
                </span>
                <span className={selectedHome.isEligible ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                  {selectedHome.isEligible ? '✅ ₹0 Free Switching' : '⚠️ Out of Geofence'}
                </span>
              </div>

              {/* Meter Gauge */}
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    selectedHome.isEligible ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min((selectedHome.distanceKm / 14) * 100, 100)}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10"
                  style={{ left: '50%' }}
                  title="7 km Limit"
                />
              </div>

              <div className="flex items-center justify-between text-[8px] font-bold text-slate-400">
                <span>0 km (Kitchen Hub)</span>
                <span className="text-slate-700">7 km Free Cap</span>
                <span>14 km</span>
              </div>

              {/* 1-Line Outcome */}
              <div className="pt-0.5 text-[9px] leading-tight">
                {selectedHome.isEligible ? (
                  <span className="text-emerald-900 font-medium">
                    ⚡ <strong>Same Kitchen Cluster:</strong> Cooks in morning batch prep with office orders for 100% free delivery.
                  </span>
                ) : (
                  <span className="text-rose-900 font-medium">
                    ⚠️ <strong>Beyond 7 km:</strong> Requires point-to-point courier (₹65). Use 100% WFH Pause Rollover or ₹29 routing fee.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* D. Visual 3-Pill Operational Rules Card */}
          <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Hybrid Switching Rules
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                <span className="text-xs">📍</span>
                <div className="font-extrabold text-slate-900 text-[9.5px] mt-0.5">≤ 7 km Hub</div>
                <span className="text-[8px] text-slate-500 block">₹0 batch delivery</span>
              </div>

              <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                <span className="text-xs">⏰</span>
                <div className="font-extrabold text-slate-900 text-[9.5px] mt-0.5">10 PM Lock</div>
                <span className="text-[8px] text-slate-500 block">1-tap night flip</span>
              </div>

              <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                <span className="text-xs">📦</span>
                <div className="font-extrabold text-slate-900 text-[9.5px] mt-0.5">30m Waves</div>
                <span className="text-[8px] text-slate-500 block">1 PM Pod • 1:30 Home</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM CHECKOUT CTA DOCKED AT BOTTOM OF PHONE */}
      <div className="sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 pb-6 sm:pb-3.5 pb-[max(1.5rem,env(safe-area-inset-bottom,20px))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-20 mt-auto">
        {stage === 1 ? (
          <div className="space-y-1.5">
            {/* Live summary line */}
            <div className="text-xs font-semibold text-slate-600 text-center">
              {selectedDuration} lunches · ₹{formatINR(effectiveMealPrice)} each · Save ₹{formatINR(totalPocketSavings)}
            </div>
            <button
              type="button"
              onClick={handleGoToPayment}
              className="w-full min-h-[48px] bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Continue to payment · ₹{formatINR(netPrice)}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : stage === 2 ? (
          <button
            type="button"
            onClick={handleCompleteCheckout}
            className={`w-full min-h-[48px] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer ${
              paymentOption === 'prepaid'
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                : paymentOption === 'mandate'
                ? 'bg-gradient-to-r from-[#4F46E5] to-[#4338CA]'
                : 'bg-gradient-to-r from-amber-600 to-amber-700'
            }`}
          >
            {paymentOption === 'prepaid' && (
              <span>Pay ₹{formatINR(netPrice)} & Claim +₹{formatINR(bonusCredits)} Bonus Cash →</span>
            )}
            {paymentOption === 'mandate' && (
              <span>Setup 10 PM UPI Mandate (₹0 Today) →</span>
            )}
            {paymentOption === 'pluxee' && (
              <span>Pay ₹{formatINR(netPrice)} via Pluxee →</span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmLocationsAndFinish}
            className="w-full min-h-[48px] bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm Hubs & Build My AI Playlist ✨ ➔</span>
          </button>
        )}
      </div>

      {/* FTUX & BILLING FAQ DRAWER (SLIDE-IN MODAL) */}
      {showFtuxInfo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Help & frequently asked questions"
          className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setShowFtuxInfo(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-100 max-h-[85%] overflow-y-auto space-y-3.5 animate-in slide-in-from-bottom duration-250 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-[#C2410C]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Help & frequently asked questions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFtuxInfo(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close help"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 15s Story Walkthrough Video Trigger */}
            {onOpenIntroSheet && (
              <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-amber-950">
                    New to scheduled meals?
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Watch the 15-second walkthrough to see how smart cut-offs and batching work.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setShowFtuxInfo(false);
                    onOpenIntroSheet();
                  }}
                  className="px-3 py-1.5 bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 ml-3 flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Watch</span>
                </button>
              </div>
            )}

            {/* Clean Visual Q&A Cards */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <h4 className="font-bold text-slate-900 flex items-center text-xs">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C2410C]" />
                  What is the 10:00 PM cut-off?
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Partner cloud kitchens procure fresh ingredients and batch-cook overnight. You can swap dishes, flip locations, or skip meals for free before 10:00 PM.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <h4 className="font-bold text-slate-900 flex items-center text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#047857]" />
                  What happens when I skip a meal?
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Under our Quota Preservation model, your meal is not consumed—it stays in your pass pack and your validity extends +1 day into your buffer. Any unconsumed meals at the end of your validity window convert to wallet balance. For UPI Mandates, the 10 PM debit is canceled (₹0 charged).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <h4 className="font-bold text-slate-900 flex items-center text-xs">
                  <CreditCard className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  How does UPI AutoPay Mandate work?
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  You pay ₹0 today. Deduction happens at 10:00 PM only for confirmed meals. If skipped before 10 PM, ₹0 is charged.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFtuxInfo(false)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Back to pass configurator
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
              <span className="text-slate-600">
                {paymentOption === 'mandate' ? 'Pass includes:' : 'Loaded into Wallet:'}
              </span>
              <span className="font-extrabold text-emerald-700">
                {paymentOption === 'mandate'
                  ? `${selectedDuration} scheduled meals`
                  : `${selectedDuration} Credits + ₹${bonusCredits}`}
              </span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 text-left text-[11px] text-indigo-900 space-y-1">
              <span className="font-bold flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Next: Set Delivery Hubs
              </span>
              <p className="text-[10px] text-indigo-700 leading-tight">
                Configure your Office Pod and Home location with 7 km geofence verification for ₹0 hybrid switching.
              </p>
            </div>

            <button
              onClick={handleContinueToLocations}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Setup Delivery Hubs (Step 3 of 3) →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
