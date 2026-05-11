"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditResult } from "@/lib/auditEngine";

export default function AuditResultPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [result, setResult] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/audit/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            setResult(data.result);
            const topRecommendation = data.result.toolResults.find((t: any) => t.savingsPerMonth > 0)?.recommendation || "Maintain your current setup";
            fetch("/api/audit/summarize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                teamSize: data.result.teamSize,
                useCase: data.result.useCase,
                totalMonthly: data.result.totalCurrentSpend,
                totalSavings: data.result.totalMonthlySavings,
                totalAnnualSavings: data.result.totalAnnualSavings,
                topRecommendation: topRecommendation,
                numTools: data.result.toolResults.length
              })
            })
            .then(res => res.json())
            .then(sumData => {
              if (sumData.summary) setSummary(sumData.summary);
              setLoadingSummary(false);
            })
            .catch(() => setLoadingSummary(false));
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 md:p-12 flex items-center justify-center">
        <p className="text-zinc-500 animate-pulse text-lg">Analyzing your AI spend...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 md:p-12 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-500 text-lg">Audit not found or expired.</p>
          <Button onClick={() => window.location.href = '/audit'}>Start New Audit</Button>
        </div>
      </div>
    );
  }

  const { toolResults, totalMonthlySavings, totalAnnualSavings, credexThreshold } = result;
  const hasSavings = totalMonthlySavings > 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12 text-zinc-900">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* TOP HERO */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight ${hasSavings ? 'text-emerald-600' : 'text-zinc-800'}`}>
            {hasSavings 
              ? `You could save $${totalMonthlySavings}/month · $${totalAnnualSavings}/year`
              : `Your AI stack is highly optimized`}
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mt-4">
            Based on our analysis of your current tools, team size, and primary use case.
          </p>
          <div className="pt-6">
            <Button onClick={handleShare} variant="outline" size="lg" className="rounded-full px-8 bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-semibold shadow-sm transition-all hover:scale-105 active:scale-95">
              {copied ? "Copied to clipboard!" : "Share this audit \u2192"}
            </Button>
          </div>
        </div>

        {/* AI SUMMARY PLACEHOLDER */}
        <Card className="border-blue-100 bg-blue-50/50 shadow-sm animate-in fade-in zoom-in duration-500 delay-150">
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              AI Spend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {loadingSummary ? (
               <>
                 <Skeleton className="h-4 w-full bg-blue-100/50" />
                 <Skeleton className="h-4 w-[90%] bg-blue-100/50" />
                 <Skeleton className="h-4 w-[80%] bg-blue-100/50" />
               </>
             ) : (
               <p className="text-blue-900 leading-relaxed text-sm md:text-base font-medium">
                 {summary}
               </p>
             )}
          </CardContent>
        </Card>

        {/* PER-TOOL CARDS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800">Tool Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolResults.map((t, i) => {
              const toolHasSavings = t.savingsPerMonth > 0;
              return (
                <Card key={i} className={`overflow-hidden transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${200 + i * 100}ms`, animationFillMode: 'both' }}>
                  <CardHeader className={`pb-4 border-b ${toolHasSavings ? 'bg-emerald-50/50 border-emerald-100' : 'bg-zinc-50/50 border-zinc-100'}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-xl font-bold text-zinc-900">{t.tool}</CardTitle>
                        <CardDescription className="mt-1.5 flex items-center gap-2 text-sm font-medium">
                          {toolHasSavings ? (
                            <>
                              <span className="line-through text-zinc-400 decoration-zinc-300">${t.currentMonthlyCost}/mo</span>
                              <span className="text-zinc-900 bg-zinc-200/50 px-1.5 py-0.5 rounded">${t.recommendedMonthlyCost}/mo</span>
                            </>
                          ) : (
                            <span className="text-zinc-700">${t.currentMonthlyCost}/mo</span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge variant={toolHasSavings ? "default" : "secondary"} className={toolHasSavings ? "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold" : "bg-zinc-200 text-zinc-700 font-medium"}>
                        {toolHasSavings ? `Save $${t.savingsPerMonth}/mo` : 'Optimized'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="space-y-4">
                      <div className="bg-white p-3.5 rounded-lg border border-zinc-100 shadow-sm">
                        <span className="text-zinc-400 uppercase tracking-wider font-semibold block text-[10px] mb-1.5">Recommended Action</span>
                        <span className="font-semibold text-zinc-800">{t.recommendation}</span>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                        {t.reason}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CREDEX CTA BLOCK */}
        {credexThreshold && (
          <Card className="bg-zinc-950 text-zinc-50 border-0 shadow-2xl overflow-hidden relative group animate-in fade-in zoom-in duration-500 delay-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text">Volume Discounts Available</CardTitle>
              <CardDescription className="text-zinc-400 text-lg font-medium mt-2">
                Your spend profile qualifies for negotiated rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-zinc-300 mb-8 text-lg max-w-xl">
                Credex can help you get these exact tools at a discount by pooling buying power. Stop paying retail prices for enterprise usage.
              </p>
              <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold w-full sm:w-auto px-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95">
                  Book a consultation &rarr;
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* OPTIMAL MESSAGE */}
        {totalMonthlySavings < 100 && (
          <Card className="bg-white border-zinc-200 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">You're spending well on AI.</CardTitle>
              <CardDescription className="text-base text-zinc-500 font-medium">
                We'll notify you when better options exist for your stack. Enter your email to stay updated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <Input type="email" placeholder="you@company.com" className="flex-1 text-base bg-zinc-50" required />
                <Button type="submit" className="font-semibold">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
