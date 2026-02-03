/**
 * Flight Data Types
 * Type definitions for flight-related data structures
 */

export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

export interface Airline {
    code: string;
    name: string;
    logo?: string;
}

export interface FlightSegment {
    departure: {
        airport: Airport;
        time: string;
        terminal?: string;
    };
    arrival: {
        airport: Airport;
        time: string;
        terminal?: string;
    };
    airline: Airline;
    flightNumber: string;
    duration: string;
    aircraft?: string;
}

export interface Flight {
    id: string;
    segments: FlightSegment[];
    price: {
        amount: number;
        currency: string;
    };
    totalDuration: string;
    stops: number;
    bookingUrl?: string;
}

export interface SearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    class: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface FilterOptions {
    maxPrice?: number;
    airlines?: string[];
    stops?: number[];
    departureTime?: {
        start: string;
        end: string;
    };
    arrivalTime?: {
        start: string;
        end: string;
    };
}

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}
