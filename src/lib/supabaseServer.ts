// Server-side Supabase clients for RSC vs Server Actions

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Use inside Server Components (RSC) where cookies CANNOT be mutated.
 * Reads cookies only; set/remove are no-ops.
 */
export async function createSupabaseServer() {
  const cookieStore = await cookies(); // (async in some Next versions)
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(_name: string, _value: string, _opts: CookieOptions) {},
      remove(_name: string, _opts: CookieOptions) {},
    },
  });
}

/**
 * Use inside Server Actions / Route Handlers where cookies MAY be mutated.
 */
export async function createSupabaseServerAction() {
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}
