# MealsOn Prototype: QA Audit Report (Phase 1)

**Date:** 2026-11-01  
**Repo:** https://github.com/AnimeFreak95/Assignment_MealOn  
**Branch under audit:** `qa/fixes-v1` (branched off `main` at `1f230ac`)  
**Audit Status:** Phase 1 Complete (Read-Only Audit). **Awaiting Product Owner Approval before making code edits.**

---

## 1. Executive Summary & Verification Matrix

Every issue from the brief was audited directly against the live code, running application runtime, and official specifications (`notion_main_page_v2.md` and `README.md`).

| Issue ID | Category | Status | Evidence Location | Summary & Proposed Action |
|:---|:---|:---|:---|:---|
| **B1** | Copy & Naming | **CONFIRMED** | `src/components/BottomNav.jsx:6`, `src/App.jsx:206`, `src/components/Header.jsx:69` | Tab is titled `"8PM Cut-Off"`, but the lock, countdown, skip, and billing occur at 10:00 PM. Change tab label to neutral `"Cut-Off"` and retain 8 PM only for notifications. |
| **B2** | Copy & Naming | **CONFIRMED** | `src/tabs/CutOffTab.jsx:540`, `README.md:55` | FAQ in app claims `"0% Food Waste"` and README claims `"eliminates 28% food waste"`. Align to PRD: `"Cuts kitchen food waste from 20–28% to <3%"`. |
| **B3** | Copy & Naming | **NOT REPRODUCED (Already Fixed)** | `src/components/SubscriptionFTUXFlow.jsx:706` | Corporate card option is already correctly grouped as `"Pluxee (Sodexo) / Zaggle"`. Not listed as separate duplicates. |
| **B4** | Copy & Naming | **CONFIRMED** | `src/tabs/WalletTab.jsx:68, 245`, `README.md:54` | `"Pause Shield"` is used ambiguously for both the Travel Pause slider and the Wallet Balance. Disambiguate to `"MealsOn Balance (Rollover Credits)"` and `"Travel Pause Shield (+Xd)"`. |
| **B5** | Copy & Naming | **CONFIRMED** | `README.md:28, 57-75` | README has outdated "New:" markers, refers to cool slate `#F8FAFC` as "Warm Alabaster", numbers Loyalty inconsistently, and omits Food Vault Mode B. Propose clean updates. |
| **B6 / D7** | Feature / Spec | **DECIDE (Needs Decision)** | `src/tabs/StreaksTab.jsx`, `notion_main_page_v2.md:104` | PRD says "Habit Streaks / Free Cold Brew"; prototype implements "Healthy Week Tree / Choice of Clean Fuel or Cheat Treat". Needs owner choice. |
| **C1** | Functional | **CONFIRMED** | `src/tabs/StreaksTab.jsx:137-145` | Impact ledger displays mature 48-order metrics (₹3,120 saved) even on day 1 for a new user. Add `"Sample 3-Month Projection"` / demo badge without altering data model. |
| **C2** | Functional | **CONFIRMED** | `src/tabs/CutOffTab.jsx:33` | Hardcoded initial state `1h 48m 12s` simulates countdown, but cannot demonstrate post-10 PM lock state or morning state. Add presenter demo clock buttons (`8:05 PM`, `9:55 PM`, `10:01 PM`) behind presenter audio bar. |
| **C3** | Functional / Edge Cases | **CONFIRMED (Report Only)** | Multiple modules | Missing edge cases documented in Section 3 (Payment decline, corporate reload, out-of-stock, post-10 PM lock). Kept read-only per brief. |
| **D-UX1** | Accessibility | **CONFIRMED** | `tailwind.config.js`, UI text | Tangerine (`#FF5A1F`), Emerald (`#10B981`), Amber (`#F59E0B`) on white/light backgrounds fail WCAG AA (4.5:1) for small text. Define dark text tokens (`#C2410C`, `#047857`, `#B45309`). |
| **D-UX2** | Viewport | **CONFIRMED** | `index.html:6` | `viewport-fit=cover` and `<meta name="theme-color" content="#0F172A">` are missing in `index.html`. Add them to clear iOS home indicator. |
| **D-UX3** | Touch Targets | **CONFIRMED** | `src/tabs/RoutingTab.jsx`, `src/tabs/AutoPilotTab.jsx` | Minor touch areas (e.g., weekday chips, macro pills) are <44px. Add touch target padding (`p-1` / `min-h-[44px]`). |
| **D-UX4** | Audio & Motion | **CONFIRMED** | `src/utils/audioDelight.js`, `index.css` | AudioContext created before user gesture warning on iOS; add `prefers-reduced-motion` to CSS confetti/bounce animations. |
| **D-UX5** | Keyboard Overlap | **CONFIRMED** | `src/tabs/AutoPilotTab.jsx:550` | AI prompt box can be obscured when soft keyboard opens on mobile. Add scroll-into-view handling on focus. |
| **D-UX6** | Offline Fonts & Favicon | **CONFIRMED** | `index.html:7-9` | Relies on Google Fonts CDN for initial font fetch; add system font fallback stack and replace play-button SVG favicon with meal Bento box SVG. |
| **E1** | Repo Hygiene | **CONFIRMED** | Repo root (37 debris files) | 37 transient files from Notion MCP/sync scripts identified. Cataloged and staged for move/cleanup after approval. |
| **E2** | GitHub Pages & Build | **CONFIRMED** | `vite.config.js`, `package.json` | Single-file build passes cleanly (`vite-plugin-singlefile`), offline `dist/index.html` verified via `file://`. `gh-pages` deploy script confirmed. |

