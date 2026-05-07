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
        console.error("No auditId returned");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const toolsList = [
    { id: "cursor", name: "Cursor" },
    { id: "copilot", name: "GitHub Copilot" },
    { id: "claude", name: "Claude (Anthropic)" },
    { id: "chatgpt", name: "ChatGPT (OpenAI)" },
    { id: "anthropicApi", name: "Anthropic API Direct" },
    { id: "openaiApi", name: "OpenAI API Direct" },
    { id: "gemini", name: "Gemini" },
    { id: "windsurf", name: "Windsurf" },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12 text-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Spend Audit</h1>
          <p className="text-zinc-500 mt-2 text-lg">Enter your current AI stack and spending to discover potential savings.</p>
        </div>

        {/* Removed submitted success message as we redirect to results page now */}
        {(
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Tell us a bit about your team size and use cases.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input id="teamSize" type="number" {...register("teamSize", { valueAsNumber: true })} />
                    {errors.teamSize && <p className="text-red-500 text-sm">{errors.teamSize.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryUseCase">Primary Use Case</Label>
                    <Controller
                      control={control}
                      name="primaryUseCase"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select use case" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coding">Coding</SelectItem>
                            <SelectItem value="writing">Writing</SelectItem>
                            <SelectItem value="data analysis">Data Analysis</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight mt-8">Tool Breakdown</h2>
              
              {toolsList.map((tool) => (
                <Card key={tool.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{tool.name}</CardTitle>
                      <Badge variant="outline" className="bg-white">Tool</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Plan Selected</Label>
                        <Controller
                          control={control}
                          name={`tools.${tool.id}.plan` as const}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select plan" />
                              </SelectTrigger>
                              <SelectContent>
                                {toolPlanOptions[tool.id as keyof typeof toolPlanOptions].map((plan) => (
                                  <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      
                      {/* For API Direct tools, we only need spend, but we'll include seats as disabled or hidden. I'll just show both but we can ignore seats for API */}
                      <div className="space-y-2">
                        <Label>Monthly Spend ($)</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...register(`tools.${tool.id}.spend` as const, { valueAsNumber: true })} 
                        />
                      </div>
                      
                      {tool.id !== "anthropicApi" && tool.id !== "openaiApi" && (
                        <div className="space-y-2">
                          <Label>Number of Seats</Label>
                          <Input 
                            type="number" 
                            {...register(`tools.${tool.id}.seats` as const, { valueAsNumber: true })} 
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Analyzing..." : "Calculate Potential Savings"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
