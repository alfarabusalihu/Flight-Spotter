import { StateCreator } from 'zustand';
import { FlightStore } from '@/types/store';
import { SUPPORTED_CURRENCIES } from '@/constants/localizationData';

export interface LocalizationSlice {
    currency: string;
    language: string;
    exchangeRates: Record<string, number>;
    translations: Record<string, string>;
    setCurrency: (currency: string) => void;
    setLanguage: (lang: string) => Promise<void>;
    fetchRates: () => Promise<void>;
    t: (text: string) => string;
    formatPrice: (amount: number | string) => string;
}

export const createLocalizationSlice: StateCreator<FlightStore, [], [], LocalizationSlice> = (set, get) => ({
    currency: "USD",
    language: "en",
    exchangeRates: {},
    translations: {},

    setCurrency: (currency) => set({ currency }),

    setLanguage: async (lang) => {
        set({ language: lang });
        if (lang === 'en') {
            set({ translations: {} });
            return;
        }

        try {
            const { translateContentAction } = await import('@/app/actions/localization');
            const coreKeys = [
                "Flights Found", "From", "Quick Filters", "Price Range",
                "Stops", "Airlines", "Cabin Class", "Search Flights",
                "Where to next, explorer?", "Select your origin and destination above"
            ];
            const translations = await translateContentAction(lang, coreKeys);
            set(state => ({ translations: { ...state.translations, ...translations } }));
        } catch (e) {
            console.error("[Store] Translation Error:", e);
        }
    },

    fetchRates: async () => {
        const { getCurrencyRatesAction } = await import('@/app/actions/localization');
        const rates = await getCurrencyRatesAction();
        set({ exchangeRates: rates });
    },

    t: (text) => {
        const trans = get().translations;
        return trans[text] || text;
    },

    formatPrice: (amount) => {
        const { currency, exchangeRates } = get();
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(num)) return "--";

        const rate = exchangeRates[currency] || 1;
        const converted = Math.round(num * rate);

        const curInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
        const sym = curInfo?.symbol || currency;

        return `${sym}${converted.toLocaleString()}`;
    },
});