---

## 2. Detailed Findings by Category

### Category B: Copy and Naming

#### B1. "8PM Cut-Off" label vs 10 PM lock [CONFIRMED]
- **Evidence:**
  - `src/components/BottomNav.jsx:6`: `{ id: 'cutoff', label: '8PM Cut-Off', icon: Clock, badge: 'Live' }`
  - `src/App.jsx:206`: `{ id: 'cutoff', label: '8PM Cut-Off', icon: Clock }`
  - `src/components/Header.jsx:69`: `title="8 PM Cut-Off Notifications"`
  - While inside the tab, the hero timer counts down to **10:00 PM**, dishes lock at **10:00 PM**, skips are free until **10:00 PM**, and AutoPay debits trigger at **10:00 PM**.
- **Proposed Fix:**
  - Rename tab in bottom navigation and headers to **`"Cut-Off"`** (or **`"10 PM Cut-Off"`**).
  - Retain "8 PM" strictly for the channel preview header (*"8:00 PM Proactive Evening Check-In"*).

#### B2. Waste-reduction claim [CONFIRMED]
- **Evidence:**
  - `src/tabs/CutOffTab.jsx:540`: Displays badge `"0% Food Waste"` (statistically impossible).
  - `README.md:55`: Says `"eliminates 28% food waste"`.
  - `notion_main_page_v2.md:174, 293`: Specifically states: *"Cuts kitchen food waste from on-demand 20–28% to <3%"*.
- **Proposed Fix:**
  - Change `CutOffTab.jsx` stat card from `"0% Food Waste"` to `"<3% Food Waste"`.
  - Change subtitle to `"Cuts industry 28% waste to <3% via 10 PM lock-in"`.

#### B3. "Pluxee / Sodexo" listed as separate cards [NOT REPRODUCED]
- **Evidence:**
  - Checked `src/components/SubscriptionFTUXFlow.jsx:706`: It already states `"Pluxee (Sodexo) / Zaggle"`.
  - Zaggle and Pluxee are shown as combined corporate benefits cards, not separate duplicates.
- **Action:** No code change needed.

#### B4. Terminology: "Pause Shield" overloaded [CONFIRMED]
- **Evidence:**
  - `src/tabs/WalletTab.jsx:68`: `"Pause Shield Balance: X Credits"`
  - `src/tabs/WalletTab.jsx:245`: `"+2d Pause Shield"` (for vacation travel slider).
  - `README.md:54`: `"banks credit into the Pause Shield wallet"`.
  - Users are confused whether "Pause Shield" is their money or their travel days.
- **Proposed Fix:**
  - For rollover cash credits: use **`"MealsOn Balance (Rollover Credits)"`** or **`"Meal Credits"`**.
  - For vacation pause: use **`"Travel Pause Shield (+Xd)"`**.

#### B5. README Hygiene [CONFIRMED]
- **Evidence:**
  - README line 23 has outdated `"New:"` badge from previous branch.
  - Line 78 calls `#F8FAFC` "Warm Alabaster" (it is Slate-50, a cool grey).
  - Loyalty section is unnumbered or inconsistently formatted.
  - Omits Food Vault mode which is present in code.
- **Proposed Fix:**
  - Update README with accurate token naming, remove obsolete feature branch tags, number Section 5 consistently, and document the 20-dish Food Vault mode.

---

### Category C: Functional & Journey

#### C1. Impact Ledger on a New-User State [CONFIRMED]
- **Evidence:**
  - `src/tabs/StreaksTab.jsx:136-145`: Hardcodes ₹3,120 delivery fees avoided, 18.4L fuel, 14.2kg CO2, 6.5 Hrs time saved.
  - A user who just purchased a 5-day or 10-day pass sees lifetime metrics for ~48 meals.
