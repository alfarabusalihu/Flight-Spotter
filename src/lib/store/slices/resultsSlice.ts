import { StateCreator } from 'zustand';
import { FlightStore, FilterState, PaginationState, AirlineInfo } from '@/types/store';
import { smartSearch } from '../../smartSearch';
import { predictPriceTrendsAction, getAIInsightsAction } from '@/app/actions/predict';
import { getAirlinesAction } from '@/app/actions/flight';

export interface ResultsSlice {
    flightResults: any[];
    searchParams: any | null;
    priceTrends: any[];
    topAirlines: AirlineInfo[];
    availableCabinClasses: string[];
    sortBy: 'price' | 'duration' | 'best';
    sortOrder: 'asc' | 'desc';
    pagination: PaginationState;
    filters: FilterState;

    setFlightResults: (results: any[]) => void;
    setSearchParams: (params: any) => void;
    searchFlights: (params: any) => Promise<void>;
    updateFilters: (filters: Partial<FilterState>) => void;
    updateSort: (sortBy: 'price' | 'duration' | 'best', sortOrder: 'asc' | 'desc') => void;
    updatePagination: (page: number) => void;
    getFilteredFlights: () => any[];
    getPaginatedFlights: () => any[];
    fetchAIPriceTrends: (origin: string, destination: string, currentPrice: number) => Promise<void>;
    processFlightResults: (results: any[], params: any) => Promise<void>;
    fetchTopAirlines: (origin: string, destination?: string) => Promise<void>;
}

