with open('docs/specs/matrix_notion_clean.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix blockquote markers
text = text.replace('Over  **', '> **')

# Replace ascii box
ascii_start = text.find('```\n┌')
ascii_end = text.find('```\n\n---', ascii_start) + 3

gantt_table = """| Phase & Strategic Focus | Timeline | Key Feature Modules Delivered | Core Operational Milestone |
| :--- | :--- | :--- | :--- |
| **Phase 1: Pilot MVP** | Weeks 1–6 | Pass Onboarding & Triple Payment Rails; 8 PM Drawer & 10 PM Zero-Waste Kitchen Lock; Pause Shield & Rollover Wallet; Hybrid Routing (30-min + 7km Geofence); Curated Food Vault (12–20 items); Healthy Week Habit Tree | 3 Anchor Towers, 500 Beta Users, Delivery SLA ≥97.5%, ₹24 batch drop cost |
| **Phase 2: Cluster Scale** | Weeks 7–14 | Tower Tribe Pod Co-Op (Milestone Ladder); AI Meal Playlist Generator (Dietary chips); Corporate Meal Card Checkout (Pluxee/Zaggle); 8 Residential Society WFH Pods | 12 Towers + 8 Societies, 2,500 active users, building-level order pooling |
| **Phase 3: Metro Scale** | Months 4+ | Automated WFH Calendar Sync (OAuth); Heated Micro-Fulfillment Locker Pods; Multi-City Scale (Bengaluru ORR, Mumbai BKC) | 10,000+ daily deliveries, corporate wellness subsidies, full EV fleet |"""

clean_text = text[:ascii_start] + gantt_table + text[ascii_end:]
with open('docs/specs/matrix_notion_clean.md', 'w', encoding='utf-8') as f:
    f.write(clean_text)

print('Success! Clean matrix length:', len(clean_text))
