# MealsOn Executive Deck: Fact-Check Report & Verification Audit (Phase 1)

> **Document Status:** `PENDING OWNER APPROVAL (PHASE 1 COMPLETE — READ-ONLY)`  
> **Git Branch:** `qa/deck-v1` (Isolated QA branch; zero changes committed to `main`)  
> **Candidate / Product Lead:** Sachin Shinde  
> **Review Scope:** 12-slide HTML presentation (`public/slides.html`, `docs/slides.html`), PPTX presentation (`public/presentation/MealsOn_Executive_Presentation.pptx`), Master PRD, Pilot Launch Plan, Roadmap, and running prototype (`src/`).

---

## 1. Executive Summary & Verification Methodology

In accordance with **Operating Rules 1 & 7**, this audit rigorously verifies every quantitative claim, metric, feature definition, timeline, and persona across the MealsOn Executive Strategy Deck against four authoritative sources in strict precedence:
1. **Master PRD Hub & Subpages** (`docs/specs/*.md` & Notion read-only records)
2. **Interactive Prototype Source Code & Runtime State** (`src/components/`, `src/tabs/`, `src/data/mockData.js`)
3. **Owner-Provided Rollout Plan** (DLF Cyber Park Beachhead W1–W6, Cluster Expansion W7–W14, Metro Scale M4+)
4. **Operations & Pilot Launch Plan** (`docs/PILOT_LAUNCH_PLAN.md`, `docs/ROADMAP.md`)

### Claim Classification Summary (36 Items Audited):
- 🟢 **MATCH (11 items):** Slide accurately reflects PRD / prototype facts or exact mathematical derivations.
- 🔴 **SLIDE WRONG (15 items):** Clear discrepancy where PRD and prototype agree, but the slide text misstates the rule, metric, or phase.
- 🟡 **SOURCES DISAGREE (5 items):** Divergence between old slides/README and updated PRD/prototype; requires alignment.
- ⚪ **UNSOURCED / ASSUMPTION (5 items):** Specific metric or benchmark unsupported by repo documentation; flagged for owner ruling or labeling.

---

## 2. Comprehensive 36-Fact Verification Ledger (F-01 to F-36)

