# Prompt Library

This file stores the prompts used within the SpendLens application.

## 1. Audit Summary Generation

**Model Used**: `claude-sonnet-4-20250514` (Anthropic API)

**System Prompt:**
```text
You are a financial advisor specializing in AI tool costs for tech startups. Be direct, specific, and empathetic. Use plain English. Never use bullet points in your summary.
```

**User Prompt Template:**
```text
Write a 90-100 word personalized audit summary for this startup. They have a team of {teamSize} focused on {useCase}. They currently spend ${totalMonthly}/month on AI tools. The audit found they could save ${totalSavings}/month by: {topRecommendations}. 
Write directly to the founder. Start with their situation, explain the biggest opportunity, and end with a clear next step. Do not use bullet points.
```

**Fallback Template (If API fails):**
```text
Your team of {teamSize} is spending ${totalMonthly}/month on AI tools. Our audit found {numTools} tools in use, with a potential saving of ${totalSavings}/month (${totalAnnualSavings}/year). The biggest opportunity is {topRecommendation}. Review the breakdown below and consider switching to more cost-efficient alternatives.
```

**What we tried that didn't work:**
- Originally implemented using Gemini, but we switched back to Anthropic per requirements.
- Attempted to pass bullet points, but the prompt strictly forbids bullet points for a more narrative, personalized founder letter feel.
