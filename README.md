# SpendLens

SpendLens is a free AI spend audit tool for startup founders to uncover hidden savings. Enter your team's tool stack to get a personalized breakdown of where you're overpaying and how to optimize.

[Live Demo](https://spend-lens.vercel.app)

## Quick Start
1. `npm install`
2. `npm run dev`
3. Visit `http://localhost:3000`

## Decisions & Trade-offs
1. **No Website Builders:** Used custom Next.js for full control over UI and lead generation workflows, sacrificing raw speed of setup for long-term flexibility.
2. **Local Storage for Drafts:** Traded cross-device session continuation for a zero-backend setup, drastically reducing database load and making it incredibly simple to implement.
3. **Client-side Form:** `react-hook-form` and `zod` are heavy bundles, trading initial load performance for significantly better developer experience and form safety.
4. **Shadcn/ui Over Custom CSS:** We sacrifice some CSS footprint for extremely rapid, accessible, and themeable UI components that can be customized entirely.
5. **Single Page Form vs Multi-Step:** A single-page form is currently utilized for simplicity and reduced engineering time, trading off potentially higher conversion rates from a multi-step form.
