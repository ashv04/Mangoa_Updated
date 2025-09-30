// src/app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, TrendingUp, Users, Star } from "lucide-react";
import DashboardSection from "@/components/DashboardSection";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If you already have middleware guarding /dashboard, this is redundant but harmless safety.
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  // === Signed-in state ===
  // (If you still want the signed-out preview, move that block to /login or /browse)
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-gradient-start to-bg-gradient-end">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="relative mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-cozy border-2 border-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-300 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-300 rounded-bl-xl" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Welcome back{user?.email ? `, ${user.email}` : ""} — track your progress and manage mappings.
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-4 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          <DashboardSection />
        </div>
      </div>
    </div>
  );
}
