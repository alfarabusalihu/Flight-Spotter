import { StateCreator } from 'zustand';
import { FlightStore } from '@/types/store';
import { getFlightInspirationAction, getNearbyAirportsAction, getAirlinesAction } from '@/app/actions/flight';
import { getAIInsightsAction } from '@/app/actions/predict';

export interface DiscoverySlice {
    discoveryDeals: any[];
    nearbyAirports: any[];
    originPOIs: any[];
    destinationPOIs: any[];
    contextHub: string | null;
    lastFetchedDiscovery: number | null;
    fetchDiscoveryDeals: (origin: string, force?: boolean) => Promise<void>;
    fetchNearbyAirports: (lat: number, lon: number) => Promise<void>;
    fetchOriginInsights: (locationName: string, iataCode?: string) => Promise<void>;
    fetchDestinationInsights: (locationName: string, iataCode?: string) => Promise<void>;
    resetSearch: () => void;
}

export const createDiscoverySlice: StateCreator<FlightStore, [], [], DiscoverySlice> = (set, get) => ({
    discoveryDeals: [],
    nearbyAirports: [],
    originPOIs: [],
    destinationPOIs: [],
    contextHub: null,
    lastFetchedDiscovery: null,

    fetchDiscoveryDeals: async (origin, force = false) => {
        if (!origin) return;
        const now = Date.now();
        const lastFetched = get().lastFetchedDiscovery;
        const CACHE_DURATION = 5 * 60 * 1000;

        if (!force && lastFetched && now - lastFetched < CACHE_DURATION) return;

        set({ isDiscoveryLoading: true });
        try {
            const iataCode = origin.includes(" - ") ? origin.split(" - ")[0] : origin.trim().toUpperCase();
            if (iataCode.length !== 3) {
                set({ isDiscoveryLoading: false });
                return;
            }

            let deals = await getFlightInspirationAction(iataCode);
            if ((!deals || deals.length === 0) && iataCode !== 'PAR') {
                deals = await getFlightInspirationAction('PAR');
                set({ contextHub: 'PAR', currency: 'EUR' });
            } else {
                set({ contextHub: null, currency: 'USD' });
            }

            if (deals && deals.length > 0) {
                const codes = Array.from(new Set(deals.map((d: any) => d.airline).filter(Boolean)));
                if (codes.length > 0) {
                    try {
                        const details = await getAirlinesAction(codes.join(','));
                        if (details) {
                            const newAirlines = details.map((a: any) => ({
                                code: a.iataCode,
                                name: a.commonName || a.businessName || a.iataCode
                            }));
                            set(state => ({
                                topAirlines: [...state.topAirlines, ...newAirlines.filter((na: any) => !state.topAirlines.some(ea => ea.code === na.code))]
                            }));
                        }
                    } catch (e) { console.error("[Store] Discovery Airline Resolution Error:", e); }
                }
            }

            set({
                discoveryDeals: deals?.slice(0, 8) || [],
                isDiscoveryLoading: false,
                lastFetchedDiscovery: now
            });
        } catch (error) {
            console.error("[Store] Discovery Fetch Critical Error:", error);
            set({ isDiscoveryLoading: false });
        }
    },

    fetchNearbyAirports: async (lat, lon) => {
        try {
            const data = await getNearbyAirportsAction(lat, lon);
            const airports = data.slice(0, 5);
            set({ nearbyAirports: airports });

            const currentOrigin = get().origin;
            if (!currentOrigin && airports.length > 0) {
                const airport = airports[0];
                const originStr = `${airport.iataCode} - ${airport.name}`;
                set({ origin: originStr, originCode: airport.iataCode } as any);
                get().fetchDiscoveryDeals(airport.iataCode);
                get().fetchOriginInsights(airport.name || airport.iataCode, airport.iataCode);
            }
        } catch (error) { console.error("[Store] Nearby Airports Error:", error); }
    },

    fetchOriginInsights: async (locationName, iataCode) => {
        if (!locationName) return;
        set({ isPOILoading: true, originPOIs: [] });
        try {
            const pois = await getAIInsightsAction(locationName, iataCode);
            set({ originPOIs: pois || [], isPOILoading: false });
        } catch (error) {
            console.error("[Store] Origin Insights Error:", error);
            set({ isPOILoading: false });
        }
    },

    fetchDestinationInsights: async (locationName, iataCode) => {
        if (!locationName) return;
        set({ isPOILoading: true, destinationPOIs: [] });
        try {
            const pois = await getAIInsightsAction(locationName, iataCode);
            set({ destinationPOIs: pois || [], isPOILoading: false });
        } catch (error) {
            console.error("[Store] Destination Insights Error:", error);
            set({ isPOILoading: false });
        }
    },

    resetSearch: () => set({
        origin: "",
        originCode: "",
        destination: "",
        destinationCode: "",
        departureDate: "",
        returnDate: "",
        passengers: 1,
        flightResults: [],
        searchParams: null,
        filters: {
            stops: [],
            maxPrice: 5000,
            airlines: [],
            cabinClass: 'Economy',
        },
        availableCabinClasses: ["Economy"],
    } as any),
});
