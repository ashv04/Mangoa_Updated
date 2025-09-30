// src/middleware.ts
import { NextResponse } from "next/server";

// No-op middleware. Let server components/layouts handle auth.
// This prevents cookie format mismatches from edge middleware.
export function middleware() {
  return NextResponse.next();
}

// Option A: remove matcher entirely (middleware won't run on any route)
// export const config = { matcher: [] };

// Option B (also fine): delete this file.
