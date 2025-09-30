import { redirect } from "next/navigation";

export default async function LegacySearchRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const raw = (await searchParams)?.q;
  const q = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const target = q ? `/discover?q=${encodeURIComponent(q)}` : "/discover";
  redirect(target);
}
