import type { ErrorType } from '@/components/SearchErrorDisplay';
import { CachedLocation } from './location';

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
}

export interface FilterState {
    stops: number[];
    maxPrice: number;
    airlines: string[];
    cabinClass: string;
}

export interface AirlineInfo {
    name: string;
    code: string;
}

export interface FlightStoreState {
    // Search Parameters
    origin: string;
    originCode: string;
    destination: string;
    destinationCode: string;
    departureDate: string;
    returnDate: string;
    passengers: number;

    // Results & Entities
    discoveryDeals: any[];
    nearbyAirports: any[];
    topAirlines: AirlineInfo[];
    priceTrends: any[];
    originPOIs: any[];
    destinationPOIs: any[];
    searchParams: any | null;
    flightResults: any[];
    contextHub: string | null;
    currency: string;
    language: string;
    exchangeRates: Record<string, number>;
    translations: Record<string, string>;
    viewMode: 'landing' | 'searching' | 'results';

    // UI & Loading
    isDiscoveryLoading: boolean;
    isSearchLoading: boolean;
    isPOILoading: boolean;
    availableCabinClasses: string[];
    lastFetchedDiscovery: number | null;
    retrievedLocations: any[];
    searchError: ErrorType | null;
    errorMessage: string | null;
    locationError: string | null;

    // Logic State
    sortBy: 'price' | 'duration' | 'best';
    sortOrder: 'asc' | 'desc';
    pagination: PaginationState;
    filters: FilterState;
}

export interface FlightStoreActions {
    updateSearchParam: (key: 'origin' | 'destination' | 'departureDate' | 'returnDate' | 'passengers' | 'originCode' | 'destinationCode', value: any) => void;
    updateFilters: (filters: Partial<FilterState>) => void;
    setSearchParams: (params: any) => void;
    setFlightResults: (results: any[]) => void;
    fetchDiscoveryDeals: (origin: string, force?: boolean) => Promise<void>;
    fetchNearbyAirports: (lat: number, lon: number) => Promise<void>;
    fetchTopAirlines: (origin: string, destination?: string) => Promise<void>;
    fetchOriginInsights: (locationName: string, iataCode?: string) => Promise<void>;
    fetchDestinationInsights: (locationName: string, iataCode?: string) => Promise<void>;
    detectUserLocation: () => Promise<void>;
    searchFlights: (params: any) => Promise<void>;
    fetchAIPriceTrends: (origin: string, destination: string, currentPrice: number) => Promise<void>;
    getFilteredFlights: () => any[];
    resetSearch: () => void;
    setCurrency: (currency: string) => void;
    setLanguage: (lang: string) => Promise<void>;
    fetchRates: () => Promise<void>;
    t: (text: string) => string;
    formatPrice: (amount: number | string) => string;
    setRetrievedLocations: (locations: any[]) => void;
    updateSort: (sortBy: FlightStoreState['sortBy'], sortOrder: FlightStoreState['sortOrder']) => void;
    updatePagination: (page: number) => void;
    getPaginatedFlights: () => any[];
    setSearchError: (error: ErrorType | null, message?: string) => void;
    clearError: () => void;
    clearLocationError: () => void;
    setViewMode: (mode: FlightStoreState['viewMode']) => void;
    processFlightResults: (results: any[], params: any) => Promise<void>;
}

export type FlightStore = FlightStoreState & FlightStoreActions;
