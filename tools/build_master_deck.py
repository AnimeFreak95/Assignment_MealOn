#!/usr/bin/env python3
"""
Builds an elevated, comprehensive 16-slide master presentation deck for MealsOn Scheduled Meals.
Enhanced with prototype UI/UX micro-interactions & Notion specifications:
- Dual-Engine Planner UI: [💖 My Food Vault (20)] Phase 1 Trust Anchor vs [✨ AI Playlist] Phase 2 Auto-Pilot.
- 4-Action Meal Card Suite: 1-Tap Swap (±₹20 parity), Drag-drop reorder, Location flip, Calendar context sync.
- Interactive Spin Wheel Modal: Friday Lunch Roulette with audio delight & confetti fanfare.
- Two-Tier Wallet Ledger & Progressive Burn Caps (15% on 5-meal, 25% on 10-meal, 35% on 20-meal) + Travel Pause slider.
- 8 PM Smart Cut-Off: Live kitchen capacity meter (e.g. 84% booked, 16 slots remaining).
- Interactive Prototype Shell: Persona Switcher (Rahul/Priya/Sneha) & GTM Multi-Channel Simulator.
"""

import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

# Theme Palette (Dark Luxury Charcoal / Slate Executive)
COLOR_BG = RGBColor(0x0F, 0x17, 0x2A)           # Slate 900 (Deep background)
COLOR_CARD_BG = RGBColor(0x1E, 0x29, 0x3B)      # Slate 800 (Card background)
COLOR_CARD_BORDER = RGBColor(0x33, 0x41, 0x55)  # Slate 700 (Border)
COLOR_CARD_BORDER_HI = RGBColor(0x47, 0x55, 0x69)# Slate 600
COLOR_TEXT_PRIMARY = RGBColor(0xF8, 0xFA, 0xFC) # Slate 50 (Pure white text)
COLOR_TEXT_SECONDARY = RGBColor(0x94, 0xA3, 0xB8)# Slate 400 (Muted description)
COLOR_ORANGE = RGBColor(0xF9, 0x73, 0x16)       # Orange 500 (Primary accent)
COLOR_EMERALD = RGBColor(0x10, 0xB9, 0x81)      # Emerald 500 (Savings & metrics)
COLOR_INDIGO = RGBColor(0x81, 0x8C, 0xF8)       # Indigo 400 (Tech & AI)
COLOR_AMBER = RGBColor(0xF5, 0x9E, 0x0B)        # Amber 500 (Alerts & tiers)
COLOR_ROSE = RGBColor(0xF4, 0x3F, 0x5E)         # Rose 500 (Pain points)

