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
    subtext: 'Homestyle • Dal Khichdi',
    sampleDish: "Rajshree's Bhakri • ₹155",
    tag: 'HOMESTYLE',
  },
  {
    id: 250,
    label: 'Bistro',
    price: 250,
    subtext: 'Corporate Thalis • Bowls',
    sampleDish: 'Paneer Quinoa Bowl • ₹230',
    tag: 'MOST POPULAR',
    isPopular: true,
  },
  {
    id: 320,
    label: "Chef's Table",
    price: 320,
    subtext: 'Artisanal • Pan-Asian • Craft',
    sampleDish: 'Zen Teriyaki Soba • ₹310',
    tag: 'SIGNATURE',
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
      {/* Top Header: Step Indicator & FAQ Toggle */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          {stage > 1 && (
            <button
              onClick={handleBackStage}
              className="p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A1F]">
              {stage === 1 ? 'Step 1 of 3' : stage === 2 ? 'Step 2 of 3' : 'Step 3 of 3'}
            </span>
            <h2 className="text-xs font-extrabold text-slate-900 leading-tight">
              {stage === 1
                ? 'Customize Your Pass'
                : stage === 2
                ? 'Payment & Activation'
                : 'Delivery Hubs & Hybrid Geofence'}
            </h2>
          </div>
        </div>

        {/* Right FAQ & 15s Story Link */}
        <div className="flex items-center space-x-1.5">
          {onOpenIntroSheet && (
            <button
              onClick={() => {
                playPop();
                onOpenIntroSheet();
              }}
              className="flex items-center space-x-1 text-[10px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-full border border-amber-200 transition-colors"
            >
              <Play className="w-2.5 h-2.5 fill-current text-amber-600" />
              <span>15s Story</span>
            </button>
          )}

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

          {/* D. Live Savings Receipt Card (Mathematically Accurate & Transparent UX) */}
          <div className="bg-gradient-to-b from-[#F0FDF4] to-[#ECFDF5] border border-[#BBF7D0] rounded-2xl p-3.5 text-xs text-slate-800 space-y-2 shadow-xs">
            {/* Header / Receipt Title */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-800 pb-1.5 border-b border-[#BBF7D0]/70">
              <span className="flex items-center space-x-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pass Price Breakdown</span>
              </span>
              <span className="text-emerald-800 font-extrabold bg-emerald-100/90 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                {selectedDuration} Meals Plan
              </span>
            </div>

            {/* Line 1: Base Meals Value */}
            <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium">
              <span>Meal Allowance ({selectedDuration} Meals × ₹{selectedTier} Cap)</span>
              <span className="font-bold text-slate-900 tabular-nums">₹{baseCost}</span>
            </div>

            {/* Line 2: Pass Discount (Meal Discount) */}
            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span>Pass Discount ({durationObj.discountPct}% OFF)</span>
              <span className="tabular-nums font-bold">- ₹{discountAmount}</span>
            </div>

            {/* Line 3: Delivery Charges (Waived via 30-min window batching) */}
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center space-x-1">
                <span>Batch Delivery ({selectedDuration} drops)</span>
                <span className="text-[9px] text-slate-400 font-normal">(@ ₹40)</span>
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="line-through text-slate-400 text-[10px] tabular-nums">₹{deliverySaved}</span>
                <span className="text-[10px] font-black text-[#059669] bg-[#DCFCE7] border border-[#86EFAC] px-1.5 py-0.2 rounded-md uppercase">
                  FREE
                </span>
              </div>
            </div>

            {/* Total / Net Pass Price */}
            <div className="border-t border-[#BBF7D0] pt-2 mt-1 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  Net Pass Price
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  (₹{effectiveMealPrice}/meal all-inclusive)
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-slate-950 tabular-nums">
                  ₹{netPrice}
                </span>
              </div>
            </div>

            {/* Total Pocket Savings Banner (Transparent summary of both benefits) */}
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-2 px-2.5 text-[10px] text-emerald-950 font-bold flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <span>🎉</span>
                <span>Total Pocket Savings:</span>
              </span>
              <span className="text-emerald-800 font-black tabular-nums">
                ₹{totalPocketSavings} (₹{discountAmount} off + ₹{deliverySaved} free delivery)
              </span>
            </div>

            {/* Visual Prepaid Bonus Callout */}
            <div className="bg-white border border-[#10B981]/30 rounded-xl p-2 px-2.5 text-[10px] text-emerald-900 font-bold flex items-center justify-between">
              <span className="flex items-center">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                Prepaid Bonus Perk:
              </span>
              <span className="bg-[#ECFDF5] text-[#10B981] px-1.5 py-0.5 rounded font-extrabold border border-emerald-200">
                +₹{bonusCredits} Extra Wallet Cash (5%)
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
                {selectedDuration} Meals • {tierObj.label} (₹{selectedTier}/d Cap)
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

      {/* STAGE 3: LOCATION HUBS & HYBRID GEOFENCE SETUP */}
      {stage === 3 && (
        <div className="px-4 py-3 space-y-3.5 animate-in fade-in duration-200">
          {/* A. Hero Context Card */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-md border border-slate-700/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center shadow-xs">
                📍 3-2 HYBRID DELIVERY HUBS
              </span>
              <span className="text-[10px] font-bold text-slate-300">
                100% ₹0 Delivery
              </span>
            </div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-snug">
              Set Your Workplace & WFH Locations
            </h1>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              MealsOn batches meals to your Office Pod on work days and to your Home on remote days with ₹0 courier fee.
            </p>
          </div>

          {/* B. Primary Office Location Card (Office Pod) */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                    🏢 Primary Office Location (Pod Drop)
                  </h3>
                  <span className="text-[10px] text-slate-500">Corporate Workplace Drop</span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center">
                <Check className="w-3 h-3 mr-0.5" /> Verified Pod
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1.5 text-xs">
              <div className="font-extrabold text-slate-900 flex items-center justify-between">
                <span>Cyber Park Tower B</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  1:00 PM – 1:30 PM Wave
                </span>
              </div>
              <p className="text-[10px] text-slate-600">
                4th Floor, Tech Hub, Sector 62 • Tower Smart Lockers
              </p>
              <div className="pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500">
                <span>Logistics model: Consolidated milk-run drop</span>
                <span className="font-bold text-emerald-700">₹0 Delivery Fee</span>
              </div>
            </div>
          </div>

          {/* C. Primary Residence / Home Location with Geofence Verification */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                    🏠 Primary Residence (Home / WFH)
                  </h3>
                  <span className="text-[10px] text-slate-500">Verify address for hybrid switching eligibility</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-400">
                Tap to compare
              </span>
            </div>

            {/* Address Option Selector */}
            <div className="space-y-2">
              {HOME_OPTIONS.map((opt) => {
                const isSelected = selectedHomeId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      playPop();
                      setSelectedHomeId(opt.id);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? opt.isEligible
                          ? 'bg-emerald-50/50 border-2 border-emerald-500 shadow-sm'
                          : 'bg-rose-50/50 border-2 border-rose-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-extrabold text-slate-900">
                            {opt.name}
                          </span>
                          <span
                            className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded ${
                              opt.isEligible
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {opt.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          {opt.address}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-900">
                          {opt.distanceKm} km
                        </span>
                        <span className="block text-[8px] text-slate-400 uppercase">
                          from kitchen
                        </span>
                      </div>
                    </div>

                    {/* Serviceability Banner */}
                    <div
                      className={`mt-2 p-1.5 rounded-lg text-[10px] font-medium flex items-center justify-between ${
                        opt.isEligible
                          ? 'bg-emerald-100/70 text-emerald-900'
                          : 'bg-rose-100/70 text-rose-900'
                      }`}
                    >
                      <span className="flex items-center font-bold">
                        {opt.isEligible ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700 shrink-0" />
                            ✅ Switching Allowed • ₹0 Free Delivery
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-700 shrink-0" />
                            ❌ Free Switching Ineligible (&gt; 7 km)
                          </>
                        )}
                      </span>
                      <span className="text-[9px] font-extrabold">
                        {opt.isEligible ? '≤ 7 km Geofence' : 'Out of Cluster'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deep-Dive Serviceability Explanation */}
            {selectedHome.isEligible ? (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-[10px] text-emerald-950 space-y-1">
                <span className="font-extrabold flex items-center text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-700 shrink-0" />
                  Why switching is possible here:
                </span>
                <p className="leading-snug text-emerald-800">
                  Green Valley Apt (4.2 km) is inside the 7 km kitchen cluster limit. The exact same partner cloud kitchens prepare both Office and Home meals in morning off-peak batch runs (9:00–11:30 AM), preserving bulk procurement and enabling 100% free delivery.
                </p>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[10px] text-rose-950 space-y-1">
                <span className="font-extrabold flex items-center text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-700 shrink-0" />
                  Why free switching is restricted here:
                </span>
                <p className="leading-snug text-rose-800">
                  Whitefield (11.8 km) exceeds the 7 km kitchen geofence. Point-to-point courier dispatch costs ₹55–₹70 per drop. On remote WFH days, you can utilize 100% credit rollover in your Pause Shield wallet or opt for a nominal ₹29 suburban routing fee.
                </p>
              </div>
            )}
          </div>

          {/* D. Hybrid Policy & Guardrails Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900">
                Hybrid Switching Policy & Operational Rules
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 space-y-2 text-[10px] text-slate-700">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">1. 7 km Kitchen-Cluster Limit:</strong>
                  <span className="text-slate-600 block mt-0.5 leading-snug">
                    Home address must be within 7 km of the office kitchen hub. This guarantees your meals cook in the morning batch roster for ₹0 delivery.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1.5 border-t border-slate-200/80">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">2. Strict 10:00 PM Night-Before Routing Lock:</strong>
                  <span className="text-slate-600 block mt-0.5 leading-snug">
                    You can switch tomorrow's lunch destination with 1 tap before 10 PM. <strong>Same-day morning flips are disabled</strong> to protect locked delivery manifests and prevent courier delays.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1.5 border-t border-slate-200/80">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">3. Structured 30-Min Delivery Waves:</strong>
                  <span className="text-slate-600 block mt-0.5 leading-snug">
                    Office Pod drops: <strong>1:00 PM – 1:30 PM</strong> (Tower Lockers) • Home drops: <strong>1:30 PM – 2:00 PM</strong> (Doorstep handover).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM CHECKOUT CTA DOCKED AT BOTTOM OF PHONE */}
      <div className="sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-20 mt-auto">
        {stage === 1 ? (
          <button
            onClick={handleGoToPayment}
            className="w-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Continue to Payment • ₹{netPrice}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : stage === 2 ? (
          <button
            onClick={handleCompleteCheckout}
            className={`w-full text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer ${
              paymentOption === 'prepaid'
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                : paymentOption === 'mandate'
                ? 'bg-gradient-to-r from-[#4F46E5] to-[#4338CA]'
                : 'bg-gradient-to-r from-amber-600 to-amber-700'
            }`}
          >
            {paymentOption === 'prepaid' && (
              <span>Pay ₹{netPrice} & Claim +₹{bonusCredits} Bonus Cash →</span>
            )}
            {paymentOption === 'mandate' && (
              <span>Setup 10 PM UPI Mandate (₹0 Today) →</span>
            )}
            {paymentOption === 'pluxee' && (
              <span>Pay ₹{netPrice} via Pluxee →</span>
            )}
          </button>
        ) : (
          <button
            onClick={handleConfirmLocationsAndFinish}
            className="w-full bg-gradient-to-r from-[#FF5A1F] to-[#FF7B47] hover:from-[#E04812] hover:to-[#FF5A1F] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] cta-bounce flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm Hubs & Build My AI Playlist ✨ ➔</span>
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
