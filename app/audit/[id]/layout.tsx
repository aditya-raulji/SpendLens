import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  if (!supabase) {
    return { title: 'AI Spend Audit' };
  }

  const { data, error } = await supabase
    .from('audits')
    .select('audit_data')
    .eq('id', id)
    .single();

  if (error || !data) {
    return { title: 'AI Spend Audit - Not Found' };
  }

  const result = data.audit_data;
  const savings = result.totalMonthlySavings || 0;
  const savingsAnnual = result.totalAnnualSavings || 0;

  return {
    title: `AI Spend Audit — Save $${savings}/month`,
    description: `This startup could save $${savings}/month on AI tools. See the full breakdown.`,
    openGraph: {
      title: `AI Spend Audit — Save $${savings}/month`,
      description: `Potential savings: $${savings}/month · $${savingsAnnual}/year`,
      url: `https://spend-lens.vercel.app/audit/${id}`,
      siteName: 'SpendLens',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `AI Spend Audit — Save $${savings}/month`,
      description: `Potential savings: $${savings}/month · $${savingsAnnual}/year`,
    },
  };
}

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
