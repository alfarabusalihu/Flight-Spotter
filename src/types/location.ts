/**
 * Location Data Types
 */

export interface CachedLocation {
    id: string;
    iataCode: string;
    name: string;
    cityName: string;
    countryCode: string;
    subType: string;
    popularity?: number;
    lastUsed?: number;
}

export interface SearchLocation {
    id: string;
    iataCode: string;
    name: string;
    subType: string;
    cityName?: string;
    countryCode?: string;
    address?: {
        cityName?: string;
        countryName?: string;
        countryCode?: string;
    };
}
