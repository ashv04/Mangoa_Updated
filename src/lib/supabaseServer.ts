// server supabase clients for rsc and server actions

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// rsc helper. reads cookies only
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
// server actions and route handlers. can mutate cookies
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
        // expire cookie to ensure sign out is seen by rsc
        cookieStore.set({ name, value: "", ...options, expires: new Date(0) });
      },
    },
  });
}
