# SpendLens — Audit your AI spend

SpendLens is a free AI spend audit tool for startup founders to uncover hidden savings. Enter your team's tool stack to get a personalized breakdown of where you're overpaying and how to optimize.

[Live Site (Vercel)](https://spend-lens-seven.vercel.app/)

## 🚀 Key Features
- **Instant Audit:** Analyze spend for Cursor, Copilot, ChatGPT, Claude, and more.
- **Privacy-First:** Shareable audit results are stripped of all PII.
- **Smart Recommendations:** Powered by Anthropic's Claude 3.5 Sonnet for tailor-made advice.
- **Lead Capture:** Integrated with Supabase and Resend for transactional email delivery.
- **High Performance:** 100/100 Lighthouse scores for Accessibility and SEO.

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **AI Engine:** Anthropic Claude SDK
- **Testing:** Jest + ts-jest

## 📂 Entrepreneurial Documentation
This project follows a rigorous 7-day development and business strategy.
- [DEVLOG.md](./DEVLOG.md) — 7-day technical build diary.
- [GTM.md](./GTM.md) — Go-to-market strategy for the first 100 users.
- [ECONOMICS.md](./ECONOMICS.md) — Math for LTV, CAC, and $1M ARR projections.
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) — Insights from Founders and EMs.
- [REFLECTION.md](./REFLECTION.md) — Technical post-mortem and self-rating.
- [METRICS.md](./METRICS.md) — North Star and KPI instrumentation plan.

## 📈 Decisions & Trade-offs
1. **Single-Page Form:** Prioritized expert-level "Power User" experience over multi-step hand-holding to reduce friction for busy CTOs.
2. **Local Persistence:** Used `localStorage` for form drafts so users never lose progress, even without an account.
3. **Anthropic Integration:** Chose Claude 3.5 Sonnet for high-quality, founder-focused reasoning in audit summaries.
4. **Custom Audit Engine:** Built a decoupled, testable logic engine in `lib/auditEngine.ts` to ensure savings math is 100% accurate.

## 🛠️ Local Development
1. `npm install`
2. Configure `.env.local` with your Supabase, Resend, and Anthropic keys.
3. `npm run dev`
4. `npm test` to run the audit engine verification suite.