- **Proposed Fix (Minimal, No Complex Modeling):**
  - Add a pill badge above the ledger: `📊 3-Month Projected Impact (Based on Cyber Park Pod Averages)`.
  - Add a toggle or footnote: *"Simulated demonstration of compounding habit savings"*.

#### C2. Countdown Depends on Real/Static Clock [CONFIRMED]
- **Evidence:**
  - `src/tabs/CutOffTab.jsx:33`: `useState(1 * 3600 + 48 * 60 + 12)` is static. It always starts at 1h 48m. If a user leaves it running, it eventually reaches 0, but there is no way for an interviewer or reviewer to see the **Locked post-10 PM state** or the **Morning batch cook state**.
- **Proposed Fix:**
  - In presenter controls area (top presentation bar alongside audio toggle), add a **"⏰ Demo Clock"** pill switcher:
    - `8:00 PM (Just Opened - 2h left)`
    - `9:55 PM (Urgent - 5m left)`
    - `10:01 PM (Locked - Kitchen Cooking)`
  - When set to `10:01 PM`, the Cut-Off tab shows the real post-lock UI: Keep/Swap/Skip disabled, kitchen badge showing *"Locked for 6 AM Batch Cooking"*.

#### C3. Missing States [REPORT ONLY]
As required by the brief, the following edge case states are currently absent or simulated:
1. **Payment Failures:** UPI mandate rejection / payment gateway timeout has no error retry screen.
2. **Corporate Card Shortfall:** No "Insufficient balance → Split payment with UPI" drawer.
3. **Out of Stock at Swap:** All 3 alternative dishes are always available.
4. **Address Serviceability:** Office/Home locations are hardcoded mock addresses; no geolocation serviceability check.
*Per rule 3 and C3, these will remain documented in the PRD and will not be built without explicit owner request.*

---

### Category D: Mobile UI/UX & Accessibility

#### D-UX1. Colour Contrast [CONFIRMED]
- **Calculated Ratios on White (`#FFFFFF`):**
  - Brand Tangerine (`#FF5A1F`): **3.1:1** (Fails WCAG AA 4.5:1 for text <18pt)
  - Brand Emerald (`#10B981`): **2.5:1** (Fails WCAG AA)
  - Brand Amber (`#F59E0B`): **2.1:1** (Fails WCAG AA)
- **Proposed Fix:**
  - Keep brand fills for backgrounds, large banners, badges, and button shapes.
  - For small text labels on white/light backgrounds, configure and apply accessible text variants:
    - Text Tangerine: `#C2410C` (Tailwind `orange-700`, **4.8:1** ✅)
    - Text Emerald: `#047857` (Tailwind `emerald-700`, **4.6:1** ✅)
    - Text Amber: `#B45309` (Tailwind `amber-700`, **4.7:1** ✅)
  - For white text on tangerine buttons: ensure font is `text-sm font-extrabold` (≥14px bold) or use `#E04812` for enhanced contrast.

#### D-UX2. Safe Area & Viewport [CONFIRMED]
- **Evidence:** `index.html` has `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. It lacks `viewport-fit=cover`.
- **Proposed Fix:**
  - Update to `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />`.
  - Add `<meta name="theme-color" content="#0F172A" />`.
  - Add `pb-[env(safe-area-inset-bottom)]` to the fixed bottom navigation bar.

#### D-UX3. Touch Targets [CONFIRMED]
- **Evidence:**
  - Day pills (Mon–Fri) in `RoutingTab.jsx` and filter chips in `AutoPilotTab.jsx` have interactive bounding boxes around ~32px height.
- **Proposed Fix:**
  - Add `min-h-[44px]` touch target sizing or invisible padding wrappers (`py-2.5 px-3`) to guarantee 44×44px hit areas on mobile touchscreens without disturbing visual density.

#### D-UX4. Motion and Sound [CONFIRMED]
- **Evidence:**
  - AudioContext in `src/utils/audioDelight.js` initializes eagerly upon helper function load.
  - CSS confetti and bounce animations do not query `@media (prefers-reduced-motion: reduce)`.
- **Proposed Fix:**
  - Ensure `audioCtx` is only instantiated inside a direct user event handler.
  - Add `@media (prefers-reduced-motion: reduce) { .cta-bounce, .confetti-particle { animation: none !important; transition: none !important; } }` in `index.css`.

#### D-UX5. Keyboard Overlap [CONFIRMED]
- **Evidence:** Focus on the AI prompt textarea in `AutoPilotTab.jsx` does not scroll the input into view above a virtual keyboard.
- **Proposed Fix:** Add `onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}`.

#### D-UX6. Fonts Offline & Favicon [CONFIRMED]
- **Evidence:**
  - `index.html` loads fonts from `fonts.googleapis.com`.
  - Favicon in `index.html:4` is a generic triangle play button: `<path d='M12 2C6.48 2 ... m-1 14.5v-9l6 4.5-6 4.5z'/>`.
- **Proposed Fix:**
  - Add a robust system font stack fallback in `tailwind.config.js`: `sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']`.
  - Replace the play button SVG favicon with a bento food box SVG icon in tangerine.

