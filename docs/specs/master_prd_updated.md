# 🍱 MealsOn — Scheduled Meals Product Requirements Document (PRD)
> **Document Status:** `APPROVED FOR IMPLEMENTATION`
> **Author:** Sachin Shinde
> **Live Prototype URL:** [https://animefreak95.github.io/Assignment_MealOn/](https://animefreak95.github.io/Assignment_MealOn/)
> **Scope:** End-to-End Scheduled Meals Subscription Engine
---
## 📱 Interactive High-Fidelity Prototype
<callout icon="🚀" color="orange_bg">
	**Live Interactive Prototype Available:**
	Experience the fully functional React/Tailwind prototype with AI Smart Planner, Food Vault, 8 PM Smart Cut-Off, Hybrid Routing, Habit Tree, and Tower Tribe Co-op.
	👉 **Try Live Prototype:** [https://animefreak95.github.io/Assignment_MealOn/](https://animefreak95.github.io/Assignment_MealOn/)
</callout>
![MealsOn Interactive Prototype Overview](https://raw.githubusercontent.com/AnimeFreak95/Assignment_MealOn/main/docs/screenshots/00-hero-prototype-overview.png)
---
## 📑 Master PRD Navigation (Feature Subpages)
Each feature has its own dedicated specification page containing comprehensive user flows, business rules, edge cases, and unit economics:
1. [💳 1. MealsOn Pass Onboarding](https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79)
2. [🤖 2. AI Meal Playlist & Curated Food Vault](https://app.notion.com/p/40b80bcda1298139bc3ff629601a16aa)
3. [🗺️ 3. Hybrid Split-Location Routing](https://app.notion.com/p/40b80bcda12981859ad7db792c3487a0)
4. [⏰ 4. 8 PM Smart Cut-Off Drawer](https://app.notion.com/p/40b80bcda12981769de9dd8266d87c41)
5. [🛡️ 5. Pause Shield & Rollover Credits Wallet](https://app.notion.com/p/40b80bcda1298180bb60e15c14f965e3)
6. [🌱 6. Healthy Week Habit Tree](https://app.notion.com/p/40b80bcda12981349a9beef85a7e2a69)
7. [🏢 7. Tower Tribe Pod Co-Op](https://app.notion.com/p/40b80bcda129812f8cfce30159ce2d13)
8. [⚖️ 8. Strategic Trade-Offs & Decision Manifesto](https://app.notion.com/p/40b80bcda129812ea11dea0aff115931)
9. [🚀 9. Phase 1 Pilot Launch Plan](https://app.notion.com/p/40c80bcda1298104a60cc794296c090c)
---
## 🌟 1. Executive Overview & Problem Statement
### The Problem
On-demand food delivery platforms thrive on instant gratification but fail everyday working professionals who want a healthy, cost-effective lunch habit. Traditional subscriptions attempt to solve this, but suffer from **four structural failure points**:
1. **Decision Fatigue & Menu Monotony:** Users spend 20 minutes every morning picking lunch or get locked into repetitive, uninspiring single-kitchen menus.
2. **Hybrid Work Friction:** Inflexible delivery addresses force users to cancel or pause when switching between office days and Work-From-Home (WFH) days.
3. **Commitment Anxiety & Forfeited Meals:** Missing a single lunch because of sickness, sudden meetings, or dining out leads to churn when users lose money without rollover protection.
4. **Logistics Unit Economics Erosion:** Point-to-point on-demand deliveries or micro 15-minute delivery slots cost ₹45–₹65 per drop, completely wiping out subscription gross margins.
### The MealsOn Solution
**MealsOn Scheduled Meals** transforms weekday lunch into a flexible, automated, and community-driven habit. Users pick an allowance tier and meal pass duration with built-in buffer validity days, auto-schedule menus via AI or their personal 20-item Food Vault, dynamically split deliveries across Office and Home in **structured 30-minute batched windows**, and enjoy 100% rollover protection on skipped meals.
---
## 🎯 2. Product Assumptions & Operating Constraints
As per the product assignment requirements, the following baseline assumptions govern this design:
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/b2967c35-35b3-40bc-9ee7-8de23921e915/47745f9b-b640-4941-a114-352969d48aee/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVWZBYKZ%2F20261102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20261102T055028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDEN%2BtRbt13KkFwC3LH8fsq%2FEJVWdisY4CSipS57o1ZIAIhAKNK6fLPuMr8OC1GR7usiZd7Bg6KpnvVOHsx7Q1mvVhRKv8DCHUQABoMNjM3NDIzMTgzODA1Igy4obRsif%2BwNgTc2Bwq3APqmVz0ha6LDA37l53PTY%2Bt9aKtYnFQLj6hOZNI26APE07GDz7aAm0nvdc8bHQtwxnq2SekUTfFeF95pdJaaTC1%2FRlH0oi0eGtzBADIzHDEEU3FMfbSxfo7fuWqgA3dqccyeBVxSgNCR1k%2BYPt6hF19vF2OwcQp26%2BWOm1laHMlM%2FVYoFbXcNinbxdX9zks6aAiITSmh5oYm6FXA5oSLr6JIffUwOWrrlbNSfTy4ujm4qnDfj4AR0uAEFSfugPh2hJb2bVpA%2BfSuESOh7gwax50aW3RcXpEeSZgB4U5UylaPR%2FxzfTMK67fJDoy4Ki2o2gKQnNpPZVUo943r5tm3Ey0gbVDGf%2BKRk0YKXiksperMTwpND8d6PN8IxEzxsdTl2HprtPA8FbbmfdLET4r6O16FyGj9JKLX3eu6zkMFrQutoyZoN6zdMmng584WuQMSY3WwDndDIvfxOeI0nJDAMxahLbNYlgw3%2B07fQt43hYzj7rsQ1xqUuyVgZGXxyOLKxGAsR8FI5CirchPYH2JtOYv24p%2F%2FnCYH5dP6ZWCAnajeMx4sHLqrnStEuqr7Z2ZW2q2TwJuyyDc2NIzYHUn8l7f7CJdwuvE6KPgoiWncqP9npyAi%2FtMXSy%2BNTCOPjCXk6DXBjqkAVQq%2Fspm7mFuTHVi0Edo67ycAeiyhaeJSuxaw4rnradjY6xULPohwmko25NW%2BdMtSUJHyPCVb1gOADzvJrM1jmvuo2HeHtVRKAKD2Umf5nCG3VYyWdFvWREaguwXHML%2FhMXJP5dklTt2W2J7mS%2BygIxlghlyWxgsMQZlT7SJmXX2wyPdbJrRucfTy2yEyR77Qqq8l72ITNj6yKqOU8bGMpFB%2BN1N&X-Amz-Signature=f19823758fdd75ac477dc1688f61d89598c7cfaf4eedd6bc6d986e3f7906e869&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject#notion_record=block.40b80bcd-a129-8060-97da-ccc5273d0f8f.b2967c35-35b3-40bc-9ee7-8de23921e915)
### 2.1 Logistics Batching Architecture: 30-Minute Windows
To prevent unit economics collapse, MealsOn replaces open delivery and narrow 15-minute slots with **three standardized 30-minute batched delivery windows**:
- **Slot A (Early Lunch):** `12:30 PM – 1:00 PM` (Early eaters, pre-meeting lunchers).
- **Slot B (Peak Office Pod — Default):** `1:00 PM – 1:30 PM` (\~65% of volume; 1 rider consolidates 8–12 orders to a single corporate tower).
- **Slot C (Late Lunch):** `1:30 PM – 2:00 PM` (Post-standup / flexible lunchers).
**Strategic Impact:**
- Increases rider productivity from **1.8 drops/hr (on-demand)** to **5.2 drops/hr (milk-run batching)**.
- Reduces last-mile delivery cost from **₹55/drop to ₹14–₹18/drop (-65% to -70%)**, allowing MealsOn to offer 100% Free Delivery sustainably.
---
## 👥 3. User Personas (Target Audience Segmentation)
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/b2967c35-35b3-40bc-9ee7-8de23921e915/56530ea8-bf94-4842-9354-784eb49e3c84/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVWZBYKZ%2F20261102%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20261102T055028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDEN%2BtRbt13KkFwC3LH8fsq%2FEJVWdisY4CSipS57o1ZIAIhAKNK6fLPuMr8OC1GR7usiZd7Bg6KpnvVOHsx7Q1mvVhRKv8DCHUQABoMNjM3NDIzMTgzODA1Igy4obRsif%2BwNgTc2Bwq3APqmVz0ha6LDA37l53PTY%2Bt9aKtYnFQLj6hOZNI26APE07GDz7aAm0nvdc8bHQtwxnq2SekUTfFeF95pdJaaTC1%2FRlH0oi0eGtzBADIzHDEEU3FMfbSxfo7fuWqgA3dqccyeBVxSgNCR1k%2BYPt6hF19vF2OwcQp26%2BWOm1laHMlM%2FVYoFbXcNinbxdX9zks6aAiITSmh5oYm6FXA5oSLr6JIffUwOWrrlbNSfTy4ujm4qnDfj4AR0uAEFSfugPh2hJb2bVpA%2BfSuESOh7gwax50aW3RcXpEeSZgB4U5UylaPR%2FxzfTMK67fJDoy4Ki2o2gKQnNpPZVUo943r5tm3Ey0gbVDGf%2BKRk0YKXiksperMTwpND8d6PN8IxEzxsdTl2HprtPA8FbbmfdLET4r6O16FyGj9JKLX3eu6zkMFrQutoyZoN6zdMmng584WuQMSY3WwDndDIvfxOeI0nJDAMxahLbNYlgw3%2B07fQt43hYzj7rsQ1xqUuyVgZGXxyOLKxGAsR8FI5CirchPYH2JtOYv24p%2F%2FnCYH5dP6ZWCAnajeMx4sHLqrnStEuqr7Z2ZW2q2TwJuyyDc2NIzYHUn8l7f7CJdwuvE6KPgoiWncqP9npyAi%2FtMXSy%2BNTCOPjCXk6DXBjqkAVQq%2Fspm7mFuTHVi0Edo67ycAeiyhaeJSuxaw4rnradjY6xULPohwmko25NW%2BdMtSUJHyPCVb1gOADzvJrM1jmvuo2HeHtVRKAKD2Umf5nCG3VYyWdFvWREaguwXHML%2FhMXJP5dklTt2W2J7mS%2BygIxlghlyWxgsMQZlT7SJmXX2wyPdbJrRucfTy2yEyR77Qqq8l72ITNj6yKqOU8bGMpFB%2BN1N&X-Amz-Signature=6ecf0975d33bac14c0d2371583b777502e32533ac980d26461aaafc0f397d34a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject#notion_record=block.40b80bcd-a129-807e-a078-f75e7ac78795.b2967c35-35b3-40bc-9ee7-8de23921e915)
---
## 🚀 4. Master Feature List & Strategic Alignment
<table header-row="true">
<colgroup>
<col>
<col>
<col width="364">
<col width="229">
<col width="157.625">
</colgroup>
<tr>
<td>Feature Module</td>
<td>Target Personas</td>
<td>Core Value Proposition</td>
<td>User Problem Solved</td>
<td>Detailed Spec</td>
</tr>
<tr>
<td>**1. MealsOn Pass Onboarding**</td>
<td>Rahul, Priya, Vikram</td>
<td>Culinary craft tiers (Rasoi ₹160, Bistro ₹250, Chef's Table ₹320) with compound savings (up to 15% off + ₹0 delivery + +5% bonus), 10–35 days validity buffers, and 30-min drop slots.</td>
<td>Removes upfront commitment anxiety and fear of forfeited money.</td>
<td>[View Pass Onboarding Page](https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79)</td>
</tr>
<tr>
<td>**2. AI Playlist & Food Vault**</td>
<td>Priya, Ananya</td>
<td>Unified weekly planner with top-level AI/Vault selector, zero-repeat anti-monotony engine, Friday AI wildcard, and 3-action card toolbar (Swap, Move drag-and-drop, Skip).</td>
<td>Eliminates daily decision fatigue, menu monotony, and algorithmic distrust.</td>
<td>[View Playlist Page](https://app.notion.com/p/40b80bcda1298139bc3ff629601a16aa)</td>
</tr>
<tr>
<td>**3. Hybrid Split-Location Routing**</td>
<td>Priya, Sneha</td>
<td>1-tap Mon–Fri Office vs. Home address matrix with calendar WFH auto-detection and 30-min batched milk-run windows.</td>
<td>Stops meals from arriving at empty office desks while protecting logistics margins.</td>
<td>[View Routing Page](https://app.notion.com/p/40b80bcda12981859ad7db792c3487a0)</td>
</tr>
<tr>
<td>**4. 8 PM Smart Cut-Off Drawer**</td>
<td>Vikram, Priya</td>
<td>Proactive 8 PM preview via In-App & WhatsApp with 10 PM zero-waste lock feeding 3 morning cooking waves.</td>
<td>Ends rigid lock-in and morning scramble with transparent kitchen batch cooking.</td>
<td>[View Cut-Off Page](https://app.notion.com/p/40b80bcda12981769de9dd8266d87c41)</td>
</tr>
<tr>
<td>**5. Pause Shield & Rollover Wallet**</td>
<td>Vikram, Sneha</td>
<td>100% rollover protection, vacation pause slider, and unconsumed credit banking.</td>
<td>Completely eliminates subscription churn caused by unconsumed, expired meals.</td>
<td>[View Wallet Page](https://app.notion.com/p/40b80bcda1298180bb60e15c14f965e3)</td>
</tr>
<tr>
<td>**6. Healthy Week Habit Tree**</td>
<td>Rahul, Priya</td>
<td>4/5 Flexible Workweek Rule (Protected Skip 🛡️ with zero tree death), 5-stage living bonsai habit tree, Friday Lunch Roulette with 100% guaranteed digital perks, and personal impact ledger.</td>
<td>Builds sticky weekday nutrition habits without punishing legitimate skips; eliminates physical treat logistics friction.</td>
<td>[View Habit Tree Page](https://app.notion.com/p/40b80bcda12981349a9beef85a7e2a69)</td>
</tr>
<tr>
<td>**7. Tower Tribe Pod Co-Op**</td>
<td>Priya, Vikram</td>
<td>Hyper-local building co-op with 3-tier milestone ladder (Bronze 25 ➔ Silver 50 ➔ Gold 75 orders), Friday Fuel Credits (₹25/₹50/₹75) self-funded via batch drop savings, and 1-tap viral nudges.</td>
<td>Drives high corporate tower density, slashing courier costs from ₹65 to ₹24 per drop while retaining +₹400 to +₹1,200 platform surplus.</td>
<td>[View Tower Tribe Page](https://app.notion.com/p/40b80bcda129812f8cfce30159ce2d13)</td>
</tr>
</table>
---
## 📈 5. Product Analytics & North Star Metrics
- **North Star Metric:** **Weekly Meal Plan Adherence Rate (**$`\ge 82\%`$**)**
- **Supporting Strategic KPIs:**
	- **FTUX Funnel Completion:** $`\ge 42\%`$ from onboarding landing.
	- **Prepaid Adoption:** $`\ge 58\%`$ users opting for Upfront Prepaid (+5% credit hook).
	- **Food Vault Adoption:** $`\ge 64\%`$ active subscribers curating $`\ge 8`$ dishes in their vault.
	- **Fleet Logistics Cost per Drop:** Reduced from ₹55/drop (on-demand) to **₹14–₹18/drop** in 30-min Office Pod clusters.
	- **30-Min Drop On-Time SLA:** $`\ge 97.5\%`$ on-time lobby delivery within the selected 30-min window.
	- **Month 1 Retention:** $`\ge 84\%`$ 30-day retention with $`< 3.5\%`$ refund requests.
<page url="https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79">MealsOn Pass Onboarding</page>
<page url="https://app.notion.com/p/40b80bcda1298139bc3ff629601a16aa">2. AI Meal Playlist & Curated Food Vault</page>
<page url="https://app.notion.com/p/40b80bcda12981859ad7db792c3487a0">3. Hybrid Split-Location Routing</page>
<page url="https://app.notion.com/p/40b80bcda12981769de9dd8266d87c41">4. 8 PM Smart Cut-Off Drawer</page>
<page url="https://app.notion.com/p/40b80bcda12981349a9beef85a7e2a69">6. Healthy Week Habit Tree</page>
<page url="https://app.notion.com/p/40b80bcda12980a4aa57ed7201b04083">Dump</page>
<page url="https://app.notion.com/p/40b80bcda12981be9c5dd3ba892f642c">🥊 Competitor Landscape & Market Positioning</page>
<page url="https://app.notion.com/p/40b80bcda12981a58fe1dbf4408af5dc">5. Pause Shield & Rollover Wallet Engine</page>
<empty-block/>
<page url="https://app.notion.com/p/40b80bcda129812ea11dea0aff115931">8. Strategic Trade-Offs & Decision Manifesto</page>
<page url="https://app.notion.com/p/40b80bcda129812f8cfce30159ce2d13">7. Tower Tribe Pod Co-Op</page>