"use client";

import Link from "next/link";

type Role = "user" | "trusted_user" | "moderator" | "admin";

type Props = {
  signedIn: boolean;
  role: Role | null;
  onSignOut: (formData: FormData) => Promise<void>; // server action
};

export default function HeaderClient({ signedIn, role, onSignOut }: Props) {
  const canModerate = role === "admin" || role === "moderator";

  return (
    <header className="w-full bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold">📚 Mangoa</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="/browse">Browse Series</Link>
          <Link href="/discover">Discover</Link>
          <Link href="/dashboard">Your Dashboard</Link>
          <Link href="/contribute">Contribute</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Get in Touch</Link>
        </nav>

        <div className="flex items-center gap-3">
          {signedIn && canModerate && (
            <Link
              href="/admin/approval"
              className="rounded px-3 py-1 border bg-purple-600 text-white hover:bg-purple-700"
            >
              Approvals
            </Link>
          )}

          {!signedIn ? (
            <>
              <Link href="/login" className="rounded px-3 py-1 border">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded bg-purple-600 text-white px-3 py-1"
              >
                Join Us!
              </Link>
            </>
          ) : (
            <form action={onSignOut}>
              <button className="rounded px-3 py-1 border">Sign out</button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