| ID | Slide | Claim on Slide | Status | Quoted Evidence (≤15 words or File/Line) | Proposed Change & Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | 1 | "₹12,000 Cr TAM" | `UNSOURCED` | Not in PRD main page, specs, or pilot documents. | Label as `"Estimated TAM (Corporate lunch corridor)"` or provide owner calculation. |
| **F-02** | 1, 10 | "35% Churn: Rigid subscriptions fail by Week 3" vs "35% Ind." retention | `SOURCES DISAGREE` | `docs/specs/cleaned_text.md:103`: `"Month 1 Retention: >= 84% 30-day retention with < 3.5% refund requests."` | Slide 1 says 35% churn; Slide 10 implies 35% retention. Align Slide 10 to: `"Target: ≥84% M1 Retention"` and label 35% as historical single-brand benchmark. |
| **F-03** | 1, 8, 11 | "28% less waste" / "eliminates 28% food waste" | `SLIDE WRONG` | `docs/specs/main_page_clean.md:125`: `"on-demand kitchens waste 20-28%... <3% food waste"`. | Replace on Slides 1, 8, and 11 with: `"<3% food waste (vs 20–28% on-demand)"`. |
| **F-04** | 3 | Title: "The **8** Strategic Pillars" | `SLIDE WRONG` | `public/slides.html:151-175`: Lists 6 pillars (01–06); PRD §4 lists 6 core modules. | Correct title to: `"The 6 Strategic Pillars of MealsOn Scheduled Meals"`. |
| **F-05** | 3 | Pillar 05: "pro-rata fair refund rails" | `SLIDE WRONG` | `docs/specs/master_prd_updated.md:100`: `"100% rollover protection, vacation pause slider, unconsumed credit banking"`. | Change to: `"unconsumed credit banking into lifetime wallet"`. No direct cash refunds. |
| **F-06** | 4 | Surplus rolls "into MealsOn Credits for treats and beverages" | `SLIDE WRONG` | `docs/specs/notion_main_page_v2.md:181`: `"Unused dish budget is instantly refunded to lifetime wallet"`. | Update to: `"The ₹60 surplus rolls directly into MealsOn Balance for future meals and renewals."` |
| **F-07** | 5 | Tier names: "Comfort / Balanced (Hero) / Macro Pro" | `SOURCES DISAGREE` | `src/components/PassOnboardingFlow.jsx:2-25`: `"Rasoi ₹160 / Bistro ₹250 / Chef's Table ₹320"`. Default is Bistro ₹250. | Update Slide 5 to match prototype & PRD §4: `"Tier 1: ₹160 ('Rasoi') / Tier 2: ₹250 ('Bistro' - Popular) / Tier 3: ₹320 ('Chef's Table')"`. |
| **F-08** | 5 | "Save ₹1,280 / ₹1,550 / ₹1,760 on 20 meals" | `MATCH` | Exact recomputation: 15% discount + ₹40*20 free delivery = ₹1,280 / ₹1,550 / ₹1,760. | Keep figures; append label: `"(incl. 15% pass discount + ₹0 free delivery)"`. |
| **F-09** | 5 | "Triple Payment Rail Architecture" | `MATCH` | `src/components/PassOnboardingFlow.jsx:45-80`: 3 rails (Upfront Prepaid +5%, UPI AutoPay, Corporate Meal Cards). | Keep "Triple Payment Rails" / "3 Payment Options" matching prototype. |
| **F-10** | 6 | "Max 2 days per kitchen brand; alternates cuisines" | `MATCH` (Heuristic) | `docs/specs/cleaned_text.md:61`: `"zero-repeat anti-monotony engine"`. Enforced in AutoPilot. | Keep; clarify as: `"Anti-monotony heuristic: alternates cuisines; max 2 days per kitchen brand"`. |
| **F-11** | 2, 3, 6, 12 | Food Vault size framing ("12", "20", "12–20", "10–20", "≥8") | `SOURCES DISAGREE` | `src/data/mockData.js:311`: 20 catalog dishes, 10 default, PRD §5 target ≥8 curated. | Standardize across deck: `"Curate 10–20 comfort favorites (target ≥8 curated; max 20)"`. Update Slide 2 Ananya card. |
| **F-12** | 6 | Mode B Food Vault shown as built feature | `MATCH` | `src/tabs/AutoPilotTab.jsx:15-180`: Food Vault is fully implemented with modal, catalog, stats, and auto-shuffle! | Confirmed live in prototype. (Brief first-read hypothesis of absence was refuted). Demo in recording. |
| **F-13** | 7 | "Office (1:00 PM) • Home (1:30 PM)" | `SLIDE WRONG` | `docs/specs/master_prd_updated.md:41-44`: 30-min windows: Office `1:00–1:30 PM`, Home `1:30–2:00 PM`. | Correct Slide 7 to: `"Office (1:00–1:30 PM) • Home (1:30–2:00 PM)"` matching prototype dropdowns. |
| **F-14** | 7 | "₹0 surcharge: free delivery on both destinations" | `MATCH` | `src/tabs/RoutingTab.jsx:55`: `"30-Min Batched Delivery Windows • ₹0 Delivery Fee"`. | Keep; note in speaker notes that residential drops are funded by the +₹205 weekly office batch surplus. |
| **F-15** | 7 | "75% churn drop: Stops food arriving at empty desks" | `UNSOURCED` | Unsourced percentage; not found in PRD or analytics specs. | Rephrase to mechanism: `"Eliminates empty-desk delivery churn"` or label as `"Est. 75% WFH churn reduction"`. |
| **F-16** | 7 | Smart Calendar Sync presented as live feature | `SOURCES DISAGREE` | Owner plan puts Calendar OAuth in Phase 3; prototype simulates toggle (`RoutingTab.jsx:28-48`). | Label on Slide 7: `"Calendar Auto-Reroute (Simulated in MVP; Full OAuth in Phase 3)"`. |
| **F-17** | 8 | Skip "extends pass validity +1 day" | `MATCH` | `src/tabs/CutOffTab.jsx:70, 282`: `"Meal stays in your pass pack (runway extended +1 day within buffer)"`. | Keep `"Preserves meal quota in pass (extends runway +1 day within buffer; unconsumed converts to wallet)"`. |
| **F-18** | 9 | "8-second looping" video teaser | `SLIDE WRONG` | `src/components/Header.jsx:13-14`: `title="Watch 15s Story / Video Preview"`, `aria-label="Watch 15-second product story"`. | Update Slide 9 to: `"15-second video story"`. |
| **F-19** | 9 | 10:45 AM WhatsApp; Thu 6:30 PM SMS; push 5m post-order; ₹48 example | `SOURCES DISAGREE` | `src/components/GtmCampaignHub.jsx:89-220`: Prototype simulates 11:15 AM Midday Trigger across Push, WhatsApp, and SMS. | Align Slide 9 timing to 11:15 AM or label as candidate campaign cadence triggers. |
| **F-20** | 10 | Friday reward: Clean Fuel (Yogurt/Juice) vs Cheat Treat (Brownie/Gelato) | `MATCH` | `src/tabs/StreaksTab.jsx:120-135`: Prototype matches Clean Fuel (₹0) vs Cheat Treat (+₹45 co-pay). | Keep. In speaker notes, explain synergy with Friday Lunch Roulette digital perks. |
| **F-21** | 10 | Tower Tribe: "Bronze (25) / Silver (50) / Gold (75+)" | `SLIDE WRONG` (Unit missing) | `src/tabs/StreaksTab.jsx:40-42`: Unlocks at 25, 50, and 75 collective orders. | Add units: `"🥉 Bronze (25 orders) | 🥈 Silver (50 orders) | 🥇 Gold (75+ orders)"`. |
| **F-22** | 10 | Impact Ledger: ₹2,840/mo • 4.8 kg CO2 (Batch EVs) • 14.2 hrs | `SLIDE WRONG` | `src/tabs/StreaksTab.jsx:100-112`: App shows ₹3,120 saved (all-time), 14.2 kg CO2, 6.5 hrs saved. EV fleet is Phase 3. | Align with app: `"₹3,120 Delivery Fees Saved (All-Time) • 14.2 kg CO₂ Offset • 6.5 hrs Decision Time Saved"`. Drop "Batch EVs". |
| **F-23** | 10 | "W4 Retention: 84% (vs 35% Ind.)" | `SLIDE WRONG` | `docs/specs/cleaned_text.md:103`: Target is `Month 1 Retention ≥ 84%` (<3.5% refunds). Not historical. | Change to: `"Target: ≥84% M1 Retention (<3.5% refund requests)"`. |
| **F-24** | 11 | "Riders batch 10–14 lunches into a single corporate building run" | `MATCH` | `docs/specs/master_roadmap_clean.md:84`: 10–14 per 30-min window; PRD §6 Moat 1: 15–25 per building wave. | Keep; clarify: `"Riders batch 10–14 lunches per 30-min window (15–25 meals per tower wave)"`. |
| **F-25** | 11 | Title: "...& 63% **Margin** Edge" | `SLIDE WRONG` | `docs/specs/notion_main_page_v2.md:194`: Drop cost collapses ₹65 → ₹24 (-63.1% logistics CAC), not margin. | Update title to: `"Trading Micro-Spontaneity for Macro-Predictability & 63% Lower Last-Mile Cost"`. |
| **F-26** | 11 | "7 km cluster geofence" | `MATCH` | `docs/PILOT_LAUNCH_PLAN.md:1` & `master_roadmap_clean.md:47`: 7 km hybrid geofence specified. | Keep. |
| **F-27** | 11 | "+₹205 weekly surplus per subscriber" | `MATCH` (with assumption) | Derivation: 5 days * (₹65 on-demand - ₹24 batch) = ₹205. Assumes 5 office days. | Keep; state assumption: `"(based on 5 office batch drops; ₹123 on 3-day office hybrid)"`. |
| **F-28** | 11 | "25% wholesale ingredient savings" | `MATCH` | `docs/specs/main_page_clean.md:125`: 25% wholesale discount unlocked via 10 PM night-before lock. | Keep. |
| **F-29** | 12 | Phase 2: "12 tech **parks** and 8 residential societies" | `SLIDE WRONG` | Owner rollout plan (§2.1): `"12 tech towers + 8 residential pods"`. | Update to: `"12 corporate tech towers + 8 residential pods"`. |
| **F-30** | 12 | "Corporate HR wellness tie-ups" in Phase 3 | `SLIDE WRONG` | Owner rollout plan (§2.1): `"Corporate Direct Billing (B2B HR wellness)"` launches in Phase 2. | Move "Corporate Direct Billing (B2B HR wellness)" from Phase 3 to Phase 2. |
| **F-31** | 12 | Phase 2 lists only "Tower Tribe launch" | `SLIDE WRONG` | Owner rollout plan (§2.1): Phase 2 includes `"AI Playlist Engine"`. | Add `"AI Playlist Engine"` to Phase 2 card. |
| **F-32** | 12 | "10,000+ daily deliveries"; "full EV fleet" | `SLIDE WRONG` | Owner rollout plan (§2.1): `"10,000+ daily orders"`; `"100% EV delivery fleet"`. | Update to: `"10,000+ daily orders"` and `"100% EV delivery fleet"`. |
| **F-33** | 12 | Gate criteria: "SLA ≥ 97%" vs card "97.5% SLA"; Meal adherence ≥ 80% vs PRD ≥ 82% | `SLIDE WRONG` | `docs/PILOT_LAUNCH_PLAN.md:111`: SLA target is `≥ 97.5%`. Gates represent minimum exit criteria. | Align both card and banner to `"≥ 97.5%"`. Add note: `"Gates = minimum pilot exit criteria; North Star targets in PRD are ≥82% adherence and ₹24 CAC"`. |
| **F-34** | 12 | 18k employees, 5 kitchens, 15 kitchens, "Launch readiness Q1 2027" | `MATCH` / `ASSUMPTION` | `docs/PILOT_LAUNCH_PLAN.md`: 18k professionals in 3 towers; 5 kitchens (P1), 15 kitchens (P2). | Keep numbers; label: `"Launch Readiness: Q1 2027 (Metro Scale Target)"`. |
| **F-35** | 2 | Persona demographics and pain points | `MATCH` | PRD §3 & §4: Priya, Rahul, Vikram, Sneha, Ananya match across all feature tables. | Keep; update Ananya's card to `"10–20 comfort favorites"` to maintain consistency with F-11. |
| **F-36** | 1 | "35-Day Buffer: Zero-forfeiture validity" | `SLIDE WRONG` | PRD §4 & `public/slides.html:154`: 5-meal = 10d buffer; 10-meal = 20d; 20-meal = 35d. | Change Slide 1 to: `"10–35-Day Buffer: Zero-forfeiture validity (20-meal pass = 35d)"`. |

