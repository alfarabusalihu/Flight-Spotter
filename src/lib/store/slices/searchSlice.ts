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
    locationError: string | null;
    updateSearchParam: (key: 'origin' | 'destination' | 'departureDate' | 'returnDate' | 'passengers' | 'originCode' | 'destinationCode', value: any) => void;
    setRetrievedLocations: (locations: any[]) => void;
    detectUserLocation: () => Promise<void>;
    clearLocationError: () => void;
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
    locationError: null,

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

    clearLocationError: () => set({ locationError: null }),

    detectUserLocation: async () => {
        get().clearLocationError();

        if (!navigator.geolocation) {
            set({ locationError: "Geolocation not supported by this browser." });
            return;
        }

        // Auth guard - defensive programming
        if (typeof window !== 'undefined') {
            const { auth } = await import('@/lib/firebase');
            const { onAuthStateChanged } = await import('firebase/auth');

            const isAuthenticated = await new Promise<boolean>((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe();
                    resolve(!!user);
                });
            });

            if (!isAuthenticated) {
                console.warn('[Store] Location detection requires authentication. User must sign in first.');
                return;
            }
        }

        try {
            const { getNearbyAirportsAction } = await import('@/app/actions/flight');
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const airports = await getNearbyAirportsAction(pos.coords.latitude, pos.coords.longitude);
            console.log(`%c[GEOLOCATION] OS Coordinates: ${pos.coords.latitude}, ${pos.coords.longitude}`, "color: #fbbf24; font-weight: bold;");

            if (airports && airports.length > 0) {
                const airport = airports[0];
                // Paranoia check for valid object
                if (!airport) {
                    console.warn('[Store] Nearest airport entry is invalid/null', airports);
                    set({ locationError: "Unable to identify a valid nearby airport." });
                    return;
                }
                const originStr = `${airport.iataCode} - ${airport.name}`;
                console.info(`[STORE] Nearest airport detected: ${originStr}`);

                set({
                    origin: originStr,
                    originCode: airport.iataCode
                } as any);

                const cityName = airport.name || originStr.split(' - ')[1] || originStr;
                await get().fetchOriginInsights(cityName, airport.iataCode);
                await get().fetchDiscoveryDeals(airport.iataCode);
            } else {
                set({ locationError: "No supported airports found near your location." });
            }
        } catch (error) {
            // Improved error logging
            const msg = error instanceof Error ? error.message : "Unknown error detected.";
            console.error("[Store] Location detection error:", msg);
            set({ locationError: "Location access denied or unavailable." });
            if (error instanceof Error && error.stack) {
                console.error(error.stack);
            }
        }
    },
});
