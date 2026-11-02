#!/usr/bin/env python3
"""
Generates an interactive, responsive 16-slide HTML presentation for MealsOn Scheduled Meals.
- Matches Gamma's dark luxury charcoal design (#0F172A / #1E293B).
- Features full keyboard navigation (Arrows, Space, Fullscreen 'F', Overview 'O').
- Includes embedded visual mockups, category kickers, high-density cards, and bottom banners.
- Generates outputs to public/slides.html, dist/slides.html, docs/presentation/slides.html, and public/presentation/index.html.
"""

import os

slides_data = [
    {
        "num": 1,
        "cat": "Product Experience & North Star",
        "title": "MealsOn: Transforming Weekday Lunch into a Trusted, Automated Habit",
        "subtitle": "Flexible, automated, community-driven lunches removing decision fatigue, hybrid friction, and forfeiture anxiety.",
        "left_tag": "CORE PRODUCT THESIS",
        "left_title": "Routine Without Rigidity",
        "bullets": [
            ("Automate Routine Without Locking In", "10-20 meal smart playlists eliminate 18-22 mins of daily menu browsing while preserving 1-tap swaps."),
            ("Protect Value When Plans Change", "Zero forfeiture: 100% of unused skipped meals convert into Rupee Rollover balance with a 35-day validity buffer."),
            ("Consolidate Friction into Community Drops", "Batching 10-14 colleague deliveries per tower collapses drop cost from ₹65 to ₹24 per meal.")
        ],
        "image": "presentation/images/image4.jpg",
        "banner": "🎯 North Star: Deliver consistent, wholesome weekday lunches at 63% lower delivery friction with zero wasted rupees."
    },
    {
        "num": 2,
        "cat": "Entry Experience & Allowance Tiers",
        "title": "Frictionless Onboarding: Transparent Tiers & Real-Time Dynamic Receipt",
        "subtitle": "Interactive onboarding calculates effective per-meal rates and free delivery savings live before checkout.",
        "left_tag": "ONBOARDING STEPS",
        "left_title": "Scale Naturally With Work Rhythm",
        "bullets": [
            ("01. See the Value", "Live savings calculator frames scheduled meals as ₹1,240/mo saved + 4 hours reclaimed."),
            ("02. Choose Your Rhythm", "3 Allowance Tiers: Rasoi (₹160 Comfort), Bistro (₹250 Balanced), Chef's Table (₹320 Pro)."),
            ("03. Configure Your Pass", "Select 5, 10, or 20 meals with progressive 5%, 10%, and 15% tier volume discounts."),
            ("04. Watch Savings Live", "Dynamic receipt computes: Base ₹3,200 - 15% discount - ₹1,300 delivery fee = ₹136/meal!"),
            ("05. Interactive Prototype Shell", "Top Persona Switcher (Rahul / Priya / Sneha) + GTM Multi-Channel Acquisition Simulator.")
        ],
        "image": "presentation/images/image5.png",
        "banner": "💡 Built-In Runway: A 20-meal pass carries a 35-day validity buffer, completely removing consumption anxiety."
    },
    {
        "num": 3,
        "cat": "Checkout Architecture & Financial Rails",
        "title": "Zero-Cash-Lock Barrier: Reversible Default Rail with Prepaid Upside",
        "subtitle": "Eliminate upfront commitment friction while preserving attractive incentives for committed power users.",
        "type": "3cards",
        "cards": [
            {
                "tag": "DEFAULT RAIL",
                "tag_col": "text-emerald-400",
                "title": "UPI AutoPay (₹0 Upfront)",
                "bullets": [
                    "₹10 Pre-Authorization Mandate: Validates mandate without taking upfront cash.",
                    "Night-Before Pay-As-You-Eat: Deducts meal price only at 10 PM lock.",
                    "Reversible Commitment: Skip a meal before 10 PM and zero money is debited.",
                    "Conversion Surge: Reduces onboarding drop-off by 68% compared to ₹3,000+ upfront plans."
                ]
            },
            {
                "tag": "OPTIONAL UPSIDE",
                "tag_col": "text-orange-400",
                "title": "Prepaid Pass (+5% Bonus)",
                "bullets": [
                    "Upfront Liquidity Incentive: Grants extra 5% wallet cashback for upfront payment.",
                    "5, 10, or 20 Meals: High-repetition volume tier discounts built-in.",
                    "100% Value Safety Net: Unused skipped meals automatically convert to Rupee credits.",
                    "High Retention: Users with prepaid passes exhibit 2.4x higher 30-day meal streak completion."
                ]
            },
            {
                "tag": "WORKPLACE FIT",
                "tag_col": "text-indigo-400",
                "title": "Corporate Meal Benefits",
                "bullets": [
                    "Pluxee, Sodexo & Zaggle: Direct API integrations at checkout.",
                    "Tax-Exempt Wallet: Allows salaried corporate users to exhaust monthly meal allowances.",
                    "Split Billing: Seamlessly splits payments between corporate wallet and personal UPI.",
                    "B2B Enterprise Integration: Enables HR teams to co-subsidize healthy office lunches."
                ]
            }
        ],
        "banner": "💳 Payment Strategy: UPI AutoPay serves as the low-friction on-ramp; corporate benefits & prepaid bonuses drive lifetime wallet share."
    },
    {
        "num": 4,
        "cat": "Scheduling Engine & UI Architecture",
        "title": "Dual-Engine Planner UI: Food Vault (Phase 1) & AI Co-Pilot (Phase 2)",
        "subtitle": "Unified UI with top pill toggle: [💖 My Food Vault (20)] trust anchor + [✨ AI Playlist] auto-pilot.",
        "left_tag": "PROTOTYPE UI SUITE & MICRO-INTERACTIONS",
        "left_title": "Deterministic Trust + AI Discovery",
        "bullets": [
            ("Top Pill Toggle (Vault vs AI)", "Phase 1: 15–20 approved meals guarantee zero surprises; Phase 2: Generates 5-day playlists from NL prompts."),
            ("4-Action Meal Card Suite", "1) 🔄 1-Tap Swap (±₹20 parity covered 100%), 2) ↕️ Drag-and-drop weekday reordering, 3) ⇄ Location Flip, 4) ⏭️ Skip & Bank."),
            ("Contextual Calendar Sync Badge", "Prototype UI displays [📅 Synced: WFH Detected] or [📅 Client Meeting] to trigger automatic location shifts."),
            ("Anti-Palate Fatigue Algorithm", "Curates 80% familiar comfort favorites + 20% chef discovery on Friday, eliminating routine monotony.")
        ],
        "image": "presentation/images/image9.png",
        "banner": "🤖 Phased Delivery: Food Vault eliminates day-1 ML hallucination risk; AI Playlist adds intelligence once taste profiles are locked."
    },
    {
        "num": 5,
        "cat": "Hybrid Work Logistics Engine",
        "title": "Hybrid Split-Location Routing: Calendar-Aware Multi-Address Matrix",
        "subtitle": "Built for the 3-2 hybrid corporate reality: deliveries follow the employee, eliminating address confusion.",
        "left_tag": "SEAMLESS HYBRID MOBILITY",
        "left_title": "Mon–Fri Split Matrix Rails",
        "bullets": [
            ("Office Pod vs. Home Cluster", "Configure default schedules (e.g., Tue-Thu at Cyber City Tower B; Mon & Fri at DLF Phase 5 residence)."),
            ("7 km Cluster Geofence", "Both addresses qualify under the same pass quota if located within our 7 km micro-hub cluster boundary."),
            ("Calendar Context Sync", "Integrates with Google/Outlook calendars to detect WFH shifts and automatically prompt address realignment."),
            ("30-Minute Wave Drops", "Consolidates office deliveries into scheduled arrival windows (12:30–1:00 PM or 1:00–1:30 PM).")
        ],
        "image": "presentation/images/image3.png",
        "banner": "🏢 Zero Friction: Eliminates cold meals sitting at empty office desks when employees unexpectedly work from home."
    },
    {
        "num": 6,
        "cat": "Supply-Demand Synchronization",
        "title": "Night-Before Decision Engine: 8 PM Interactive Ping & 10 PM Batch Lock",
        "subtitle": "Interactive Cut-Off tab features live kitchen capacity meters, proactive WhatsApp alerts & 1-tap skip actions.",
        "left_tag": "ZERO-WASTE DEMAND SYNCHRONIZATION",
        "left_title": "Predictable Kitchen Production",
        "bullets": [
            ("8:00 PM WhatsApp Interactive Preview", "Pings employee with tomorrow's scheduled meal and 3 quick-action buttons right on WhatsApp."),
            ("Live Kitchen Capacity Meter", "Prototype UI displays real-time kitchen capacity (e.g., '84% booked, 16 slots remaining'), creating gentle urgency."),
            ("Live In-App Countdown to 10:00 PM", "Subtle ambient timer keeps users informed without aggressive spam notifications."),
            ("Three Clear 1-Tap Actions", "1) Keep Meal (Confirm), 2) 1-Tap Swap (Rotate dish), 3) Skip & Bank Credit (Preserve 100% quota in pack)."),
            ("Kitchen Waste Collapses: 28% → <3%", "Kitchens receive exact bulk manifests 14 hours in advance, allowing wholesale prep with zero stockout.")
        ],
        "image": "presentation/images/image7.png",
        "banner": "⏱️ Operational Win: Enforcing the 10 PM cut-off unlocks bulk morning cooking, reducing food prep cost by 18%."
    },
    {
        "num": 7,
        "cat": "Retention & Trust Architecture",
        "title": "Value Protection Guarantee: Two-Tier Wallet & Progressive Burn Caps",
        "subtitle": "Subscription trust earned through non-perishable value: 100% Rupee Rollover & 1–5 Day Travel Pause slider.",
        "left_tag": "ZERO FORFEITURE GUARANTEE",
        "left_title": "Two-Tier Ledger & Burn Controls",
        "bullets": [
            ("Two-Tier Wallet Ledger", "Explicit separation of Deposited Money (UPI AutoPay/Prepaid) vs Promotional Rollover Credits."),
            ("Progressive Burn Caps", "Redeem rollover balance up to: 15% on 5-meal pass, 25% on 10-meal pass, and 35% on 20-meal pass on renewal."),
            ("Interactive 1–5 Day Travel Pause Slider", "Drag slider in prototype freezes subscription instantly; extends validity runway with zero administrative penalty."),
            ("End-of-Horizon Safety Net", "Any unconsumed meals at horizon end deposit 100% value into MealsOn Balance, valid for 60 days on renewal.")
        ],
        "image": "presentation/images/image10.png",
        "banner": "🛡️ Churn Killer: Traditional subscriptions lose 35% of users to forfeiture rage; MealsOn makes value completely non-perishable."
    },
    {
        "num": 8,
        "cat": "Engagement & Habit Loops",
        "title": "Habit Gamification: 4/5 Workweek Rule, Living Bonsai & Spin Wheel",
        "subtitle": "Positive habit reinforcement featuring an interactive canvas roulette wheel with audio fanfare and real rewards.",
        "left_tag": "THE REINFORCEMENT LOOP",
        "left_title": "Living Bonsai & Interactive Roulette",
        "bullets": [
            ("The 4/5 Flexible Workweek Rule", "Consuming 4 scheduled meals completes the weekly streak; 1 team lunch or client outing never breaks streak."),
            ("5-Stage Living Bonsai Tree", "Prototype visual tree sprouts branches from Mon to Thu as healthy meals are confirmed and eaten."),
            ("Interactive Canvas Spin Wheel Modal", "Hitting 4 meals unlocks Friday Lunch Roulette: playable wheel modal with sound effects and confetti fanfare."),
            ("Perks That Reinforce Habit", "Spins win tangible rewards: Artisanal Desserts, Clean Fuel protein shakes, tier upgrades, or wallet cashback.")
        ],
        "image": "presentation/images/image8.png",
        "banner": "🌱 Engagement Metric: 78% of active pilot subscribers maintain 4-week active habit streaks under flexible scoring."
    },
    {
        "num": 9,
        "cat": "Compound Value Proposition",
        "title": "Weekly Impact & Savings Ledger: Financial, Time & Eco Dividends",
        "subtitle": "Quantifying the compounded tangible savings delivered to corporate subscribers every Friday.",
        "type": "3cards",
        "cards": [
            {
                "tag": "FINANCIAL DIVIDEND",
                "tag_col": "text-emerald-400",
                "title": "₹1,240 / Month Saved",
                "bullets": [
                    "₹0 Delivery Surcharges: Completely eliminates ₹45-₹65 surge fees per meal.",
                    "15% Pass Volume Discount: Wholesale pass pricing beats on-demand restaurant menus.",
                    "₹0 Packaging Surge: Standardized bulk-run eco-containers reduce packaging fees.",
                    "Annual Impact: ₹14,880 retained in disposable income per employee."
                ]
            },
            {
                "tag": "COGNITIVE DIVIDEND",
                "tag_col": "text-orange-400",
                "title": "4.2 Hours / Month Saved",
                "bullets": [
                    "Zero Menu Scrolling: Eliminates 18-22 mins of daily 12:30 PM decision deadlock.",
                    "Zero Courier Phone Tag: No 'Bhaiya tower ke bahar khade ho' phone interruptions.",
                    "100% Punctual Arrival: Consolidated wave drop reaches lobby exactly at 1:00 PM.",
                    "Mental Clarity: Employees focus on afternoon work without lunch anxiety."
                ]
            },
            {
                "tag": "ENVIRONMENTAL DIVIDEND",
                "tag_col": "text-indigo-400",
                "title": "63% Carbon Collapse",
                "bullets": [
                    "Consolidated Delivery: Replaces 14 individual rider two-wheeler trips with 1 batched run.",
                    "100% Compostable Packaging: Bagasse sugarcane meal trays replace single-use plastic boxes.",
                    "<3% Food Waste: Night-before kitchen demand locking saves 4.5 tons of food per quarter.",
                    "Corporate ESG Badge: Shareable sustainability impact metrics for enterprise HR reports."
                ]
            }
        ],
        "banner": "📊 Compounded ROI: The weekly ledger transforms lunch from an invisible expense into a high-visibility personal & corporate benefit."
    },
    {
        "num": 10,
        "cat": "Hyper-Local Last-Mile Efficiency",
        "title": "Office Pod Consolidated Delivery: Collapsing Drop Costs from ₹65 to ₹24",
        "subtitle": "Batching Cyber Park Tower B deliveries into a 1 PM wave transforms fragmented chaos into high-density routing.",
        "left_tag": "THE LOGISTICS BREAKTHROUGH",
        "left_title": "63% Delivery Cost Collapse",
        "bullets": [
            ("Fragmented On-Demand (Old)", "14 separate couriers make 14 individual runs; ₹65 cost per order; massive security gate congestion."),
            ("Consolidated Pod Wave (MealsOn)", "1 courier transports 14 pre-sorted meals in a thermal tote; ₹24 cost per meal; single lobby drop."),
            ("1:00 PM Synchronized Drop", "All meals arrive at the tower hub 10 minutes prior to lunch hour, sorted by floor and subscriber name."),
            ("Unit Economics Unlocked", "Saves ₹41 per meal in pure logistics cost—funding customer discounts and kitchen partner margins.")
        ],
        "image": "presentation/images/image6.png",
        "banner": "⚡ Scalability Core: High pod density enables MealsOn to achieve positive unit economics at price points competitors cannot match."
    },
    {
        "num": 11,
        "cat": "Competitive Strategy & Moats",
        "title": "Incumbent Teardown: Why Zomato Subscriptions Failed & Why MealsOn Wins",
        "subtitle": "Dissecting the structural flaws of aggregator subscription experiments to build an unassailable moat.",
        "type": "3cards",
        "cards": [
            {
                "tag": "ZOMATO SUBSCRIPTIONS",
                "tag_col": "text-rose-400",
                "title": "Structural Flaws",
                "bullets": [
                    "On-Demand Spine: Dispatches 1 rider per single order; ₹65+ rider fulfillment cost.",
                    "Zero Kitchen Notice: Kitchens cook live on receipt; 20-28% food waste & frequent stockouts.",
                    "Strict Forfeiture: Missed a meal? Money is lost forever (triggered 35% churn by week 3).",
                    "Cannibalization Fear: Discounted subscriptions cannibalized high-margin on-demand ad fees."
                ]
            },
            {
                "tag": "MEALSON ARCHITECTURE",
                "tag_col": "text-emerald-400",
                "title": "Purpose-Built Advantage",
                "bullets": [
                    "Batched Corridor Delivery: 1 rider delivers 14 meals per tower pod; drop cost collapses to ₹24.",
                    "10 PM Batch Lock: Kitchens receive exact SKU counts 14 hours ahead; <3% food waste.",
                    "100% Rupee Rollover: Zero forfeiture; skipped meals roll into renewable wallet credits.",
                    "Focused Habit Engine: Dedicated strictly to daily weekday lunch without platform conflict."
                ]
            },
            {
                "tag": "COMPETITIVE MOATS",
                "tag_col": "text-orange-400",
                "title": "Defensible Moats",
                "bullets": [
                    "Tower Density Moat: Incumbents cannot match batched ₹24 delivery without clustering orders.",
                    "Trust & Retention Moat: Zero-forfeiture policy builds 60-65% Month-2 retention.",
                    "Kitchen Partnership Moat: Cloud kitchens prioritize MealsOn for predictable morning revenue.",
                    "High Switching Costs: Tower Tribe colleague discounts create social lock-in."
                ]
            }
        ],
        "banner": "🛡️ Strategic Moat: Aggregators cannot replicate batched corridor delivery without disrupting their core on-demand driver dispatch models."
    },
    {
        "num": 12,
        "cat": "Financial Feasibility & Unit Economics",
        "title": "Strategic Unit Economics: Trading Micro-Spontaneity for Retained Margin",
        "subtitle": "Full margin walk per meal drop: how predictable batch logistics generate a +₹205 weekly surplus per subscriber.",
        "type": "3cards",
        "cards": [
            {
                "tag": "TIER 1: RASOI PASS",
                "tag_col": "text-orange-400",
                "title": "₹160 / Meal Drop",
                "bullets": [
                    "Food Cost (COGS): ₹88.00 (55.0% - Homestyle prep)",
                    "Eco Packaging: ₹12.00 (7.5% - Bagasse tray)",
                    "Batched Delivery: ₹24.00 (15.0% - Tower wave)",
                    "Payment Gateway: ₹3.20 (2.0% - UPI AutoPay)",
                    "Platform Gross Surplus: ₹32.80 (20.5% net margin)",
                    "Target Audience: Budget junior analysts & interns."
                ]
            },
            {
                "tag": "TIER 2: BISTRO PASS",
                "tag_col": "text-indigo-400",
                "title": "₹250 / Meal Drop",
                "bullets": [
                    "Food Cost (COGS): ₹135.00 (54.0% - Gourmet protein)",
                    "Eco Packaging: ₹15.00 (6.0% - Insulated bowl)",
                    "Batched Delivery: ₹24.00 (9.6% - Tower wave)",
                    "Payment Gateway: ₹5.00 (2.0% - UPI/Cards)",
                    "Platform Gross Surplus: ₹71.00 (28.4% net margin)",
                    "Target Audience: Mid-level engineers & PMs (Hero Tier)."
                ]
            },
            {
                "tag": "TIER 3: CHEF'S TABLE",
                "tag_col": "text-emerald-400",
                "title": "₹320 / Meal Drop",
                "bullets": [
                    "Food Cost (COGS): ₹170.00 (53.1% - Premium artisan)",
                    "Eco Packaging: ₹18.00 (5.6% - Thermal bento)",
                    "Batched Delivery: ₹24.00 (7.5% - Priority drop)",
                    "Payment Gateway: ₹6.40 (2.0% - Corporate cards)",
                    "Platform Gross Surplus: ₹101.60 (31.8% net margin)",
                    "Target Audience: Senior leadership & fitness pros."
                ]
            }
        ],
        "banner": "💰 Reinvestment Flywheel: +₹205 weekly surplus per subscriber self-funds Friday rewards (₹40) while retaining healthy net platform profit."
    },
    {
        "num": 13,
        "cat": "B2B2C Viral Growth Engine",
        "title": "Tower Tribe Pod Co-Ops: Hyper-Local B2B2C Viral Network Effects",
        "subtitle": "Turning corporate office buildings into viral, self-organizing delivery clusters via a 3-tier milestone ladder.",
        "type": "3cards",
        "cards": [
            {
                "tag": "MILESTONE 1 (5+ SUBSCRIBERS)",
                "tag_col": "text-orange-400",
                "title": "Priority Tower Drop",
                "bullets": [
                    "Unlocks Dedicated Lobby Drop: 1:00 PM guaranteed wave arrival.",
                    "Free Priority Dispatch: Eliminates any floor delivery friction.",
                    "Viral Trigger: Colleague invites 3 desk-mates to unlock priority status.",
                    "Drop Cost Impact: Reduces last-mile courier cost to ₹35/meal."
                ]
            },
            {
                "tag": "MILESTONE 2 (12+ SUBSCRIBERS)",
                "tag_col": "text-indigo-400",
                "title": "5% Colleague Co-Op Discount",
                "bullets": [
                    "5% Discount Across All Tiers: Automatically applied to all pod members.",
                    "Pod Slack/Teams Channel Integration: Live arrival notification posted directly.",
                    "Social Proof: Coworkers see branded delivery crates in office breakout areas.",
                    "Drop Cost Impact: Reduces last-mile courier cost to ₹28/meal."
                ]
            },
            {
                "tag": "MILESTONE 3 (25+ SUBSCRIBERS)",
                "tag_col": "text-emerald-400",
                "title": "10% Off + Hot-Case Station",
                "bullets": [
                    "10% Colleague Co-Op Discount: Maximum savings unlocked across the building.",
                    "Dedicated Floor Hot-Case Station: Temperature-controlled insulated food lockers installed.",
                    "Zero Last-Mile Hand-Off: Food stays warm until employee steps away from meetings.",
                    "Drop Cost Impact: Reaches peak logistics efficiency of ₹24.00/meal."
                ]
            }
        ],
        "banner": "🚀 Viral CAC Advantage: Existing subscribers recruit their peers to unlock the next discount tier, slashing Blended CAC by 35%."
    },
    {
        "num": 14,
        "cat": "Operational Backend & Infrastructure",
        "title": "Kitchen Partner OS & Courier Wave Logistics Engine",
        "subtitle": "Synchronizing cloud kitchen prep schedules with batched corridor delivery for clockwork precision.",
        "type": "3cards",
        "cards": [
            {
                "tag": "STEP 1: 10 PM BATCH LOCK",
                "tag_col": "text-amber-400",
                "title": "Exact Kitchen Manifests",
                "bullets": [
                    "Aggregated SKU Forecast: 10:01 PM automatic API dispatch to kitchen partner dashboard.",
                    "Zero Speculative Inventory: Kitchens order exact raw materials from wholesale vendors.",
                    "Capacity Quota Protection: Kitchen order caps prevent kitchen overbooking and quality degradation.",
                    "Advance Prep: Pre-portioning and marinating happens seamlessly overnight."
                ]
            },
            {
                "tag": "STEP 2: WHOLESALE BATCH PREP",
                "tag_col": "text-indigo-400",
                "title": "6:00 AM – 11:30 AM Prep",
                "bullets": [
                    "Industrial Batch Cooking: Chef cooks 150 portions of Dal Makhani in one continuous kettle cycle.",
                    "Standardized QC Checks: Temperature probing and visual consistency verified prior to packaging.",
                    "Automated QR Bag Tagging: Thermal printer prints subscriber name, tower pod, and dietary tag.",
                    "Staging in Thermal Racks: Packed meals staged in heated staging cabinets at 65°C."
                ]
            },
            {
                "tag": "STEP 3: 12:15 PM WAVE DISPATCH",
                "tag_col": "text-emerald-400",
                "title": "Consolidated Tower Drops",
                "bullets": [
                    "Single Van/Bike Dispatch: Dedicated fleet courier collects 30-50 pre-sorted pod meals.",
                    "Thermal Trunk Containers: Double-insulated containers maintain food serving heat.",
                    "12:45 PM Lobby Arrival: Courier scans single master QR at lobby concierge or pod locker.",
                    "Automated Subscriber Notification: In-app WhatsApp alert: 'Your lunch is ready in Tower B Lobby!'."
                ]
            }
        ],
        "banner": "⚙️ Operational Rigor: Zero live order chaos—every kitchen step is fully scheduled, pre-allocated, and thermally monitored."
    },
    {
        "num": 15,
        "cat": "Go-To-Market Execution",
        "title": "Phased Rollout Plan: Cyber Park Beachhead to Pan-India Metro Scale",
        "subtitle": "A disciplined, milestone-driven expansion roadmap proving unit economics before scaling geography.",
        "type": "3cards",
        "cards": [
            {
                "tag": "PHASE 1: BEACHHEAD PILOT",
                "tag_col": "text-orange-400",
                "title": "Weeks 1–8: Cyber City",
                "bullets": [
                    "Geography: DLF Cyber City, Gurgaon (5 Corporate Towers).",
                    "Kitchen Supply: 3 Top-rated cloud kitchen partners.",
                    "Core Targets: 1,000 active subscribers; Pass Completion ≥ 82%.",
                    "Fleet Metric: Prove batched drop cost ≤ ₹24.00 per meal.",
                    "Success Gate: Month-2 Renewal rate ≥ 60% before expanding."
                ]
            },
            {
                "tag": "PHASE 2: CLUSTER SCALE",
                "tag_col": "text-indigo-400",
                "title": "Months 3–6: Delhi-NCR",
                "bullets": [
                    "Geography: Expand to Noida Sector 62 & Golf Course Road.",
                    "Feature Unlocks: Launch AI Health Co-Pilot & HR Cafeteria portals.",
                    "Core Targets: 8,000 active subscribers; 20 corporate pod tribes.",
                    "Financial Milestone: Positive contribution margin across all 3 clusters.",
                    "Partnerships: Formal integrations with Pluxee, Zaggle, and Sodexo."
                ]
            },
            {
                "tag": "PHASE 3: METRO EXPANSION",
                "tag_col": "text-emerald-400",
                "title": "Months 7–12: Multi-City",
                "bullets": [
                    "Geography: Bangalore (Outer Ring Rd) & Mumbai (BKC).",
                    "Scale Target: 50,000 active daily subscribers.",
                    "Revenue Run-Rate: ₹42 Crore ARR run-rate with 24% EBITDA margin.",
                    "Enterprise B2B: Direct white-label corporate cafeteria contracts.",
                    "Long-Term Retention: Sustained 65% Month-2 retention baseline."
                ]
            }
        ],
        "banner": "📈 Capital Efficiency: The pilot requires zero heavy capital expenditure—leveraging existing cloud kitchen capacity and corridor riders."
    },
    {
        "num": 16,
        "cat": "Risk Governance & Success Scorecard",
        "title": "Executive Governance: North-Star Metrics & Failure Mode Playbook",
        "subtitle": "Rigorous KPI tracking and proactive mitigation protocols protecting customer trust and service SLAs.",
        "type": "2widecards",
        "left_card": {
            "tag": "NORTH STAR KPI SCORECARD",
            "tag_col": "text-emerald-400",
            "title": "Grounded Target Metrics",
            "items": [
                ("Pass Completion Rate [≥ 82%]", "Percentage of purchased meals consumed within validity buffer window."),
                ("Month-2 Renewal Rate [60% – 65%]", "Driven by 100% Rupee Rollover Wallet and zero-forfeiture guarantee."),
                ("Kitchen Food Waste [< 3.0%]", "Reduced from industry 28% via 10 PM night-before demand batch locking."),
                ("Fleet Drop Cost [≤ ₹24.00]", "Achieved by batching 10-14 meal orders per single corporate tower wave drop."),
                ("Customer NPS Score [≥ 62]", "Benchmark against on-demand food aggregator average NPS of 38-42.")
            ]
        },
        "right_card": {
            "tag": "FAILURE MODE PLAYBOOK",
            "tag_col": "text-rose-400",
            "title": "Proactive SLA Mitigations",
            "items": [
                ("Kitchen Stockout / Incident", "Hot Standby Kitchen: Partner backup cloud kitchen maintains 20 ready buffer portions; auto-failsafe re-routing within 15 mins."),
                ("Courier Breakdown / Traffic Delay", "12:15 PM Early Dispatch Buffer: 45-min buffer window allows backup rider dispatch from Cyber Park corridor depot with zero late drops."),
                ("Spillage / Temperature Drop", "Hermetic Heat-Sealed Trays: Tested for 90-min heat retention (min 60°C); 100% immediate meal refund + free lunch coupon on breach."),
                ("Rain / Extreme Weather", "Monsoon Drop Protocols: Dedicated indoor lobby concierge handoff coordinates with building facility teams.")
            ]
        },
        "banner": "🏆 Product Vision: MealsOn Scheduled Meals transforms corporate lunch into a predictable, zero-waste daily utility."
    }
]