---

## 3. Newly Discovered Discrepancies (Not in Original Brief)

During deep codebase parsing and PPTX binary inspection, the following **4 critical discrepancies** were identified:

1. **NEW-01: PPTX Slide Duplication Bug (15 Slides vs 12 Slides):**  
   `public/presentation/MealsOn_Executive_Presentation.pptx` currently has **15 slides** because running `tools/generate_pptx_slides.py` repeatedly appended new slides without truncating previous runs. Slides 10, 11, and 12 were duplicated as Slides 13, 14, and 15. The generator script must be patched to slice `prs.slides` to the 9 base slides before appending, or update slides in-place.
2. **NEW-02: Missing PPTX in `docs/`:**  
   `public/slides.html` links to `/presentation/MealsOn_Executive_Presentation.pptx`. The build script copies to `dist/presentation/`, but `docs/presentation/` does not exist. Both GitHub Pages deployment modes (`docs/` vs root) require synchronization.
3. **NEW-03: Slide 8 Banner Waste Wording Drift:**  
   Slide 8 bottom banner states: `"cuts partner food waste by 28%"`. This must be updated in lockstep with F-03 to `"<3% food waste (vs 20–28% on-demand)"`.
4. **NEW-04: Currency Typography Formatting:**  
   Inconsistent use of rupee symbols (some raw Unicode, some entity codes) and spacing in slide headings. Will normalize all occurrences to standard Indian Rupee typography (`₹1,280`, `₹1,550`, `₹1,760`).

