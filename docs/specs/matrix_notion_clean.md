# 📊 Feature Prioritisation Matrix & Implementation Roadmap

> **Document Status:** `APPROVED FOR IMPLEMENTATION`  
> **Frameworks Used:** **RICE Scoring** (Reach, Impact, Confidence, Effort) + **Kano Model Classification** (Must-Have, Performance, Delighter)  
> **Parent Hub:** [🍱 MealsOn — Scheduled Meals Master PRD](https://app.notion.com/p/40a80bcda1298038960bc414a931d754)  
> **Strategic Objective:** Rigorously rank and phase the MealsOn scheduled meal product capabilities to ensure operational feasibility, unit economic viability (+₹205 weekly surplus), and maximum customer retention.

---

## 🎯 1. Prioritisation Framework Methodology

### The Dual-Framework Approach
To avoid building "nice-to-have" features before core operational rails are solid, MealsOn uses a dual prioritization lens:

1. **RICE Scoring Model:**
   - **Reach (R):** Number of active subscribers exposed to or benefiting from the feature per quarter (Scale: 100 to 1,000+ per cluster).
   - **Impact (I):** Direct contribution to Core Retention, Decision Fatigue Reduction, and Margin Preservation (3 = Massive, 2 = High, 1 = Medium, 0.5 = Low).
   - **Confidence (C):** Level of conviction backed by user testing, pilot feasibility, and operational proof (100% = High data, 80% = Medium, 50% = Low/Exploratory).
   - **Effort (E):** Person-weeks of engineering, product design, and operations setup required (1 = Low, 5 = High).
   - **RICE Score Formula:**
     **RICE Score = (Reach × Impact × Confidence) / Effort**

2. **Kano Model Category:**
   - **Must-Have (M):** Table-stakes features. If missing, the subscription immediately fails or bleeds cash.
   - **Performance (P):** More is better. Directly drives daily satisfaction, plan adherence, and LTV.
   - **Delighter (D):** Unexpected value drivers that spark organic virality and brand affinity.

---

## 🏆 2. Master Feature Prioritisation Matrix (RICE & Kano)

| Rank | Feature Module | Kano Category | Reach (Qtr) | Impact (0.5–3) | Confidence % | Effort (wks) | RICE Score | Strategic Implementation Phase |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **#1** | **Pass Onboarding & Triple Payment Rails** | **Must-Have (M)** | 1,000 | 3.0 (Massive) | 100% | 2.5 | **1,200** | **Phase 1: Pilot MVP (W1)** |
| **#2** | **8 PM Cut-Off & 10 PM Zero-Waste Kitchen Lock** | **Must-Have (M)** | 1,000 | 3.0 (Massive) | 95% | 2.5 | **1,140** | **Phase 1: Pilot MVP (W1)** |
| **#3** | **Pause Shield & Rollover Credits Wallet** | **Must-Have (M)** | 1,000 | 2.5 (High) | 90% | 2.0 | **1,125** | **Phase 1: Pilot MVP (W1)** |
| **#4** | **Hybrid Split-Location Routing (30-min + 7km)** | **Performance (P)** | 850 | 2.5 (High) | 85% | 2.0 | **903** | **Phase 1: Pilot MVP (W2)** |
| **#5** | **Curated Food Vault (12–20 Favorites)** | **Performance (P)** | 900 | 2.0 (High) | 90% | 2.0 | **810** | **Phase 1: Pilot MVP (W2)** |
| **#6** | **Healthy Week Habit Tree & Friday Payoff** | **Delighter (D)** | 750 | 2.0 (High) | 80% | 2.0 | **600** | **Phase 1 Pilot (W3)** |
| **#7** | **Tower Tribe Pod Co-Op & Building Pooling** | **Delighter (D)** | 600 | 2.5 (High) | 75% | 2.5 | **450** | **Phase 2: Cluster Scale (W7)** |
| **#8** | **AI Natural Language Playlist Generator** | **Performance (P)** | 500 | 1.5 (Med) | 70% | 3.0 | **175** | **Phase 2: Cluster Scale (W8)** |
| **#9** | **Automated WFH Calendar Sync (Google/O365)** | **Delighter (D)** | 400 | 1.0 (Med) | 65% | 2.5 | **104** | **Phase 3: Metro Scale (M4+)** |

---

## 🔍 3. Deep-Dive Feature Evaluation & Trade-Off Rationale

### 1. Pass Onboarding & Triple Payment Rails (Rank #1 — RICE: 1,200)
- **Why #1:** Without clear commitment-free tiers (Rasoi ₹160, Bistro ₹250, Chef's Table ₹320) and flexible payments (Upfront +5%, UPI AutoPay at 10 PM, Sodexo/Zaggle), top-of-funnel conversion collapses.
- **Kano:** **Must-Have.** Friction in payment or pass setup kills adoption before day 1.

### 2. 8 PM Smart Cut-Off Drawer & 10 PM Kitchen Lock (Rank #2 — RICE: 1,140)
- **Why #2:** The operational backbone of cloud kitchen batch economics. A rigid 10 PM lock allows kitchens to prep morning manifests with under 3% waste, unlocking a 25% wholesale discount passed back to subscribers.
- **Kano:** **Must-Have.** Without this, kitchens face food waste volatility and refuse fixed-price supply agreements.

### 3. Pause Shield & Rollover Wallet Engine (Rank #3 — RICE: 1,125)
- **Why #3:** Traditional meal subscriptions fail at Week 3 due to "forfeited meal guilt." By guaranteeing 100% rupee rollover and a vacation pause slider, trust is established immediately.
- **Kano:** **Must-Have.** The primary structural lever separating MealsOn from failed subscription startups.

### 4. Hybrid Split-Location Routing (Rank #4 — RICE: 903)
- **Why #4:** Modern professionals work 3 days in the office and 2 days at home. An address toggle with a 7 km cluster geofence and 3 standardized 30-min windows guarantees meals are delivered to where the user actually is.
- **Kano:** **Performance.** Directly dictates whether hybrid corporate users can maintain a 5-day habit.

### 5. Curated Food Vault (Rank #5 — RICE: 810)
- **Why #5:** User research revealed that 64% of corporate professionals do not want daily algorithmic surprises; they want 10–15 trusted, comfort meals on rotation with zero duplicate dishes within the week.
- **Kano:** **Performance.** Proven driver of Day-30 retention.

### 6. Healthy Week Habit Tree (Rank #6 — RICE: 600)
- **Why #6:** Replaces predatory streak mechanics with a forgiving 4/5 flexible rule and a visual living bonsai. Provides an emotional end-of-week payoff (Clean Fuel vs. Cheat Treat) without physical courier friction.
- **Kano:** **Delighter.** Drives organic engagement and high Friday NPS.

### 7. Tower Tribe Pod Co-Op (Rank #7 — RICE: 450)
- **Why #7:** Aggregates order density at the building lobby level (Bronze 25, Silver 50, Gold 75 orders). Drops delivery cost to ₹24/meal while creating a self-funding +₹400 to +₹1,200 weekly logistics surplus.
- **Kano:** **Delighter / Growth Engine.** Placed in Phase 2 once single-building beachhead density is established.

### 8. AI Natural Language Playlist Generator (Rank #8 — RICE: 175)
- **Why #8:** While technically exciting, users prioritize predictability and trust over open-ended generative prompts. Phased after the Food Vault to prevent onboarding friction.
- **Kano:** **Performance.** High effort (LLM prompt parsing, real-time recipe balancing), moderate initial reach.

### 9. Automated WFH Calendar Sync (Rank #9 — RICE: 104)
- **Why #9:** High integration overhead (Google Workspace / Outlook OAuth security review) with moderate pilot reach. Manual 1-tap toggling in the 8 PM drawer solves 95% of hybrid routing during Phase 1.
- **Kano:** **Delighter.** Reserved for Phase 3 enterprise B2B expansion.

---

## 🗺️ 4. Phased Implementation Roadmap (Gantt Alignment)

| Phase & Strategic Focus | Timeline | Key Feature Modules Delivered | Core Operational Milestone |
| :--- | :--- | :--- | :--- |
| **Phase 1: Pilot MVP** | Weeks 1–6 | Pass Onboarding & Triple Payment Rails; 8 PM Drawer & 10 PM Zero-Waste Kitchen Lock; Pause Shield & Rollover Wallet; Hybrid Routing (30-min + 7km Geofence); Curated Food Vault (12–20 items); Healthy Week Habit Tree | 3 Anchor Towers, 500 Beta Users, Delivery SLA ≥97.5%, ₹24 batch drop cost |
| **Phase 2: Cluster Scale** | Weeks 7–14 | Tower Tribe Pod Co-Op (Milestone Ladder); AI Meal Playlist Generator (Dietary chips); Corporate Meal Card Checkout (Pluxee/Zaggle); 8 Residential Society WFH Pods | 12 Towers + 8 Societies, 2,500 active users, building-level order pooling |
| **Phase 3: Metro Scale** | Months 4+ | Automated WFH Calendar Sync (OAuth); Heated Micro-Fulfillment Locker Pods; Multi-City Scale (Bengaluru ORR, Mumbai BKC) | 10,000+ daily deliveries, corporate wellness subsidies, full EV fleet |

---

## ⚖️ 5. Resource Allocation & Engineering Budget

| Workstream | Phase 1 (MVP Pilot) | Phase 2 (Cluster Scale) | Phase 3 (Metro Scale) |
| :--- | :--- | :--- | :--- |
| **Frontend Engineering** | 40% (Pass flow, Food Vault, Habit Tree UI) | 30% (Tower Tribe leaderboard, AI chips) | 25% (Calendar OAuth, Locker UI) |
| **Backend & Logistics API** | 40% (Batching router, 10 PM lock, Wallet engine) | 35% (Building clustering, Co-op ledger) | 35% (Multi-city routing, Locker IoT) |
| **Kitchen Ops & SLAs** | 20% (Manual kitchen dispatch dashboards) | 20% (Automated manifest printing) | 15% (ERP integration) |
| **Product Design (UI/UX)** | Dedicated focus on FTUX trust & micro-interactions | Focus on social gamification & viral loops | Focus on enterprise B2B portals |
