import { create } from 'zustand';
import { FlightStore } from '@/types/store';
import { smartSearch } from './smartSearch';

import { createUISlice } from './store/slices/uiSlice';
import { createLocalizationSlice } from './store/slices/localizationSlice';
import { createSearchSlice } from './store/slices/searchSlice';
import { createResultsSlice } from './store/slices/resultsSlice';
import { createDiscoverySlice } from './store/slices/discoverySlice';

/**
 * Global Flight Store
 * Assembled from modular slices for better maintainability and code partitioning.
 */
export const useFlightStore = create<FlightStore>((...a) => ({
    ...createUISlice(...a),
    ...createLocalizationSlice(...a),
    ...createSearchSlice(...a),
    ...createResultsSlice(...a),
    ...createDiscoverySlice(...a),
}));

// Register SmartSearch listener to push background results instantly to the UI
smartSearch.onResults((results, params) => {
    console.log(`[Store] 📥 Auto-populating store with ${results.length} pre-fetched flights`);

    const store = useFlightStore.getState();

    // Explicitly update search params and results
    store.setFlightResults(results);
    store.setSearchParams(params);

    // Update loading and error states
    useFlightStore.setState({
        isSearchLoading: false,
        searchError: null,
        pagination: { ...store.pagination, currentPage: 1 }
    } as any);

    // Run the consolidated post-processing
    store.processFlightResults(results, {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode
    });
});
