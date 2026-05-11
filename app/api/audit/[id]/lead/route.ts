import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, companyName, role } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let savings = 0;

    // Update Supabase if configured
    if (supabase) {
      const { data: auditData, error: selectError } = await supabase
        .from('audits')
        .select('total_savings_monthly')
        .eq('id', id)
        .single();
        
      if (auditData) {
        savings = Number(auditData.total_savings_monthly) || 0;
      }

      const { error: updateError } = await supabase
        .from('audits')
        .update({
          email,
          company_name: companyName,
          role: role
        })
        .eq('id', id);

      if (updateError) {
        console.error("Supabase update error:", updateError);
      }
    }

    // Send Resend email
    const auditUrl = `${request.headers.get('origin') || 'http://localhost:3000'}/audit/${id}`;
    
    // In dev without a key or when mocking, don't crash
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'SpendLens <audits@spendlens.com>', // Replace with your verified domain
        to: email,
        subject: 'Your AI spend audit from SpendLens',
        text: `Hi there, your audit showed you could save $${savings}/month on AI tools. Here's your shareable audit link: ${auditUrl}. If your savings are significant, the team at Credex (credex.rocks) can help you access the same AI tools at a lower cost through discounted credits. — The SpendLens team`
      });
    } else {
      console.log(`Mock email sent to ${email} with savings $${savings} at ${auditUrl}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to process lead" }, { status: 500 });
  }
}
