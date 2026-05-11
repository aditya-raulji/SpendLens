"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="bg-emerald-50 border-emerald-200 mt-10 animate-in fade-in zoom-in duration-500">
        <CardHeader>
          <CardTitle className="text-emerald-800">Check your inbox</CardTitle>
          <CardDescription className="text-emerald-600">
            We've sent a link to your audit results so you don't lose it.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-10 border-zinc-200 shadow-sm bg-white animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
      <CardHeader>
        <CardTitle className="text-xl">Save your results</CardTitle>
        <CardDescription>
          Get a shareable link to this audit sent to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com" 
              className="bg-zinc-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input 
                id="company" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp" 
                className="bg-zinc-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="bg-zinc-50">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Founder">Founder</SelectItem>
                  <SelectItem value="Engineering Manager">Engineering Manager</SelectItem>
                  <SelectItem value="CTO">CTO</SelectItem>
                  <SelectItem value="Individual developer">Individual developer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full sm:w-auto font-semibold">
            {loading ? "Saving..." : "Send my results"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
