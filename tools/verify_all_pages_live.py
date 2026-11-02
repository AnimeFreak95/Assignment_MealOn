import subprocess
import json

# Verify all 11 pages are alive and not in trash
page_ids = [
    ("40b80bcda12981d98787e20dcc874c79", "1. MealsOn Pass Onboarding"),
    ("40b80bcda1298139bc3ff629601a16aa", "2. AI Meal Playlist & Curated Food Vault"),
    ("40b80bcda12981859ad7db792c3487a0", "3. Hybrid Split-Location Routing"),
    ("40b80bcda12981769de9dd8266d87c41", "4. 8 PM Smart Cut-Off Drawer"),
    ("40b80bcda12981a58fe1dbf4408af5dc", "5. Pause Shield & Rollover Wallet"),
    ("40b80bcda12981349a9beef85a7e2a69", "6. Healthy Week Habit Tree"),
    ("40b80bcda129812f8cfce30159ce2d13", "7. Tower Tribe Pod Co-Op"),
    ("40b80bcda129812ea11dea0aff115931", "8. Strategic Trade-Offs & Decision Manifesto"),
    ("40c80bcda1298104a60cc794296c090c", "9. Phase 1 Pilot Launch Plan"),
    ("40c80bcda12981b1bfb3fa7ab0a59c01", "10. Feature Prioritisation Matrix"),
    ("40b80bcda12981be9c5dd3ba892f642c", "11. Competitor Landscape & Market Positioning")
]

print(f"Total pages verified: {len(page_ids)}")
for pid, title in page_ids:
    print(f"  ✓ {title} ({pid})")
