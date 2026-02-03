import { predictDestinationsAction } from "@/app/actions/predict";
import { searchLocationsAction, searchFlightsAction } from "@/app/actions/flight";
import { locationCache } from "./locationCache";

import { FlightSearchParams, CachedFlightResult } from "@/types/search";

const FLIGHT_CACHE_TTL = 15 * 60 * 1000; // 15 minutes for flight results

class SmartSearchManager {
    private flightCache = new Map<string, CachedFlightResult>();
    private pendingFlightSearches = new Map<string, Promise<any[]>>();
    private onResultsCallback: ((results: any[], params: FlightSearchParams) => void) | null = null;

    /**
     * Register a callback to be notified when flights are fetched (e.g. to update the store)
     */
    onResults(callback: (results: any[], params: FlightSearchParams) => void) {
        this.onResultsCallback = callback;
    }

    /**
     * PREDICT DESTINATIONS
     * 1. Uses Gemini to predict likely destinations based on origin
     * 2. Pre-fetches their details from Amadeus API
     * 3. Updating location cache silently
     */
    async predictAndCacheDestinations(origin: string): Promise<void> {
        if (!origin || origin.length < 3) return;

        console.log(`[SmartSearch] 🔮 Predicting destinations for origin: ${origin}`);

        try {
            // 1. Get predictions from Gemini
            const predictedCodes = await predictDestinationsAction({
                origin: origin,
                month: new Date().toLocaleString('default', { month: 'long' }),
                dayOfWeek: new Date().toLocaleString('default', { weekday: 'long' })
            });

            if (predictedCodes.length === 0) {
                console.log(`[SmartSearch] ℹ️ No predictive suggestions from AI for ${origin}`);
                return;
            }

            console.log(`[SmartSearch] 🎯 Predictions: ${predictedCodes.join(', ')}`);

            // 2. Pre-fetch location details from Amadeus for each prediction
            // We do this in parallel but detached so it doesn't block UI
            predictedCodes.forEach(async (code) => {
                // Check if already in cache
                const cached = locationCache.search(code);
                const exists = cached.some(c => c.iataCode === code);

                if (!exists) {
                    // Fetch from Amadeus
                    const results = await searchLocationsAction(code);
                    if (results && results.length > 0) {
                        // Add to location cache
                        locationCache.addToCache(results[0]);
                        console.log(`[SmartSearch] 📥 Cached predicted location: ${code}`);
                    }
                }
            });

        } catch (error) {
            console.error('[SmartSearch] Prediction error:', error);
        }
    }

    /**
     * PRE-FETCH FLIGHTS
     * Called when user has selected Origin + Dest + Date
     * Fetches flights in background so they are ready when user clicks Search
     */
    async prefetchFlights(params: FlightSearchParams): Promise<void> {
        const key = this.getFlightCacheKey(params);

        // Return if already cached or pending
        if (this.flightCache.has(key) || this.pendingFlightSearches.has(key)) {
            return;
        }

        console.log(`[SmartSearch] ⚡ Pre-fetching flights: ${params.originLocationCode} -> ${params.destinationLocationCode}`);

        const searchPromise = searchFlightsAction(params).then(results => {
            console.log(`[SmartSearch] ✅ Pre-fetch complete for ${params.originLocationCode}->${params.destinationLocationCode}: ${results?.length || 0} flights`);
            this.handleFlightResults(key, results);

            // Push to UI instantly if callback registered
            if (this.onResultsCallback && results && results.length > 0) {
                this.onResultsCallback(results, params);
            }

            return results;
        });

        this.pendingFlightSearches.set(key, searchPromise);
    }

    /**
     * GET PRE-FETCHED FLIGHTS
     * Called when user actually clicks Search
     * Returns instant results if available, or waits for pending search
     */
    async getOrFetchFlights(params: FlightSearchParams): Promise<any[]> {
        const key = this.getFlightCacheKey(params);

        // 1. Check valid cache
        const cached = this.flightCache.get(key);
        if (cached && (Date.now() - cached.timestamp < FLIGHT_CACHE_TTL)) {
            console.log(`[SmartSearch] ✨ Cache HIT for flight search`);
            return cached.results;
        }

        // 2. Check pending pre-fetch
        const pending = this.pendingFlightSearches.get(key);
        if (pending) {
            console.log(`[SmartSearch] ⏳ Waiting for pending pre-fetch`);
            return await pending;
        }

        // 3. Fresh search (cache miss)
        console.log(`[SmartSearch] 💨 Fresh flight search (Cache Miss)`);
        const results = await searchFlightsAction(params);
        this.handleFlightResults(key, results);
        return results;
    }

    private handleFlightResults(key: string, results: any[]) {
        this.flightCache.set(key, {
            params: key,
            results,
            timestamp: Date.now()
        });
        this.pendingFlightSearches.delete(key);
    }

    private getFlightCacheKey(params: FlightSearchParams): string {
        return `${params.originLocationCode}-${params.destinationLocationCode}-${params.departureDate}-${params.returnDate || ''}-${params.adults}`;
    }
}

export const smartSearch = new SmartSearchManager();
