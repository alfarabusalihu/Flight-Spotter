/**
 * Centralized Localization Constants
 * Used for fallbacks and UI labels throughout the app.
 */

export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
    flag?: string;
}

export interface LanguageInfo {
    code: string;
    label: string;
    nativeLabel: string;
    flag?: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
    { code: 'fr', label: 'French', nativeLabel: 'Français' },
    { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
    { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
    { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
    { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
    { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
    { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
];

// Fallback rates if API fails
export const FALLBACK_RATES: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.0,
    AED: 3.67,
    JPY: 148.0,
    CNY: 7.19,
    AUD: 1.52,
    CAD: 1.35,
    BRL: 4.95,
};
