import { NextResponse } from 'next/server';
import { auditSpend, AuditInput, AuditResult } from '@/lib/auditEngine';

// Global store to survive hot-reloads during dev
const globalForAudit = global as unknown as {
  auditStore: Map<string, AuditResult>;
};

export const auditStore = globalForAudit.auditStore || new Map<string, AuditResult>();

if (process.env.NODE_ENV !== "production") {
  globalForAudit.auditStore = auditStore;
}

export async function POST(request: Request) {
  try {
    const input: AuditInput = await request.json();
    const result = auditSpend(input);
    const auditId = crypto.randomUUID();
    
    auditStore.set(auditId, result);
    
    return NextResponse.json({ auditId, result });
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json({ error: "Failed to process audit" }, { status: 500 });
  }
}
