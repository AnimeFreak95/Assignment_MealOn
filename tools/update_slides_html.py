import re

def update_slides():
    with open('public/slides.html', 'r', encoding='utf-8') as f:
        text = f.read()

    # Replace header counter
    text = text.replace('9 High-Impact Strategy Slides', '12 High-Impact Strategy Slides')
    text = text.replace('Slide 01 / 09', 'Slide 01 / 12')
    text = text.replace('Slide 02 / 09', 'Slide 02 / 12')
    text = text.replace('Slide 03 / 09', 'Slide 03 / 12')
    text = text.replace('Slide 04 / 09', 'Slide 04 / 12')
    text = text.replace('Slide 05 / 09', 'Slide 05 / 12')
    text = text.replace('Slide 06 / 09', 'Slide 06 / 12')
    text = text.replace('Slide 07 / 09', 'Slide 07 / 12')
    text = text.replace('Slide 08 / 09', 'Slide 08 / 12')
    text = text.replace('Slide 09 / 09', 'Slide 09 / 12')

    # Update Slide 3 title
    text = text.replace('The 6 Connected Pillars of MealsOn Scheduled Meals', 'The 8 Strategic Pillars of MealsOn Scheduled Meals')

    slide_10 = '''
    <!-- Slide 10 -->
    <section class="slide-card bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden">
      <div class="flex justify-between items-center text-xs font-extrabold text-orange-600 tracking-wider uppercase">
        <span>Slide 10 / 12</span>
        <span>Habit Engine & Community Co-Op</span>
      </div>
      <div class="my-auto space-y-4">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest block">Retention & Network Effects</span>
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Healthy Week Habit Tree & Tower Tribe Pod Co-Op</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Habit Tree -->
          <div class="bg-white border border-emerald-200 p-5 rounded-2xl shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-emerald-600 uppercase flex items-center gap-1.5">🌱 Healthy Week Habit Tree</span>
              <span class="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">5-Stage Bonsai</span>
            </div>
            <p class="text-xs text-slate-600 leading-snug">Visual bonsai grows Mon–Fri with each healthy lunch logged. <strong>4/5 Flexible Grace Rule</strong> forgives 1 cheat day or travel skip without resetting progress.</p>
            <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-[11px] text-slate-700 space-y-1">
              <div class="font-bold text-emerald-900">🎁 Friday Duality Payoff:</div>
              <div>• <strong>Clean Fuel (Default):</strong> High-protein Greek Yogurt / Cold-Pressed Juice (₹0 sponsor co-pay)</div>
              <div>• <strong>Cheat Treat:</strong> Artisanal brownie / Gelato (+₹45 from weekly logistics savings)</div>
            </div>
          </div>
          <!-- Tower Tribe -->
          <div class="bg-white border border-indigo-200 p-5 rounded-2xl shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-indigo-600 uppercase flex items-center gap-1.5">🏢 Tower Tribe Pod Co-Op</span>
              <span class="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">Building-Level Pooling</span>
            </div>
            <p class="text-xs text-slate-600 leading-snug">Gamifies building delivery density. Co-workers pool orders to unlock collective Friday fuel credits while routing to 1 central tower desk.</p>
            <div class="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div class="bg-amber-50 p-2 rounded-lg border border-amber-200">
                <div class="font-bold text-amber-800">🥉 Bronze (25)</div>
                <div class="text-slate-600 mt-0.5">₹25 Fuel Credit</div>
              </div>
              <div class="bg-slate-100 p-2 rounded-lg border border-slate-300">
                <div class="font-bold text-slate-800">🥈 Silver (50)</div>
                <div class="text-slate-600 mt-0.5">₹50 Fuel Credit</div>
              </div>
              <div class="bg-yellow-50 p-2 rounded-lg border border-yellow-300">
                <div class="font-bold text-yellow-800">🥇 Gold (75+)</div>
                <div class="text-slate-600 mt-0.5">₹75 Fuel Credit</div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-slate-900 text-white p-3 rounded-xl text-xs flex items-center justify-between">
          <span>📊 <strong>Impact Ledger:</strong> ₹2,840 Saved / Mo • 4.8 kg CO2 Avoided (Batch EVs) • 14.2 hrs Decision Time Saved</span>
          <span class="text-emerald-400 font-bold">W4 Retention: 84% (vs 35% Ind.)</span>
        </div>
      </div>
      <div class="text-[11px] text-slate-400 font-medium">MealsOn Scheduled Meals • Executive Product Strategy</div>
    </section>'''

    slide_11 = '''
    <!-- Slide 11 -->
    <section class="slide-card bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden">
      <div class="flex justify-between items-center text-xs font-extrabold text-orange-600 tracking-wider uppercase">
        <span>Slide 11 / 12</span>
        <span>Strategic Trade-Offs & Unit Economics</span>
      </div>
      <div class="my-auto space-y-4">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest block">Executive Decision Framework</span>
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Trading Micro-Spontaneity for Macro-Predictability & 63% Margin Edge</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
            <div class="text-xs font-extrabold text-orange-600 uppercase">📦 3 Fixed 30-Min Windows</div>
            <p class="text-xs text-slate-700 font-semibold">Rejected open 15-min on-demand slots.</p>
            <p class="text-[11px] text-slate-600 leading-snug">Riders batch 10–14 lunches into a single corporate building run. Slashes drop cost from ₹65 to ₹24 (63% cost collapse).</p>
          </div>
          <div class="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
            <div class="text-xs font-extrabold text-emerald-600 uppercase">⏰ 10 PM Night-Before Lock</div>
            <p class="text-xs text-slate-700 font-semibold">Rejected same-day morning cancellations.</p>
            <p class="text-[11px] text-slate-600 leading-snug">Gives cloud kitchens exact morning prep manifests. Eliminates 28% food waste (&lt;3% total) and unlocks 25% wholesale ingredient savings.</p>
          </div>
          <div class="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
            <div class="text-xs font-extrabold text-indigo-600 uppercase">📍 7 km Cluster Geofence</div>
            <p class="text-xs text-slate-700 font-semibold">Rejected cross-city WFH address swaps.</p>
            <p class="text-[11px] text-slate-600 leading-snug">Hybrid office-to-home flips must remain within 7 km hub radius. Prevents split-fleet deadheading while preserving hybrid convenience.</p>
          </div>
        </div>
        <div class="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <span>💡 <strong>Economics Proof:</strong> Logistics batching generates <strong>+₹205 weekly surplus</strong> per subscriber, effortlessly self-funding Friday treats and loyalty perks.</span>
          <span class="font-bold text-slate-900">Zero-Breakage Trust Model</span>
        </div>
      </div>
      <div class="text-[11px] text-slate-400 font-medium">MealsOn Scheduled Meals • Executive Product Strategy</div>
    </section>'''

    slide_12 = '''
    <!-- Slide 12 -->
    <section class="slide-card bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden">
      <div class="flex justify-between items-center text-xs font-extrabold text-orange-600 tracking-wider uppercase">
        <span>Slide 12 / 12</span>
        <span>Go-To-Market Execution & Pilot Plan</span>
      </div>
      <div class="my-auto space-y-4">
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest block">Phase 1 Pilot Rollout</span>
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Cyber Park Gurgaon Beachhead: 3 Towers, 5 Kitchens, 500 Beta Users</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
            <div class="text-xs font-extrabold text-orange-600 uppercase">Phase 1: Beachhead (W1–W6)</div>
            <div class="text-xs font-bold text-slate-900">DLF Cyber Park, Gurgaon</div>
            <p class="text-[11px] text-slate-600 leading-snug">3 Anchor corporate towers (18k tech employees), 5 partner cloud kitchens, 500 capped beta passes. Focus on 97.5% delivery SLA and batch routing.</p>
          </div>
          <div class="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
            <div class="text-xs font-extrabold text-indigo-600 uppercase">Phase 2: Cluster Scale (W7–W14)</div>
            <div class="text-xs font-bold text-slate-900">Cyber City & DLF Phase 5</div>
            <p class="text-[11px] text-slate-600 leading-snug">Expand to 12 tech parks and 8 residential societies within 7 km geofence. 15 cloud kitchens, 2,500 active subscribers, Tower Tribe launch.</p>
          </div>
          <div class="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
            <div class="text-xs font-extrabold text-emerald-600 uppercase">Phase 3: Metro Scale (M4+)</div>
            <div class="text-xs font-bold text-slate-900">Bengaluru & Mumbai Hubs</div>
            <p class="text-[11px] text-slate-600 leading-snug">ORR Bengaluru and BKC Mumbai. 10,000+ daily deliveries, corporate HR wellness tie-ups, full EV fleet deployment.</p>
          </div>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <span>🚀 <strong>Pilot Gate Criteria:</strong> Meal Adherence &ge; 80% • Delivery Drop SLA &ge; 97% • Fleet CAC &le; ₹26/drop • Net Positive Unit Margin</span>
          <span class="font-bold text-emerald-800">Launch Readiness: Q1 2027</span>
        </div>
      </div>
      <div class="text-[11px] text-slate-400 font-medium">MealsOn Scheduled Meals • Executive Product Strategy</div>
    </section>'''

    # Find the end of Slide 9
    s9_pattern = r'(<!-- Slide 9 -->.*?</section>)'
    match = re.search(s9_pattern, text, re.DOTALL)
    if match:
        end_pos = match.end()
        new_text = text[:end_pos] + '\n\n' + slide_10 + '\n' + slide_11 + '\n' + slide_12 + text[end_pos:]
        with open('public/slides.html', 'w', encoding='utf-8') as f:
            f.write(new_text)
        print("Updated public/slides.html successfully!")
    else:
        print("Could not find Slide 9 in public/slides.html")

if __name__ == '__main__':
    update_slides()
