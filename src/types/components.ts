/**
 * Component Props Types
 * Centralized type definitions for all component props
 */

// Layout Components
export interface HeaderProps {
    onLogoClick?: () => void;
}

export interface FooterProps {
    // Add footer-specific props if needed
}

// Error Handling
export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}


// Search Components
export interface SearchFormProps {
    // Add search form specific props if needed
}

export interface SearchSectionProps {
    // Add search section specific props if needed
}

export interface SearchGuideProps {
    // Add search guide specific props if needed
}

// Results Components
export interface FlightResultsProps {
    results: any[]; // TODO: Replace with proper Flight type
    isLoading: boolean;
}

export interface ResultsDashboardProps {
    // Add dashboard specific props if needed
}

export interface ResultsDashboardWrapperProps {
    // Add wrapper specific props if needed
}

// Feature Components
export interface TouristPlacesProps {
    // Add tourist places specific props if needed
}

export interface FlightDealsProps {
    // Add flight deals specific props if needed
}

export interface PriceGraphProps {
    // Add price graph specific props if needed
}

export interface SearchFiltersBarProps {
    // Add filters bar specific props if needed
}

// UI Components
export interface ThemeToggleProps {
    // Add theme toggle specific props if needed
}

export interface AuthProps {
    // Add auth specific props if needed
}

export interface AirlinesMarqueeProps {
    // Add airlines marquee specific props if needed
}

export interface HeroProps {
    // Add hero specific props if needed
}
