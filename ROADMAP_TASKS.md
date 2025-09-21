# Roadmap: FinancePal (Hackathon Build)

This doc breaks the work into crisp, incremental tasks so we can ship confidently and fix bugs early. Each task is scoped to ~15–90 minutes and includes acceptance criteria, UX notes, and test steps.

## 0) Stabilization (pre-flight)
- Goal: Ensure current build is stable.
- Tasks:
  - [ ] Verify WebSocket reconnects silently; no console noise (VERBOSE=false)
  - [ ] Confirm notifications: bell bump + inline preview; no auto-open unless toggled
  - [ ] Confirm Dev Panel (left) small and not obstructing main UI
- Acceptance: Notifications work end-to-end; no white screen; no unnecessary console logs
- Test: Trigger each scenario from Dev Panel; verify drawer stays closed unless clicked; preview shows for 8s

---

## 1) “Ask FinancePal” (Ask All) – Curated Answer
- Goal: Replace “Ask Any Agent” with “Ask FinancePal” that fans out to all agents and returns a curated top-line plan + 3 collapsible replies.
- Tasks:
  - [ ] Add a modal/section for Ask FinancePal result
  - [ ] On submit, call chat API for Sofia, Marcus, and Luna in parallel with the same question
  - [ ] Curate: either
    - [ ] Option A: Simple heuristic (choose most actionable reply), or
    - [ ] Option B: One extra LLM call to summarize and produce a single plan + attributions
  - [ ] UI: Top-line plan first, then expandable “Sofia said…”, “Marcus said…”, “Luna said…”
  - [ ] Button CTAs: “Start with this plan” → opens steps list or seeds chat with that plan
- Acceptance: One click, one unified plan with three expert perspectives
- Test:
  - [ ] Type: “How do I build credit with limited income?”
  - [ ] Expect: curated plan + 3 collapsible sub-answers

UX Notes:
- Keep it minimal: single column content, Stripe-esque typography; bolder title; subtle subhead
- Show a tiny “I asked your team” badge for delight

---

## 2) Scoping Quiz (Persona Starter)
- Goal: Ask 6 quick questions to tailor experience (student/newcomer/gig, credit card, income pattern, goal, remittance, language)
- Tasks:
  - [ ] Modal with 6 steps (progress indicator)
  - [ ] Store persona in localStorage and a small context
  - [ ] Show a badge near greeting, e.g., “Newcomer” or “Student” (click to retake)
- Acceptance: Persona state persists across refresh; UI badge present
- Test:
  - [ ] Complete quiz as “Newcomer” and “Student”; badge updates accordingly

UX Notes:
- Keep copy empathetic and short; no walls of text
- Provide “Skip for now” link

---

## 3) Persona Playbooks Row
- Goal: Show 2–3 bold, tailored cards (Student Starter, Newcomer Saver, Gig Cushion)
- Tasks:
  - [ ] Render cards based on persona
  - [ ] Each card: title, subhead, primary CTA (Get steps), secondary (Talk to [Agent])
  - [ ] “Get steps” opens a minimal steps list (Dialog) now; can wire to real backend later
  - [ ] “Talk to [Agent]” seeds chat with a prebuilt prompt
- Acceptance: Cards change immediately when persona changes; CTAs work
- Test:
  - [ ] Switch persona → cards swap
  - [ ] Click “Get steps” → dialog shows checkable steps; Close works

UX Notes:
- Visual weight similar to Stripe’s product cards; no busy gradients
- Keep icons minimalist; room to breathe

---

## 4) Resource Hub (For Underserved Users)
- Goal: One page with curated links and quick guides for newcomers/students
- Tasks:
  - [ ] Static page with sections: Open an account without SSN (ITIN), Avoiding fees, Remittance tips, Trusted resources (CFPB/FDIC), Language help
  - [ ] Link to this from header or a small “Resources” chip in greeting area
- Acceptance: Page loads fast; content scannable
- Test:
  - [ ] Navigate to /resources → see sections & links; back works

UX Notes:
- Keep copy short, scannable with bullets
- Demonstrate empathy and trust with credible links

---

## 5) Inline Preview Polish & Limits
- Goal: Refine inline ‘New insight’ preview so it’s elegant and never noisy
- Tasks:
  - [ ] Cap to max 2 previews visible at once; queue or replace older ones
  - [ ] Add a tiny pulsing dot near agent icon while preview is active (optional)
  - [ ] Add an A11y-friendly aria-live region for new previews
- Acceptance: Even under multiple notifications, UI feels calm
- Test:
  - [ ] Fire multiple scenarios quickly; ensure only two previews show simultaneously

---

## 6) Micro-interactions & Styling Cleanup
- Goal: Stripe-esque calm visual language
- Tasks:
  - [ ] Reduce shadow intensity slightly on cards
  - [ ] Standardize border radii
  - [ ] Increase whitespace in Playbooks and Ask FinancePal outputs
  - [ ] Subtle bell bump only once per new notification; not on every render
- Acceptance: Visual consistency across sections
- Test:
  - [ ] Regenerate pages; compare against before screenshots

---

## 7) Internationalization Toggle (EN/ES)
- Goal: Basic EN/ES toggle for UI strings (no deep i18n infra yet)
- Tasks:
  - [ ] Language toggle in header (dropdown or chip)
  - [ ] Provide EN/ES strings for key UI labels (greeting, buttons, card titles)
  - [ ] Persist choice in localStorage
- Acceptance: Toggle flips key UI strings; persists
- Test:
  - [ ] Switch to Español; refresh; stays in Español

---

## 8) Demo Mode Enhancements (Optional)
- Goal: Make the demo smooth and repeatable
- Tasks:
  - [ ] Add reset state button in Dev Panel (clear notifications, reset persona)
  - [ ] Add “Periodic demo” toggle that fires a scenario every 30–45s
  - [ ] Add emoji confetti on goal-complete scenarios
- Acceptance: Judge sees constant, smooth motion without manual effort
- Test:
  - [ ] Enable periodic demo; watch previews and bell count steadily update

---

## 9) Stretch: Remittance Corridor Intelligence (Concept)
- Goal: For Newcomers sending money back home, surface tips
- Tasks:
  - [ ] Add a static remittance card with 3 tips (fees, FX spread, timing)
  - [ ] Chat prompt seeds: “Help me lower remittance costs to {Country}”
- Acceptance: Demonstrates relevance to underserved audience
- Test:
  - [ ] Click card → opens seeded chat with Marcus

---

# Implementation Order Recommendation
1) Stabilization
2) Ask FinancePal (curated)
3) Scoping Quiz
4) Playbooks row
5) Inline preview polish & limits
6) Resource Hub
7) Micro-interactions cleanup
8) i18n toggle (EN/ES)
9) Demo mode enhancements (optional)

# Definition of Done (per task)
- No console errors or white screens
- Desktop + mobile responsive checks for new components
- Minimal but real test (manual OK for hackathon)
- All new strings centralized for easy future i18n

# Notes
- Keep surfaces minimal: Bell + Drawer (system), Inline preview (personal), Chat
- Avoid adding banners or third notification surfaces
- Preserve the Stripe-esque calm while highlighting the “team of agents” personality
