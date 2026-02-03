"use client";

import { Info } from "lucide-react";
import { FlightSkeleton } from "./Skeleton";
import FlightCard from "./FlightCard";

interface FlightResultsProps {
    results?: any[];
    isLoading?: boolean;
    isInspiration?: boolean;
}

export default function FlightResults({ results = [], isLoading, isInspiration }: FlightResultsProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="h-8 w-48 mb-4">
                    <div className="bg-silver-light dark:bg-dark-cyan/20 animate-pulse rounded-lg h-full w-full" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <FlightSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xl font-display font-semibold text-foreground">
                    {isInspiration ? "Deals you might like" : results.length > 0 ? "Flights found" : "Explore popular routes"}
                </h3>
                <div className="flex items-center gap-2 text-xs text-silver">
                    <Info className="w-3 h-3" />
                    <span>Prices include taxes & fees</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {results.length > 0 ? (
                    results.map((flight: any, index: number) => (
                        <FlightCard
                            key={flight.id || index}
                            flight={flight}
                            index={index}
                            isInspiration={isInspiration}
                        />
                    ))
                ) : (
                    <div className="p-16 text-center glass-card">
                        <p className="text-silver font-bold font-sans">No flights found for this selection.</p>
                        {isInspiration && (
                            <p className="text-[10px] text-amber-500/60 mt-2 font-bold uppercase tracking-widest">
                                Tip: Discovery deals are currently limited to MAD, PAR, LON, and BER hubs in sandbox mode.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Comprehensive IATA Map for common cities
const IATA_MAP: Record<string, string> = {
    'PAR': 'Paris',
    'LON': 'London',
    'MAD': 'Madrid',
    'BER': 'Berlin',
    'FRA': 'Frankfurt',
    'AMS': 'Amsterdam',
    'CDG': 'Paris-CDG',
    'LHR': 'London-Heathrow',
    'JFK': 'New York',
    'DXB': 'Dubai',
    'HND': 'Tokyo',
    'BCN': 'Barcelona',
    'FCO': 'Rome',
    'IST': 'Istanbul',
    'MUC': 'Munich',
    'DUB': 'Dublin',
    'VIE': 'Vienna',
    'ZRH': 'Zurich',
    'CPH': 'Copenhagen',
    'OSL': 'Oslo',
    'ARN': 'Stockholm',
    'HEL': 'Helsinki',
    'ATH': 'Athens',
    'LIS': 'Lisbon',
    'PRG': 'Prague',
    'WAW': 'Warsaw',
    'BRU': 'Brussels'
};
