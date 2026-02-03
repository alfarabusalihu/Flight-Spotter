import { Metadata } from "next";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import SearchSection from "@/components/SearchSection";
import ResultsDashboardWrapper from "@/components/ResultsDashboardWrapper";
import { Skeleton } from "@/components/ui/Skeleton";
import SearchFiltersBar from "@/components/SearchFiltersBar";

// Metadata for SEO
export const metadata: Metadata = {
    title: 'Search Flights | Flight Spotter',
    description: 'Search and compare flights from hundreds of airlines. Find the best deals on flights worldwide.',
};

// Server Component - Static parts render on server
export default function FlightsPage() {
    return (
        <ErrorBoundary>
            <div className="min-h-screen flex flex-col relative bg-background transition-colors duration-1000">

                <main className="flex-1 w-full flex flex-col items-center relative z-10">
                    {/* Page Title - SSR */}
                    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 pt-10 pb-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-foreground mb-3">
                                Find Your Perfect{" "}
                                <span className="text-dark-cyan-light">Flight</span>
                            </h1>
                            <p className="text-foreground/60 text-lg">
                                Search and compare flights from hundreds of airlines
                            </p>
                        </div>
                    </div>

                    <SearchFiltersBar />
                    <SearchSection />

                    {/* Results - Conditionally rendered */}
                    <Suspense fallback={<div />}>
                        <ResultsDashboardWrapper />
                    </Suspense>

                </main>


            </div>
        </ErrorBoundary >
    );
}
