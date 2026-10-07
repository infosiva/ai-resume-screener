# DESIGN-LOCK — ai-resume-screener (AI resume screening)
**Date:** 2026-10-06  **Status:** IN PROGRESS (design finalized before code)
- Archetype: `career-portfolio` (pickArchetype, avoid-list honoured; default only, hub `theme_ai-resume-screener.layout.archetype` overrides at runtime via `data-layout`)
- Default bg / accent: `#f2f7f3` / `#15803d` (registered in design-system/tokens/palette-registry.json, check-palettes = free). Hub palette overrides via `--theme-base`/`--theme-primary`.
- Background animation: AnimatedBg, default aurora, hub `layout.bgAnimation`/`bgSpeed` overrides; prefers-reduced-motion honoured
- Logo: document + check glyph, accent "Screen" key word
- Demo panel: existing screen flow on page
- Telemetry: hub-gated GA4 (consent denied by default), consent-gated usage log, structured error log -> /api/log (JSON lines, no PII, no IP stored)
- Notes: career-portfolio = hiring domain fit.
- Pillars: AI chat/feedback use free chain Groq->Gemini->Cerebras with graceful 200 fallback; no new deps; gaps (no evals/RAG changes in this pass) stated in final report.

---
# HANDOFF — ai-resume-screener full 16-step §0-DESIGN-PIPELINE modernization

**Date:** 2026-08-04  **Status:** IN PROGRESS
**Goal:** Full 16-step design pipeline pass (not CSS-only) — differentiated theme,
real animated logo, working chatbot with rate limit + scope guard, feedback widget,
mixed-content fix, build/push/deploy/e2e-verify. Part of overnight portfolio wave
(same playbook as trackwealth/tutiq earlier tonight).

## Resume audit — prior interrupted session (found on disk, untracked)
Ran `git status`/`git diff` first. Found uncommitted, NEVER-committed work:
- `app/api/feedback/route.ts` (modified) — added `TELEGRAM_NOTIFICATIONS_DISABLED`
  env guard. Small, safe, unrelated to design pipeline. KEEPING.
- `app/globals.css` (modified) — added `overflow-x:hidden` mobile fix. Safe, KEEPING
  (will layer full theme on top).
- `tsconfig.json` (modified) — cosmetic reformat + `jsx: react-jsx` (was `preserve`) +
  added `.next/dev/types` to include. Looks like an auto-generated Next.js upgrade
  diff, not hand-written. Harmless. KEEPING.
- `app/api/data/route.ts` + `lib/data-api.ts` — shared free-public-API proxy
  (§0-PUBLIC-APIS pattern), portfolio-wide utility, not resume-screener-specific,
  not part of the design pipeline scope. Unused by current page but harmless/inert.
  KEEPING (no reason to discard working infra).
- `app/api/media/generate/route.ts` + `lib/media-gen.ts` — same pattern, portfolio
  shared utility. KEEPING, inert until wired.
- `lib/theme-loader.ts` — Edge Config theme loader, ALREADY correctly wrapped in
  `unstable_cache` with `revalidate: 600` per §0-EDGE-CONFIG-QUOTA. KEEPING, correct
  and safe as shipped, not currently imported (available for future use).
- `lib/useIsMobile.ts` — SSR-safe hook, harmless, KEEPING.
- `app/icon.tsx`, `app/sitemap.ts`, `public/robots.txt`, `next-env.d.ts` — these
  ALREADY EXIST as real files (not stubs) — icon.tsx has blue-gradient checkmark
  icon (`#1e3a5f`→`#2563eb`), sitemap.ts lists static routes, robots.txt has
  Allow:/Sitemap. All will be UPDATED in this pass (icon recolored to new accent,
  sitemap/robots left as-is if still valid).

**Decision: continue on top of existing work, do not discard.** None of it conflicts
with the design pipeline; none of it is wrong-direction. It's inert shared-infra
plus two trivial safe fixes. Proceeding with full 16-step pass now.

