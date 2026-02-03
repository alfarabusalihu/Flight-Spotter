"use client";

import { motion } from "framer-motion";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg ${className}`} />
    );
}

export function FlightSkeleton() {
    return (
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 p-4 flex items-center gap-8 rounded-lg">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-20 h-3" />
                </div>
                <div className="hidden md:flex flex-col items-center justify-center space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-24 h-[1px]" />
                </div>
                <div className="flex flex-col md:items-end space-y-2">
                    <Skeleton className="w-16 h-4" />
                    <Skeleton className="w-12 h-3" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
        </div>
    );
}

export function PriceChartSkeleton() {
    return (
        <div className="w-full bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 p-6 rounded-xl shadow-lg">
            <div className="space-y-2 mb-6">
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-48 h-3" />
            </div>
            <Skeleton className="w-full h-[200px]" />
        </div>
    );
}
