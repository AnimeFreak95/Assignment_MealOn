#!/usr/bin/env python3
"""
Adds Slide 10, Slide 11, and Slide 12 to MealsOn_Executive_Presentation.pptx
and updates Slide 3 title to reflect 8 Pillars.
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

COLOR_BG = RGBColor(0xF8, 0xFA, 0xFC)       # Slate 50
COLOR_CARD_BG = RGBColor(0xFF, 0xFF, 0xFF)  # White
COLOR_CARD_BORDER = RGBColor(0xE2, 0xE8, 0xF0) # Slate 200
COLOR_ORANGE = RGBColor(0xFF, 0x5A, 0x1F)   # Primary Orange / Tangerine
COLOR_TITLE = RGBColor(0x0F, 0x17, 0x2A)    # Slate 900
COLOR_SUBTITLE = RGBColor(0x47, 0x55, 0x69) # Slate 600
COLOR_MUTED = RGBColor(0x94, 0xA3, 0xB8)    # Slate 400
COLOR_EMERALD = RGBColor(0x10, 0xB9, 0x81)  # Emerald 500
COLOR_INDIGO = RGBColor(0x4F, 0x46, 0xE5)   # Indigo 600
COLOR_AMBER = RGBColor(0xD9, 0x77, 0x06)    # Amber 600

def create_base_slide(prs, category_text, title_text):
    blank_layout = prs.slide_layouts[6] # blank layout
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
    
    # Update Slide 3 Header
    slide_3 = prs.slides[2]
    tb = slide_3.shapes[1]
    tb.text_frame.paragraphs[1].text = "The 8 Strategic Pillars of MealsOn Scheduled Meals"
    
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
    p5.text = "• Psychological Anchor: Transforms repetitive food selection into a visible weekly health investment."
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
    q5.text = "• Viral Workplace Growth: Organic word-of-mouth referral without paid ads; lowers CAC to near-zero in density hubs."
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
    pb.text = "📊 Impact Ledger: ₹2,840 Saved/Mo • 4.8 kg CO2 Avoided (Batch EVs) • 14.2 hrs Cognitive Time Saved • W4 Retention: 84%"
    pb.font.size = Pt(10)
    pb.font.bold = True
    pb.font.color.rgb = COLOR_CARD_BG

    # --- SLIDE 11: Strategic Trade-Offs & Unit Economics ---
    s11 = create_base_slide(
        prs,
        "SLIDE 11 • STRATEGIC TRADE-OFFS & UNIT ECONOMICS",
        "Trading Micro-Spontaneity for Macro-Predictability & 63% Margin Edge"
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
                "• Consolidates 10–14 deliveries per rider into a single corporate building lobby drop.",
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
                "• Slashes raw ingredient food waste from 28% to <3%.",
                "• Enables partner kitchens to offer 25% wholesale pricing discounts passed to users."
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
    pb11.text = "💡 Economics Proof: Batched delivery creates +₹205 weekly logistics surplus per subscriber, self-funding Friday treats and loyalty rewards with zero breakage dependency."
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
                "• Density Target: 12 Corporate towers + 8 residential pods within 7 km.",
                "• Kitchen Supply: 15 Cloud kitchens with diversified cuisines.",
                "• User Base: 2,500 Active recurring subscribers.",
                "• Features Unlocked: Tower Tribe milestone rewards & automated WFH calendar sync.",
                "• Logistics: Dedicated 2-wheeler EV batch pods."
            ],
            COLOR_INDIGO
        ),
        (
            "PHASE 3: METRO SCALE (M4+)",
            "Bengaluru & Mumbai Hubs",
            [
                "• Expansion: ORR Whitefield (Bengaluru) and BKC (Mumbai).",
                "• Volume Target: 10,000+ daily scheduled lunches.",
                "• Corporate B2B: Direct HR wellness & tax-free Pluxee/Zaggle corporate pass rollouts.",
                "• Infrastructure: Micro-fulfillment warm pods in corporate park lobbies."
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
    pb12.text = "🚀 Pilot Success Gates: Meal Adherence ≥ 80% • 30-Min On-Time SLA ≥ 97% • Fleet CAC ≤ ₹26/drop • Net Margin Positive by W4"
    pb12.font.size = Pt(10)
    pb12.font.bold = True
    pb12.font.color.rgb = RGBColor(0x06, 0x5F, 0x46)
    
    # Save back
    prs.save('public/presentation/MealsOn_Executive_Presentation.pptx')
    prs.save('dist/presentation/MealsOn_Executive_Presentation.pptx')
    print("Successfully built and saved 12-slide presentation in public/ and dist/!")

if __name__ == '__main__':
    build_presentation()
