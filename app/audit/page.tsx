"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormPersist } from "@/hooks/useFormPersist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

const toolPlanOptions = {
  cursor: ["Hobby ($0)", "Pro ($20/user/mo)", "Business ($40/user/mo)", "Enterprise (custom)", "None"],
  copilot: ["Individual ($10/user/mo)", "Business ($19/user/mo)", "Enterprise ($39/user/mo)", "None"],
  claude: ["Free ($0)", "Pro ($20/mo)", "Max ($100/mo)", "Team ($25/user/mo)", "Enterprise (custom)", "API Direct (usage-based)", "None"],
  chatgpt: ["Plus ($20/mo)", "Team ($25/user/mo)", "Enterprise (custom)", "API Direct (usage-based)", "None"],
  anthropicApi: ["Active", "None"],
  openaiApi: ["Active", "None"],
  gemini: ["Pro ($19.99/mo)", "Ultra ($249.99/mo)", "API (usage-based)", "None"],
  windsurf: ["Free ($0)", "Pro ($15/user/mo)", "Teams ($35/user/mo)", "None"],
};

const formSchema = z.object({
  website: z.string().optional(),
  teamSize: z.number().min(1, "Team size must be at least 1"),
  primaryUseCase: z.enum(["coding", "writing", "data analysis", "research", "mixed"]),
  tools: z.object({
    cursor: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
    copilot: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
    claude: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
    chatgpt: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
    anthropicApi: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
    openaiApi: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
    gemini: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
    windsurf: z.object({ plan: z.string(), spend: z.number().min(0), seats: z.number().min(0) }),
  })
});

type FormData = z.infer<typeof formSchema>;

