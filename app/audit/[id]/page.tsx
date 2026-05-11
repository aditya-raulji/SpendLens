"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Share2, Check, Sparkles, TrendingDown, Clock, ShieldCheck } from "lucide-react";

interface AuditResult {
  toolResults: Array<{
    tool: string;
    currentMonthlyCost: number;
    recommendedPlan: string;
    recommendedMonthlyCost: number;
    savingsPerMonth: number;
    recommendation: string;
    reason: string;
  }>;
  totalMonthlySavings: number;
  credexThreshold: boolean;
}

export default function AuditResultsPage() {
  const { id } = useParams();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/audit/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setResult(data.result);
          const topRecommendation = data.result.toolResults.find((t: { savingsPerMonth: number }) => t.savingsPerMonth > 0)?.recommendation || "Maintain your current setup";
          fetch("/api/audit/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              teamSize: 1, 
              useCase: "coding",
              totalMonthly: data.result.totalMonthlySavings + 100,
              totalSavings: data.result.totalMonthlySavings,
              topRecommendations: topRecommendation
            })
          })
          .then(r => r.json())
          .then(s => setSummary(s.summary))
          .catch(() => setSummary("Your audit is complete. See the breakdown below for specific optimization opportunities."));
        }
        setLoading(false);
      });
  }, [id]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 dark:bg-zinc-950 flex flex-col items-center justify-center space-y-8">
        <div className="relative h-24 w-24">
           <div className="absolute inset-0 rounded-full border-4 border-gold/20 animate-ping" />
           <div className="absolute inset-4 rounded-full border-4 border-gold/40 animate-pulse" />
           <div className="absolute inset-8 rounded-full bg-gold/60" />
        </div>
        <p className="font-heading italic text-2xl text-olive-900 dark:text-olive-100 animate-pulse">Synthesizing Efficiency...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-beige-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h1 className="text-4xl font-heading italic text-olive-950 dark:text-olive-100">Audit Not Found</h1>
        <p className="text-muted-foreground max-w-sm">The requested intelligence report could not be retrieved from our archives.</p>
        <Button onClick={() => window.location.href = '/audit'} className="rounded-full bg-olive-800 px-8">Start New Audit</Button>
      </div>
    );
  }

  const totalMonthlySavings = result.totalMonthlySavings;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const credexThreshold = result.credexThreshold;

  return (
    <div className="min-h-screen bg-beige-100 dark:bg-zinc-950 selection:bg-gold/30 pb-20">
      <Navbar />
      
      <main className="max-w-5xl mx-auto pt-32 px-6 space-y-16">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Badge variant="outline" className="rounded-full px-3 py-1 bg-white/50 border-gold/20 text-gold text-[10px] font-bold tracking-widest uppercase">Verified Audit</Badge>
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date().toLocaleDateString()}</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-heading italic text-olive-950 dark:text-olive-100 leading-none">
               Clinical <span className="not-italic font-normal text-charcoal dark:text-white">Savings Report.</span>
             </h1>
          </div>
          <Button onClick={copyUrl} variant="outline" className="h-12 px-6 rounded-full glass-matte border-none shadow-lg text-sm font-semibold tracking-wide transition-all active:scale-95">
            {copied ? (
              <span className="flex items-center gap-2 text-emerald-600"><Check className="w-4 h-4" /> Link Copied</span>
            ) : (
              <span className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share Audit</span>
            )}
          </Button>
        </div>

        {/* HERO STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 glass-matte rounded-[3rem] p-12 cinematic-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative space-y-10">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-gold/20 rounded-2xl flex items-center justify-center"><TrendingDown className="text-gold w-6 h-6" /></div>
                 <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Cumulative Annual Opportunity</h3>
                    <p className="text-5xl font-heading italic text-olive-950 dark:text-olive-100">${totalAnnualSavings.toLocaleString()}</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Executive Summary</p>
                <p className="text-xl md:text-2xl text-olive-900 dark:text-olive-100 leading-relaxed font-light">
                  {summary || "Calculating summary analysis..."}
                </p>
              </div>
            </div>
          </div>
          
          <Card className="glass-matte border-none rounded-[3rem] flex flex-col justify-center items-center p-8 text-center space-y-6">
             <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">
                <TrendingDown className="w-10 h-10" />
             </div>
             <div>
                <p className="text-5xl font-heading italic text-emerald-600">${totalMonthlySavings.toLocaleString()}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/60 mt-1">Monthly Optimization</p>
             </div>
             <p className="text-sm text-muted-foreground font-medium">Potential burn reduction across your currently active AI stack.</p>
          </Card>
        </div>

        {/* TOOL BREAKDOWN */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-heading italic text-olive-950 dark:text-olive-100">Granular Intelligence</h2>
             <Separator className="flex-1 bg-border/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {result.toolResults.map((t, i) => {
              const hasSavings = t.savingsPerMonth > 0;
              return (
                <Card key={i} className="glass-matte border-none rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                   <div className={hasSavings ? "h-2 w-full bg-gold" : "h-2 w-full bg-muted/30"} />
                   <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-2xl font-heading italic text-olive-950 dark:text-olive-100">{t.tool}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Currently: ${t.currentMonthlyCost}/mo</p>
                         </div>
                         <div className={`h-10 w-10 rounded-full flex items-center justify-center ${hasSavings ? 'bg-gold/20 text-gold' : 'bg-muted/30 text-muted-foreground'}`}>
                            {hasSavings ? <TrendingDown className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-8 pt-4 space-y-6">
                      <div className="p-5 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/20">
                         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Recommended Shift</p>
                         <p className="font-heading italic text-xl text-olive-900 dark:text-olive-100">{t.recommendation}</p>
                         <p className="text-sm text-gold font-bold mt-2">New Cost: ${t.recommendedMonthlyCost}/mo</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {t.reason}
                      </p>
                   </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* LEAD CAPTURE / CREDEX */}
        <LeadCaptureForm auditId={id as string} />

        <div className="text-center pt-20">
          <Button variant="link" onClick={() => window.location.href = '/audit'} className="text-olive-900 dark:text-olive-100 font-heading italic text-xl hover:text-gold transition-colors">
            Start New Audit &rarr;
          </Button>
        </div>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-xs font-semibold tracking-widest uppercase mt-20">
        SpendLens Luxury Dashboard &copy; 2026
      </footer>
    </div>
  );
}
