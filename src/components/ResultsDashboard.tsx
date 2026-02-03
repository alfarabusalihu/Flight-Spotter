"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchFiltersBar from "./SearchFiltersBar";
import FlightResults from "./FlightResults";
import PriceGraph from "./PriceGraph";
import TouristPlaces from "./TouristPlaces";
import { useFlightStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

export default function ResultsDashboard() {
    const {
        flightResults,
        isSearchLoading,
        pagination,
        getPaginatedFlights,
        updatePagination
    } = useFlightStore();

    const paginatedResults = getPaginatedFlights ? getPaginatedFlights() : flightResults.slice(0, 10);
    const totalPages = Math.ceil(flightResults.length / pagination.itemsPerPage);

    if (flightResults.length === 0) {
        return null;
    }

    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen pt-8"
        >

            {/* Results Grid - Featured Layout */}
            <div className="w-full max-w-[1600px] mx-auto px-fluid py-8 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">

                {/* Results List */}
                <div className="space-y-6">
                    <FlightResults
                        results={paginatedResults}
                        isLoading={isSearchLoading}
                    />

                    {/* EEAT Trust Marker */}
                    {!isSearchLoading && (
                        <div className="flex items-center gap-2 p-4 bg-dark-cyan/5 rounded-[2rem] border border-dark-cyan/10">
                            <div className="w-8 h-8 rounded-full bg-dark-cyan/10 flex items-center justify-center">
                                <span className="text-xs">✨</span>
                            </div>
                            <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
                                AI-Powered Insights • Verified by Amadeus Global Data Hub
                            </p>
                        </div>
                    )}

                    {/* Enhanced Pagination Controls */}
                    {!isSearchLoading && totalPages > 1 && (
                        <div className="flex flex-col items-center gap-4 mt-8 py-8 border-t border-silver/10">
                            <div className="flex items-center gap-1">
                                <Button
                                    onClick={() => updatePagination(Math.max(1, pagination.currentPage - 1))}
                                    disabled={pagination.currentPage === 1}
                                    variant="ghost"
                                    size="icon"
                                    className="bg-dark-cyan/5 text-foreground hover:bg-dark-cyan/10 rounded-xl"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        const cur = pagination.currentPage;
                                        return page === 1 || page === totalPages || (page >= cur - 1 && page <= cur + 1);
                                    })
                                    .map((page, i, arr) => {
                                        const showEllipsis = i > 0 && page - arr[i - 1] > 1;
                                        return (
                                            <div key={page} className="flex items-center">
                                                {showEllipsis && <span className="px-2 text-silver text-xs">...</span>}
                                                <Button
                                                    onClick={() => updatePagination(page)}
                                                    variant={pagination.currentPage === page ? "default" : "ghost"}
                                                    size="icon"
                                                    className={`rounded-xl font-bold text-sm ${pagination.currentPage === page
                                                        ? 'bg-dark-cyan text-white shadow-lg shadow-dark-cyan/20 hover:bg-dark-cyan'
                                                        : 'bg-transparent text-silver hover:bg-dark-cyan/5 hover:text-dark-cyan'
                                                        }`}
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        );
                                    })}

                                <Button
                                    onClick={() => updatePagination(Math.min(totalPages, pagination.currentPage + 1))}
                                    disabled={pagination.currentPage === totalPages}
                                    variant="ghost"
                                    size="icon"
                                    className="bg-dark-cyan/5 text-foreground hover:bg-dark-cyan/10 rounded-xl"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-silver font-bold uppercase tracking-widest">
                                Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, flightResults.length)} of {flightResults.length} flights
                            </p>
                        </div>
                    )}
                </div>

                {/* Vertical Visualizer Column */}
                <div className="w-full hidden lg:block h-full">
                    <div className="sticky top-28 space-y-8 overflow-y-auto max-h-[calc(100vh-8rem)] pb-8 no-scrollbar">
                        <PriceGraph />
                        <TouristPlaces />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
