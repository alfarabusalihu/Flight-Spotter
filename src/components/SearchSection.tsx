"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import SearchForm from "./SearchForm";
import SearchGuide from "./SearchGuide";
import { useFlightStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/Skeleton";

// Lazy load components that appear after user interaction
const TouristPlaces = dynamic(() => import("./TouristPlaces"), {
    loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
    ssr: false
});

const FlightDeals = dynamic(() => import("./FlightDeals"), {
    loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
    ssr: false
});

export default function SearchSection() {
    const { origin, destination, isSearchLoading, flightResults } = useFlightStore();

    // Hide this main search section if we have results (as ResultsDashboard has its own sticky search bar)
    if (flightResults.length > 0) {
        return null;
    }

    // Investigation mode when user has entered some info but not searched yet
    const isExploring = (origin || destination);

    return (
        <section className="w-full py-12 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Contextual Sections Under Search Form */}
                <AnimatePresence mode="wait">
                    {!isExploring && !isSearchLoading && (
                        <motion.div
                            key="guide"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <SearchGuide />
                        </motion.div>
                    )}

                    {isExploring && (
                        <motion.div
                            key="exploring"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="mt-8 space-y-8"
                        >
                            {/* Lazy loaded - only when user is exploring */}
                            <TouristPlaces />
                            <FlightDeals />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
