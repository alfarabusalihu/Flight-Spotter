// ... imports
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BarChart2, List } from "lucide-react";
import FlightResults from "./FlightResults";
import PriceGraph from "./PriceGraph";
import TouristPlaces from "./TouristPlaces";
import { useFlightStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function ResultsDashboard() {
    const {
        flightResults,
        isSearchLoading,
        pagination,
        getPaginatedFlights,
        updatePagination,
        screenSize // Assuming added to store
    } = useFlightStore();

    const [mobileView, setMobileView] = useState<'flights' | 'insights'>('flights');

    const paginatedResults = getPaginatedFlights ? getPaginatedFlights() : flightResults.slice(0, 10);
    const totalPages = Math.ceil(flightResults.length / pagination.itemsPerPage);

    if (flightResults.length === 0) {
        return null;
    }

    // Toggle function for mobile
    const toggleMobileView = () => {
        setMobileView(prev => prev === 'flights' ? 'insights' : 'flights');
    };

    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen pt-8"
        >
            {/* Mobile View Toggle (Visible only on lg and below) */}
            <div className="lg:hidden w-full px-fluid mb-6">
                <div className="flex bg-background/50 backdrop-blur-sm p-1 rounded-full border border-silver/10 relative">
                    {/* Sliding Background Pill */}
                    <motion.div
                        className="absolute top-1 bottom-1 bg-dark-cyan rounded-full shadow-sm z-0"
                        initial={false}
                        animate={{
                            left: mobileView === 'flights' ? '4px' : '50%',
                            width: 'calc(50% - 4px)'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    <button
                        onClick={() => setMobileView('flights')}
                        className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${mobileView === 'flights' ? 'text-white' : 'text-foreground/60'}`}
                    >
                        <List className="w-4 h-4" />
                        Flights
                    </button>
                    <button
                        onClick={() => setMobileView('insights')}
                        className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${mobileView === 'insights' ? 'text-white' : 'text-foreground/60'}`}
                    >
                        <BarChart2 className="w-4 h-4" />
                        Insights
                    </button>
                </div>
            </div>

            {/* Results Grid - Featured Layout */}
            <div className="w-full max-w-[1600px] mx-auto px-fluid py-8 relative overflow-hidden">

                {/* Mobile Sliding Container */}
                <motion.div
                    className="flex w-[200%] lg:w-full lg:grid lg:grid-cols-[60%_40%] lg:gap-8 items-start"
                    animate={{ x: screenSize !== 'lg' && screenSize !== 'xl' ? (mobileView === 'flights' ? '0%' : '-100%') : '0%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >

                    {/* Left Column: Flight Results */}
                    <div className="w-[50%] lg:w-full space-y-6 px-1 lg:px-0">
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

                        {/* Pagination */}
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

                                    {/* Simplified Pagination for Mobile */}
                                    <span className="text-sm font-bold mx-4">
                                        Page {pagination.currentPage} of {totalPages}
                                    </span>

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
                            </div>
                        )}
                    </div>

                    {/* Right Column: Insights (Graph/Places) */}
                    <div className="w-[50%] lg:w-full lg:block h-full px-1 lg:px-0">
                        <div className="lg:sticky lg:top-28 space-y-8 overflow-y-auto max-h-[calc(100vh-8rem)] pb-8 no-scrollbar">
                            <PriceGraph />
                            <TouristPlaces />
                        </div>
                    </div>

                </motion.div>
            </div>
        </motion.div>
    );
}
