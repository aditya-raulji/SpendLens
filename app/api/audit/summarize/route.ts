import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const auditResult = await req.json();

  const prompt = `You are a financial advisor specializing in AI tool costs 
for tech startups. Write a 90-100 word personalized audit summary.

Team size: ${auditResult.teamSize}
Use case: ${auditResult.useCase}  
Current monthly AI spend: $${auditResult.totalMonthly}
Potential monthly savings: $${auditResult.totalSavings}
Top recommendation: ${auditResult.topRecommendation}

Write directly to the founder. Start with their situation, 
explain the biggest savings opportunity, end with a clear next step. 
Plain English only. No bullet points.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7,
          }
        })
      }
    );

    if (!response.ok) throw new Error('Gemini API failed');

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) throw new Error('No summary returned');

    return NextResponse.json({ summary });

  } catch (error) {
    // Graceful fallback — no crash, no error shown to user
    const fallback = `Your team of ${auditResult.teamSize} is spending $${auditResult.totalMonthly}/month on AI tools. Our audit found ${auditResult.numTools} tools in use, with a potential saving of $${auditResult.totalSavings}/month ($${auditResult.totalSavings * 12}/year). The biggest opportunity is ${auditResult.topRecommendation}. Review the breakdown below to start saving.`;
    
    return NextResponse.json({ summary: fallback });
  }
}