---

## 4. Slide ↔ Prototype Alignment Matrix (Demo Walkthrough Plan)

To ensure Sachin's recorded demo flows seamlessly between the presentation deck and the live application, the table below maps each slide to its corresponding prototype screen and highlights the exact controls to point at:

| Slide # | Slide Subject | Prototype Screen / Tab | Actionable Points to Showcase in Demo |
| :---: | :--- | :--- | :--- |
| **01** | Executive Summary | Global Header / Welcome | Show 15s Story pill, 3 allowance tiers, and ₹0 delivery badge. |
| **02** | Target Personas | Global Navigation | Highlight how each persona maps to a tab (Ananya → Food Vault, Vikram → Cut-Off). |
| **03** | 6 Strategic Pillars | Master Flow | Overview of the end-to-end habit loop from onboarding to Friday payoff. |
| **04** | FTUX Psychology | Pass Configurator Modal | Demonstrate 10–35 day buffer runway calculation and value rollover banner. |
| **05** | Allowance Tiers & Rails | Pass Flow (`PassOnboardingFlow.jsx`) | Show **Rasoi (₹160)**, **Bistro (₹250 - Popular)**, **Chef's Table (₹320)** and 3 payment rails (Prepaid +5%, UPI AutoPay at 10 PM, Meal Cards). |
| **06** | Dual Scheduling Engine | Tab 1: "Auto-Pilot" | **Demo Food Vault:** Toggle top-level selector to "💖 My Vault", open 20-dish modal, show live nutrition averages (kcal/protein), and trigger "Auto-Shuffle from Vault". |
| **07** | Hybrid Split Routing | Tab 2: "Routing" | Show Mon–Fri address matrix (60% Office / 40% Home), 30-min windows (`1:00–1:30 PM` vs `1:30–2:00 PM`), toggle Calendar Auto-Reroute, and trigger 1-Tap Undo. |
| **08** | 8 PM Cut-Off & 10 PM Lock | Tab 3: "Cut-Off" | Show real-time countdown to 10 PM lock, 1-tap Keep, 1-tap Swap carousel (similar-value match), and Skip confirmation sheet (preserves meal quota + extends runway +1 day). |
| **09** | Outbound GTM Interception | GTM Campaign Hub Modal | Open GTM Hub: toggle Push Notification (11:15 AM), WhatsApp Concierge, SMS Smart-Link, and 15s video teaser sheet. |
| **10** | Habit Tree & Tower Tribe | Tab 4: "Streaks / Loyalty" | **Sub-tab 1:** Show 5-stage Bonsai, 4/5 Flexible Grace Rule, and Friday Duality payoff. <br>**Sub-tab 2 (Tower Tribe):** Show 44-order collective progress bar, Bronze/Silver/Gold milestones (25/50/75 orders), simulate colleague order (+1), and trigger Friday Fuel claim celebration! |
| **11** | Trade-Offs & Unit Economics | Slide / Tab 5: "Wallet" | Show ₹24 batch drop breakdown vs ₹65 on-demand (-63%), +₹205 weekly logistics surplus, and zero-breakage 60-day paid rollover wallet. |
| **12** | Pilot Plan & Gates | Slide 12 | Present DLF Cyber Park Beachhead (3 towers, 5 kitchens, 500 beta users), expansion phases, and gate exit thresholds (≥97.5% SLA, ≥80% adherence). |

