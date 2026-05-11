"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

interface LeadCaptureFormProps {
  auditId: string;
}

export function LeadCaptureForm({ auditId }: LeadCaptureFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/audit/${auditId}/lead`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyName: company, role })
      });

      if (!res.ok) throw new Error("Failed to submit");
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="glass-matte border-none rounded-[3rem] p-12 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-heading italic text-olive-950 dark:text-olive-100">Report Archived</h2>
          <p className="text-muted-foreground font-medium">A permanent record of this audit has been sent to your inbox.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-matte border-none rounded-[3rem] overflow-hidden cinematic-shadow animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
      <CardHeader className="p-12 pb-6 text-center">
        <CardTitle className="text-4xl font-heading italic text-olive-950 dark:text-olive-100">Preserve This Intel</CardTitle>
        <CardDescription className="text-muted-foreground font-medium mt-2">
          Secure a permanent encrypted link to these optimization metrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-12 pt-0">
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Verified Business Email</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@venture.com" 
                className="h-14 pl-12 bg-white/50 dark:bg-black/20 border-none rounded-2xl text-lg font-medium focus-visible:ring-gold"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="company" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Company Name</Label>
              <Input 
                id="company" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Project Apollo" 
                className="h-14 bg-white/50 dark:bg-black/20 border-none rounded-2xl text-lg font-medium focus-visible:ring-gold"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="role" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Functional Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val || "")}>
                <SelectTrigger id="role" className="h-14 bg-white/50 dark:bg-black/20 border-none rounded-2xl text-lg font-medium focus:ring-gold">
                  <SelectValue placeholder="Select expertise" />
                </SelectTrigger>
                <SelectContent className="glass-matte border-none rounded-2xl">
                  <SelectItem value="Founder" className="py-3">Founding Partner</SelectItem>
                  <SelectItem value="Engineering Manager" className="py-3">Engineering Lead</SelectItem>
                  <SelectItem value="CTO" className="py-3">Chief Technology Officer</SelectItem>
                  <SelectItem value="Individual developer" className="py-3">Strategic Developer</SelectItem>
                  <SelectItem value="Other" className="py-3">Other Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full h-16 rounded-full bg-charcoal dark:bg-white dark:text-charcoal text-white text-xl font-heading italic shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Archiving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Full Report &rarr;
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