export const createResultsSlice: StateCreator<FlightStore, [], [], ResultsSlice> = (set, get) => ({
    flightResults: [],
    searchParams: null,
    priceTrends: [],
    topAirlines: [],
    availableCabinClasses: ["Economy"],
    sortBy: 'price',
    sortOrder: 'asc',
    pagination: {
        currentPage: 1,
        itemsPerPage: 10
    },
    filters: {
        stops: [],
        maxPrice: 5000,
        airlines: [],
        cabinClass: 'Economy',
    },

    setFlightResults: (results) => set({ flightResults: results }),
    setSearchParams: (params) => set({ searchParams: params }),

    searchFlights: async (params) => {
        set({
            isSearchLoading: true,
            searchParams: params,
            searchError: null,
            errorMessage: null,
            flightResults: [],
            priceTrends: []
        });
        console.info(`%c[Store] 🛫 Executing Smart Search: ${params.originLocationCode} ➝ ${params.destinationLocationCode}`, "color: #38bdf8; font-weight: bold;");

        try {
            const results = await smartSearch.getOrFetchFlights({
                originLocationCode: params.originLocationCode,
                destinationLocationCode: params.destinationLocationCode,
                departureDate: params.departureDate,
                adults: params.adults,
                returnDate: params.returnDate
            });

            if (!results || results.length === 0) {
                set({
                    searchError: 'no_flights_found',
                    errorMessage: 'No flights available for this route and dates',
                    flightResults: [],
                    isSearchLoading: false
                });
                return;
            }

            set({
                flightResults: results || [],
                isSearchLoading: false,
                pagination: { ...get().pagination, currentPage: 1 },
                searchError: null
            });

            await get().processFlightResults(results, {
                originLocationCode: params.originLocationCode,
                destinationLocationCode: params.destinationLocationCode
            });

        } catch (error: any) {
            console.error("[Store] Flight Search Critical Error:", error);
            let errorType = 'api_error';
            if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
                errorType = 'network_error';
            }
            set({
                isSearchLoading: false,
                searchError: errorType as any,
                errorMessage: error?.message || 'An error occurred while searching for flights'
            });
        }
    },

    updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),

    updateSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

    updatePagination: (page) => set((state) => ({
        pagination: { ...state.pagination, currentPage: page }
    })),

    getFilteredFlights: () => {
        const { flightResults, filters, sortBy, sortOrder } = get();
        if (!flightResults) return [];

        return flightResults.filter((flight) => {
            const price = parseFloat(flight.price?.total || flight.price?.amount || flight.price || "0");
            if (price > filters.maxPrice) return false;

            const isSearchRes = !!flight.itineraries;
            if (isSearchRes && filters.stops.length > 0) {
                const stops = (flight.itineraries[0]?.segments?.length || 1) - 1;
                if (!filters.stops.includes(stops)) return false;
            }

            if (filters.airlines.length > 0) {
                const validating = flight.validatingAirlineCodes?.[0];
                const operating = flight.itineraries?.[0]?.segments?.[0]?.carrierCode;
                if (!filters.airlines.includes(validating) && !filters.airlines.includes(operating)) {
                    return false;
                }
            }

            if (filters.cabinClass !== 'Economy') {
                const cabin = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin;
                if (cabin !== filters.cabinClass) return false;
            }

            return true;
        }).sort((a, b) => {
            const factor = sortOrder === 'asc' ? 1 : -1;
            if (sortBy === 'price') {
                const priceA = parseFloat(a.price?.total || a.price?.amount || "0");
                const priceB = parseFloat(b.price?.total || b.price?.amount || "0");
                return (priceA - priceB) * factor;
            }
            if (sortBy === 'duration') {
                const getDuration = (f: any) => f.itineraries?.[0]?.duration || "";
                return (getDuration(a).localeCompare(getDuration(b))) * factor;
            }
            return 0;
        });
    },

    getPaginatedFlights: () => {
        const filtered = get().getFilteredFlights();
        const { currentPage, itemsPerPage } = get().pagination;
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filtered.slice(startIndex, startIndex + itemsPerPage);
    },

    fetchAIPriceTrends: async (origin, destination, currentPrice) => {
        try {
            console.log(`[Store] Fetching AI Price Trends for: ${origin} -> ${destination} (Base: ${currentPrice})`);
            const trends = await predictPriceTrendsAction(origin, destination, currentPrice);

            if (trends && trends.length > 0) {
                set({ priceTrends: trends });
            } else {
                const failSafeTrends = Array.from({ length: 14 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const variation = 1 + (Math.random() * 0.3 - 0.1);
                    return {
                        date: date.toISOString().split('T')[0],
                        price: Math.round(currentPrice * variation)
                    };
                });
                set({ priceTrends: failSafeTrends });
            }
        } catch (error) {
            console.error("[Store] AI Price Trend Error:", error);
            const date = new Date();
            set({ priceTrends: [{ date: date.toISOString().split('T')[0], price: currentPrice }] });
        }
    },

    processFlightResults: async (results, params) => {
        if (!results || results.length === 0) return;
        console.log(`[Store] ⚙️ Processing ${results.length} results for filters & trends...`);

        const uniqueCarrierCodes = new Set<string>();
        results.forEach((f: any) => {
            if (f.validatingAirlineCodes?.[0]) uniqueCarrierCodes.add(f.validatingAirlineCodes[0]);
            if (f.airline) uniqueCarrierCodes.add(f.airline);
            f.itineraries?.forEach((it: any) => {
                it.segments?.forEach((seg: any) => {
                    if (seg.carrierCode) uniqueCarrierCodes.add(seg.carrierCode);
                });
            });
        });

        const carrierList = Array.from(uniqueCarrierCodes).filter(Boolean);
        const resultsCabinClasses: string[] = [...new Set(results.flatMap((f: any) =>
            f.travelerPricings?.[0]?.fareDetailsBySegment?.map((seg: any) => seg.cabin) || []
        ))].filter(Boolean) as string[];

        set({
            availableCabinClasses: resultsCabinClasses.length > 0 ? resultsCabinClasses : ["Economy"]
        });

        if (carrierList.length > 0) {
            const carrierStr = carrierList.join(',');
            try {
                const airlineData = await getAirlinesAction(carrierStr);
                const existingAirlines = airlineData || [];
                const mapped = carrierList.map(code => {
                    const match = existingAirlines.find((a: any) => a.iataCode === code);
                    return {
                        code,
                        name: match ? (match.commonName || match.businessName || code) : code
                    };
                });
                set({ topAirlines: mapped });
            } catch (e) {
                set({ topAirlines: carrierList.map(code => ({ code, name: code })) });
            }
        }

        const prices = results.map((f: any) => parseFloat(f.price?.total || f.price?.amount || 0));
        const cheapest = prices.length > 0 ? Math.min(...prices) : 0;
        if (cheapest > 0 && params.originLocationCode && params.destinationLocationCode) {
            get().fetchAIPriceTrends(params.originLocationCode, params.destinationLocationCode, cheapest);
        }
    },

    fetchTopAirlines: async (origin, destination) => {
        console.log(`[Store] Fetching Carriers for ${origin} -> ${destination || 'Anywhere'}`);
    },
});
