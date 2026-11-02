import urllib.request
import json

# Let's inspect each page via API-retrieve-a-page
pages = [
    ("40b80bcda12981d98787e20dcc874c79", "1. Pass Onboarding"),
    ("40b80bcda1298139bc3ff629601a16aa", "2. AI Playlist & Food Vault"),
    ("40b80bcda12981859ad7db792c3487a0", "3. Hybrid Routing"),
    ("40b80bcda12981769de9dd8266d87c41", "4. Cut-Off Drawer"),
    ("40b80bcda12981a58fe1dbf4408af5dc", "5. Pause Shield & Wallet"),
    ("40b80bcda12981349a9beef85a7e2a69", "6. Healthy Week Tree"),
    ("40b80bcda129812f8cfce30159ce2d13", "7. Tower Tribe Pod Co-Op"),
    ("40b80bcda129812ea11dea0aff115931", "8. Strategic Trade-Offs"),
    ("40c80bcda1298104a60cc794296c090c", "9. Phase 1 Pilot Plan"),
    ("40c80bcda12981b1bfb3fa7ab0a59c01", "10. Prioritisation Matrix"),
    ("40b80bcda12981be9c5dd3ba892f642c", "11. Competitor Landscape")
]

for pid, name in pages:
    print(f"{pid} ({name})")
