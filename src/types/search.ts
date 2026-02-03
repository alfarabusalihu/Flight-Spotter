/**
 * Search and Result Data Types
 */

export interface FlightSearchParams {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    adults: string;
    returnDate?: string;
}

export interface CachedFlightResult {
    params: string;
    results: any[];
    timestamp: number;
}
