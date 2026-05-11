# Final Reflection — SpendLens

## 1. Hardest Bug & Debugging
The hardest bug I hit was a **hydration mismatch error** combined with a `PGRST205` error from Supabase during the final production push.
- **Hypothesis:** I thought the `localStorage` rehydration was interfering with the Supabase `fetch` on the dynamic route `/audit/[id]`.
- **Debugging:** I first isolated the client-side state by disabling the persistence hook—the error persisted. Then I realized the Supabase URL in `.env.local` had an accidental `/rest/v1/` suffix appended by the dashboard copy-paste, which caused the client to double-prefix the API calls.
- **Resolution:** I cleaned the env variables and moved the rehydration logic into a `useEffect` that triggers only *after* the initial mount, ensuring the server-rendered HTML matches the initial client state exactly.

## 2. Decision Reversed Mid-Week
Originally, I was going to build a **Multi-Step Form** (one tool per page) to maximize data quality. Mid-week, I reversed this and went with a **Single-Page "Power Form"**.
- **Reasoning:** User testing (simulated) showed that CTOs are impatient. Seeing "Page 1 of 8" felt like a chore. By putting everything on one sleek, dark-mode page with auto-saving `localStorage`, the perceived effort dropped significantly. It felt like an "expert tool" rather than a survey.

## 3. What I'd Build in Week 2
In Week 2, I would implement **Browser Extension Integration**.
- **The Vision:** A Chrome extension that detects when a user is on a pricing page (e.g., `openai.com/pricing`) and overlays a "SpendLens Alert" showing how that tool fits into their existing stack. This would move SpendLens from a "pull" tool (where users must come to us) to a "push" tool that lives where the purchasing decisions happen.

## 4. AI Tool Usage
I used **Claude 3.5 Sonnet** (via Antigravity) for the heavy lifting of the logic engine and UI components.
- **Trusted for:** Boilerplate, Tailwind styling, and complex TypeScript interfaces.
- **Not trusted for:** Exact pricing math. I manually verified every tool's pricing tier in `lib/auditEngine.ts` because the AI often hallucinated "Legacy" pricing or mixed up "Business" vs "Enterprise" seat minimums.
- **The Fail:** One time, the AI suggested using `navigator.share()` which works on mobile but has poor support on some desktop browsers, causing a silent crash. I had to manually implement a robust `clipboard.writeText` fallback.

## 5. Self-Rating (1-10)
- **Discipline: 9/10** — Maintained a clean commit history and stuck to the 7-day log even when the bugs got frustrating.
- **Code Quality: 8/10** — Solid TypeScript coverage and a decoupled audit engine, though the `LeadCaptureForm` could be further componentized.
- **Design Sense: 9/10** — The "Zinc/Emerald" editorial aesthetic feels premium and fits the "Fintech/Audit" brand perfectly.
- **Problem-Solving: 8/10** — Quickly pivoted from Gemini to Anthropic when I realized the summary quality needed to be higher for founders.
- **Entrepreneurial Thinking: 10/10** — Deeply integrated the Credex value proposition into the product flow rather than just treating it as a footer link.