export default function AuditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formMethods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: 1,
      primaryUseCase: "coding",
      tools: {
        cursor: { plan: "None", spend: 0, seats: 0 },
        copilot: { plan: "None", spend: 0, seats: 0 },
        claude: { plan: "None", spend: 0, seats: 0 },
        chatgpt: { plan: "None", spend: 0, seats: 0 },
        anthropicApi: { plan: "None", spend: 0, seats: 0 },
        openaiApi: { plan: "None", spend: 0, seats: 0 },
        gemini: { plan: "None", spend: 0, seats: 0 },
        windsurf: { plan: "None", spend: 0, seats: 0 },
      }
    }
  });

  const { register, handleSubmit, control, formState: { errors } } = formMethods;

  useFormPersist("spendlens-audit-form", formMethods);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.auditId) {
        router.push(`/audit/${json.auditId}`);
      } else {
        setErrorMsg(json.error || "Submission failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg("Connection failed. Please check your internet.");
      setIsSubmitting(false);
    }
  };

  const toolsList = [
    { id: "cursor", name: "Cursor" },
    { id: "copilot", name: "GitHub Copilot" },
    { id: "claude", name: "Claude" },
    { id: "chatgpt", name: "ChatGPT" },
    { id: "anthropicApi", name: "Anthropic API" },
    { id: "openaiApi", name: "OpenAI API" },
    { id: "gemini", name: "Gemini" },
    { id: "windsurf", name: "Windsurf" },
  ] as const;

  return (
    <div className="min-h-screen bg-beige-100 dark:bg-zinc-950 selection:bg-gold/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-heading italic text-olive-950 dark:text-olive-100 leading-tight">
            Audit Your <span className="not-italic font-normal text-charcoal dark:text-white">Intelligence Stack</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Precisely map your AI tool spending. Every field you fill brings you closer to clinical efficiency.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="text" {...register("website")} tabIndex={-1} autoComplete="off" />
          </div>

          {/* COMPANY DETAILS */}
          <Card className="glass-matte border-none shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="font-heading italic text-3xl text-olive-900 dark:text-olive-100">Contextual Baseline</CardTitle>
              <CardDescription className="text-muted-foreground text-sm font-medium">The foundation of your audit.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="teamSize" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Active Team Members</Label>
                  <Input 
                    id="teamSize" 
                    type="number" 
                    {...register("teamSize", { valueAsNumber: true })} 
                    className="h-14 bg-white/50 dark:bg-black/20 border-none rounded-2xl text-lg font-medium focus-visible:ring-gold"
                  />
                  {errors.teamSize && <p className="text-red-500 text-xs font-semibold">{errors.teamSize.message}</p>}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="primaryUseCase" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Primary Intelligence Need</Label>
                  <Controller
                    control={control}
                    name="primaryUseCase"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-14 bg-white/50 dark:bg-black/20 border-none rounded-2xl text-lg font-medium focus:ring-gold">
                          <SelectValue placeholder="Select usage profile" />
                        </SelectTrigger>
                        <SelectContent className="glass-matte border-none rounded-2xl">
                          <SelectItem value="coding" className="py-3">Software Development</SelectItem>
                          <SelectItem value="writing" className="py-3">Creative Writing</SelectItem>
                          <SelectItem value="data analysis" className="py-3">Data Intelligence</SelectItem>
                          <SelectItem value="research" className="py-3">Academic Research</SelectItem>
                          <SelectItem value="mixed" className="py-3">General Utility</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/30 max-w-[200px] mx-auto" />

          {/* TOOLS GRID */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-heading italic text-olive-950 dark:text-olive-100">Tool Infrastructure</h2>
              <Separator className="flex-1 bg-border/30" />
            </div>
            
            {toolsList.map((tool, idx) => (
              <Card key={tool.id} className="glass-matte border-none shadow-xl rounded-[2.5rem] overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-heading italic text-olive-900 dark:text-olive-100 transition-colors group-hover:text-gold">{tool.name}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-tighter text-muted-foreground font-bold">Tool #{idx + 1}</CardDescription>
                  </div>
                  <div className="h-10 w-10 bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold/60" />
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground opacity-60">Current Subscription</Label>
                      <Controller
                        control={control}
                        name={`tools.${tool.id}.plan` as const}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-12 bg-white/40 dark:bg-black/20 border-none rounded-xl font-medium focus:ring-gold/40">
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent className="glass-matte border-none rounded-xl">
                              {toolPlanOptions[tool.id as keyof typeof toolPlanOptions].map((plan) => (
                                <SelectItem key={plan} value={plan} className="py-2.5">{plan}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground opacity-60">Monthly Spend ($)</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...register(`tools.${tool.id}.spend` as const, { valueAsNumber: true })} 
                        className="h-12 bg-white/40 dark:bg-black/20 border-none rounded-xl font-medium focus-visible:ring-gold/40"
                      />
                    </div>
                    
                    {tool.id !== "anthropicApi" && tool.id !== "openaiApi" && (
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground opacity-60">Allocated Seats</Label>
                        <Input 
                          type="number" 
                          {...register(`tools.${tool.id}.seats` as const, { valueAsNumber: true })} 
                          className="h-12 bg-white/40 dark:bg-black/20 border-none rounded-xl font-medium focus-visible:ring-gold/40"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-10 flex flex-col items-center gap-6">
            {errorMsg && (
              <div className="px-6 py-3 rounded-full bg-red-50 text-red-600 text-sm font-semibold animate-bounce">
                {errorMsg}
              </div>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="h-20 px-16 rounded-full bg-charcoal dark:bg-white dark:text-charcoal text-white text-2xl font-heading italic shadow-2xl shadow-charcoal/20 transition-all hover:px-24 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="animate-spin w-6 h-6" />
                  Generating Audit...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Calculate Savings
                  <ArrowRight className="w-6 h-6" />
                </span>
              )}
            </Button>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Takes approx. 180ms to process</p>
          </div>
        </form>
      </main>

      <footer className="py-12 border-t border-border/20 text-center text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        Strictly Confidential Intelligence Audit
      </footer>
    </div>
  );
}
