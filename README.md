# MealsOn — Scheduled Meals Product Prototype

> **Interactive mobile web application prototype built for the Entain Product Management Assignment.**  
> Elevating the *'Scheduled Meals'* experience for MealsOn users through user delight, practicality, and business value.

---

## 🌟 Executive Summary & Problem Solved

Subscription and scheduled meal programs typically face three major failure points:
1. **Decision Fatigue & Menu Monotony:** Users get tired of rigid repetitive weekly menus.
2. **Hybrid Work Friction:** Inflexible delivery addresses force users to cancel when working from home or traveling.
3. **Commitment Anxiety & Forfeited Meals:** Missing an occasional lunch leads to churn when money is lost without rollover protection.

**MealsOn Scheduled Meals** transforms this experience into a flexible, automated, and community-driven habit.

---

## 🚀 Core Features & Architectural Walkthrough

### 1. 🤖 AI Meal Playlist Auto-Pilot (Tab 1: "Auto-Pilot")
- **Dynamic AI Prompt Box:** Pre-filled with natural language dietary goals (e.g., *"High-protein vegetarian lunches under 500 kcal, no mushrooms, under ₹250/meal"*).
- **Dietary Filter Chips:** 1-tap toggles for `[High Protein (>20g)]`, `[<500 Kcal]`, `[Pure Veg]`, `[Homestyle]`, and `[Budget <₹250]` that dynamically update prompt parameters.
- **5-Day Multi-Kitchen Schedule:** Balanced Mon–Fri schedule curated from verified partner cloud kitchens.
- **1-Tap Dish Swapping:** Instant alternative cycling that recalculates weekly pricing and macro averages live.

### 2. 🗺️ Hybrid Split-Location Routing (Tab 2: "Routing")
- **Mon–Fri Day-to-Location Matrix:** 1-tap toggle per weekday between **🏢 Office (Cyber Park Tower B)** and **🏠 Home (Green Valley Apt)**.
- **Dynamic Route Summary:** Live split bar showing office vs. home distribution.
- **Smart Calendar Sync:** Auto-detects calendar events (e.g. *"WFH - Sprint Planning"*) on Thursday, automatically flipping delivery to Home with an "Undo" control.

### 3. ⏰ 8 PM Smart Cut-Off Drawer (Tab 3: "8PM Cut-Off")
- **Simulated Notification Channels:** Preview both **In-App Bottom Sheet** and **WhatsApp Interactive Message** views.
- **Live Ticking 10 PM Countdown:** Real-time countdown timer to the kitchen lock-in cut-off.
- **3 Core Action Paths:**
  1. `✅ Keep Meal (Confirmed)` — Locks meal with green confirmation badge and kitchen notification.
  2. `🔄 1-Tap Swap Dish` — Inline carousel with 3 equal-value replacement meals.
  3. `⏭️ Skip & Bank Credit` — 100% rollover protection: banks credit into the Pause Shield wallet and extends subscription end-date +1 day.
- **Zero-Waste Kitchen FAQ:** Embedded breakdown explaining how 10 PM order locking eliminates 28% food waste and guarantees fresh cooking.

### 4. 🛡️ Pause Shield & Rollover Credits Wallet (Tab 4: "Wallet")
- **Dynamic Credit Balance & SVG Progress Ring:** Live global credit count in an emerald gradient hero card.
- **Dynamic Plan Horizon Timeline:** Visual status for Delivered, Shielded, Travel Pause, Scheduled, and +2 Free Rollover Days; its length tracks the selected pause.
- **Simulate Travel / Vacation Pause Slider:** 1-to-5 day pause slider that shifts the timeline and extends subscription validity in real time.
- **Rollover Control:** Choose automatic rollover or claim a skipped-meal credit manually from the cut-off screen.
- **45-Day Flexible Pass Guarantee:** Explains zero-expiry penalty rules.

### 5. 🔥 5-Day Habit Streaks & Office Pod Drops (Tab 5: "Streaks & Pods")
- **Weekly Habit Streak Tracker:** 5-node Mon–Fri progress tracker.
- **Demo Mode Simulation:** "Simulate Friday Delivery Completion" button that triggers celebratory fanfare, full-screen confetti, and lets the user pick their unlocked free treat (*☕ Free Cold Brew* or *🍫 High-Protein Almond Brownie*).
- **Office Pod Consolidated Delivery Engine:** Batches deliveries for Cyber Park Tower B colleagues at 1:00 PM wave.
- **PM Unit Economics View:** Shows how batching 12 orders into 1 fleet drop slashes last-mile delivery costs by **63%** (from ₹65 to ₹24/order).

---

## 🎨 Design System & Strict Tokens

- **Primary Accent:** Vibrant Tangerine (`#FF5A1F`, hover `#E04812`)
- **Secondary Accent:** Emerald Green (`#10B981`, light fill `#ECFDF5`)
- **Warning / Cut-Off Accent:** Amber (`#F59E0B`, light fill `#FFFBEB`)
- **Background Canvas:** Warm Alabaster (`#F8FAFC`) with elevated pure white cards (`#FFFFFF`, border `#E2E8F0`, rounded-2xl)
- **Typography:** Plus Jakarta Sans & Inter
- **Delight Engine:** Native Web Audio API synthesizer for tactile pop/chimes (with presenter audio toggle) and SVG confetti particle engine.

---

## 🛠️ Tech Stack & Setup

- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** Lucide React
- **Packaging:** `vite-plugin-singlefile` for standalone zero-dependency distribution

### Quick Start

```bash
# Clone the repository
git clone https://github.com/AnimeFreak95/Assignment_MealOn.git
cd Assignment_MealOn

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

The production output generates `dist/index.html`, a self-contained bundle that runs in any browser without needing a web server.
