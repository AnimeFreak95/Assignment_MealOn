with open("cleaned_text.md", "r") as f:
    text = f.read()

# Replace the older Section 6 with a clean executive card linking to Subpage 7
old_sec6_start = text.find("## 🥊 6. Competitive Landscape & Market Positioning")
old_sec6_end = text.find('<page url="https://app.notion.com/p/40b80bcda12981d98787e20dcc874c79">')

new_sec6 = """## 🥊 6. Competitive Landscape & Strategic Market Positioning

> 🎯 **Executive Summary & Moat Architecture:**
> For the complete, uncompressed competitive deep dive—including **Zomato's live Single-Merchant Subscription teardown**, the **comprehensive 5-way market comparison matrix**, and our **4 defensible moats**—refer to the dedicated subpage:
> 👉 **[🥊 7. Competitor Landscape & Strategic Market Positioning Subpage](https://app.notion.com/p/40b80bcda12981e5be1ce31c42ef8c53)**

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
"""

updated_text = text[:old_sec6_start] + new_sec6 + text[old_sec6_end:]

with open("main_page_clean.md", "w") as f:
    f.write(updated_text)

print("main_page_clean.md created successfully. Length:", len(updated_text))
