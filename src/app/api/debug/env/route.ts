import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const url = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const svcPresent = svc.length > 0;
  const svcPrefix = svcPresent ? svc.slice(0, 10) : null; // mask
  return NextResponse.json({
    urlPresent: url,
    serviceKeyPresent: svcPresent,
    serviceKeyPrefix: svcPrefix, // masked first 10 chars
    nodeEnv: process.env.NODE_ENV,
  });
}
