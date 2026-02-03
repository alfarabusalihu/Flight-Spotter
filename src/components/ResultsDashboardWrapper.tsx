"use client";

import { useFlightStore } from "@/lib/store";
import ResultsDashboard from "./ResultsDashboard";

// Client wrapper to handle conditional rendering based on store state
export default function ResultsDashboardWrapper() {
    const { flightResults } = useFlightStore();
    const hasResults = flightResults.length > 0;

    if (!hasResults) {
        return null;
    }

    return <ResultsDashboard />;
}
