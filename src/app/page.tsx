import Footer from "@/components/Footer";
import LandingSection from "@/components/LandingSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Main Content Area */}
      <main className="flex-1">
        <LandingSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}