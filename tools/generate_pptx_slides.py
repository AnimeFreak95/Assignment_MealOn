#!/usr/bin/env python3
"""
Generates and synchronizes MealsOn_Executive_Presentation.pptx with all verified PRD facts:
- Normalizes presentation to exactly 12 slides (trims duplicates).
- Updates Slides 1–9 text with verified facts (Rasoi/Bistro/Chef's Table, 6 pillars, 10-35d buffer, <3% waste, etc.).
- Rebuilds Slide 10 (Habit Engine & Tower Tribe), Slide 11 (Unit Economics & Trade-Offs), and Slide 12 (Pilot Rollout & Gates).
- Saves synchronized PPTX to public/, dist/, and docs/.
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

COLOR_BG = RGBColor(0xF8, 0xFA, 0xFC)          # Slate 50
COLOR_CARD_BG = RGBColor(0xFF, 0xFF, 0xFF)     # White
COLOR_CARD_BORDER = RGBColor(0xE2, 0xE8, 0xF0) # Slate 200
COLOR_ORANGE = RGBColor(0xFF, 0x5A, 0x1F)      # Primary Orange / Tangerine
COLOR_TITLE = RGBColor(0x0F, 0x17, 0x2A)       # Slate 900
COLOR_SUBTITLE = RGBColor(0x47, 0x55, 0x69)    # Slate 600
COLOR_MUTED = RGBColor(0x94, 0xA3, 0xB8)       # Slate 400
COLOR_EMERALD = RGBColor(0x10, 0xB9, 0x81)     # Emerald 500
COLOR_INDIGO = RGBColor(0x4F, 0x46, 0xE5)      # Indigo 600
COLOR_AMBER = RGBColor(0xD9, 0x77, 0x06)       # Amber 600

def replace_text_in_slide(slide, old_text, new_text):
    for shape in slide.shapes:
        if shape.has_text_frame:
            for p in shape.text_frame.paragraphs:
                if old_text in p.text:
                    p.text = p.text.replace(old_text, new_text)

def create_base_slide(prs, category_text, title_text):
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    
    # 1. Background fill
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_BG
    bg.line.fill.background()
    
    # 2. Header text box
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.73), Inches(1.2))
    tf = header_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    p_cat = tf.paragraphs[0]
    p_cat.text = category_text
    p_cat.font.size = Pt(10)
    p_cat.font.bold = True
    p_cat.font.color.rgb = COLOR_ORANGE
    p_cat.space_after = Pt(4)
    
    p_title = tf.add_paragraph()
    p_title.text = title_text
    p_title.font.size = Pt(21)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_TITLE
    
    # 3. Footer text box
    footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.95), Inches(11.73), Inches(0.3))
    tf_f = footer_box.text_frame
    tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = 0
    p_foot = tf_f.paragraphs[0]
    p_foot.text = "MealsOn Scheduled Meals • Executive Product Strategy"
    p_foot.font.size = Pt(9)
    p_foot.font.color.rgb = COLOR_MUTED
    
    return slide

def add_card(slide, left, top, width, height):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_CARD_BG
    card.line.color.rgb = COLOR_CARD_BORDER
    card.line.width = Pt(1)
    return card

def build_presentation():
    pptx_path = 'public/presentation/MealsOn_Executive_Presentation.pptx'
    prs = Presentation(pptx_path)
    
    # Trim to base 9 slides if duplicate runs exist
    while len(prs.slides) > 9:
        rId = prs.slides._sldIdLst[-1].rId
        prs.part.drop_rel(rId)
        del prs.slides._sldIdLst[-1]
    
    # Update Slide 1
    s1 = prs.slides[0]
    replace_text_in_slide(s1, "35% Churn: Traditional subscriptions fail by Week 3", "35% Churn: Traditional subscriptions fail by W3 (Industry Benchmark)")
    replace_text_in_slide(s1, "3 Tiers: ₹160 Homestyle, ₹250 Balanced, ₹320 Macro Pro", "3 Tiers: ₹160 (Rasoi), ₹250 (Bistro), ₹320 (Chef's Table)")
    replace_text_in_slide(s1, "35-Day Buffer: Extended validity so unconsumed meals never forfeit", "10–35-Day Buffer: Zero-forfeiture validity (20-meal = 35d)")
    replace_text_in_slide(s1, "28% Less Waste: Night-before 10 PM kitchen batch procurement", "<3% Food Waste: Night-before 10 PM batch lock (vs 20–28% on-demand)")

    # Update Slide 2 (Ananya)
    s2 = prs.slides[1]
    replace_text_in_slide(s2, "Curates personal 12-dish vault.", "Curates personal 10–20 comfort favorites.")

    # Update Slide 3
    s3 = prs.slides[2]
    replace_text_in_slide(s3, "The 8 Strategic Pillars of MealsOn Scheduled Meals", "The 6 Strategic Pillars of MealsOn Scheduled Meals")
    replace_text_in_slide(s3, "The 6 Connected Pillars of MealsOn Scheduled Meals", "The 6 Strategic Pillars of MealsOn Scheduled Meals")
    replace_text_in_slide(s3, "3 Allowance Tiers (₹160/₹250/₹320) + 10 to 35-day validity buffer + ₹0 delivery.", "Allowance tiers (₹160 Rasoi / ₹250 Bistro / ₹320 Chef's Table) + 10 to 35-day validity buffer + ₹0 delivery.")
    replace_text_in_slide(s3, "Dual-mode scheduling: AI prompt discovery OR user's 20-dish curated vault.", "Dual-mode scheduling: AI prompt discovery OR rotating from 10–20 curated favorites.")
    replace_text_in_slide(s3, "Weekday Office vs. Home matrix with smart calendar sync auto-detecting WFH days.", "Weekday Office vs. Home matrix with calendar WFH auto-reroute (OAuth in Phase 3).")
    replace_text_in_slide(s3, "100% rollover protection, vacation pause slider, and pro-rata fair refund rails.", "100% rollover protection, vacation pause slider, and unconsumed credit banking into lifetime wallet.")

    # Update Slide 4
    s4 = prs.slides[3]
    replace_text_in_slide(s4, "The ₹60 surplus rolls directly into MealsOn Credits for treats.", "The ₹60 surplus rolls directly into MealsOn Balance for future meals and renewals.")

    # Update Slide 5
    s5 = prs.slides[4]
    replace_text_in_slide(s5, "Tier 1: ₹160/Meal ('Comfort')", "Tier 1: ₹160/Meal ('Rasoi' - Homestyle)")
    replace_text_in_slide(s5, "Tier 2: ₹250/Meal ('Balanced' - Hero)", "Tier 2: ₹250/Meal ('Bistro' - Most Popular)")
    replace_text_in_slide(s5, "Tier 3: ₹320/Meal ('Macro Pro')", "Tier 3: ₹320/Meal ('Chef's Table' - Artisanal)")
    replace_text_in_slide(s5, "Homestyle tiffins, khichdi, roti-sabzi (Save ₹1,280 on 20 meals)", "Homestyle tiffins, khichdi, roti-sabzi (Save ₹1,280 on 20 meals*)")
    replace_text_in_slide(s5, "Executive thalis, paneer bowls, wraps (Save ₹1,550 on 20 meals)", "Executive thalis, paneer bowls, wraps (Save ₹1,550 on 20 meals*)")
    replace_text_in_slide(s5, ">30g protein gym bowls, keto, artisanal salads (Save ₹1,760 on 20 meals)", "Gourmet Pan-Asian, grill platters, artisanal specials (Save ₹1,760 on 20 meals*)")

    # Update Slide 6
    s6 = prs.slides[5]
    replace_text_in_slide(s6, "• Multi-Kitchen Rotation: Max 2 days per brand per week; consecutive days alternate cuisines", "• Anti-Monotony Heuristic: Alternates cuisines; max 2 days per kitchen brand")
    replace_text_in_slide(s6, "• Curate Up to 20 Favorites: Handpick 5–20 approved meals from verified partner cloud kitchens", "• Curate 10–20 Favorites (Target ≥8): Handpick approved meals from verified partner kitchens")

    # Update Slide 7
    s7 = prs.slides[6]
    replace_text_in_slide(s7, "Precision Drop Windows: Office drop at 1:00 PM – 1:15 PM; Home drop at 1:30 PM – 1:45 PM", "Precision Drop Windows: Office drop at 1:00 PM – 1:30 PM; Home drop at 1:30 PM – 2:00 PM")
    replace_text_in_slide(s7, "75% Churn Reduction: Completely stops meals from arriving at empty office desks", "Zero-Desks Drop: Eliminates empty-desk delivery churn")
    replace_text_in_slide(s7, "SMART CALENDAR SYNC", "SMART CALENDAR REROUTE (Simulated MVP • Phase 3 OAuth)")

    # Update Slide 8
    s8 = prs.slides[7]
    replace_text_in_slide(s8, "Preserves credit into Pause Shield Wallet and extends pass validity +1 day.", "Preserves meal quota in pass (extends runway +1 day within buffer; unconsumed converts to wallet).")
    replace_text_in_slide(s8, "10 PM lock-in cuts partner food waste by 28%.", "10 PM night-before batch lock achieves <3% food waste for cloud kitchens (vs 20–28% on-demand).")

    # Update Slide 9
    s9 = prs.slides[8]
    replace_text_in_slide(s9, "8-second looping animation communicating the 3 trust pillars, interactive tier picker, and +5% bonus.", "15-second video story communicating trust pillars, 10–35d buffer runway, and ₹ rollover.")
    replace_text_in_slide(s9, "Concise 150-char SMS with personalized shortlink for planning next week's lunches.", "Concise 150-char SMS with personalized shortlink (11:15 AM trigger).")

    # --- SLIDE 10: Habit Engine & Community Co-Op ---
    s10 = create_base_slide(
        prs,
        "SLIDE 10 • RETENTION & NETWORK EFFECTS",
        "Healthy Week Habit Tree & Tower Tribe Pod Co-Op"
    )
    
    # Card 1: Habit Tree (Left)
    add_card(s10, Inches(0.8), Inches(1.9), Inches(5.7), Inches(4.2))
    tb_c1 = s10.shapes.add_textbox(Inches(1.1), Inches(2.1), Inches(5.1), Inches(3.8))
    tf1 = tb_c1.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "🌱 Healthy Week Habit Tree"
    p1.font.size = Pt(15)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_EMERALD
    p1.space_after = Pt(8)
    
    p2 = tf1.add_paragraph()
    p2.text = "• 5-Stage Living Bonsai: Grows from Seedling (Mon) to Golden Bloom (Fri) with each healthy lunch logged."
    p2.font.size = Pt(11)
    p2.font.color.rgb = COLOR_TITLE
    p2.space_after = Pt(6)
    
    p3 = tf1.add_paragraph()
    p3.text = "• 4/5 Flexible Grace Rule: 1 cheat meal or travel skip forgives habit streak without wiping weekly progress."
    p3.font.size = Pt(11)
    p3.font.color.rgb = COLOR_TITLE
    p3.space_after = Pt(6)
    
    p4 = tf1.add_paragraph()
    p4.text = "• Friday Duality Payoff: Choose between Clean Fuel (Greek Yogurt / Cold-Pressed Juice) or Cheat Treat (Artisanal Brownie / Gelato) bundled at ₹0 delivery surcharge."
    p4.font.size = Pt(11)
    p4.font.color.rgb = COLOR_TITLE
    p4.space_after = Pt(6)
    
    p5 = tf1.add_paragraph()
    p5.text = "• Friday Lunch Roulette: Guaranteed digital rewards (wallet cash, tier upgrades, buffer days) eliminate physical treat logistics."
    p5.font.size = Pt(11)
    p5.font.color.rgb = COLOR_SUBTITLE

    # Card 2: Tower Tribe Pod Co-Op (Right)
    add_card(s10, Inches(6.8), Inches(1.9), Inches(5.7), Inches(4.2))
    tb_c2 = s10.shapes.add_textbox(Inches(7.1), Inches(2.1), Inches(5.1), Inches(3.8))
    tf2 = tb_c2.text_frame
    tf2.word_wrap = True
    
    q1 = tf2.paragraphs[0]
    q1.text = "🏢 Tower Tribe Pod Co-Op"
    q1.font.size = Pt(15)
    q1.font.bold = True
    q1.font.color.rgb = COLOR_INDIGO
    q1.space_after = Pt(8)
    
    q2 = tf2.add_paragraph()
    q2.text = "• Building-Level Density Engine: Aggregates colleagues across corporate floors into a single consolidated delivery drop."
    q2.font.size = Pt(11)
    q2.font.color.rgb = COLOR_TITLE
    q2.space_after = Pt(6)
    
    q3 = tf2.add_paragraph()
    q3.text = "• Milestone Ladder Rewards: Collective order volumes unlock shared Friday Fuel Credits for all participants:"
    q3.font.size = Pt(11)
    q3.font.color.rgb = COLOR_TITLE
    q3.space_after = Pt(4)
    
    q4 = tf2.add_paragraph()
    q4.text = "   🥉 Bronze (25 orders): ₹25 Fuel Credit\n   🥈 Silver (50 orders): ₹50 Fuel Credit\n   🥇 Gold (75+ orders): ₹75 Fuel Credit"
    q4.font.size = Pt(11)
    q4.font.bold = True
    q4.font.color.rgb = COLOR_ORANGE
    q4.space_after = Pt(6)
    
    q5 = tf2.add_paragraph()
    q5.text = "• Viral Workplace Growth: 1-tap colleague nudges drive organic adoption; lowers CAC to near-zero in density corridors."
    q5.font.size = Pt(11)
    q5.font.color.rgb = COLOR_SUBTITLE

    # Banner / Impact Callout
    banner = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.73), Inches(0.55))
    banner.fill.solid()
    banner.fill.fore_color.rgb = COLOR_TITLE
    banner.line.fill.background()
    tb_b = s10.shapes.add_textbox(Inches(1.0), Inches(6.3), Inches(11.3), Inches(0.45))
    tf_b = tb_b.text_frame
    tf_b.margin_top = Inches(0.05)
    pb = tf_b.paragraphs[0]
    pb.text = "📊 Impact Ledger: ₹3,120 Delivery Fees Saved (All-Time) • 14.2 kg CO2 Offset • 6.5 hrs Time Saved (Illustrative) • Target: ≥84% M1 Retention (<3.5% refunds)"
    pb.font.size = Pt(10)
    pb.font.bold = True
    pb.font.color.rgb = COLOR_CARD_BG

    # --- SLIDE 11: Strategic Trade-Offs & Unit Economics ---
    s11 = create_base_slide(
        prs,
        "SLIDE 11 • STRATEGIC TRADE-OFFS & UNIT ECONOMICS",
        "Trading Micro-Spontaneity for Macro-Predictability & 63% Lower Last-Mile Cost"
    )
    
    col_w = Inches(3.64)
    gap = Inches(0.4)
    start_x = Inches(0.8)
    
    # 3 Trade-Off Cards
    tradeoffs = [
        (
            "📦 3 FIXED 30-MIN WINDOWS",
            "Rejected Open 15-Min Slots",
            [
                "• 12:30–1:00, 1:00–1:30, 1:30–2:00 PM",
                "• Consolidates 10–14 deliveries per 30-min window (15–25 meals per tower wave).",
                "• Drop cost collapses from ₹65 (on-demand) to ₹24 (63% unit cost reduction).",
                "• Prevents rider fleet fragmentation during peak lunch rush."
            ],
            COLOR_ORANGE
        ),
        (
            "⏰ 10 PM ZERO-WASTE LOCK",
            "Rejected Morning Cancellations",
            [
                "• 10:00 PM night-before order cutoff",
                "• Cloud kitchens receive exact batch production schedules at 6:00 AM.",
                "• Reduces raw ingredient food waste to <3% (vs 20–28% on-demand).",
                "• Unlocks 25% wholesale pricing discounts passed directly to users."
            ],
            COLOR_EMERALD
        ),
        (
            "📍 7 KM CLUSTER GEOFENCE",
            "Rejected Cross-City Swaps",
            [
                "• Hybrid Office vs Home routing limited to 7 km radius",
                "• Night-before 10 PM routing lock prevents same-day route disruption.",
                "• Protects batch route clustering without deadhead delivery miles.",
                "• Preserves seamless hybrid flexibility for 94% of urban office commutes."
            ],
            COLOR_INDIGO
        )
    ]
    
    for i, (title, sub, bullets, color) in enumerate(tradeoffs):
        cx = start_x + i * (col_w + gap)
        add_card(s11, cx, Inches(1.9), col_w, Inches(4.2))
        tb_card = s11.shapes.add_textbox(cx + Inches(0.2), Inches(2.1), col_w - Inches(0.4), Inches(3.8))
        tfc = tb_card.text_frame
        tfc.word_wrap = True
        
        p = tfc.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(2)
        
        p_sub = tfc.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_TITLE
        p_sub.space_after = Pt(8)
        
        for bullet in bullets:
            pb = tfc.add_paragraph()
            pb.text = bullet
            pb.font.size = Pt(10)
            pb.font.color.rgb = COLOR_SUBTITLE
            pb.space_after = Pt(4)
            
    # Bottom Callout
    banner11 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.73), Inches(0.55))
    banner11.fill.solid()
    banner11.fill.fore_color.rgb = RGBColor(0xFE, 0xF3, 0xC7) # Amber 100
    banner11.line.color.rgb = RGBColor(0xF5, 0x9E, 0x0B)
    tb_b11 = s11.shapes.add_textbox(Inches(1.0), Inches(6.3), Inches(11.3), Inches(0.45))
    tf_b11 = tb_b11.text_frame
    tf_b11.margin_top = Inches(0.05)
    pb11 = tf_b11.paragraphs[0]
    pb11.text = "💡 Economics Proof: Logistics batching generates +₹205 weekly surplus per 5-day office subscriber (+₹123 on 3-day hybrid), self-funding Friday treats and loyalty perks."
    pb11.font.size = Pt(10)
    pb11.font.bold = True
    pb11.font.color.rgb = RGBColor(0x92, 0x40, 0x0E)

    # --- SLIDE 12: Go-To-Market Execution & Pilot Plan ---
    s12 = create_base_slide(
        prs,
        "SLIDE 12 • GO-TO-MARKET EXECUTION & PILOT PLAN",
        "Cyber Park Gurgaon Beachhead: 3 Towers, 5 Kitchens, 500 Beta Users"
    )
    
    phases = [
        (
            "PHASE 1: BEACHHEAD (W1–W6)",
            "DLF Cyber Park, Gurgaon",
            [
                "• Density Target: 3 Anchor corporate tech towers (~18,000 employees).",
                "• Kitchen Supply: 5 Partner cloud kitchens (Homestyle, Fit Bowls, Thalis).",
                "• User Cap: 500 Beta Pass subscribers.",
                "• SLA Focus: 97.5% on-time 30-min window delivery.",
                "• Drop Target: Single lobby drop desk per tower."
            ],
            COLOR_ORANGE
        ),
        (
            "PHASE 2: CLUSTER SCALE (W7–W14)",
            "Cyber City & DLF Phase 5",
            [
                "• Density Target: 12 Corporate tech towers + 8 residential pods within 7 km.",
                "• Kitchen Supply: 15 Cloud kitchens with diversified cuisines.",
                "• User Base: 2,500 Active recurring subscribers.",
                "• Features Unlocked: Tower Tribe milestone rewards, AI Playlist Engine, Corporate Direct Billing.",
                "• Logistics: Dedicated 2-wheeler EV batch pods."
            ],
            COLOR_INDIGO
        ),
        (
            "PHASE 3: METRO SCALE (M4+)",
            "Bengaluru & Mumbai Hubs",
            [
                "• Expansion: ORR Whitefield (Bengaluru) and BKC (Mumbai).",
                "• Volume Target: 10,000+ daily scheduled orders.",
                "• Automation: Calendar Auto-Sync (OAuth), lobby warming pods, 100% EV delivery fleet.",
                "• Corporate Scale: Pan-India enterprise cafeteria & HR wellness rollouts."
            ],
            COLOR_EMERALD
        )
    ]
    
    for i, (title, sub, bullets, color) in enumerate(phases):
        cx = start_x + i * (col_w + gap)
        add_card(s12, cx, Inches(1.9), col_w, Inches(4.2))
        tb_card = s12.shapes.add_textbox(cx + Inches(0.2), Inches(2.1), col_w - Inches(0.4), Inches(3.8))
        tfc = tb_card.text_frame
        tfc.word_wrap = True
        
        p = tfc.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(2)
        
        p_sub = tfc.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_TITLE
        p_sub.space_after = Pt(8)
        
        for bullet in bullets:
            pb = tfc.add_paragraph()
            pb.text = bullet
            pb.font.size = Pt(10)
            pb.font.color.rgb = COLOR_SUBTITLE
            pb.space_after = Pt(4)
            
    # Bottom Gate Criteria Banner
    banner12 = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.73), Inches(0.55))
    banner12.fill.solid()
    banner12.fill.fore_color.rgb = RGBColor(0xDC, 0xFC, 0xE7) # Emerald 100
    banner12.line.color.rgb = RGBColor(0x10, 0xB9, 0x81)
    tb_b12 = s12.shapes.add_textbox(Inches(1.0), Inches(6.3), Inches(11.3), Inches(0.45))
    tf_b12 = tb_b12.text_frame
    tf_b12.margin_top = Inches(0.05)
    pb12 = tf_b12.paragraphs[0]
    pb12.text = "🚀 Pilot Success Gates: Meal Adherence ≥ 80% (PRD North Star ≥ 82%) • 30-Min SLA ≥ 97.5% • Fleet CAC ≤ ₹26/drop (PRD Target ₹24) • Net Margin Positive"
    pb12.font.size = Pt(10)
    pb12.font.bold = True
    pb12.font.color.rgb = RGBColor(0x06, 0x5F, 0x46)
    
    # Save back to public/, dist/, and docs/
    os.makedirs('public/presentation', exist_ok=True)
    os.makedirs('dist/presentation', exist_ok=True)
    os.makedirs('docs/presentation', exist_ok=True)
    
    prs.save('public/presentation/MealsOn_Executive_Presentation.pptx')
    prs.save('dist/presentation/MealsOn_Executive_Presentation.pptx')
    prs.save('docs/presentation/MealsOn_Executive_Presentation.pptx')
    print(f"Successfully generated synchronized 12-slide presentation ({len(prs.slides)} slides) in public/, dist/, and docs/!")

if __name__ == '__main__':
    build_presentation()
