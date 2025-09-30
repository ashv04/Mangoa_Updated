// src/app/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache"; // keep header/layout uncached
import { createSupabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Role = "user" | "trusted_user" | "moderator" | "admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  noStore(); // ensure we read the live session/role every request

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/approval");

  const { data: prof } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role: Role | null = (prof?.role as Role | undefined) ?? null;

  // gatekeep the entire /admin subtree
  if (role !== "admin" && role !== "moderator") redirect("/");

  return <>{children}</>;
}
