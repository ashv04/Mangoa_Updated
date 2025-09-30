// src/app/layout.tsx
import "./globals.css";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import AuthListener from "@/components/AuthListener"; // ✅ add this

export const metadata = { title: "Mangoa" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="min-h-full">
      <body className="min-h-screen flex flex-col overflow-y-auto">
        {/* Runs on the client; keeps server cookies in sync with Supabase session */}
        <AuthListener />

        <HeaderServer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