---

### Category E: Repo Hygiene

#### E1. Root-Level Scratch Files [CATALOGED]
We found **37 files** in the root directory that were generated during previous Notion PRD syncs and testing. **No secrets or authentication tokens are exposed in these files** (only public Notion page IDs and markdown content).

**Classification & Recommendation:**

| File Group | Files | Purpose | Recommended Action |
|:---|:---|:---|:---|
| **PRD Source Specs** | `notion_main_page_v2.md`, `cleaned_text.md`, `main_page_clean.md`, `notion_updated.md`, `notion_current_content.md` | Source markdown documents for PRD | Move to `/docs/specs/` |
| **MCP / Sync Scripts** | `update_notion.py`, `run_update.py`, `make_mcp_call.py`, `print_args.py`, `print_clean.py`, `print_snippet.py`, `update_main_hub_section6.py` | Helper scripts used to push PRD updates to Notion | Move to `/tools/notion/` |
| **Payload Artifacts** | `payload.json`, `payload_test.json`, `args.json`, `args_update.json`, `call_payload*.json`, `escaped_for_tool.json`, `formatted_tool_args.json`, `single_line_args.json`, `ready_payload.json`, `push_payload.json`, `subpage_*.json`, `update_*.json`, `block_ids_to_delete.json`, `p1*.txt`, `p2.txt`, `section_6_to_insert.txt` | Temporary JSON arguments for API calls | **Delete from repo root** and add `*.payload.json`, `tool_call_*.json` to `.gitignore` |

#### E2. GitHub Pages Deployment [CONFIRMED]
- `vite.config.js`: `base: './'` ensures relative path resolution for both local offline `file://` execution and GitHub Pages hosting.
- `package.json`: Contains `"deploy": "gh-pages -d dist"` and `"homepage": "https://animefreak95.github.io/Assignment_MealOn/"`.
- Production build passes with zero external network dependencies via `vite-plugin-singlefile`.

---

## 3. Needs Owner Decision (Section 4)

Per operating rule 4, the following items require your explicit decision before any changes are made:

### A1. Food Vault Visibility in README
- **Finding in Code:** The 20-dish curated Food Vault is **already implemented** in `src/components/FoodVaultModal.jsx` and accessible in `AutoPilotTab.jsx` via the `Curated Food Vault (12/20)` button.
- **Issue:** The README only highlights the AI Auto-Pilot generator and does not document Mode B (The Food Vault).
- **Proposed Default:** Update the README to proudly document both Mode A (AI Auto-Pilot) and Mode B (20-Dish Curated Food Vault).
- 👉 *Owner Decision needed:* Approve documenting the existing Food Vault in README? `[YES / NO]`

### D2. Three Expiry Rules Harmonization
- **Finding:**
  - FTUX pass configurator offers 10, 20, and 35-day pass buffers.
  - Wallet Tab mentions "45-Day Flexible Pass Guarantee".
  - Notion PRD Feature 5 specifies 60-day rollover validity for prepaid credits.
- **Proposed Default:** Harmonize copy: The Pass duration validity is determined by the selected tier buffer (10/20/35 days); skipped meal rollover cash is valid for 60 days on renewal. Remove the hardcoded "45-Day" label from `WalletTab.jsx`.
- 👉 *Owner Decision needed:* Approve aligning the label to dynamic pass buffer days? `[YES / NO]`

### D3. Skip Compensation: Rollover Credit vs. +1 Day Extension
- **Finding:** Currently, skipping a prepaid meal adds +1 credit to the wallet **and** the vacation slider extends dates.
- **Proposed Default:**
  - Meal Skip = 100% money rollover into wallet balance (60 days validity).
  - Travel Pause (1–5 days) = Subscription calendar end-date extension.
  - Do not double-compensate on regular single-meal skips.
- 👉 *Owner Decision needed:* Confirm single-meal skip = wallet credit only? `[YES / NO]`