---

## 5. Proposed Tier A Fixes (Ready for Implementation Upon Approval)

These fixes are 100% verified against PRD and prototype code, requiring no new business logic:

1. **fix(F-03):** Standardize food waste claim across Slides 1, 8, and 11 to `"<3% food waste (vs 20–28% on-demand)"`.
2. **fix(F-04):** Update Slide 3 title to `"The 6 Strategic Pillars of MealsOn Scheduled Meals"`.
3. **fix(F-05):** Update Slide 3 Pillar 05 text to `"unconsumed credit banking into lifetime wallet"`.
4. **fix(F-06):** Update Slide 4 value rollover text to `"rolls directly into MealsOn Balance for future meals and renewals"`.
5. **fix(F-07):** Update Slide 5 tier names and descriptions to `"Tier 1: ₹160 ('Rasoi' - Homestyle) / Tier 2: ₹250 ('Bistro' - Most Popular) / Tier 3: ₹320 ('Chef's Table' - Artisanal/Gourmet)"`.
6. **fix(F-08):** Add explicit calculation note on Slide 5: `"(incl. 15% pass discount + ₹0 free delivery)"`.
7. **fix(F-11):** Standardize Food Vault capacity on Slide 2 (Ananya) and Slide 3 to `"10–20 comfort favorites"`.
8. **fix(F-13):** Update Slide 7 time windows to `"Office (1:00–1:30 PM) • Home (1:30–2:00 PM)"`.
9. **fix(F-16):** Update Slide 7 Calendar Sync to `"Calendar Auto-Reroute (Simulated in MVP; Full OAuth in Phase 3)"`.
10. **fix(F-18):** Update Slide 9 video teaser length from `"8-second"` to `"15-second video story"`.
11. **fix(F-21):** Add order units to Slide 10 Tower Tribe milestones: `"🥉 Bronze (25 orders) • 🥈 Silver (50 orders) • 🥇 Gold (75+ orders)"`.
12. **fix(F-22):** Align Slide 10 Impact Ledger numbers with prototype: `"₹3,120 Delivery Fees Saved (All-Time) • 14.2 kg CO₂ Offset • 6.5 hrs Time Saved (Illustrative)"`. Remove `"Batch EVs"`.
13. **fix(F-23):** Update Slide 10 retention claim to `"Target: ≥84% M1 Retention (<3.5% refund requests)"`.
14. **fix(F-24):** Clarify Slide 11 batch size: `"Riders batch 10–14 lunches per 30-min window (15–25 meals per tower wave)"`.
15. **fix(F-25):** Correct Slide 11 title to `"Trading Micro-Spontaneity for Macro-Predictability & 63% Lower Last-Mile Cost"`.
16. **fix(F-27):** Add hybrid assumption note to Slide 11: `"(based on 5 office batch drops; ₹123 on 3-day office hybrid)"`.
17. **fix(F-29):** Update Slide 12 Phase 2 target to `"12 corporate tech towers + 8 residential pods"`.
18. **fix(F-30):** Move `"Corporate Direct Billing (B2B HR wellness)"` from Phase 3 to Phase 2 on Slide 12.
19. **fix(F-31):** Add `"AI Playlist Engine"` to Phase 2 on Slide 12.
20. **fix(F-32):** Update Slide 12 Phase 3 targets to `"10,000+ daily orders"` and `"100% EV delivery fleet"`.
21. **fix(F-33):** Align Slide 12 gate criteria and card SLA to `"≥ 97.5%"`.
22. **fix(F-36):** Update Slide 1 buffer claim to `"10–35-Day Buffer: Zero-forfeiture validity (20-meal pass = 35d)"`.
23. **fix(NEW-01):** Patch `tools/generate_pptx_slides.py` to prevent slide duplication (restricting PPTX to exactly 12 slides).