def render_slide_html(s):
    num_str = f"{s['num']:02d}"
    html = f"""
    <div class="slide hidden flex flex-col justify-between p-6 md:p-10 w-full h-full" id="slide-{s['num']}">
      <!-- Slide Header -->
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div class="flex items-center gap-3">
          <span class="text-xs font-black tracking-widest uppercase px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
            SLIDE {num_str} • {s['cat'].upper()}
          </span>
          <span class="text-xs text-slate-400 hidden md:inline font-medium">MealsOn Executive Strategy</span>
        </div>
        <div class="text-xs font-mono text-slate-400 font-bold">
          {num_str} / 16
        </div>
      </div>

      <!-- Slide Title & Subtitle -->
      <div class="my-2">
        <h2 class="text-xl md:text-2xl font-black text-slate-100 tracking-tight leading-snug">
          {s['title']}
        </h2>
        <p class="text-xs md:text-sm text-slate-400 mt-1">
          {s['subtitle']}
        </p>
      </div>

      <!-- Main Slide Content Area -->
      <div class="flex-1 my-2 overflow-hidden flex items-center">
    """

    # Check Slide Layout Type
    stype = s.get("type", "split")
    if stype == "split":
        # 60% Left Content, 40% Right Image
        html += f"""
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 w-full h-full items-stretch">
          <!-- Left Content (7 cols) -->
          <div class="md:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div class="text-xs font-bold tracking-wider text-orange-400 uppercase mb-1">{s['left_tag']}</div>
              <h3 class="text-base md:text-lg font-bold text-slate-100 mb-3">{s['left_title']}</h3>
              <div class="space-y-2.5">
        """
        for b_title, b_desc in s['bullets']:
            html += f"""
                <div class="text-xs">
                  <span class="font-bold text-emerald-400">• {b_title}:</span>
                  <span class="text-slate-300 ml-1 leading-relaxed">{b_desc}</span>
                </div>
            """
        html += f"""
              </div>
            </div>
          </div>

          <!-- Right Image (5 cols) -->
          <div class="md:col-span-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-2 flex items-center justify-center overflow-hidden shadow-lg">
            <img src="{s['image']}" alt="{s['title']}" onerror="if(!this.dataset.retried){{this.dataset.retried=true; this.src=this.src.includes('presentation/') ? this.src.replace('presentation/', '') : 'presentation/' + this.src;}}" class="w-full h-full object-contain rounded-xl max-h-[340px]" />
          </div>
        </div>
        """
    elif stype == "3cards":
        html += """
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full items-stretch">
        """
        for card in s['cards']:
            html += f"""
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div class="text-xs font-bold tracking-wider {card['tag_col']} uppercase mb-1">{card['tag']}</div>
              <h3 class="text-base font-bold text-slate-100 mb-3">{card['title']}</h3>
              <ul class="space-y-2 text-xs text-slate-300">
            """
            for bullet in card['bullets']:
                html += f"""
                <li class="flex items-start gap-1.5 leading-relaxed">
                  <span class="text-orange-400 font-bold shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
                """
            html += """
              </ul>
            </div>
          </div>
            """
        html += """
        </div>
        """
    elif stype == "2widecards":
        lc = s['left_card']
        rc = s['right_card']
        html += f"""
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full h-full items-stretch">
          <!-- Left Card -->
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div class="text-xs font-bold tracking-wider {lc['tag_col']} uppercase mb-1">{lc['tag']}</div>
              <h3 class="text-base font-bold text-slate-100 mb-3">{lc['title']}</h3>
              <div class="space-y-2.5">
        """
        for kname, kdesc in lc['items']:
            html += f"""
                <div class="text-xs">
                  <span class="font-bold text-orange-400">• {kname}:</span>
                  <span class="text-slate-300 ml-1 leading-relaxed">{kdesc}</span>
                </div>
            """
        html += f"""
              </div>
            </div>
          </div>

          <!-- Right Card -->
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div class="text-xs font-bold tracking-wider {rc['tag_col']} uppercase mb-1">{rc['tag']}</div>
              <h3 class="text-base font-bold text-slate-100 mb-3">{rc['title']}</h3>
              <div class="space-y-2.5">
        """
        for rname, rdesc in rc['items']:
            html += f"""
                <div class="text-xs">
                  <span class="font-bold text-amber-400">• {rname}:</span>
                  <span class="text-slate-300 ml-1 leading-relaxed">{rdesc}</span>
                </div>
            """
        html += """
              </div>
            </div>
          </div>
        </div>
        """

    # Bottom Banner & Footer
    html += f"""
      </div>

      <!-- Bottom Banner -->
      <div class="mt-2 bg-slate-800/90 border border-orange-500/40 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-200">
        <span>{s['banner']}</span>
        <span class="text-[10px] text-slate-400 font-mono hidden md:inline">MealsOn PRD Hub</span>
      </div>
    </div>
    """
    return html

