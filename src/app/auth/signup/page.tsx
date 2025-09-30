"use client";

import * as React from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signupAction, type FormState } from "@/app/auth/signup/signup.actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-95 disabled:opacity-50"
    >
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export default function SignupPage() {
  const initialState: FormState = { ok: false, message: "" };

  // Tell useFormState what the state type is (and the payload type FormData).
  const [state, formAction] = useFormState<FormState, FormData>(
    signupAction,
    initialState
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-gradient-start to-bg-gradient-end">
      <div className="container mx-auto max-w-md px-4 py-12">
        <div className="rounded-xl border bg-card p-6 shadow-cozy panel-border">
          <h1 className="text-2xl font-bold mb-1">Join us</h1>
          <p className="text-muted-foreground mb-6">
            Create an account to submit mappings, vote, and more.
          </p>

          {state.message ? (
            <div
              className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                state.ok
                  ? "border-green-300 text-green-800"
                  : "border-red-300 text-red-800"
              }`}
            >
              {state.message}
            </div>
          ) : null}

          <form action={formAction} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="display_name" className="text-sm font-medium">
                Display name (optional)
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                placeholder="Robin"
                className="rounded-md border px-3 py-2 bg-background"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="rounded-md border px-3 py-2 bg-background"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="rounded-md border px-3 py-2 bg-background"
              />
            </div>

            <SubmitBtn />
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
