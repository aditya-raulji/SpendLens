import { NextResponse } from 'next/server';
import { auditSpend, AuditInput } from '@/lib/auditEngine';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
// Check if credentials exist to avoid client creation error if empty during development without env vars
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    const input: AuditInput = await request.json();
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
