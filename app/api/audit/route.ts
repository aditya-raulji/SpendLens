import { NextResponse } from 'next/server';
import { auditSpend, AuditInput } from '@/lib/auditEngine';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
// Check if credentials exist to avoid client creation error if empty during development without env vars
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory rate limiting store: Map<IP, { count, resetAt }>
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);

  // If no record or reset period has passed, reset counter
  if (!limitData || now > limitData.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour reset
    return true;
  }

  // If over limit, block
  if (limitData.count >= 10) {
    return false;
  }

  // Increment and allow
  limitData.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const input: AuditInput & { website?: string } = await request.json();
    
    // 1. Honeypot check
    if (input.website) {
      console.warn("Honeypot triggered, silently rejecting.");
      // Return a fake success to fool bots without adding to DB
      return NextResponse.json({ auditId: crypto.randomUUID(), result: {} });
    }

    // 2. IP Rate limiting
    // Note: In Next.js App Router, request.headers.get('x-forwarded-for') or x-real-ip is standard for identifying IP behind proxies
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const result = auditSpend(input);
    
    if (!supabase) {
      // Fallback for local testing without Supabase
      console.warn("Supabase not configured, returning mock ID");
      return NextResponse.json({ auditId: crypto.randomUUID(), result });
    }

    const { data, error } = await supabase
      .from('audits')
      .insert([
        {
          audit_data: result,
          team_size_reported: result.teamSize,
          total_savings_monthly: result.totalMonthlySavings,
          is_high_savings: result.credexThreshold
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }
    
    return NextResponse.json({ auditId: data.id, result });
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json({ error: "Failed to process audit" }, { status: 500 });
  }
}