def build_full_html():
    slides_markup = "\n".join([render_slide_html(s) for s in slides_data])
    
    # Thumbnails / Jump List
    jump_options = "\n".join([f'<option value="{s["num"]}">Slide {s["num"]:02d}: {s["title"][:40]}...</option>' for s in slides_data])
    dots_markup = "\n".join([f'<button onclick="goToSlide({s["num"]})" class="dot-btn w-2.5 h-2.5 rounded-full bg-slate-600 hover:bg-orange-500 transition-all" id="dot-{s["num"]}" title="Slide {s["num"]}"></button>' for s in slides_data])

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MealsOn Scheduled Meals — Master Executive Strategy Deck</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {{
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #0B1120;
    }}
    .stage-container {{
      aspect-ratio: 16 / 9;
      max-width: 1280px;
    }}
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-orange-500 selection:text-white">

  <!-- Top Navigation Bar -->
  <header class="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-slate-800">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white text-base shadow-md shadow-orange-500/20">
        🍱
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-black tracking-wider uppercase text-orange-400">MealsOn Strategy</span>
          <span class="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono border border-slate-700">16 Slides Master</span>
        </div>
        <h1 class="text-sm font-bold text-slate-200 hidden sm:block">Executive Product Review Deck (Sachin Shinde)</h1>
      </div>
    </div>

    <!-- Quick Controls -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Jump to Slide Selector -->
      <select id="slideSelector" onchange="goToSlide(parseInt(this.value))" class="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500">
        {jump_options}
      </select>

      <a href="presentation/MealsOn_Master_Deck.pptx" download class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
        <span>Download .PPTX</span>
        <span class="text-orange-400">⬇️</span>
      </a>

      <button onclick="toggleFullscreen()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all" title="Toggle Fullscreen (F)">
        ⛶
      </button>

      <a href="/" class="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-orange-500/20 flex items-center gap-1">
        <span>App</span>
        <span>→</span>
      </a>
    </div>
  </header>

  <!-- Presentation Stage (16:9) -->
  <main class="w-full flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6">
    <div id="presentationStage" class="stage-container w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {slides_markup}
    </div>
  </main>

  <!-- Bottom Navigation & Controls -->
  <footer class="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-t border-slate-800/80">
    <!-- Prev Button -->
    <button onclick="prevSlide()" class="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-200 transition-all">
      <span>←</span>
      <span class="hidden sm:inline">Prev</span>
    </button>

    <!-- Slide Dots -->
    <div class="flex items-center gap-1.5">
      {dots_markup}
    </div>

    <!-- Next Button -->
    <div class="flex items-center gap-3">
      <span id="slideCounter" class="text-xs font-mono font-bold text-slate-400">01 / 16</span>
      <button onclick="nextSlide()" class="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-all shadow-md shadow-orange-500/20">
        <span class="hidden sm:inline">Next</span>
        <span>→</span>
      </button>
    </div>
  </footer>

  <!-- Interactive Slide Controller Script -->
  <script>
    let currentSlide = 1;
    const totalSlides = 16;

    function showSlide(num) {{
      if (num < 1) num = 1;
      if (num > totalSlides) num = totalSlides;
      currentSlide = num;

      // Hide all slides
      for (let i = 1; i <= totalSlides; i++) {{
        const el = document.getElementById(`slide-${{i}}`);
        const dot = document.getElementById(`dot-${{i}}`);
        if (el) el.classList.add('hidden');
        if (dot) {{
          dot.classList.remove('bg-orange-500', 'w-5');
          dot.classList.add('bg-slate-600', 'w-2.5');
        }}
      }}

      // Show current slide
      const currentEl = document.getElementById(`slide-${{currentSlide}}`);
      const currentDot = document.getElementById(`dot-${{currentSlide}}`);
      if (currentEl) currentEl.classList.remove('hidden');
      if (currentDot) {{
        currentDot.classList.remove('bg-slate-600', 'w-2.5');
        currentDot.classList.add('bg-orange-500', 'w-5');
      }}

      // Update counter and selector
      const counter = document.getElementById('slideCounter');
      if (counter) counter.innerText = `${{String(currentSlide).padStart(2, '0')}} / ${{String(totalSlides).padStart(2, '0')}}`;
      const sel = document.getElementById('slideSelector');
      if (sel) sel.value = currentSlide;
    }}

    function nextSlide() {{
      if (currentSlide < totalSlides) {{
        showSlide(currentSlide + 1);
      }}
    }}

    function prevSlide() {{
      if (currentSlide > 1) {{
        showSlide(currentSlide - 1);
      }}
    }}

    function goToSlide(num) {{
      showSlide(num);
    }}

    function toggleFullscreen() {{
      if (!document.fullscreenElement) {{
        document.documentElement.requestFullscreen().catch(err => {{
          console.error(`Error enabling fullscreen: ${{err.message}}`);
        }});
      }} else {{
        if (document.exitFullscreen) {{
          document.exitFullscreen();
        }}
      }}
    }}

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {{
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {{
        e.preventDefault();
        nextSlide();
      }} else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {{
        e.preventDefault();
        prevSlide();
      }} else if (e.key === 'Home') {{
        e.preventDefault();
        showSlide(1);
      }} else if (e.key === 'End') {{
        e.preventDefault();
        showSlide(totalSlides);
      }} else if (e.key.toLowerCase() === 'f') {{
        e.preventDefault();
        toggleFullscreen();
      }}
    }});

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {{
      showSlide(1);
    }});
  </script>
</body>
</html>
"""
    return full_html

if __name__ == "__main__":
    html_content = build_full_html()
    destinations = [
        os.path.join("public", "slides.html"),
        os.path.join("dist", "slides.html"),
        os.path.join("docs", "presentation", "slides.html"),
        os.path.join("public", "presentation", "index.html"),
    ]
    for d in destinations:
        os.makedirs(os.path.dirname(d), exist_ok=True)
        with open(d, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Generated HTML slide presentation: {d} ({os.path.getsize(d)} bytes)")
