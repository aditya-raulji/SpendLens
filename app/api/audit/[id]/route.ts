import { NextResponse } from 'next/server';
import { auditStore } from '../route';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = auditStore.get(id);
  
  if (!result) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }
  
  return NextResponse.json({ result });
}
