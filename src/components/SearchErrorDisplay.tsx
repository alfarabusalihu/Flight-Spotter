"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, XCircle, Wifi, Calendar, Plane, MapPin, ArrowRight } from "lucide-react";

export type ErrorType =
    | "no_flights_found"
    | "invalid_route"
    | "api_error"
    | "network_error"
    | "invalid_dates"
    | "sandbox_limitation";

interface SearchErrorDisplayProps {
    type: ErrorType;
    origin?: string;
    destination?: string;
    departureDate?: string;
    onDismiss?: () => void;
    onRetry?: () => void;
}

const errorConfig = {
    no_flights_found: {
        icon: Plane,
        title: "No Flights Available",
        color: "text-amber-500",
        bgColor: "bg-amber-500/[0.08]",
        borderColor: "border-amber-500/20",
        getMessage: (origin?: string, destination?: string) =>
            `No flights found from ${origin || 'origin'} to ${destination || 'destination'} for the selected dates.`,
        suggestions: [
            "Try selecting different dates (±3 days)",
            "Check nearby airports",
            "Consider connecting flights"
        ]
    },
    invalid_route: {
        icon: MapPin,
        title: "Route Not Available",
        color: "text-orange-500",
        bgColor: "bg-orange-500/[0.08]",
        borderColor: "border-orange-500/20",
        getMessage: () => "This route is not currently serviced by any airlines.",
        suggestions: [
            "Try a major hub airport nearby",
            "Search for multi-city routes",
            "Check alternative destinations"
        ]
    },
    api_error: {
        icon: AlertCircle,
        title: "Service Temporarily Unavailable",
        color: "text-red-500",
        bgColor: "bg-red-500/[0.08]",
        borderColor: "border-red-500/20",
        getMessage: () => "We're having trouble connecting to the flight search service.",
        suggestions: [
            "Please try again in a moment",
            "Check your internet connection",
            "Contact support if issue persists"
        ]
    },
    network_error: {
        icon: Wifi,
        title: "Connection Issue",
        color: "text-purple-500",
        bgColor: "bg-purple-500/[0.08]",
        borderColor: "border-purple-500/20",
        getMessage: () => "Unable to connect to the internet.",
        suggestions: [
            "Check your network connection",
            "Try again when online",
            "Some cached results may be available"
        ]
    },
    invalid_dates: {
        icon: Calendar,
        title: "Invalid Date Selection",
        color: "text-blue-500",
        bgColor: "bg-blue-500/[0.08]",
        borderColor: "border-blue-500/20",
        getMessage: () => "Please select valid travel dates.",
        suggestions: [
            "Departure date must be in the future",
            "Return date must be after departure",
            "Dates must be within 330 days"
        ]
    },
    sandbox_limitation: {
        icon: XCircle,
        title: "Test Mode Limitation",
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/[0.08]",
        borderColor: "border-cyan-500/20",
        getMessage: () => "This route is only available in production mode.",
        suggestions: [
            "Try routes within Europe (FR, ES, GB, DE, NL)",
            "Popular test routes: Paris ↔ Madrid, London ↔ Amsterdam",
            "Full route coverage available in production"
        ]
    }
};

export default function SearchErrorDisplay({
    type,
    origin,
    destination,
    departureDate,
    onDismiss,
    onRetry
}: SearchErrorDisplayProps) {
    const config = errorConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={`mt-6 rounded-3xl border ${config.borderColor} ${config.bgColor} p-6 backdrop-blur-md`}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${config.bgColor} flex items-center justify-center border ${config.borderColor}`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-display font-black ${config.color} mb-1.5`}>
                        {config.title}
                    </h3>

                    <p className="text-sm font-medium text-foreground/60 mb-4 max-w-2xl">
                        {config.getMessage(origin, destination)}
                    </p>

                    {/* Route Info */}
                    {origin && destination && (
                        <div className="flex items-center gap-2 mb-5 text-[10px] font-black uppercase tracking-widest bg-foreground/5 dark:bg-white/5 p-3 rounded-2xl border border-foreground/5 w-fit">
                            <span className="text-foreground/80">{origin}</span>
                            <ArrowRight className="w-3 h-3 text-dark-cyan-light" />
                            <span className="text-foreground/80">{destination}</span>
                            {departureDate && (
                                <>
                                    <span className="text-foreground/20 mx-1">•</span>
                                    <span className="text-foreground/40">{departureDate}</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Suggestions */}
                    <div className="space-y-3 bg-white/40 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5">
                        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">
                            💡 Suggestions
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            {config.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2 text-xs text-foreground/60 font-medium">
                                    <span className={`w-1 h-1 rounded-full mt-1.5 ${config.color} opacity-40`} />
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest ${config.color} bg-white dark:bg-white/10 hover:shadow-xl hover:shadow-black/5 transition-all border ${config.borderColor}`}
                            >
                                Try Again
                            </button>
                        )}
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all"
                            >
                                Dismiss
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
