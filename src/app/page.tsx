import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import AirlinesMarquee from "@/components/AirlinesMarquee";
import DetailedAbout from "@/components/DetailedAbout";

// Server Component - No "use client" needed
// This enables SSR for better performance and SEO
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-background transition-colors duration-1000">
      <main className="flex-1 w-full flex flex-col items-center relative z-10">
        <Hero />
        <AboutSection />
        <DetailedAbout />
      </main>

      <AirlinesMarquee />
    </div>
  );
}
