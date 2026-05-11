"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-gold/30 scroll-smooth">
      <Navbar />

      <main className="flex-1 pt-32">
        {/* HERO SECTION */}
        <section className="relative px-6 pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,var(--color-beige-200),transparent_50%)]" />
          
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-matte text-xs font-semibold tracking-widest uppercase text-olive-800 animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles className="w-3 h-3 text-gold" />
              The New Standard in AI Auditing
            </div>
            
            <h1 className="text-6xl md:text-8xl font-heading font-light text-olive-950 dark:text-olive-100 italic leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Stop Overpaying for <br />
              <span className="font-normal not-italic text-charcoal dark:text-white">Intelligent Tools.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              A premium, Scandinavian-inspired audit experience for modern engineering teams. Uncover hidden savings in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Link href="/audit">
                <Button size="lg" className="h-16 px-10 rounded-full bg-olive-800 hover:bg-olive-900 text-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-olive-900/20">
                  Start Your Audit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/audit/sample">
                <Button variant="link" size="lg" className="text-olive-900 dark:text-olive-100 font-heading italic text-xl hover:text-gold transition-colors">
                  View Sample Report &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* IMAGE SHOWCASE */}
        <section className="px-6 pb-40">
          <div className="max-w-6xl mx-auto">
            <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden glass-matte cinematic-shadow border-8 border-white/40 group">
              <img 
                src="/luxury_saas_hero.png" 
                alt="SpendLens Interface" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                <div className="space-y-2">
                  <h3 className="font-heading italic text-3xl text-white">Precision Intelligence</h3>
                  <p className="text-white/60 text-sm max-w-sm">Every seat, every license, every dollar accounted for with surgical accuracy.</p>
                </div>
                <div className="hidden md:flex gap-4">
                   <div className="h-12 w-12 rounded-full glass-matte flex items-center justify-center text-white"><BarChart3 className="w-5 h-5" /></div>
                   <div className="h-12 w-12 rounded-full glass-matte flex items-center justify-center text-white"><ShieldCheck className="w-5 h-5" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-32 px-6 bg-white/30 dark:bg-black/20">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-heading italic text-olive-950 dark:text-olive-100">Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-md mx-auto">High-end auditing shouldn't have a high-end price tag.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-matte p-12 rounded-[3rem] space-y-6 text-left border-gold/10">
                <h3 className="text-2xl font-heading italic">Individual Audit</h3>
                <p className="text-5xl font-heading italic">$0 <span className="text-sm not-italic text-muted-foreground uppercase tracking-widest">/ forever</span></p>
                <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> Full tool analysis</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> AI Summary Report</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> Shareable URL</li>
                </ul>
              </div>
              <div className="bg-olive-800 p-12 rounded-[3rem] space-y-6 text-left text-white cinematic-shadow scale-105">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-heading italic">Enterprise Plan</h3>
                  <Badge className="bg-gold text-charcoal">Recommended</Badge>
                </div>
                <p className="text-5xl font-heading italic">Custom</p>
                <ul className="space-y-3 text-sm font-medium text-white/70">
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> SSO & Team Management</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> API Integration</li>
                  <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> Dedicated FinOps Advisor</li>
                </ul>
                <Button className="w-full h-12 rounded-full bg-white text-olive-900 hover:bg-gold transition-colors">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-40 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-heading italic text-olive-950 dark:text-olive-100">Born in Scandinavia, <br /> Built for the World.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                SpendLens was founded on the principle of *minimalist efficiency*. We believe that in the age of AI, intelligence should be used to optimize intelligence. Our goal is to help 10,000 startups reach profitability by cutting unnecessary burn.
              </p>
              <div className="flex gap-10 pt-4">
                <div className="space-y-1">
                  <p className="text-3xl font-heading italic text-gold">100%</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Privacy Guaranteed</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-heading italic text-gold">2k+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Audits Conducted</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden glass-matte">
               <div className="absolute inset-0 bg-olive-800/10 flex items-center justify-center p-20">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gold rounded-full mx-auto flex items-center justify-center text-4xl">🌲</div>
                    <p className="font-heading italic text-2xl text-olive-900">"Efficiency is the ultimate luxury."</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="bg-olive-100 dark:bg-olive-900/20 py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <div className="h-14 w-14 bg-white dark:bg-olive-800 rounded-2xl flex items-center justify-center cinematic-shadow">
                  <Zap className="text-gold w-7 h-7" />
                </div>
                <h3 className="text-2xl font-heading italic text-olive-950 dark:text-olive-100">Hyper-Fast Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">Our engine calculates optimizations across 8+ major AI providers in under 200ms.</p>
              </div>
              
              <div className="space-y-6">
                <div className="h-14 w-14 bg-white dark:bg-olive-800 rounded-2xl flex items-center justify-center cinematic-shadow">
                  <ShieldCheck className="text-gold w-7 h-7" />
                </div>
                <h3 className="text-2xl font-heading italic text-olive-950 dark:text-olive-100">PII-Stripped Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">Share reports securely. We strip all company names and emails from public audit links.</p>
              </div>
              
              <div className="space-y-6">
                <div className="h-14 w-14 bg-white dark:bg-olive-800 rounded-2xl flex items-center justify-center cinematic-shadow">
                  <BarChart3 className="text-gold w-7 h-7" />
                </div>
                <h3 className="text-2xl font-heading italic text-olive-950 dark:text-olive-100">Actionable Savings</h3>
                <p className="text-muted-foreground leading-relaxed">Don&apos;t just see the waste—get specific downgrade and consolidation recommendations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-40 px-6">
          <div className="max-w-4xl mx-auto glass-matte rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
             <h2 className="text-4xl md:text-6xl font-heading italic text-olive-950 dark:text-olive-100">Ready to slim your burn?</h2>
             <p className="text-lg text-muted-foreground max-w-md mx-auto">Join the high-growth engineering teams using SpendLens to stay lean while scaling.</p>
             <Link href="/audit" className="inline-block">
                <Button size="lg" className="h-14 px-10 rounded-full bg-charcoal text-white hover:bg-black transition-all hover:px-14">
                  Start Your Audit Now
                </Button>
             </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 text-center text-muted-foreground text-sm font-medium">
        &copy; 2026 SpendLens. All rights reserved. Built for the elite engineering teams.
      </footer>
    </div>
  );
}
