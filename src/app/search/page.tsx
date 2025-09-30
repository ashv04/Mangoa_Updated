import { redirect } from "next/navigation";

export default function LegacySearchRedirect({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const raw = searchParams?.q;
  const q = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const target = q ? `/discover?q=${encodeURIComponent(q)}` : "/discover";
  redirect(target);
}