IMG_DIR = os.path.join("docs", "gamma_media", "ppt", "media")

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def add_base(slide_num, category, title, subtitle=None):
        slide = prs.slides.add_slide(blank_layout)
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()

        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.38), Inches(11.73), Inches(1.18))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p_cat = tf.paragraphs[0]
        p_cat.text = f"SLIDE {slide_num:02d}  •  {category.upper()}"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ORANGE
        p_cat.space_after = Pt(2)

        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.size = Pt(19)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_PRIMARY

        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(10.5)
            p_sub.font.color.rgb = COLOR_TEXT_SECONDARY
            p_sub.space_before = Pt(2)

        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.73), Inches(0.3))
        tff = footer_box.text_frame
        tff.margin_left = tff.margin_top = tff.margin_right = tff.margin_bottom = 0
        pf = tff.paragraphs[0]
        pf.text = f"MealsOn Scheduled Meals  •  Executive Product Strategy  •  Slide {slide_num:02d} of 16"
        pf.font.size = Pt(9)
        pf.font.color.rgb = COLOR_TEXT_SECONDARY

        return slide

    def add_card(slide, left, top, width, height, bg_col=COLOR_CARD_BG, border_col=COLOR_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = border_col
        card.line.width = Pt(1.2)
        return card

    def add_bottom_banner(slide, text, bg_col=COLOR_CARD_BG, text_col=COLOR_TEXT_PRIMARY, border_col=COLOR_ORANGE):
        banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.35), Inches(11.73), Inches(0.55))
        banner.fill.solid()
        banner.fill.fore_color.rgb = bg_col
        banner.line.color.rgb = border_col
        banner.line.width = Pt(1.0)
        tf = banner.text_frame
        tf.word_wrap = True
        tf.margin_top = Inches(0.08)
        tf.margin_left = Inches(0.2)
        p = tf.paragraphs[0]
        p.text = text
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = text_col

    def add_image_safe(slide, img_name, left, top, width, height):
        img_path = os.path.join(IMG_DIR, img_name)
        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, left, top, width, height)
            border = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
            border.fill.background()
            border.line.color.rgb = COLOR_CARD_BORDER_HI
            border.line.width = Pt(1.5)
        else:
            ph = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
            ph.fill.solid()
            ph.fill.fore_color.rgb = COLOR_CARD_BG
            ph.line.color.rgb = COLOR_ORANGE
            tf = ph.text_frame
            p = tf.paragraphs[0]
            p.text = f"[ Visual Asset: {img_name} ]"
            p.font.size = Pt(11)
            p.font.color.rgb = COLOR_TEXT_PRIMARY

    # ==================== SLIDE 01: HERO & NORTH STAR ====================
    s1 = add_base(1, "Product Experience & North Star", 
                  "MealsOn: Transforming Weekday Lunch into a Trusted, Automated Habit",
                  "Flexible, automated, community-driven lunches removing decision fatigue, hybrid friction, and forfeiture anxiety.")
    add_card(s1, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb1 = s1.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(6.3), Inches(3.95))
    tf1 = tb1.text_frame; tf1.word_wrap = True
    
    p = tf1.paragraphs[0]; p.text = "CORE PRODUCT THESIS"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf1.add_paragraph(); p2.text = "Routine Without Rigidity"; p2.font.size = Pt(18); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(8)
    
    bullets_s1 = [
        ("Automate Routine Without Locking In", "10-20 meal smart playlists eliminate 18-22 mins of daily menu browsing while preserving 1-tap swaps."),
        ("Protect Value When Plans Change", "Zero forfeiture: 100% of unused skipped meals convert into Rupee Rollover balance with a 35-day validity buffer."),
        ("Consolidate Friction into Community Drops", "Batching 10-14 colleague deliveries per tower collapses drop cost from ₹65 to ₹24 per meal.")
    ]
    for b_title, b_desc in bullets_s1:
        pb = tf1.add_paragraph(); pb.text = f"• {b_title}: "; pb.font.size = Pt(10.5); pb.font.bold = True; pb.font.color.rgb = COLOR_EMERALD; pb.space_after = Pt(2)
        pd = tf1.add_paragraph(); pd.text = f"   {b_desc}"; pd.font.size = Pt(10); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(6)

    add_image_safe(s1, "image4.jpg", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s1, "🎯 North Star: Deliver consistent, wholesome weekday lunches at 63% lower delivery friction with zero wasted rupees.")

    # ==================== SLIDE 02: ENTRY EXPERIENCE ====================
    s2 = add_base(2, "Entry Experience & Allowance Tiers", 
                  "Frictionless Onboarding: Transparent Tiers & Real-Time Dynamic Receipt",
                  "Interactive onboarding calculates effective per-meal rates and free delivery savings live before checkout.")
    
    add_card(s2, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb2 = s2.shapes.add_textbox(Inches(1.05), Inches(1.95), Inches(6.3), Inches(4.0))
    tf2 = tb2.text_frame; tf2.word_wrap = True
    
    steps = [
        ("01", "See the Value", "Live savings calculator frames scheduled meals as ₹1,240/mo saved + 4 hours reclaimed."),
        ("02", "Choose Your Rhythm", "3 Allowance Tiers: Rasoi (₹160 Comfort), Bistro (₹250 Balanced), Chef's Table (₹320 Pro)."),
        ("03", "Configure Your Pass", "Select 5, 10, or 20 meals with progressive 5%, 10%, and 15% tier volume discounts."),
        ("04", "Watch Savings Live", "Dynamic receipt computes: Base ₹3,200 - 15% tier discount - ₹1,300 delivery fee = ₹136/meal!"),
        ("05", "Interactive Prototype Shell", "Top Persona Switcher (Rahul / Priya / Sneha) + GTM Multi-Channel Acquisition Simulator.")
    ]
    for num, stitle, sdesc in steps:
        p = tf2.paragraphs[0] if num == "01" else tf2.add_paragraph()
        p.text = f"[{num}]  {stitle}"
        p.font.size = Pt(10.5); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE; p.space_after = Pt(1)
        pd = tf2.add_paragraph()
        pd.text = sdesc
        pd.font.size = Pt(9.2); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(4)

    add_image_safe(s2, "image5.png", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s2, "💡 Built-In Runway: A 20-meal pass carries a 35-day validity buffer, completely removing consumption anxiety.")

    # ==================== SLIDE 03: CHECKOUT DESIGN ====================
    s3 = add_base(3, "Checkout Architecture & Financial Rails",
                  "Zero-Cash-Lock Barrier: Reversible Default Rail with Prepaid Upside",
                  "Eliminate upfront commitment friction while preserving attractive incentives for committed power users.")
    c_w = Inches(3.7)
    gap = Inches(0.31)
    
    add_card(s3, Inches(0.8), Inches(1.8), c_w, Inches(4.35))
    tb3_1 = s3.shapes.add_textbox(Inches(1.0), Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf3_1 = tb3_1.text_frame; tf3_1.word_wrap = True
    p = tf3_1.paragraphs[0]; p.text = "DEFAULT RAIL"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf3_1.add_paragraph(); p2.text = "UPI AutoPay (₹0 Upfront)"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• ₹10 Pre-Authorization Mandate: Validates mandate without taking upfront cash.",
        "• Night-Before Pay-As-You-Eat: Deducts meal price only at 10 PM lock.",
        "• Reversible Commitment: Skip a meal before 10 PM and zero money is debited.",
        "• Conversion Surge: Reduces onboarding drop-off by 68% compared to ₹3,000+ upfront plans."
    ]:
        pb = tf3_1.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s3, Inches(0.8) + c_w + gap, Inches(1.8), c_w, Inches(4.35))
    tb3_2 = s3.shapes.add_textbox(Inches(1.0) + c_w + gap, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf3_2 = tb3_2.text_frame; tf3_2.word_wrap = True
    p = tf3_2.paragraphs[0]; p.text = "OPTIONAL UPSIDE"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf3_2.add_paragraph(); p2.text = "Prepaid Pass (+5% Bonus)"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Upfront Liquidity Incentive: Grants extra 5% wallet cashback for upfront payment.",
        "• 5, 10, or 20 Meals: High-repetition volume tier discounts built-in.",
        "• 100% Value Safety Net: Unused skipped meals automatically convert to Rupee credits.",
        "• High Retention: Users with prepaid passes exhibit 2.4x higher 30-day meal streak completion."
    ]:
        pb = tf3_2.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s3, Inches(0.8) + (c_w + gap)*2, Inches(1.8), c_w, Inches(4.35))
    tb3_3 = s3.shapes.add_textbox(Inches(1.0) + (c_w + gap)*2, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf3_3 = tb3_3.text_frame; tf3_3.word_wrap = True
    p = tf3_3.paragraphs[0]; p.text = "WORKPLACE FIT"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_INDIGO
    p2 = tf3_3.add_paragraph(); p2.text = "Corporate Meal Benefits"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Pluxee, Sodexo & Zaggle: Direct API integrations at checkout.",
        "• Tax-Exempt Wallet: Allows salaried corporate users to exhaust monthly meal allowances.",
        "• Split Billing: Seamlessly splits payments between corporate wallet and personal UPI.",
        "• B2B Enterprise Integration: Enables HR teams to co-subsidize healthy office lunches."
    ]:
        pb = tf3_3.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_bottom_banner(s3, "💳 Payment Strategy: UPI AutoPay serves as the low-friction on-ramp; corporate benefits & prepaid bonuses drive lifetime wallet share.")

    # ==================== SLIDE 04: DUAL-ENGINE SCHEDULING (ENHANCED) ====================
    s4 = add_base(4, "Scheduling Engine & UI Architecture",
                  "Dual-Engine Planner UI: Food Vault (Phase 1) & AI Co-Pilot (Phase 2)",
                  "Unified UI with top pill toggle: [💖 My Food Vault (20)] trust anchor + [✨ AI Playlist] auto-pilot.")
    
    add_card(s4, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb4 = s4.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(6.3), Inches(3.95))
    tf4 = tb4.text_frame; tf4.word_wrap = True
    
    p = tf4.paragraphs[0]; p.text = "PROTOTYPE UI SUITE & MICRO-INTERACTIONS"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_INDIGO
    p2 = tf4.add_paragraph(); p2.text = "Deterministic Trust + AI Discovery"; p2.font.size = Pt(17); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    
    bullets_s4 = [
        ("Top Pill Toggle (Vault vs AI)", "Phase 1: 15–20 approved meals guarantee zero surprises; Phase 2: Generates 5-day playlists from NL prompts."),
        ("4-Action Meal Card Suite", "1) 🔄 1-Tap Swap (±₹20 parity covered 100%), 2) ↕️ Drag-and-drop weekday reordering, 3) ⇄ Location Flip, 4) ⏭️ Skip & Bank."),
        ("Contextual Calendar Sync Badge", "Prototype UI displays [📅 Synced: WFH Detected] or [📅 Client Meeting] to trigger automatic location shifts."),
        ("Anti-Palate Fatigue Algorithm", "Curates 80% familiar comfort favorites + 20% chef discovery on Friday, eliminating routine monotony.")
    ]
    for b_title, b_desc in bullets_s4:
        pb = tf4.add_paragraph(); pb.text = f"• {b_title}: "; pb.font.size = Pt(10); pb.font.bold = True; pb.font.color.rgb = COLOR_EMERALD; pb.space_after = Pt(1)
        pd = tf4.add_paragraph(); pd.text = f"   {b_desc}"; pd.font.size = Pt(9.2); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(4)

    add_image_safe(s4, "image9.png", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s4, "🤖 Phased Delivery: Food Vault eliminates day-1 ML hallucination risk; AI Playlist adds intelligence once taste profiles are locked.")

    # ==================== SLIDE 05: HYBRID ROUTING ====================
    s5 = add_base(5, "Hybrid Work Logistics Engine",
                  "Hybrid Split-Location Routing: Calendar-Aware Multi-Address Matrix",
                  "Built for the 3-2 hybrid corporate reality: deliveries follow the employee, eliminating address confusion.")
    
    add_card(s5, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb5 = s5.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(6.3), Inches(3.95))
    tf5 = tb5.text_frame; tf5.word_wrap = True
    
    p = tf5.paragraphs[0]; p.text = "SEAMLESS HYBRID MOBILITY"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf5.add_paragraph(); p2.text = "Mon–Fri Split Matrix Rails"; p2.font.size = Pt(18); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(8)
    
    bullets_s5 = [
        ("Office Pod vs. Home Cluster", "Configure default schedules (e.g., Tue-Thu at Cyber City Tower B; Mon & Fri at DLF Phase 5 residence)."),
        ("7 km Cluster Geofence", "Both addresses qualify under the same pass quota if located within our 7 km micro-hub cluster boundary."),
        ("Calendar Context Sync", "Integrates with Google/Outlook calendars to detect WFH shifts and automatically prompt address realignment."),
        ("30-Minute Wave Drops", "Consolidates office deliveries into scheduled arrival windows (12:30–1:00 PM or 1:00–1:30 PM).")
    ]
    for b_title, b_desc in bullets_s5:
        pb = tf5.add_paragraph(); pb.text = f"• {b_title}: "; pb.font.size = Pt(10.5); pb.font.bold = True; pb.font.color.rgb = COLOR_ORANGE; pb.space_after = Pt(1)
        pd = tf5.add_paragraph(); pd.text = f"   {b_desc}"; pd.font.size = Pt(9.5); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(5)

    add_image_safe(s5, "image3.png", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s5, "🏢 Zero Friction: Eliminates cold meals sitting at empty office desks when employees unexpectedly work from home.")

    # ==================== SLIDE 06: NIGHT-BEFORE CUT-OFF (ENHANCED) ====================
    s6 = add_base(6, "Supply-Demand Synchronization",
                  "Night-Before Decision Engine: 8 PM Interactive Ping & 10 PM Batch Lock",
                  "Interactive Cut-Off tab features live kitchen capacity meters, proactive WhatsApp alerts & 1-tap skip actions.")
    
    add_card(s6, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb6 = s6.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(6.3), Inches(3.95))
    tf6 = tb6.text_frame; tf6.word_wrap = True
    
    p = tf6.paragraphs[0]; p.text = "ZERO-WASTE DEMAND SYNCHRONIZATION"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_AMBER
    p2 = tf6.add_paragraph(); p2.text = "Predictable Kitchen Production"; p2.font.size = Pt(17); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    
    bullets_s6 = [
        ("8:00 PM WhatsApp Interactive Preview", "Pings employee with tomorrow's scheduled meal and 3 quick-action buttons right on WhatsApp."),
        ("Live Kitchen Capacity Meter", "Prototype UI displays real-time kitchen capacity (e.g., '84% booked, 16 slots remaining'), creating gentle urgency."),
        ("Live In-App Countdown to 10:00 PM", "Subtle ambient timer keeps users informed without aggressive spam notifications."),
        ("Three Clear 1-Tap Actions", "1) Keep Meal (Confirm), 2) 1-Tap Swap (Rotate dish), 3) Skip & Bank Credit (Preserve 100% quota in pack)."),
        ("Kitchen Waste Collapses: 28% → <3%", "Kitchens receive exact bulk manifests 14 hours in advance, allowing wholesale prep with zero stockout.")
    ]
    for b_title, b_desc in bullets_s6:
        pb = tf6.add_paragraph(); pb.text = f"• {b_title}: "; pb.font.size = Pt(10); pb.font.bold = True; pb.font.color.rgb = COLOR_EMERALD; pb.space_after = Pt(1)
        pd = tf6.add_paragraph(); pd.text = f"   {b_desc}"; pd.font.size = Pt(9.2); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(4)

    add_image_safe(s6, "image7.png", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s6, "⏱️ Operational Win: Enforcing the 10 PM cut-off unlocks bulk morning cooking, reducing food prep cost by 18%.")

    # ==================== SLIDE 07: VALUE PROTECTION (ENHANCED) ====================
    s7 = add_base(7, "Retention & Trust Architecture",
                  "Value Protection Guarantee: Two-Tier Wallet & Progressive Burn Caps",
                  "Subscription trust earned through non-perishable value: 100% Rupee Rollover & 1–5 Day Travel Pause slider.")
    
    add_card(s7, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb7 = s7.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(6.3), Inches(3.95))
    tf7 = tb7.text_frame; tf7.word_wrap = True
    
    p = tf7.paragraphs[0]; p.text = "ZERO FORFEITURE GUARANTEE"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf7.add_paragraph(); p2.text = "Two-Tier Ledger & Burn Controls"; p2.font.size = Pt(17); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    
    bullets_s7 = [
        ("Two-Tier Wallet Ledger", "Explicit separation of Deposited Money (UPI AutoPay/Prepaid) vs Promotional Rollover Credits."),
        ("Progressive Burn Caps", "Redeem rollover balance up to: 15% on 5-meal pass, 25% on 10-meal pass, and 35% on 20-meal pass on renewal."),
        ("Interactive 1–5 Day Travel Pause Slider", "Drag slider in prototype freezes subscription instantly; extends validity runway with zero administrative penalty."),
        ("End-of-Horizon Safety Net", "Any unconsumed meals at horizon end deposit 100% value into MealsOn Balance, valid for 60 days on renewal.")
    ]
    for b_title, b_desc in bullets_s7:
        pb = tf7.add_paragraph(); pb.text = f"• {b_title}: "; pb.font.size = Pt(10); pb.font.bold = True; pb.font.color.rgb = COLOR_ORANGE; pb.space_after = Pt(1)
        pd = tf7.add_paragraph(); pd.text = f"   {b_desc}"; pd.font.size = Pt(9.2); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(4)

    add_image_safe(s7, "image10.png", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s7, "🛡️ Churn Killer: Traditional subscriptions lose 35% of users to forfeiture rage; MealsOn makes value completely non-perishable.")

    # ==================== SLIDE 08: HABIT GAMIFICATION (ENHANCED) ====================
    s8 = add_base(8, "Engagement & Habit Loops",
                  "Habit Gamification: 4/5 Workweek Rule, Living Bonsai & Spin Wheel",
                  "Positive habit reinforcement featuring an interactive canvas roulette wheel with audio fanfare and real rewards.")
    
    add_card(s8, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb8 = s8.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(6.3), Inches(3.95))
    tf8 = tb8.text_frame; tf8.word_wrap = True
    
    p = tf8.paragraphs[0]; p.text = "THE REINFORCEMENT LOOP"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf8.add_paragraph(); p2.text = "Living Bonsai & Interactive Roulette"; p2.font.size = Pt(17); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    
    bullets_s8 = [
        ("The 4/5 Flexible Workweek Rule", "Consuming 4 scheduled meals completes the weekly streak; 1 team lunch or client outing never breaks streak."),
        ("5-Stage Living Bonsai Tree", "Prototype visual tree sprouts branches from Mon to Thu as healthy meals are confirmed and eaten."),
        ("Interactive Canvas Spin Wheel Modal", "Hitting 4 meals unlocks Friday Lunch Roulette: playable wheel modal with sound effects and confetti fanfare."),
        ("Perks That Reinforce Habit", "Spins win tangible rewards: Artisanal Desserts, Clean Fuel protein shakes, tier upgrades, or wallet cashback.")
    ]
    for b_title, b_desc in bullets_s8:
        pb = tf8.add_paragraph(); pb.text = f"• {b_title}: "; pb.font.size = Pt(10); pb.font.bold = True; pb.font.color.rgb = COLOR_INDIGO; pb.space_after = Pt(1)
        pd = tf8.add_paragraph(); pd.text = f"   {b_desc}"; pd.font.size = Pt(9.2); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(4)

    add_image_safe(s8, "image8.png", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s8, "🌱 Engagement Metric: 78% of active pilot subscribers maintain 4-week active habit streaks under flexible scoring.")

    # ==================== SLIDE 09: SAVINGS & IMPACT LEDGER ====================
    s9 = add_base(9, "Compound Value Proposition",
                  "Weekly Impact & Savings Ledger: Financial, Time & Eco Dividends",
                  "Quantifying the compounded tangible savings delivered to corporate subscribers every Friday.")
    
    add_card(s9, Inches(0.8), Inches(1.8), c_w, Inches(4.35))
    tb9_1 = s9.shapes.add_textbox(Inches(1.0), Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf9_1 = tb9_1.text_frame; tf9_1.word_wrap = True
    p = tf9_1.paragraphs[0]; p.text = "FINANCIAL DIVIDEND"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf9_1.add_paragraph(); p2.text = "₹1,240 / Month Saved"; p2.font.size = Pt(18); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• ₹0 Delivery Surcharges: Completely eliminates ₹45-₹65 surge fees per meal.",
        "• 15% Pass Volume Discount: Wholesale pass pricing beats on-demand restaurant menus.",
        "• ₹0 Packaging Surge: Standardized bulk-run eco-containers reduce packaging fees.",
        "• Annual Impact: ₹14,880 retained in disposable income per employee."
    ]:
        pb = tf9_1.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s9, Inches(0.8) + c_w + gap, Inches(1.8), c_w, Inches(4.35))
    tb9_2 = s9.shapes.add_textbox(Inches(1.0) + c_w + gap, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf9_2 = tb9_2.text_frame; tf9_2.word_wrap = True
    p = tf9_2.paragraphs[0]; p.text = "COGNITIVE DIVIDEND"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf9_2.add_paragraph(); p2.text = "4.2 Hours / Month Saved"; p2.font.size = Pt(18); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Zero Menu Scrolling: Eliminates 18-22 mins of daily 12:30 PM decision deadlock.",
        "• Zero Courier Phone Tag: No 'Bhaiya tower ke bahar khade ho' phone interruptions.",
        "• 100% Punctual Arrival: Consolidated wave drop reaches lobby exactly at 1:00 PM.",
        "• Mental Clarity: Employees focus on afternoon work without lunch anxiety."
    ]:
        pb = tf9_2.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s9, Inches(0.8) + (c_w + gap)*2, Inches(1.8), c_w, Inches(4.35))
    tb9_3 = s9.shapes.add_textbox(Inches(1.0) + (c_w + gap)*2, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf9_3 = tb9_3.text_frame; tf9_3.word_wrap = True
    p = tf9_3.paragraphs[0]; p.text = "ENVIRONMENTAL DIVIDEND"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_INDIGO
    p2 = tf9_3.add_paragraph(); p2.text = "63% Carbon Collapse"; p2.font.size = Pt(18); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Consolidated Delivery: Replaces 14 individual rider two-wheeler trips with 1 batched run.",
        "• 100% Compostable Packaging: Bagasse sugarcane meal trays replace single-use plastic boxes.",
        "• <3% Food Waste: Night-before kitchen demand locking saves 4.5 tons of food per quarter.",
        "• Corporate ESG Badge: Shareable sustainability impact metrics for enterprise HR reports."
    ]:
        pb = tf9_3.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_bottom_banner(s9, "📊 Compounded ROI: The weekly ledger transforms lunch from an invisible expense into a high-visibility personal & corporate benefit.")

    # ==================== SLIDE 10: OFFICE POD CONSOLIDATED DELIVERY ====================
    s10 = add_base(10, "Hyper-Local Last-Mile Efficiency",
                   "Office Pod Consolidated Delivery: Collapsing Drop Costs from ₹65 to ₹24",
                   "Batching Cyber Park Tower B deliveries into a 1 PM wave transforms fragmented chaos into high-density routing.")
    
    add_card(s10, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.35))
    tb10 = s10.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(6.3), Inches(3.95))
    tf10 = tb10.text_frame; tf10.word_wrap = True
    
    p = tf10.paragraphs[0]; p.text = "THE LOGISTICS BREAKTHROUGH"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf10.add_paragraph(); p2.text = "63% Delivery Cost Collapse"; p2.font.size = Pt(18); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(8)
    
    bullets_s10 = [
        ("Fragmented On-Demand (Old)", "14 separate couriers make 14 individual runs; ₹65 cost per order; massive security gate congestion."),
        ("Consolidated Pod Wave (MealsOn)", "1 courier transports 14 pre-sorted meals in a thermal tote; ₹24 cost per meal; single lobby drop."),
        ("1:00 PM Synchronized Drop", "All meals arrive at the tower hub 10 minutes prior to lunch hour, sorted by floor and subscriber name."),
        ("Unit Economics Unlocked", "Saves ₹41 per meal in pure logistics cost—funding customer discounts and kitchen partner margins.")
    ]
    for b_title, b_desc in bullets_s10:
        pb = tf10.add_paragraph(); pb.text = f"• {b_title}: "; pb.font.size = Pt(10.5); pb.font.bold = True; pb.font.color.rgb = COLOR_ORANGE; pb.space_after = Pt(1)
        pd = tf10.add_paragraph(); pd.text = f"   {b_desc}"; pd.font.size = Pt(9.5); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(5)

    add_image_safe(s10, "image6.png", Inches(7.85), Inches(1.8), Inches(4.68), Inches(4.35))
    add_bottom_banner(s10, "⚡ Scalability Core: High pod density enables MealsOn to achieve positive unit economics at price points competitors cannot match.")

    # ==================== SLIDE 11: COMPETITIVE STRATEGY ====================
    s11 = add_base(11, "Competitive Strategy & Moats",
                   "Incumbent Teardown: Why Zomato Subscriptions Failed & Why MealsOn Wins",
                   "Dissecting the structural flaws of aggregator subscription experiments to build an unassailable moat.")
    
    add_card(s11, Inches(0.8), Inches(1.8), c_w, Inches(4.35))
    tb11_1 = s11.shapes.add_textbox(Inches(1.0), Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf11_1 = tb11_1.text_frame; tf11_1.word_wrap = True
    p = tf11_1.paragraphs[0]; p.text = "ZOMATO SUBSCRIPTIONS"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ROSE
    p2 = tf11_1.add_paragraph(); p2.text = "Structural Flaws"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• On-Demand Spine: Dispatches 1 rider per single order; ₹65+ rider fulfillment cost.",
        "• Zero Kitchen Notice: Kitchens cook live on receipt; 20-28% food waste & frequent stockouts.",
        "• Strict Forfeiture: Missed a meal? Money is lost forever (triggered 35% churn by week 3).",
        "• Cannibalization Fear: Discounted subscriptions cannibalized high-margin on-demand ad fees."
    ]:
        pb = tf11_1.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s11, Inches(0.8) + c_w + gap, Inches(1.8), c_w, Inches(4.35))
    tb11_2 = s11.shapes.add_textbox(Inches(1.0) + c_w + gap, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf11_2 = tb11_2.text_frame; tf11_2.word_wrap = True
    p = tf11_2.paragraphs[0]; p.text = "MEALSON ARCHITECTURE"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf11_2.add_paragraph(); p2.text = "Purpose-Built Advantage"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Batched Corridor Delivery: 1 rider delivers 14 meals per tower pod; drop cost collapses to ₹24.",
        "• 10 PM Batch Lock: Kitchens receive exact SKU counts 14 hours ahead; <3% food waste.",
        "• 100% Rupee Rollover: Zero forfeiture; skipped meals roll into renewable wallet credits.",
        "• Focused Habit Engine: Dedicated strictly to daily weekday lunch without platform conflict."
    ]:
        pb = tf11_2.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s11, Inches(0.8) + (c_w + gap)*2, Inches(1.8), c_w, Inches(4.35))
    tb11_3 = s11.shapes.add_textbox(Inches(1.0) + (c_w + gap)*2, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf11_3 = tb11_3.text_frame; tf11_3.word_wrap = True
    p = tf11_3.paragraphs[0]; p.text = "COMPETITIVE MOATS"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf11_3.add_paragraph(); p2.text = "Defensible Moats"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Tower Density Moat: Incumbents cannot match batched ₹24 delivery without clustering orders.",
        "• Trust & Retention Moat: Zero-forfeiture policy builds 60-65% Month-2 retention.",
        "• Kitchen Partnership Moat: Cloud kitchens prioritize MealsOn for predictable morning revenue.",
        "• High Switching Costs: Tower Tribe colleague discounts create social lock-in."
    ]:
        pb = tf11_3.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_bottom_banner(s11, "🛡️ Strategic Moat: Aggregators cannot replicate batched corridor delivery without disrupting their core on-demand driver dispatch models.")

    # ==================== SLIDE 12: UNIT ECONOMICS ====================
    s12 = add_base(12, "Financial Feasibility & Unit Economics",
                   "Strategic Unit Economics: Trading Micro-Spontaneity for Retained Margin",
                   "Full margin walk per meal drop: how predictable batch logistics generate a +₹205 weekly surplus per subscriber.")
    
    add_card(s12, Inches(0.8), Inches(1.8), c_w, Inches(4.35))
    tb12_1 = s12.shapes.add_textbox(Inches(1.0), Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf12_1 = tb12_1.text_frame; tf12_1.word_wrap = True
    p = tf12_1.paragraphs[0]; p.text = "TIER 1: RASOI PASS"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf12_1.add_paragraph(); p2.text = "₹160 / Meal Drop"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Food Cost (COGS): ₹88.00 (55.0% - Homestyle prep)",
        "• Eco Packaging: ₹12.00 (7.5% - Bagasse tray)",
        "• Batched Delivery: ₹24.00 (15.0% - Tower wave)",
        "• Payment Gateway: ₹3.20 (2.0% - UPI AutoPay)",
        "• Platform Gross Surplus: ₹32.80 (20.5% net margin)",
        "• Target Audience: Budget junior analysts & interns."
    ]:
        pb = tf12_1.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s12, Inches(0.8) + c_w + gap, Inches(1.8), c_w, Inches(4.35))
    tb12_2 = s12.shapes.add_textbox(Inches(1.0) + c_w + gap, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf12_2 = tb12_2.text_frame; tf12_2.word_wrap = True
    p = tf12_2.paragraphs[0]; p.text = "TIER 2: BISTRO PASS"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_INDIGO
    p2 = tf12_2.add_paragraph(); p2.text = "₹250 / Meal Drop"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Food Cost (COGS): ₹135.00 (54.0% - Gourmet protein)",
        "• Eco Packaging: ₹15.00 (6.0% - Insulated bowl)",
        "• Batched Delivery: ₹24.00 (9.6% - Tower wave)",
        "• Payment Gateway: ₹5.00 (2.0% - UPI/Cards)",
        "• Platform Gross Surplus: ₹71.00 (28.4% net margin)",
        "• Target Audience: Mid-level engineers & PMs (Hero Tier)."
    ]:
        pb = tf12_2.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s12, Inches(0.8) + (c_w + gap)*2, Inches(1.8), c_w, Inches(4.35))
    tb12_3 = s12.shapes.add_textbox(Inches(1.0) + (c_w + gap)*2, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf12_3 = tb12_3.text_frame; tf12_3.word_wrap = True
    p = tf12_3.paragraphs[0]; p.text = "TIER 3: CHEF'S TABLE"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf12_3.add_paragraph(); p2.text = "₹320 / Meal Drop"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Food Cost (COGS): ₹170.00 (53.1% - Premium artisan)",
        "• Eco Packaging: ₹18.00 (5.6% - Thermal bento)",
        "• Batched Delivery: ₹24.00 (7.5% - Priority drop)",
        "• Payment Gateway: ₹6.40 (2.0% - Corporate cards)",
        "• Platform Gross Surplus: ₹101.60 (31.8% net margin)",
        "• Target Audience: Senior leadership & fitness pros."
    ]:
        pb = tf12_3.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_bottom_banner(s12, "💰 Reinvestment Flywheel: +₹205 weekly surplus per subscriber self-funds Friday rewards (₹40) while retaining healthy net platform profit.")

    # ==================== SLIDE 13: TOWER TRIBE POD CO-OPS ====================
    s13 = add_base(13, "B2B2C Viral Growth Engine",
                   "Tower Tribe Pod Co-Ops: Hyper-Local B2B2C Viral Network Effects",
                   "Turning corporate office buildings into viral, self-organizing delivery clusters via a 3-tier milestone ladder.")
    
    add_card(s13, Inches(0.8), Inches(1.8), c_w, Inches(4.35))
    tb13_1 = s13.shapes.add_textbox(Inches(1.0), Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf13_1 = tb13_1.text_frame; tf13_1.word_wrap = True
    p = tf13_1.paragraphs[0]; p.text = "MILESTONE 1 (5+ SUBSCRIBERS)"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf13_1.add_paragraph(); p2.text = "Priority Tower Drop"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Unlocks Dedicated Lobby Drop: 1:00 PM guaranteed wave arrival.",
        "• Free Priority Dispatch: Eliminates any floor delivery friction.",
        "• Viral Trigger: Colleague invites 3 desk-mates to unlock priority status.",
        "• Drop Cost Impact: Reduces last-mile courier cost to ₹35/meal."
    ]:
        pb = tf13_1.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s13, Inches(0.8) + c_w + gap, Inches(1.8), c_w, Inches(4.35))
    tb13_2 = s13.shapes.add_textbox(Inches(1.0) + c_w + gap, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf13_2 = tb13_2.text_frame; tf13_2.word_wrap = True
    p = tf13_2.paragraphs[0]; p.text = "MILESTONE 2 (12+ SUBSCRIBERS)"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_INDIGO
    p2 = tf13_2.add_paragraph(); p2.text = "5% Colleague Co-Op Discount"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• 5% Discount Across All Tiers: Automatically applied to all pod members.",
        "• Pod Slack/Teams Channel Integration: Live arrival notification posted directly.",
        "• Social Proof: Coworkers see branded delivery crates in office breakout areas.",
        "• Drop Cost Impact: Reduces last-mile courier cost to ₹28/meal."
    ]:
        pb = tf13_2.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s13, Inches(0.8) + (c_w + gap)*2, Inches(1.8), c_w, Inches(4.35))
    tb13_3 = s13.shapes.add_textbox(Inches(1.0) + (c_w + gap)*2, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf13_3 = tb13_3.text_frame; tf13_3.word_wrap = True
    p = tf13_3.paragraphs[0]; p.text = "MILESTONE 3 (25+ SUBSCRIBERS)"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf13_3.add_paragraph(); p2.text = "10% Off + Hot-Case Station"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• 10% Colleague Co-Op Discount: Maximum savings unlocked across the building.",
        "• Dedicated Floor Hot-Case Station: Temperature-controlled insulated food lockers installed.",
        "• Zero Last-Mile Hand-Off: Food stays warm until employee steps away from meetings.",
        "• Drop Cost Impact: Reaches peak logistics efficiency of ₹24.00/meal."
    ]:
        pb = tf13_3.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_bottom_banner(s13, "🚀 Viral CAC Advantage: Existing subscribers recruit their peers to unlock the next discount tier, slashing Blended CAC by 35%.")

    # ==================== SLIDE 14: KITCHEN OS & LOGISTICS ====================
    s14 = add_base(14, "Operational Backend & Infrastructure",
                   "Kitchen Partner OS & Courier Wave Logistics Engine",
                   "Synchronizing cloud kitchen prep schedules with batched corridor delivery for clockwork precision.")
    
    add_card(s14, Inches(0.8), Inches(1.8), c_w, Inches(4.35))
    tb14_1 = s14.shapes.add_textbox(Inches(1.0), Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf14_1 = tb14_1.text_frame; tf14_1.word_wrap = True
    p = tf14_1.paragraphs[0]; p.text = "STEP 1: 10 PM BATCH LOCK"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_AMBER
    p2 = tf14_1.add_paragraph(); p2.text = "Exact Kitchen Manifests"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Aggregated SKU Forecast: 10:01 PM automatic API dispatch to kitchen partner dashboard.",
        "• Zero Speculative Inventory: Kitchens order exact raw materials from wholesale vendors.",
        "• Capacity Quota Protection: Kitchen order caps prevent kitchen overbooking and quality degradation.",
        "• Advance Prep: Pre-portioning and marinating happens seamlessly overnight."
    ]:
        pb = tf14_1.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s14, Inches(0.8) + c_w + gap, Inches(1.8), c_w, Inches(4.35))
    tb14_2 = s14.shapes.add_textbox(Inches(1.0) + c_w + gap, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf14_2 = tb14_2.text_frame; tf14_2.word_wrap = True
    p = tf14_2.paragraphs[0]; p.text = "STEP 2: WHOLESALE BATCH PREP"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_INDIGO
    p2 = tf14_2.add_paragraph(); p2.text = "6:00 AM – 11:30 AM Prep"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Industrial Batch Cooking: Chef cooks 150 portions of Dal Makhani in one continuous kettle cycle.",
        "• Standardized QC Checks: Temperature probing and visual consistency verified prior to packaging.",
        "• Automated QR Bag Tagging: Thermal printer prints subscriber name, tower pod, and dietary tag.",
        "• Staging in Thermal Racks: Packed meals staged in heated staging cabinets at 65°C."
    ]:
        pb = tf14_2.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s14, Inches(0.8) + (c_w + gap)*2, Inches(1.8), c_w, Inches(4.35))
    tb14_3 = s14.shapes.add_textbox(Inches(1.0) + (c_w + gap)*2, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf14_3 = tb14_3.text_frame; tf14_3.word_wrap = True
    p = tf14_3.paragraphs[0]; p.text = "STEP 3: 12:15 PM WAVE DISPATCH"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf14_3.add_paragraph(); p2.text = "Consolidated Tower Drops"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Single Van/Bike Dispatch: Dedicated fleet courier collects 30-50 pre-sorted pod meals.",
        "• Thermal Trunk Containers: Double-insulated containers maintain food serving heat.",
        "• 12:45 PM Lobby Arrival: Courier scans single master QR at lobby concierge or pod locker.",
        "• Automated Subscriber Notification: In-app WhatsApp alert: 'Your lunch is ready in Tower B Lobby!'."
    ]:
        pb = tf14_3.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_bottom_banner(s14, "⚙️ Operational Rigor: Zero live order chaos—every kitchen step is fully scheduled, pre-allocated, and thermally monitored.")

    # ==================== SLIDE 15: PILOT ROADMAP ====================
    s15 = add_base(15, "Go-To-Market Execution",
                   "Phased Rollout Plan: Cyber Park Beachhead to Pan-India Metro Scale",
                   "A disciplined, milestone-driven expansion roadmap proving unit economics before scaling geography.")
    
    add_card(s15, Inches(0.8), Inches(1.8), c_w, Inches(4.35))
    tb15_1 = s15.shapes.add_textbox(Inches(1.0), Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf15_1 = tb15_1.text_frame; tf15_1.word_wrap = True
    p = tf15_1.paragraphs[0]; p.text = "PHASE 1: BEACHHEAD PILOT"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ORANGE
    p2 = tf15_1.add_paragraph(); p2.text = "Weeks 1–8: Cyber City"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Geography: DLF Cyber City, Gurgaon (5 Corporate Towers).",
        "• Kitchen Supply: 3 Top-rated cloud kitchen partners.",
        "• Core Targets: 1,000 active subscribers; Pass Completion ≥ 82%.",
        "• Fleet Metric: Prove batched drop cost ≤ ₹24.00 per meal.",
        "• Success Gate: Month-2 Renewal rate ≥ 60% before expanding."
    ]:
        pb = tf15_1.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s15, Inches(0.8) + c_w + gap, Inches(1.8), c_w, Inches(4.35))
    tb15_2 = s15.shapes.add_textbox(Inches(1.0) + c_w + gap, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf15_2 = tb15_2.text_frame; tf15_2.word_wrap = True
    p = tf15_2.paragraphs[0]; p.text = "PHASE 2: CLUSTER SCALE"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_INDIGO
    p2 = tf15_2.add_paragraph(); p2.text = "Months 3–6: Delhi-NCR"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Geography: Expand to Noida Sector 62 & Golf Course Road.",
        "• Feature Unlocks: Launch AI Health Co-Pilot & HR Cafeteria portals.",
        "• Core Targets: 8,000 active subscribers; 20 corporate pod tribes.",
        "• Financial Milestone: Positive contribution margin across all 3 clusters.",
        "• Partnerships: Formal integrations with Pluxee, Zaggle, and Sodexo."
    ]:
        pb = tf15_2.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_card(s15, Inches(0.8) + (c_w + gap)*2, Inches(1.8), c_w, Inches(4.35))
    tb15_3 = s15.shapes.add_textbox(Inches(1.0) + (c_w + gap)*2, Inches(2.0), c_w - Inches(0.4), Inches(3.95))
    tf15_3 = tb15_3.text_frame; tf15_3.word_wrap = True
    p = tf15_3.paragraphs[0]; p.text = "PHASE 3: METRO EXPANSION"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf15_3.add_paragraph(); p2.text = "Months 7–12: Multi-City"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    for b in [
        "• Geography: Bangalore (Outer Ring Rd) & Mumbai (BKC).",
        "• Scale Target: 50,000 active daily subscribers.",
        "• Revenue Run-Rate: ₹42 Crore ARR run-rate with 24% EBITDA margin.",
        "• Enterprise B2B: Direct white-label corporate cafeteria contracts.",
        "• Long-Term Retention: Sustained 65% Month-2 retention baseline."
    ]:
        pb = tf15_3.add_paragraph(); pb.text = b; pb.font.size = Pt(9.5); pb.font.color.rgb = COLOR_TEXT_SECONDARY; pb.space_after = Pt(4)

    add_bottom_banner(s15, "📈 Capital Efficiency: The pilot requires zero heavy capital expenditure—leveraging existing cloud kitchen capacity and corridor riders.")

    # ==================== SLIDE 16: GOVERNANCE & RISK MITIGATION ====================
    s16 = add_base(16, "Risk Governance & Success Scorecard",
                   "Executive Governance: North-Star Metrics & Failure Mode Playbook",
                   "Rigorous KPI tracking and proactive mitigation protocols protecting customer trust and service SLAs.")
    
    col_w = Inches(5.7)
    gap_col = Inches(0.33)
    
    add_card(s16, Inches(0.8), Inches(1.8), col_w, Inches(4.35))
    tb16_1 = s16.shapes.add_textbox(Inches(1.05), Inches(2.0), col_w - Inches(0.4), Inches(3.95))
    tf16_1 = tb16_1.text_frame; tf16_1.word_wrap = True
    p = tf16_1.paragraphs[0]; p.text = "NORTH STAR KPI SCORECARD"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_EMERALD
    p2 = tf16_1.add_paragraph(); p2.text = "Grounded Target Metrics"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    
    kpis = [
        ("Pass Completion Rate", "≥ 82%", "Percentage of purchased meals consumed within validity buffer window."),
        ("Month-2 Renewal Rate", "60% – 65%", "Driven by 100% Rupee Rollover Wallet and zero-forfeiture guarantee."),
        ("Kitchen Food Waste", "< 3.0%", "Reduced from industry 28% via 10 PM night-before demand batch locking."),
        ("Fleet Drop Cost", "≤ ₹24.00", "Achieved by batching 10-14 meal orders per single corporate tower wave drop."),
        ("Customer NPS Score", "≥ 62", "Benchmark against on-demand food aggregator average NPS of 38-42.")
    ]
    for kname, kval, kdesc in kpis:
        pk = tf16_1.add_paragraph(); pk.text = f"• {kname} [{kval}]: "; pk.font.size = Pt(10); pk.font.bold = True; pk.font.color.rgb = COLOR_ORANGE; pk.space_after = Pt(1)
        pd = tf16_1.add_paragraph(); pd.text = f"   {kdesc}"; pd.font.size = Pt(9); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(3)

    add_card(s16, Inches(0.8) + col_w + gap_col, Inches(1.8), col_w, Inches(4.35))
    tb16_2 = s16.shapes.add_textbox(Inches(1.05) + col_w + gap_col, Inches(2.0), col_w - Inches(0.4), Inches(3.95))
    tf16_2 = tb16_2.text_frame; tf16_2.word_wrap = True
    p = tf16_2.paragraphs[0]; p.text = "FAILURE MODE PLAYBOOK"; p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = COLOR_ROSE
    p2 = tf16_2.add_paragraph(); p2.text = "Proactive SLA Mitigations"; p2.font.size = Pt(16); p2.font.bold = True; p2.font.color.rgb = COLOR_TEXT_PRIMARY; p2.space_after = Pt(6)
    
    risks = [
        ("Kitchen Stockout / Incident", "Hot Standby Kitchen: Partner backup cloud kitchen maintains 20 ready buffer portions; auto-failsafe re-routing within 15 mins."),
        ("Courier Breakdown / Traffic Delay", "12:15 PM Early Dispatch Buffer: 45-min buffer window allows backup rider dispatch from Cyber Park corridor depot with zero late drops."),
        ("Spillage / Temperature Drop", "Hermetic Heat-Sealed Trays: Tested for 90-min heat retention (min 60°C); 100% immediate meal refund + free lunch coupon on breach."),
        ("Rain / Extreme Weather", "Monsoon Drop Protocols: Dedicated indoor lobby concierge handoff coordinates with building facility teams.")
    ]
    for rname, rdesc in risks:
        pr = tf16_2.add_paragraph(); pr.text = f"• {rname}: "; pr.font.size = Pt(10); pr.font.bold = True; pr.font.color.rgb = COLOR_AMBER; pr.space_after = Pt(1)
        pd = tf16_2.add_paragraph(); pd.text = f"   {rdesc}"; pd.font.size = Pt(9); pd.font.color.rgb = COLOR_TEXT_SECONDARY; pd.space_after = Pt(3)

    add_bottom_banner(s16, "🏆 Product Vision: MealsOn Scheduled Meals transforms corporate lunch into a predictable, zero-waste daily utility.")

    out_paths = [
        os.path.join("public", "presentation", "MealsOn_Master_Deck.pptx"),
        os.path.join("dist", "presentation", "MealsOn_Master_Deck.pptx"),
        os.path.join("docs", "presentation", "MealsOn_Master_Deck.pptx")
    ]
    for p in out_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        prs.save(p)
        print(f"Saved: {p} ({os.path.getsize(p)} bytes)")

if __name__ == "__main__":
    create_deck()