### D4. Friday Perk "₹0 Courier Cost" vs Home/Office Routing
- **Finding:** The Friday treat is advertised as "funded by consolidated Office Pod batching savings". However, the default 3-2 hybrid routing assigns Friday to **Home (WFH)**, where solo delivery would apply.
- **Proposed Default:** Clarify copy: Friday treat ships *inside the same meal bento box* at ₹0 extra courier cost regardless of address; Pod batching funds the reward pool across the week.
- 👉 *Owner Decision needed:* Approve this copy clarification? `[YES / NO]`

### D5. Swap Pricing Model
- **Finding:** Cut-Off drawer says "Equal-value replacements (₹190)". PRD says cheaper swaps credit the difference to wallet.
- **Proposed Default:** Keep replacement meals within the allowance tier; add note in swap drawer: *"Dishes within your plan allowance tier (₹160 / ₹250 / ₹320)"*.
- 👉 *Owner Decision needed:* Approve this wording? `[YES / NO]`

### D6. UPI AutoPay vs Pass Discount Copy
- **Finding:** In Checkout, selecting UPI AutoPay shows "Pass Activated". But AutoPay is ₹0 upfront per-meal billing.
- **Proposed Default:** Clarify checkout modal for AutoPay: *"UPI AutoPay Mandate Active — ₹0 charged today. Daily debits at 10 PM only for confirmed meals."*
- 👉 *Owner Decision needed:* Approve this modal copy distinction? `[YES / NO]`

### D7. Streak Naming & Reward Option
- **Finding:** PRD mentions "Habit Streaks" with "Free Cold Brew". Prototype implements "Healthy Week Tree" with a choice between Clean Fuel (*Fudgy Whey Protein Bar*) or Cheat Treat (*Caramel Cold Brew*).
- **Proposed Default:** Retain the richer dual-choice reward implemented in prototype; document this as the official specification.
- 👉 *Owner Decision needed:* Confirm keeping the dual-reward choice in the prototype? `[YES / NO]`

### D8. AI Prompt Budget vs Tier Allowance
- **Finding:** The AI prompt box says "under ₹250/meal", but user might select the ₹320 Macro Pro tier.
- **Proposed Default:** Dynamically sync the prompt text and budget chip with the user's active tier (`under ₹${tierAllowance}/meal`).
- 👉 *Owner Decision needed:* Approve dynamically binding budget prompt to tier? `[YES / NO]`

---

## 4. Proposed Execution Plan (Phase 2)

Upon your approval, we will execute Phase 2 on branch `qa/fixes-v1` with one commit per verified issue:

1. **Commit 1 (`fix(B1)`):** Rename bottom nav / headers to `"Cut-Off"`, reserving 8 PM for the evening notification label.
2. **Commit 2 (`fix(B2)`):** Align kitchen waste stats in `CutOffTab.jsx` from "0%" to "<3% waste (down from 28%)".
3. **Commit 3 (`fix(B4)`):** Disambiguate "Pause Shield" into "MealsOn Balance (Rollover Credits)" and "Travel Pause Shield".
4. **Commit 4 (`fix(B5)`):** Clean README hygiene (colors, numbering, Food Vault documentation).
5. **Commit 5 (`fix(C1)`):** Add "Sample 3-Month Projection" context banner to StreaksTab Impact Ledger.
6. **Commit 6 (`fix(C2)`):** Add presenter "Demo Clock" toggle (`8:00 PM` / `9:55 PM` / `10:01 PM`) to showcase post-lock state.
7. **Commit 7 (`fix(D-UX1)`):** Update text colors in `tailwind.config.js` to WCAG AA-compliant 4.5:1 variants on light backgrounds.
8. **Commit 8 (`fix(D-UX2)`):** Add `viewport-fit=cover`, theme-color, and safe-area padding to `index.html` and bottom nav.
9. **Commit 9 (`fix(D-UX3)`):** Ensure 44×44px minimum touch targets across weekday pills and filter chips.
10. **Commit 10 (`fix(D-UX4)`):** Safeguard Web Audio initialization and add `prefers-reduced-motion` CSS rules.
11. **Commit 11 (`fix(D-UX5)`):** Add scroll-into-view on focus for mobile prompt inputs.
12. **Commit 12 (`fix(D-UX6)`):** Add offline system font stack in Tailwind and replace play favicon with Bento food icon.
13. **Commit 13 (`chore(E1)`):** Move PRD markdown specs to `/docs/specs/`, move MCP tools to `/tools/notion/`, and delete transient JSON payloads.

---

**Phase 1 Complete. Ready for owner feedback on the decisions above.**