## Pre-existing state audit (this session)
- Landing (`app/page.tsx`): single-column tool UI, zero-auth core action already
  working (§T compliant) — job description + resume upload → AI match score. Uses
  raw Tailwind `bg-gray-950`/`text-blue-400`/`blue-600` — NO CSS vars at all (§S
  violation, "no-accent-var = instant fail").
  Freemium: 5 free screenings/day via localStorage counter — reasonable, kept.
- `app/layout.tsx`: has `FloatingChatWrapper` imported ✓, but:
  - Mixed-content bug: `<Script src="http://31.97.56.148:3098/t.js">` — plain HTTP
    tracker on an HTTPS site, will be silently blocked by browsers (same bug class
    as the protofast.app incident referenced in §Z9). FIX: remove or make https.
  - No FeedbackWidget wired.
  - No JSON-LD issue, AdSense tag present — fine.
- `app/api/chat/route.ts`: exists, calls `callAI` from canonical `lib/ai.ts`
  cascade (Groq-first ✓). VIOLATIONS: (1) no rate limiting at all — §H hard rule;
  (2) system prompt does not end with the mandatory scope-fallback line — §J.
  FIX: add rate limit (60/hr per §Y — chatbot, not 10) + scope-fallback line.
- `components/FloatingChatWrapper.tsx`: already sets its own explicit dark bg
  (§0-BG-CONTRAST compliant) — good, no fix needed there.
