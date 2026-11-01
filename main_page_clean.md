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
7. [🥊 7. Competitor Landscape & Strategic Market Positioning](https://app.notion.com/p/40b80bcda12981be9c5dd3ba892f642c)
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

## 🥊 6. Competitive Landscape & Strategic Market Positioning

> 🎯 **Executive Summary & Moat Architecture:**
> For the complete, uncompressed competitive deep dive—including **Zomato's live Single-Merchant Subscription teardown**, the **comprehensive 5-way market comparison matrix**, and our **4 defensible moats**—refer to the dedicated subpage:
> 👉 **[🥊 7. Competitor Landscape & Strategic Market Positioning Subpage](https://app.notion.com/p/40b80bcda12981be9c5dd3ba892f642c)**

### 6.1 The Four Structural Defensible Moats

1. 🌐 **Multi-Kitchen Coalition Moat (Zero Palate Fatigue):**
   * *Zomato Lock-in:* Zomato Subscriptions locks users into a single restaurant brand (e.g. *GharSe* or *Charcoal Eats*) for all 5–15 days, causing sensory monotony and high Day-4 churn.
   * *MealsOn Moat:* Decouples passes from individual merchants. Users enjoy rotating regional curation across top-rated local kitchens (4.2★+) under one unified pass.
2. 🚴 **Fleet Cannibalization Moat (Clustered Batch Logistics):**
   * *On-Demand Friction:* Point-to-point dispatches cost ₹55–₹65/order, making free delivery an unsustainable cash drain.
   * *MealsOn Moat:* Pre-scheduled 1:00 PM **Office Pod drops** bundle 15–25 meals per corporate tower run, slashing last-mile cost to **₹24/drop** (63% logistics savings).
3. 🍳 **Kitchen Batch Economy Moat (Off-Peak Morning Prep):**
   * *Kitchen Chaos:* Erratic lunch rush orders trigger 20–28% food waste and delayed prep.
   * *MealsOn Moat:* **10:00 PM night-before batch lock** enables partner kitchens to cook during 9:00–11:30 AM off-peak hours with **<3% food waste**, unlocking a **25% wholesale discount**.
4. 📦 **"Food Vault" Retention Moat (The IKEA Effect):**
   * *Habit Moat:* Once a subscriber curates 10–20 personalized comfort favorites into their vault, returning to endless aggregator menus feels exhausting.

---
<page url="https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79">1. Subscription Pass & Payment Onboarding (FTUX)</page>
<page url="https://app.notion.com/p/40b80bcda1298139bc3ff629601a16aa">2. AI Meal Playlist & Curated Food Vault</page>
<page url="https://app.notion.com/p/40b80bcda12981859ad7db792c3487a0">3. Hybrid Split-Location Routing</page>
<page url="https://app.notion.com/p/40b80bcda12981769de9dd8266d87c41">4. 8 PM Smart Cut-Off Drawer</page>
<page url="https://app.notion.com/p/40b80bcda1298180bb60e15c14f965e3">5. Pause Shield & Rollover Credits Wallet</page>
<page url="https://app.notion.com/p/40b80bcda12981349a9beef85a7e2a69">6. 5-Day Habit Streaks & Office Pod Drops</page>
<page url="https://app.notion.com/p/40b80bcda12981be9c5dd3ba892f642c">7. Competitor Landscape & Strategic Market Positioning</page>
<empty-block/>
<empty-block/>
<page url="https://app.notion.com/p/40b80bcda12980a4aa57ed7201b04083">Dump</page>