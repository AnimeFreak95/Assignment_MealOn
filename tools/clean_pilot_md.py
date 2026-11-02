with open('docs/PILOT_LAUNCH_PLAN.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the ASCII box with a clean markdown table
ascii_box_start = text.find('```\n+-')
ascii_box_end = text.find('```\n\n### Phase 1')

table_summary = """| Rollout Phase | Duration | Scope & Footprint | Kitchen Supply & Users | Strategic Milestone Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Beachhead Pilot** | Weeks 1–6 | 3 Anchor Towers in DLF Cyber Park | 5 Partner Kitchens, 500 Capped Beta Users | Delivery Drop SLA (≥97.5%), Batch Drop Economics (₹24/drop), 10 PM Zero-Waste Lock |
| **Phase 2: Cluster Scale** | Weeks 7–14 | 12 Corporate Towers + 8 Residential Pods | 15 Cloud Kitchens, 2,500 Active Subscribers | Tower Tribe Pod Co-Op Rewards, WFH Calendar Sync, Corporate Meal Wallets |
| **Phase 3: Metro Scale** | Months 4+ | Gurgaon, Bengaluru (ORR), Mumbai (BKC) | 50+ Certified Kitchens, 10,000+ Daily Meals | Dedicated Lobby Warm Locker Pods, Corporate B2B Billing, Full EV Fleet |

"""

clean_md = text[:ascii_box_start] + table_summary + text[ascii_box_end + 4:]
with open('docs/specs/pilot_notion_clean.md', 'w', encoding='utf-8') as f:
    f.write(clean_md)
print('Cleaned! Length:', len(clean_md))