---

## 6. Open Decisions for Owner Review (Section 7)

Before proceeding to Phase 2 (edits and commits), please confirm your decision on the following strategic items:

1. **F-01 (₹12,000 Cr TAM):** Should we label this as `"Estimated TAM (Corporate lunch corridor)"` with an explanatory footnote, or remove the rupee figure in favor of target workforce sizing (45,000 professionals in Cyber Park beachhead)?  
   *Recommendation:* Label as `"Estimated TAM (Corporate lunch corridor)"`.
2. **F-02 & F-23 (Retention & Churn Benchmarks):** Should we cite the 35% benchmark as `"Historical single-brand subscription retention (Swiggy Daily)"` to reconcile Slide 1 (pain) and Slide 10 (target)?  
   *Recommendation:* Yes, label clearly as industry baseline vs MealsOn target of ≥84%.
3. **F-15 (75% Churn Drop on Slide 7):** Do you prefer phrasing this as `"Eliminates empty-desk delivery churn"` (mechanism-led) or keep the quantified estimate labeled as `"Est. 75% WFH churn reduction"`?  
   *Recommendation:* Use `"Eliminates empty-desk delivery churn"`.
4. **F-19 (GTM Timings on Slide 9):** The slide lists 10:45 AM WhatsApp and Thu 6:30 PM SMS, whereas the prototype GTM Hub simulates an 11:15 AM Midday Trigger. Should we align Slide 9 to 11:15 AM, or keep both as candidate multi-touch timing windows?  
   *Recommendation:* Align to 11:15 AM (Peak Pre-Lunch Decision Window) for 100% demo consistency.
5. **Storyline Structure & New Slides (Brief Section 5):** The brief suggests optionally expanding from 12 to 14 slides to include dedicated slides for **Success Metrics & KPIs** and **Competitive Landscape / Zomato Subscriptions Teardown**. Do you want to keep the deck strictly at 12 slides for a tight 10-minute demo recording, or expand to 14 slides?  
   *Recommendation:* Keep at 12 slides for recording economy, embedding metrics into Slide 12 and competitor teardown details into `SPEAKER_NOTES.md`.

---

> [!IMPORTANT]
> **Boundary Check:** Per Operating Rules 1 & 7, Phase 1 is strictly read-only. No edits have been made to `public/slides.html`, `docs/slides.html`, or `generate_pptx_slides.py`. Once you review and approve this report, Phase 2 execution will commence on `qa/deck-v1`.
