import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  const data = await req.json();
  
  const { teamSize, useCase, totalMonthly, totalSavings, totalAnnualSavings, topRecommendation, numTools } = data;

  const systemPrompt = "You are a financial advisor specializing in AI tool costs for tech startups. Be direct, specific, and empathetic. Use plain English. Never use bullet points in your summary.";

  const userPrompt = `Write a 90-100 word personalized audit summary for this startup. They have a team of ${teamSize} focused on ${useCase}. They currently spend $${totalMonthly}/month on AI tools. The audit found they could save $${totalSavings}/month by: ${topRecommendation}. 
Write directly to the founder. Start with their situation, explain the biggest opportunity, and end with a clear next step. Do not use bullet points.`;

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const summary = response.content[0].type === 'text' ? response.content[0].text : '';
    
    if (!summary) throw new Error('No summary returned');

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Anthropic API Error:", error);
    // Graceful fallback — no crash, no error shown to user
    const fallback = `Your team of ${teamSize} is spending $${totalMonthly}/month on AI tools. Our audit found ${numTools} tools in use, with a potential saving of $${totalSavings}/month ($${totalAnnualSavings}/year). The biggest opportunity is ${topRecommendation}. Review the breakdown below and consider switching to more cost-efficient alternatives.`;
    
    return NextResponse.json({ summary: fallback });
  }
}
