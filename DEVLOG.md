# Development Log — SpendLens

## Day 1 — 2026-05-05
**Hours worked:** 3
**What I did:** Researched the "AI Spend Audit" niche. Looked at pricing pages for Cursor, GitHub Copilot, OpenAI, and Anthropic to find common patterns. Identified that most startups overpay by about 30% due to overlapping seat subscriptions.
**What I learned:** AI tool pricing is intentionally confusing. Business plans usually have minimum seat counts that startups don't always need.
**Blockers / what I'm stuck on:** Trying to decide if I should use a database early or stay local-only. Decided to start local to move faster.
**Plan for tomorrow:** Collect all pricing data into a structured format for the engine.

## Day 2 — 2026-05-06
**Hours worked:** 4
**What I did:** Created `PRICING_DATA.md` with rules for downgrading, tool alternatives, and redundancy checks. Sketched the landing page UI and audit flow on paper.
**What I learned:** The real value isn't just counting tools, but suggesting specific "swaps" (e.g., using OpenAI API for bulk tasks instead of ChatGPT Plus seats).
**Blockers / what I'm stuck on:** How to handle the "Use Case" input—it needs to be flexible but specific enough for the AI to give a good summary.
**Plan for tomorrow:** Initialize the Next.js project and build the core form.

## Day 3 — 2026-05-07
**Hours worked:** 8
**What I did:** Initialized Next.js with TypeScript and Tailwind. Set up shadcn/ui. Built the hero section and the massive 8-tool spend form. Implemented `localStorage` persistence so users don't lose their data on refresh.
**What I learned:** `react-hook-form` is essential for forms this large. Manual state management would have been a nightmare.
**Blockers / what I'm stuck on:** Hydration errors with `localStorage`. Fixed it by creating a custom `useFormPersist` hook that waits for mount.
**Plan for tomorrow:** Build the logic engine and the results page.

## Day 4 — 2026-05-08
**Hours worked:** 10
**What I did:** Wrote the core `auditEngine.ts` logic. Added 5 Jest tests to ensure savings math is accurate. Built the Results page with hero stats and tool breakdown cards. Integrated a basic AI summary endpoint using Gemini (later swapped).
**What I learned:** Testing the engine was a lifesaver. Found three edge cases where savings were being double-counted.
**Blockers / what I'm stuck on:** CSS grid layout on mobile for the tool cards. Took a few iterations to make it look premium on 375px.
**Plan for tomorrow:** Take a break to clear my head before production push.

## Day 5 — 2026-05-09
**Hours worked:** 0
**What I did:** Day off. Mentally planned the Supabase schema and lead capture flow.
**What I learned:** Resting helps spot architectural flaws. Realized I need to PII-strip the public shareable pages for privacy.
**Blockers / what I'm stuck on:** N/A.
**Plan for tomorrow:** Final prep for backend integration.

## Day 6 — 2026-05-10
**Hours worked:** 2
**What I did:** Planning day. Refined the GTM strategy and worked on the `ARCHITECTURE.md` documentation. Did some light research on Resend's API limits.
**What I learned:** GTM is just as hard as coding. "Post on Twitter" isn't a strategy; need specific niche targeting.
**Blockers / what I'm stuck on:** N/A.
**Plan for tomorrow:** Final production sprint—Supabase, Resend, and Meta tags.

## Day 7 — 2026-05-11
**Hours worked:** 12
**What I did:** Massive sprint. Integrated Supabase for real persistence. Swapped Gemini for Anthropic (Claude 3.5 Sonnet) for better summary quality. Added lead capture with Resend transactional emails. Implemented dynamic OG tags for social sharing. Fixed 10+ linting and build errors for Vercel deployment. Hit 100/100 Lighthouse scores for Accessibility and SEO.
**What I learned:** Deployment is where the "real" bugs hide (TypeScript type mismatches, missing env vars, build timeouts).
**Blockers / what I'm stuck on:** TypeScript type mismatch with Radix UI's `onValueChange`. Fixed by wrapping the handler with a null-check.
**Plan for tomorrow:** Launch on Product Hunt and start the GTM execution.
