// Server wrapper: fetches user + role, injects server sign-out action

import HeaderClient from "./HeaderClient";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import {
  createSupabaseServer,
  createSupabaseServerAction,
} from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Role = "user" | "trusted_user" | "moderator" | "admin";

export default async function HeaderServer() {
  noStore();

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: Role | null = null;
  if (user) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = (prof?.role as Role | undefined) ?? null;
  }

  // Server Action: accept FormData for <form action=...>
  async function signOut(_: FormData) {
    "use server";
    const s = await createSupabaseServerAction();
    await s.auth.signOut();
    redirect("/");
  }

  return <HeaderClient signedIn={!!user} role={role} onSignOut={signOut} />;
}