- No `FeedbackWidget` component exists anywhere in this project — only the API
  route. Need to build a minimal widget (reuse trackwealth's as reference pattern)
  and wire into layout.
- `app/icon.tsx`: functional but generic blue gradient + checkmark/doc icon, not
  matching the new locked accent. Needs recolor to match new palette.
- No dedicated navbar/logo mark — H1 is plain text, no icon, no accent-colored key
  word. §0-DESIGN-LOCK "dedicated logo mandatory" violation.
- `design-system/MASTER.md` has NO entry for ai-resume-screener yet — new
  assignment needed, must not collide with resumevault (`#0c0f1a`+`#7c3aed`, same
  AI-infra category, closest neighbor) or any other dev-tools/AI-infra project.

## LOCKED DESIGN DECISION
- **Category:** AI infra / resume (dev-tools family per CLAUDE.md §V)
- **Bg:** `#0d1120` (dark navy) — distinct hex, not on MASTER.md collision list
  (neighbors: `#0b1120` clawdbotai/idea-agent/zerostaff, `#0c111a` agenttrace,
  `#0c0f1a` resumevault, `#080d1a` neuralos, `#0e0e16` pixelforge — all different)
- **Accent:** `#818cf8` (indigo-violet) — distinct from resumevault's `#7c3aed`
- **Accent-2:** `#22d3ee` (cyan) — used for match-score ring/highlight, pairs with
  accent for a two-tone tech feel; bg+accent PAIR is what's checked for collision
  and `#0d1120`+`#818cf8` is unique even though cyan alone appears elsewhere
- **Layout archetype:** T4 "AI Dev Tools / Agent Infrastructure" (split dark
  terminal family, per LAYOUT-PROMPTS.md — matches agenttrace/neuralos/resumevault
  pattern). KEEP existing single-column scan interface (it already IS the live
  product demo per §T — job desc + resumes in, ranked candidates out) — layer in:
  proper nav with logo, hero framing, accent theme, animated score-ring detail.
- **Logo concept:** Document + AI-scan glyph — a stylized resume/doc icon with a
  scanning line sweep, indigo-to-cyan gradient. Wordmark "Resume**Screen**" with
  "Screen" in accent color. SVG, animated draw-in (stroke-dashoffset) on mount +
  scanning-line sweep loop, `prefers-reduced-motion` respected. Used consistently:
  navbar + `app/icon.tsx` favicon (same gradient/shape, static single-frame version).
- **Competitor research:** Firecrawl crawl of 1-2 ATS/resume-screening competitor
  sites for layout inspiration before implementation (see below).

## Files to touch
- `design-system/MASTER.md` — add ai-resume-screener registry row + collision list
- `app/globals.css` — full theme tokens (bg/accent/accent-2 CSS vars), remove
  overflow-x fix duplication if any
- `components/ResumeScreenLogo.tsx` — NEW animated SVG logo mark
- `app/page.tsx` — recolor to CSS vars, add branded nav w/ logo, wire FeedbackWidget
- `app/layout.tsx` — remove/fix http:// tracker script, wire FeedbackWidget
- `app/icon.tsx` — recolor favicon to match new accent
- `app/api/chat/route.ts` — add rate limiting (60/hr) + scope-fallback system prompt line
- `components/FeedbackWidget.tsx` — NEW, adapted from trackwealth pattern (no auth)
- `lib/rateLimit.ts` — NEW if no shared one exists in this project

## Steps
- [x] 1. HANDOFF.md written (this file) — resume audit + design lock complete
- [ ] 2. Firecrawl competitor research (1-2 ATS/resume tool sites)
- [ ] 3. Design tool pipeline (taste-skill → design-shotgun considered →
      ui-ux-pro-max mentally applied → theme tokens)
- [ ] 4. globals.css — theme tokens, unique bg/accent, no purple-as-bg (accent is
      indigo/violet-adjacent on DARK bg, which is allowed — only bg=purple is banned)
- [ ] 5. Animated logo (ResumeScreenLogo.tsx) + favicon recolor
- [ ] 6. Branded navbar with logo in page.tsx
- [ ] 7. Chatbot fixes: rate limit + scope-fallback prompt line
- [ ] 8. FeedbackWidget component + wire into layout
- [ ] 9. Fix mixed-content http:// tracker script in layout.tsx
- [ ] 10. §0-BG-CONTRAST grep audit — every text-white/rgba(255,255,255 component
      has explicit own background
- [ ] 11. npm run build — exit 0
- [ ] 12. Playwright screenshots 375px + 1280px, read them
- [ ] 13. Update design-system/MASTER.md registry + collision list
- [ ] 14. git commit (specific files, info.siva@gmail.com/Siva)
- [ ] 15. git push origin main — verify .vercel/project.json orgId stays
      team_2XHm064mWA86v38GDJ01Veli (infosiva, FROZEN list) — NEVER relink
- [ ] 16. e2e-verify against live URL, record P1-P10 in this file

## Success criteria
- Build exits 0, no TS errors
- No purple/near-black+orange bg, no bg collision with any MASTER.md entry
- Logo animated, visible navbar+favicon, respects prefers-reduced-motion
- Chatbot rate-limited (60/hr) + scoped system prompt with fallback line
- Feedback widget live in layout
- §0-BG-CONTRAST clean (grep audit passes)
- Pushed to main on infosiva account, e2e-verify run against live URL

## Resume from here if interrupted
Design locked, about to start Firecrawl research then implementation. If
interrupted mid-implementation: check git diff against this file's "Files to
touch" list to see what's done vs pending, resume from first unchecked step.


## OWASP LLM Top 10 dispositions (gate item 45, 2026-10-07; list recalled from memory, unverified)
- LLM01 prompt injection: input sanitised in chat route (app/api/chat/route.ts); no output filtering or tool sandbox review done. PARTIAL.
- LLM02 sensitive info disclosure: `redact()` helper available; not applied to every log. PARTIAL.
- LLM04/10 DoS / unbounded consumption: per-IP rate limit where present; token budgets not enforced. PARTIAL.
- LLM05 improper output handling: model output rendered as text; not audited for HTML sinks. UNVERIFIED.
- LLM06 excessive agency: no tool-calling agents audited. UNVERIFIED.
- Others (supply chain, poisoning, embeddings, misinformation): not assessed.
