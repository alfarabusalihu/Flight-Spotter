/**
 * Location Cache System
 * Provides instant autocomplete suggestions using in-memory cache only
 * No persistence - cache clears on page refresh
 */

import { CachedLocation } from "@/types/location";

const MAX_RECENT = 10;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

class LocationCache {
    private cache: CachedLocation[] = [];
    private recentSearches: CachedLocation[] = [];
    private cacheTimestamp: number = Date.now();

    constructor() {
        // Pure in-memory cache - no localStorage
    }

    /**
     * Get cached locations matching a keyword
     */
    search(keyword: string): CachedLocation[] {
        // Check if cache is expired
        if (Date.now() - this.cacheTimestamp > CACHE_TTL) {
            this.cache = [];
            this.cacheTimestamp = Date.now();
        }

        const normalized = keyword.toLowerCase().trim();
        if (!normalized) return this.recentSearches;

        return this.cache.filter(loc =>
            loc.name.toLowerCase().includes(normalized) ||
            loc.iataCode.toLowerCase().includes(normalized) ||
            loc.address?.cityName?.toLowerCase().includes(normalized)
        );
    }

    /**
     * Add locations to cache
     */
    add(locations: CachedLocation[]): void {
        // Merge with existing cache, avoiding duplicates
        const existingCodes = new Set(this.cache.map(l => l.iataCode));
        const newLocations = locations.filter(l => !existingCodes.has(l.iataCode));

        this.cache = [...this.cache, ...newLocations];
        this.cacheTimestamp = Date.now();
    }

    /**
     * Add to recent searches
     */
    addRecent(location: CachedLocation): void {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(
            loc => loc.iataCode !== location.iataCode
        );

        // Add to front
        this.recentSearches.unshift(location);

        // Keep only last MAX_RECENT
        if (this.recentSearches.length > MAX_RECENT) {
            this.recentSearches = this.recentSearches.slice(0, MAX_RECENT);
        }
    }

    /**
     * Get recent searches
     */
    getRecent(): CachedLocation[] {
        return this.recentSearches;
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache = [];
        this.recentSearches = [];
        this.cacheTimestamp = Date.now();
    }

    /**
     * Reset cache (for testing)
     */
    private resetCache(): void {
        this.clear();
    }
}

export const locationCache = new LocationCache();
