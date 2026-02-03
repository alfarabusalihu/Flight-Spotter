
import { CachedLocation } from "@/types/location";

const CACHE_KEY = 'flight_spotter_location_cache';
const RECENT_SEARCHES_KEY = 'flight_spotter_recent_searches';
const MAX_RECENT = 10;
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Location Cache Manager
 * Provides instant autocomplete suggestions using localStorage
 */
class LocationCache {
    private cache: CachedLocation[] = [];
    private recentSearches: CachedLocation[] = [];

    constructor() {
        this.initializeCache();
    }

    /**
     * Initialize cache with popular airports and user's recent searches
     */
    private initializeCache(): void {
        if (typeof window === 'undefined') return;

        try {
            // Load from localStorage
            const cachedData = localStorage.getItem(CACHE_KEY);
            const recentData = localStorage.getItem(RECENT_SEARCHES_KEY);

            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                // Check if cache is still valid
                if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL) {
                    this.cache = parsed.locations;
                } else {
                    // Cache expired, start clean
                    this.resetCache();
                }
            } else {
                this.resetCache();
            }

            if (recentData) {
                this.recentSearches = JSON.parse(recentData);
            }
        } catch (error) {
            console.error('[LocationCache] Initialization error:', error);
            this.resetCache();
        }
    }

    /**
     * Reset cache to empty (Pure Amadeus logic)
     */
    private resetCache(): void {
        this.cache = [];
        this.saveCache();
    }

    /**
     * Save cache to localStorage
     */
    private saveCache(): void {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                locations: this.cache
            }));
        } catch (error) {
            console.error('[LocationCache] Save error:', error);
        }
    }

    /**
     * Save recent searches to localStorage
     */
    private saveRecentSearches(): void {
        try {
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches));
        } catch (error) {
            console.error('[LocationCache] Save recent searches error:', error);
        }
    }

    /**
     * Search cached locations with fuzzy matching
     */
    search(query: string): CachedLocation[] {
        if (!query || query.length === 0) {
            // Return recent searches + popular airports
            const combined = [...this.recentSearches];
            const popularNotInRecent = this.cache
                .filter(loc => !this.recentSearches.some(r => r.iataCode === loc.iataCode))
                .slice(0, 10);
            return [...combined, ...popularNotInRecent];
        }

        const normalizedQuery = query.toLowerCase().trim();

        // Search in cache
        const results = this.cache.filter(loc => {
            const searchableText = `${loc.name} ${loc.cityName} ${loc.iataCode} ${loc.countryCode}`.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });

        // Sort by relevance
        return results.sort((a, b) => {
            // Prioritize IATA code matches
            const aCodeMatch = a.iataCode.toLowerCase().startsWith(normalizedQuery);
            const bCodeMatch = b.iataCode.toLowerCase().startsWith(normalizedQuery);
            if (aCodeMatch && !bCodeMatch) return -1;
            if (!aCodeMatch && bCodeMatch) return 1;

            // Then by city name matches
            const aCityMatch = a.cityName.toLowerCase().startsWith(normalizedQuery);
            const bCityMatch = b.cityName.toLowerCase().startsWith(normalizedQuery);
            if (aCityMatch && !bCityMatch) return -1;
            if (!aCityMatch && bCityMatch) return 1;

            // Finally by popularity
            return (b.popularity || 0) - (a.popularity || 0);
        });
    }

    /**
     * Add location to cache (from API results)
     */
    addToCache(location: any): void {
        const cached: CachedLocation = {
            id: location.id,
            iataCode: location.iataCode,
            name: location.name,
            cityName: location.address?.cityName || location.cityName || '',
            countryCode: location.address?.countryCode || location.countryCode || '',
            subType: location.subType,
            popularity: 0,
            lastUsed: Date.now()
        };

        // Check if already exists
        const existingIndex = this.cache.findIndex(loc => loc.iataCode === cached.iataCode);
        if (existingIndex === -1) {
            this.cache.push(cached);
            this.saveCache();
        }
    }

    /**
     * Add location to recent searches
     */
    addToRecent(location: CachedLocation): void {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(
            loc => loc.iataCode !== location.iataCode
        );

        // Add to front
        this.recentSearches.unshift({
            ...location,
            lastUsed: Date.now()
        });

        // Keep only MAX_RECENT
        this.recentSearches = this.recentSearches.slice(0, MAX_RECENT);
        this.saveRecentSearches();
    }

    /**
     * Get recent searches
     */
    getRecentSearches(): CachedLocation[] {
        return this.recentSearches;
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.resetCache();
        this.recentSearches = [];
        this.saveRecentSearches();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            totalCached: this.cache.length,
            recentSearches: this.recentSearches.length,
            cacheSize: new Blob([JSON.stringify(this.cache)]).size
        };
    }
}

// Singleton instance
export const locationCache = new LocationCache();
