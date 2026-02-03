import { StateCreator } from 'zustand';
import { FlightStore } from '@/types/store';
import { smartSearch } from '../../smartSearch';

export interface SearchSlice {
    origin: string;
    originCode: string;
    destination: string;
    destinationCode: string;
    departureDate: string;
    returnDate: string;
    passengers: number;
    retrievedLocations: any[];
    updateSearchParam: (key: 'origin' | 'destination' | 'departureDate' | 'returnDate' | 'passengers' | 'originCode' | 'destinationCode', value: any) => void;
    setRetrievedLocations: (locations: any[]) => void;
    detectUserLocation: () => Promise<void>;
}

export const createSearchSlice: StateCreator<FlightStore, [], [], SearchSlice> = (set, get) => ({
    origin: "",
    originCode: "",
    destination: "",
    destinationCode: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    retrievedLocations: [],

    updateSearchParam: (key, value) => {
        set({ [key]: value } as any);
        if (key === 'destination' && value && value.length > 2) {
            const cityName = value.split(' - ')[0] || value;
            get().fetchDestinationInsights(cityName, get().destinationCode);
        } else if (key === 'destinationCode' && value && value.length === 3) {
            const cityName = get().destination.split(' - ')[0] || get().destination;
            get().fetchDestinationInsights(cityName || value, value);
        }
    },

    setRetrievedLocations: (locations) => set({ retrievedLocations: locations }),

    detectUserLocation: async () => {
        if (!navigator.geolocation) return;
        try {
            const { getNearbyAirportsAction } = await import('@/app/actions/flight');
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const airports = await getNearbyAirportsAction(pos.coords.latitude, pos.coords.longitude);
            console.log(`%c[GEOLOCATION] OS Coordinates: ${pos.coords.latitude}, ${pos.coords.longitude}`, "color: #fbbf24; font-weight: bold;");

            if (airports && airports.length > 0) {
                const airport = airports[0];
                const originStr = `${airport.iataCode} - ${airport.name}`;
                console.info(`[STORE] Nearest airport detected: ${originStr}`);

                set({
                    origin: originStr,
                    originCode: airport.iataCode
                } as any);

                const cityName = airport.name || originStr.split(' - ')[1] || originStr;
                await get().fetchOriginInsights(cityName, airport.iataCode);
                await get().fetchDiscoveryDeals(airport.iataCode);
            }
        } catch (error) {
            console.error("[Store] Location detection error:", error);
        }
    },
});
