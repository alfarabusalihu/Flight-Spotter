import { StateCreator } from 'zustand';
import { FlightStore } from '@/types/store';

export interface UISlice {
    viewMode: 'landing' | 'searching' | 'results';
    isDiscoveryLoading: boolean;
    isSearchLoading: boolean;
    isPOILoading: boolean;
    searchError: any;
    errorMessage: string | null;
    setViewMode: (mode: 'landing' | 'searching' | 'results') => void;
    setSearchError: (error: any, message?: string) => void;
    clearError: () => void;
}

export const createUISlice: StateCreator<FlightStore, [], [], UISlice> = (set) => ({
    viewMode: 'landing',
    isDiscoveryLoading: false,
    isSearchLoading: false,
    isPOILoading: false,
    searchError: null,
    errorMessage: null,

    setViewMode: (mode) => set({ viewMode: mode }),
    setSearchError: (error, message) => set({ searchError: error, errorMessage: message || null }),
    clearError: () => set({ searchError: null, errorMessage: null }),
});
