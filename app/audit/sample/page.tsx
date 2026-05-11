"use client";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingDown, Clock, ShieldCheck, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SampleAuditPage() {
  const sampleResult = {
    toolResults: [
      {
        tool: "Cursor",
        currentMonthlyCost: 120,
        recommendation: "Downgrade to Pro",
        recommendedMonthlyCost: 60,
        savingsPerMonth: 60,
        reason: "You have 3 Business seats but only 2 active developers. Cursor Pro is sufficient for teams <= 2."
      },
      {
        tool: "ChatGPT",
        currentMonthlyCost: 50,
        recommendation: "Consolidate to API",
        recommendedMonthlyCost: 10,
        savingsPerMonth: 40,
        reason: "You are paying for ChatGPT Team but your API usage suggests most tasks can be handled via the OpenAI API directly."
      }
    ],
    totalMonthlySavings: 100,
    totalAnnualSavings: 1200
  };

  return (
    <div className="min-h-screen bg-beige-100 dark:bg-zinc-950 selection:bg-gold/30 pb-20">
      <Navbar />
      
      <main className="max-w-5xl mx-auto pt-32 px-6 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Badge variant="outline" className="rounded-full px-3 py-1 bg-white/50 border-gold/20 text-gold text-[10px] font-bold tracking-widest uppercase">Sample Report</Badge>
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5"><Clock className="w-3 h-3" /> Demo Data</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-heading italic text-olive-950 dark:text-olive-100 leading-none">
               Clinical <span className="not-italic font-normal text-charcoal dark:text-white">Savings Report.</span>
             </h1>
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-full glass-matte border-none shadow-lg text-sm font-semibold tracking-wide transition-all active:scale-95">
            <Share2 className="w-4 h-4 mr-2" /> Share Audit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 glass-matte rounded-[3rem] p-12 cinematic-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative space-y-10">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-gold/20 rounded-2xl flex items-center justify-center"><TrendingDown className="text-gold w-6 h-6" /></div>
                 <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Sample Annual Savings</h3>
                    <p className="text-5xl font-heading italic text-olive-950 dark:text-olive-100">$1,200</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Executive Summary</p>
                <p className="text-xl md:text-2xl text-olive-900 dark:text-olive-100 leading-relaxed font-light">
                  This sample audit demonstrates how SpendLens identifies redundant seats and suggests cost-efficient API alternatives. By optimizing just two tools, this team saves over $1k annually.
                </p>
              </div>
            </div>
          </div>
          
          <Card className="glass-matte border-none rounded-[3rem] flex flex-col justify-center items-center p-8 text-center space-y-6">
             <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">
                <TrendingDown className="w-10 h-10" />
             </div>
             <div>
                <p className="text-5xl font-heading italic text-emerald-600">$100</p>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/60 mt-1">Monthly Optimization</p>
             </div>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-heading italic text-olive-950 dark:text-olive-100">Granular Intelligence</h2>
             <Separator className="flex-1 bg-border/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleResult.toolResults.map((t, i) => (
              <Card key={i} className="glass-matte border-none rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                 <div className="h-2 w-full bg-gold" />
                 <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-2xl font-heading italic text-olive-950 dark:text-olive-100">{t.tool}</h3>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Currently: ${t.currentMonthlyCost}/mo</p>
                       </div>
                       <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gold/20 text-gold">
                          <TrendingDown className="w-5 h-5" />
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
            ))}
          </div>
        </div>
        
        <div className="text-center pt-10">
          <Button onClick={() => window.location.href = '/audit'} className="rounded-full bg-charcoal text-white px-12 h-14 text-lg font-heading italic">Start Your Own Real Audit &rarr;</Button>
        </div>
      </main>
    </div>
  );
}
