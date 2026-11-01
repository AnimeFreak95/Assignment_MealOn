# 🍱 MealsOn — Scheduled Meals Product Requirements Document (PRD)
> **Document Status:** `APPROVED FOR IMPLEMENTATION`
> **Author:** Sachin Shinde
> **Live Prototype URL:** `http://localhost:5173`
> **Scope:** End-to-End Scheduled Meals Subscription Engine
---
## 📑 Master PRD Navigation (Feature Subpages)
Each feature has its own dedicated specification page containing comprehensive user flows, business rules, edge cases, and unit economics:
1. [💳 1. Subscription Pass & Payment Onboarding (FTUX)](https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79)
2. [🤖 2. AI Meal Playlist & Curated Food Vault](https://app.notion.com/p/40b80bcda1298139bc3ff629601a16aa)
3. [🗺️ 3. Hybrid Split-Location Routing](https://app.notion.com/p/40b80bcda12981859ad7db792c3487a0)
4. [⏰ 4. 8 PM Smart Cut-Off Drawer](https://app.notion.com/p/40b80bcda12981769de9dd8266d87c41)
5. [🛡️ 5. Pause Shield & Rollover Credits Wallet](https://app.notion.com/p/40b80bcda1298180bb60e15c14f965e3)
6. [🔥 6. 5-Day Habit Streaks & Office Pod Drops](https://app.notion.com/p/40b80bcda12981349a9beef85a7e2a69)
---
## 🌟 1. Executive Overview & Problem Statement
### The Problem
On-demand food delivery platforms thrive on instant gratification but fail everyday working professionals who want a healthy, cost-effective lunch habit. Traditional subscriptions attempt to solve this, but suffer from **three structural failure points**:
1. **Decision Fatigue & Menu Monotony:** Users spend 20 minutes every morning picking lunch or get locked into repetitive, uninspiring single-kitchen menus.
2. **Hybrid Work Friction:** Inflexible delivery addresses force users to cancel or pause when switching between office days and Work-From-Home (WFH) days.
3. **Commitment Anxiety & Forfeited Meals:** Missing a single lunch because of sickness, sudden meetings, or dining out leads to churn when users lose money without rollover protection.
### The MealsOn Solution
**MealsOn Scheduled Meals** transforms weekday lunch into a flexible, automated, and community-driven habit. Users pick an allowance tier and meal pass duration with built-in buffer validity days, auto-schedule menus via AI or their personal 20-item Food Vault, dynamically split deliveries across Office and Home, and enjoy 100% rollover protection on skipped meals.
---
## 🎯 2. Product Assumptions & Operating Constraints
As per the product assignment requirements, the following baseline assumptions govern this design:
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/b2967c35-35b3-40bc-9ee7-8de23921e915/47745f9b-b640-4941-a114-352969d48aee/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SEQJF7I%2F20261101%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20261101T075226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDFQFwQvuwGMDIPCfhLx4B1inIUgwuHoTDWfbnK7Pwg%2FAiA%2FyXRe0Hsi5a%2F7DSDJTXPbQ1PXU7TmppWOFohvK%2BmbyCr%2FAwhfEAAaDDYzNzQyMzE4MzgwNSIMgIAHFB1TFMBvRt4YKtwD0fWsLnx7a%2Fmy6bNS%2BOgUAWXyGdNXKb9AAyufGP09qs5XZe%2B%2Fe4byDNz6TKkLepk10BJ7fUsdrj30DXaVTzLjDJxo8ox8cEbm5Ft0x4rtWuuze60ZJFXdqzIG4xg0O%2FBZ4eH7w5cs%2Fveq9WyulFj1rZKwwkA%2FwMgDP%2FaD7pty%2BGg8GgqRN9XUCMSQujgNRHjXLutomQB28%2FnILlSkBs8i6MW3Avsm66KgssSo9rSn9IamvBu%2FysPvnVV%2BLDjaNLCAWwiK%2FhdazU%2BlEilXoT89514RLIINBFX6dW%2FP6q%2FJBWgpiI8Ca%2F6yiDXaIPKlVcgUGYRRVSWp8YoOt28FitK3YEc36rhUrPIeU5APbCxoe4b9Le186HBNaRXkgl0u45ORF0IU8hxWJKpKAEd4Rt67HbI80mCerweP%2BwM1SrhwZWnJDFtsjKcd8j8j2iGjnhC7a4g%2FqYFFsEWXOiYyQZe1zTm%2ByhpSgT18hsUciezNMbH3UxIEvGUda2tPrqyjIVPnPAH87OTCy6N86E6PtsBYpL%2FLceH3Ll3PwkFAqoQNQVoeih0ovwOGG7Qi%2Fvp4z6sauQXjfviXx5jCb5jEAX1%2FQHAHHj7NpPSDjsYWqgprMXo5BaLcU0OV7y0wpg8wvKWb1wY6pgEZbABngjSk%2BeL0t03v%2FLnMEaBqIAYJsK5%2BiR2YYkgBV%2FbkDCsrStTwOX9JI9q1YsJdvqiLdXapWUHiYH2zE05XqKhoh6I9A3bJEsO3iyJiqIHc%2BmqdcNIcNrnRlICktRC2ncG1UUWuF0xJw0eM432Iq4sWVqUkQB2I6XQyuRmuIXi1p3ubFq87iYj4h1fkRgcuWHHRvkK8CwmL5Y%2BpN5hNe3OHinGW&X-Amz-Signature=d168a55aa62b38865114f028c65e1f7561ba9f5eeb9534c22d5d9402df4ab4e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject#notion_record=block.40b80bcd-a129-8060-97da-ccc5273d0f8f.b2967c35-35b3-40bc-9ee7-8de23921e915)
<empty-block/>
---
## 👥 3. User Personas (Target Audience Segmentation)
![](https://prod-files-secure.s3.us-west-2.amazonaws.com/b2967c35-35b3-40bc-9ee7-8de23921e915/56530ea8-bf94-4842-9354-784eb49e3c84/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SEQJF7I%2F20261101%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20261101T075226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDFQFwQvuwGMDIPCfhLx4B1inIUgwuHoTDWfbnK7Pwg%2FAiA%2FyXRe0Hsi5a%2F7DSDJTXPbQ1PXU7TmppWOFohvK%2BmbyCr%2FAwhfEAAaDDYzNzQyMzE4MzgwNSIMgIAHFB1TFMBvRt4YKtwD0fWsLnx7a%2Fmy6bNS%2BOgUAWXyGdNXKb9AAyufGP09qs5XZe%2B%2Fe4byDNz6TKkLepk10BJ7fUsdrj30DXaVTzLjDJxo8ox8cEbm5Ft0x4rtWuuze60ZJFXdqzIG4xg0O%2FBZ4eH7w5cs%2Fveq9WyulFj1rZKwwkA%2FwMgDP%2FaD7pty%2BGg8GgqRN9XUCMSQujgNRHjXLutomQB28%2FnILlSkBs8i6MW3Avsm66KgssSo9rSn9IamvBu%2FysPvnVV%2BLDjaNLCAWwiK%2FhdazU%2BlEilXoT89514RLIINBFX6dW%2FP6q%2FJBWgpiI8Ca%2F6yiDXaIPKlVcgUGYRRVSWp8YoOt28FitK3YEc36rhUrPIeU5APbCxoe4b9Le186HBNaRXkgl0u45ORF0IU8hxWJKpKAEd4Rt67HbI80mCerweP%2BwM1SrhwZWnJDFtsjKcd8j8j2iGjnhC7a4g%2FqYFFsEWXOiYyQZe1zTm%2ByhpSgT18hsUciezNMbH3UxIEvGUda2tPrqyjIVPnPAH87OTCy6N86E6PtsBYpL%2FLceH3Ll3PwkFAqoQNQVoeih0ovwOGG7Qi%2Fvp4z6sauQXjfviXx5jCb5jEAX1%2FQHAHHj7NpPSDjsYWqgprMXo5BaLcU0OV7y0wpg8wvKWb1wY6pgEZbABngjSk%2BeL0t03v%2FLnMEaBqIAYJsK5%2BiR2YYkgBV%2FbkDCsrStTwOX9JI9q1YsJdvqiLdXapWUHiYH2zE05XqKhoh6I9A3bJEsO3iyJiqIHc%2BmqdcNIcNrnRlICktRC2ncG1UUWuF0xJw0eM432Iq4sWVqUkQB2I6XQyuRmuIXi1p3ubFq87iYj4h1fkRgcuWHHRvkK8CwmL5Y%2BpN5hNe3OHinGW&X-Amz-Signature=4d571e54bee1780913e5ca2a8d28aa570bc16da22f25d13aab1854ab0663d228&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject#notion_record=block.40b80bcd-a129-807e-a078-f75e7ac78795.b2967c35-35b3-40bc-9ee7-8de23921e915)
<empty-block/>
---
## 🚀 4. Master Feature List & Strategic Alignment
<table header-row="true">
<colgroup>
<col width="215">
<col>
<col width="290">
<col width="359.6875">
<col width="141.515625">
</colgroup>
<tr>
<td>Feature Module</td>
<td>Target Personas</td>
<td>Core Value Proposition</td>
<td>User Problem Solved</td>
<td>Detailed Spec</td>
</tr>
<tr>
<td>**1. Subscription Pass & FTUX**</td>
<td>Rahul, Priya, Vikram</td>
<td>Compound savings (up to 15% off + ₹0 delivery + +5% bonus) with 10–35 days validity buffers.</td>
<td>Removes upfront commitment anxiety and fear of forfeited money.</td>
<td>[View FTUX Page](https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79)</td>
</tr>
<tr>
<td>**2. AI Playlist & Food Vault**</td>
<td>Priya, Ananya</td>
<td>1-tap 5-day rotation via AI dietary prompt OR user's 20-dish curated vault with zero repeat dishes.</td>
<td>Eliminates daily decision fatigue, menu monotony, and algorithmic distrust.</td>
<td>[View Playlist Page](https://app.notion.com/p/40b80bcda1298139bc3ff629601a16aa)</td>
</tr>
<tr>
<td>**3. Hybrid Split-Location Routing**</td>
<td>Priya, Sneha</td>
<td>1-tap Mon–Fri Office vs. Home address matrix with calendar WFH auto-detection.</td>
<td>Stops meals from arriving at empty office desks on remote workdays.</td>
<td>[View Routing Page](https://app.notion.com/p/40b80bcda12981859ad7db792c3487a0)</td>
</tr>
<tr>
<td>**4. 8 PM Smart Cut-Off Drawer**</td>
<td>Vikram, Priya</td>
<td>Proactive 8 PM preview via In-App & WhatsApp with 10 PM zero-waste lock and 1-tap swap/skip.</td>
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
<td>**6. 5-Day Streaks & Office Pods**</td>
<td>Rahul, Vikram</td>
<td>Gamified Mon–Fri completion rewards (Free Cold Brew) + consolidated 1:00 PM wave fleet drops.</td>
<td>Builds weekday dining habits while slashing last-mile logistics costs by 63%.</td>
<td>[View Streaks Page](https://app.notion.com/p/40b80bcda12981349a9beef85a7e2a69)</td>
</tr>
</table>
---
## 📈 5. Product Analytics & North Star Metrics
- **North Star Metric:** **Weekly Meal Plan Adherence Rate (**$`\ge 82\%`$**)**
- **Supporting Strategic KPIs:**
	- **FTUX Funnel Completion:** $`\ge 42\%`$ from onboarding landing.
	- **Prepaid Adoption:** $`\ge 58\%`$ users opting for Upfront Prepaid (+5% credit hook).
	- **Food Vault Adoption:** $`\ge 64\%`$ active subscribers curating $`\ge 8`$ dishes in their vault.
	- **Weekly Swap Frequency:** $`< 8\%`$ swaps in Vault mode vs. $`18\%`$ in Pure AI mode.
	- **Fleet Logistics CAC:** Reduced from ₹65/drop to **₹24/drop** in verified Office Pod towers.
	- **Month 1 Retention:** $`\ge 84\%`$ 30-day retention with $`< 3.5\%`$ refund requests.
<empty-block/>
<empty-block/>

---

---

## 🥊 6. Competitive Landscape & Strategic Market Positioning

> 💡 **Market Context & Opportunity Gap:**
> Traditional aggregators were engineered for spontaneous dinner splurges, saddling weekday lunch with ₹45–₹65 delivery/platform surcharges. While newer subscription experiments attempt to solve fee friction, they fall into the trap of single-merchant silos and rigid operational constraints. MealsOn bridges this gap with a multi-kitchen, habit-automated subscription engine designed specifically for modern hybrid workforces.

### 6.1 The Competitive Dilemma: Why Prior Models Failed

* **Local Tiffins & Dabbawalas:** Zero technology, single-kitchen monotony, cash-only transactions, and complete inflexibility when hybrid employees work from home.
* **First-Gen App Subscriptions (Swiggy Daily):** Strict calendar locks with forfeited meals. Users felt penalized whenever 2–3 lunches were missed, driving rapid monthly churn.
* **Diet & Health Subscriptions (EatFit / Food Darzee):** Niche and expensive (₹300–₹450/meal) with rigid single-commissary menus leading to fast palate fatigue.
* **Standard On-Demand Aggregators (Swiggy / Zomato On-Demand):** Infinite variety, but ₹45–₹65 in delivery, platform, and surge fees per lunch order makes daily usage economically unviable.
* **Zomato Subscriptions (Live Single-Merchant Model):** Solves delivery fee friction via flat-rate prepaid bundles, but **locks the user into a single restaurant**, forces **100% upfront capital commitment**, **disables Pluxee/Sodexo**, and **binds all days to a single delivery address**.

---

### 6.2 Deep Dive Teardown: Zomato Subscriptions vs. MealsOn

<table header-row="true">
<tr>
<td>Strategic Dimension</td>
<td>Zomato Subscriptions (Live Model Teardown)</td>
<td>MealsOn Scheduled Meals (Our Product)</td>
<td>Competitive Advantage / Defensibility</td>
</tr>
<tr>
<td><strong>Merchant & Kitchen Scope</strong></td>
<td>❌ <strong>Single-Restaurant Lock-In:</strong> User commits 100% of their 3/5/15 meals to 1 kitchen (e.g., <em>GharSe</em> or <em>Charcoal Eats</em>).</td>
<td>✅ <strong>Platform-Wide Multi-Kitchen Playlist:</strong> Rotates across top-rated local kitchens & partner brands (4.2★+).</td>
<td><strong>Eliminates Palate Fatigue:</strong> Users enjoy authentic regional rotation (e.g., Punjabi Mon, Bengali Wed, South Indian Fri) without switching subscriptions.</td>
</tr>
<tr>
<td><strong>Daily Menu Experience</strong></td>
<td>⚠️ <strong>Manual Daily Substitution:</strong> Fixed restaurant menu requiring manual day-by-day swaps via radio buttons.</td>
<td>✅ <strong>Dual-Engine Habit Automation:</strong> Mode A (AI Auto-Pilot with anti-monotony rules) OR Mode B (20-item curated Food Vault).</td>
<td><strong>Zero Daily Decision Fatigue:</strong> Lunch runs automatically on background rails without requiring daily app visits.</td>
</tr>
<tr>
<td><strong>Hybrid Location Routing</strong></td>
<td>❌ <strong>Single Static Address:</strong> All 5 or 15 days locked to one address and delivery slot.</td>
<td>✅ <strong>Mon–Fri Split-Location Matrix:</strong> Mon/Tue/Thu mapped to Office Pod; Wed/Fri mapped to Home with Calendar sync.</td>
<td><strong>Built for 3-2 Hybrid Reality:</strong> Seamlessly routes food to where the employee actually sits each day.</td>
</tr>
<tr>
<td><strong>Payment & Working Capital</strong></td>
<td>❌ <strong>100% Upfront Only:</strong> ₹567–₹2,235 collected upfront via UPI/Cards.</td>
<td>✅ <strong>Dual Financial Rail:</strong> Pay-per-meal via UPI AutoPay (₹0 upfront barrier) OR Upfront Prepaid with +5% bonus credit.</td>
<td><strong>Zero Commitment Anxiety:</strong> Dramatic reduction in upfront FTUX checkout drop-off.</td>
</tr>
<tr>
<td><strong>Corporate Tax-Free Meal Cards</strong></td>
<td>❌ <strong>Disabled / Unsupported:</strong> Pluxee (Sodexo) and Amex explicitly disabled at checkout.</td>
<td>✅ <strong>Native 1-Tap Corporate Rails:</strong> Native Pluxee, Zaggle, and corporate expense card binding.</td>
<td><strong>Unlocks Corporate Budgets:</strong> Taps into ₹2,500–₹3,500 monthly tax-free employee meal allocations.</td>
</tr>
<tr>
<td><strong>Perceived Value & Dish Pricing</strong></td>
<td>⚠️ <strong>Flat SKU Pricing Trap:</strong> Swapping a ₹410 dish for a ₹305 dish charges the same ₹199 flat rate.</td>
<td>✅ <strong>Allowance Cap + Difference Rollover:</strong> Unused dish budget is instantly refunded to lifetime wallet.</td>
<td><strong>Fair Value Guarantee:</strong> Users never feel financially penalized on simpler homestyle meal days.</td>
</tr>
<tr>
<td><strong>Operational Cut-Off SLA</strong></td>
<td>⚠️ <strong>Rolling 2-Hour Pre-Slot Window:</strong> Kitchens receive dispatch alerts 2 hours prior to slot.</td>
<td>✅ <strong>Proactive 8:00 PM Ping + 10:00 PM Batch Lock:</strong> Morning batch cooking (9:00–11:30 AM).</td>
<td><strong>Supply Predictability:</strong> Cuts kitchen food waste to &lt;3% and unlocks 25% lower base procurement prices.</td>
</tr>
<tr>
<td><strong>Fulfillment Economics</strong></td>
<td>❌ <strong>Individual Fleet Dispatches:</strong> Point-to-point rider dispatches per order.</td>
<td>✅ <strong>Office Pod Consolidated Batch Drops:</strong> 1 rider drops 15–25 meals in corporate towers at 1:00 PM.</td>
<td><strong>63% Lower Logistics CAC:</strong> Slashes per-drop last-mile cost from ₹65 down to ₹24/delivery.</td>
</tr>
</table>

---

### 6.3 Comprehensive 5-Way Market Comparison Matrix

<table header-row="true">
<tr>
<td>Evaluation Dimension</td>
<td>Local Tiffins / Dabbawalas</td>
<td>Standard On-Demand (Swiggy / Zomato)</td>
<td>Zomato Subscriptions (Prepaid Plan)</td>
<td>Health Subscriptions (EatFit / Darzee)</td>
<td>MealsOn Scheduled Meals (Our Product)</td>
</tr>
<tr>
<td><strong>Core Ordering Model</strong></td>
<td>Fixed offline verbal subscription</td>
<td>On-demand live order</td>
<td>Single-restaurant prepaid bundle</td>
<td>Rigid single-brand calendar pass</td>
<td><strong>Flexible Scheduled Pass + Dual-Mode Engine</strong></td>
</tr>
<tr>
<td><strong>Ancillary Order Fees</strong></td>
<td>₹0 (Built-in)</td>
<td>₹45–₹65 / meal (Delivery + Platform + Surge)</td>
<td><strong>₹0 Delivery + ₹0 Platform Fee</strong></td>
<td>Built into premium ticket</td>
<td><strong>₹0 Delivery Fee (Office Pod Batching)</strong></td>
</tr>
<tr>
<td><strong>Restaurant Variety</strong></td>
<td>❌ 1 fixed kitchen</td>
<td>✅ Infinite restaurants</td>
<td>⚠️ <strong>Locked to 1 chosen restaurant</strong></td>
<td>❌ 1 proprietary commissary</td>
<td><strong>✅ Multi-Kitchen Curation (Top 4.2+ ratings)</strong></td>
</tr>
<tr>
<td><strong>Daily Decision Fatigue</strong></td>
<td>Zero (Forced menu)</td>
<td>Severe (15–20 mins daily search)</td>
<td>Moderate (Select 5–15 days upfront)</td>
<td>Low (Fixed diet menu)</td>
<td><strong>Zero (AI Auto-Pilot OR 20-Dish Food Vault)</strong></td>
</tr>
<tr>
<td><strong>Fulfillment SLA</strong></td>
<td>Unpredictable (12:00–2:00 PM)</td>
<td>35–50 mins live waiting</td>
<td>15-minute slot (e.g., 12:15–12:30 PM)</td>
<td>Fixed morning drop</td>
<td><strong>15-Min Precision Window (1:00–1:15 PM)</strong></td>
</tr>
<tr>
<td><strong>Hybrid Location Routing</strong></td>
<td>❌ Fixed single location</td>
<td>⚠️ Manual address toggle daily</td>
<td>❌ <strong>1 address locked for all days</strong></td>
<td>❌ Fixed single address</td>
<td><strong>✅ Upfront Mon–Fri Split-Location Matrix</strong></td>
</tr>
<tr>
<td><strong>Skipped Meal Protection</strong></td>
<td>❌ 100% Forfeited</td>
<td>N/A (Pay as you go)</td>
<td>Reschedule inside validity period only</td>
<td>❌ Complex SLA / forfeited</td>
<td><strong>✅ 100% Rupee Rollover into Lifetime Wallet</strong></td>
</tr>
<tr>
<td><strong>Payment Options</strong></td>
<td>Cash / UPI monthly</td>
<td>Pay per order</td>
<td><strong>100% Upfront only</strong></td>
<td>100% Upfront only</td>
<td><strong>UPI AutoPay Mandate OR Upfront (+5% credit)</strong></td>
</tr>
<tr>
<td><strong>Corporate Tax Cards</strong></td>
<td>❌ Cash only</td>
<td>✅ Supported</td>
<td>❌ <strong>Pluxee/Sodexo disabled</strong></td>
<td>⚠️ Partial support</td>
<td><strong>✅ Native 1-Tap Pluxee & Zaggle support</strong></td>
</tr>
<tr>
<td><strong>Cut-Off Governance</strong></td>
<td>❌ Morning phone call</td>
<td>N/A</td>
<td>Rolling 2-hour pre-slot cut-off</td>
<td>24–48 hours prior</td>
<td><strong>8:00 PM WhatsApp Ping + 10:00 PM Batch Lock</strong></td>
</tr>
</table>

---

### 6.4 MealsOn’s Four Defensible Moats

1. 🌐 **The Multi-Kitchen Curation Moat (Zero Palate Fatigue):**
   * *The Problem:* Zomato Subscriptions locks users into a single restaurant chain (e.g., *GharSe* or *Charcoal Eats*) for their entire 5 or 15-day pack. Even the best cloud kitchen triggers sensory monotony and palate fatigue by Day 4, leading to high subscription drop-off.
   * *MealsOn Moat:* MealsOn decouples the meal pass from individual merchants. Users subscribe to an overarching tier and access a curated coalition of top-rated partner kitchens (4.2★+). Subscribers can have a North Indian thali on Monday from Kitchen A, a coastal fish curry on Tuesday from Kitchen B, and a high-protein salad on Wednesday from Kitchen C—all under one unified billing and delivery schedule.

2. 🚴 **The Fleet Cannibalization Moat (Clustered Drop Economics):**
   * *The Problem:* On-demand platforms dispatch gig drivers point-to-point, incurring ₹55–₹65 per single delivery run. Subsidizing this fee creates heavy unit-level burn.
   * *MealsOn Moat:* By aggregating workplace demand into **Office Pods** across tech parks and corporate towers, 1 rider drops 15–25 meals in a consolidated 1:00 PM batch run. This lowers last-mile logistics costs to **₹24/drop** (a 63% reduction), structurally enabling genuine zero-fee delivery.

3. 🍳 **The Kitchen Batch Economy Moat (Off-Peak Morning Prep):**
   * *The Problem:* On-demand kitchens receive erratic order bursts between 12:45 PM and 1:45 PM, creating kitchen chaos, driver wait delays, and 20–28% food inventory wastage.
   * *MealsOn Moat:* With a **10:00 PM night-before batch lock**, partner kitchens receive exact prep rosters before sleep. Chefs prepare orders during off-peak morning hours (9:00 AM – 11:30 AM) with **<3% food waste**, unlocking a **25% wholesale discount** on base meal procurement.

4. 📦 **The "Food Vault" Retention Moat (The IKEA Effect):**
   * *The Problem:* Aggregator meal passes experience steep Month-2 churn because browsing endless menus creates choice fatigue.
   * *MealsOn Moat:* Once a subscriber invests 2 minutes during onboarding to handpick **10–20 comfort favorites** into their **Food Vault**, switching costs become asymmetrical. The platform's anti-monotony engine rotates strictly within their personal vault, making the habit automatic and returning to daily menu scrolling feel high-friction.

<page url="https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79">1. Subscription Pass & Payment Onboarding (FTUX)</page>
<page url="https://app.notion.com/p/40b80bcda1298139bc3ff629601a16aa">2. AI Meal Playlist & Curated Food Vault</page>
<page url="https://app.notion.com/p/40b80bcda12981859ad7db792c3487a0">3. Hybrid Split-Location Routing</page>
<page url="https://app.notion.com/p/40b80bcda12981769de9dd8266d87c41">4. 8 PM Smart Cut-Off Drawer</page>
<page url="https://app.notion.com/p/40b80bcda1298180bb60e15c14f965e3">5. Pause Shield & Rollover Credits Wallet</page>
<page url="https://app.notion.com/p/40b80bcda12981349a9beef85a7e2a69">6. 5-Day Habit Streaks & Office Pod Drops</page>
<empty-block/>
<empty-block/>
<page url="https://app.notion.com/p/40b80bcda12980a4aa57ed7201b04083">Dump</page>