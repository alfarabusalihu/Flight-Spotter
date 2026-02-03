"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumCalendarProps {
    selectedDate: string;
    onSelect: (date: string) => void;
    onClose: () => void;
}

export default function PremiumCalendar({ selectedDate, onSelect, onClose }: PremiumCalendarProps) {
    const today = startOfToday();
    const initialDate = selectedDate ? new Date(selectedDate) : today;
    const [currentMonth, setCurrentMonth] = useState(isNaN(initialDate.getTime()) ? today : initialDate);
    const selected = selectedDate ? new Date(selectedDate) : null;

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-dark-cyan-light" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground/80">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-dark-cyan-light" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 mb-2 px-4">
                {days.map((day) => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-tighter text-foreground/30 py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                const isSelected = selected && isSameDay(day, selected);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isPast = isBefore(day, today);

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative aspect-square flex items-center justify-center p-1 ${!isCurrentMonth ? "opacity-20" : ""} ${isPast ? "cursor-not-allowed opacity-20" : "cursor-pointer"}`}
                        onClick={() => {
                            if (!isPast) {
                                onSelect(format(cloneDay, "yyyy-MM-dd"));
                                onClose();
                            }
                        }}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="activeDay"
                                className="absolute inset-2 bg-dark-cyan rounded-xl shadow-lg shadow-cyan-500/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={`relative text-xs font-bold transition-colors ${isSelected ? "text-white" : "text-foreground group-hover:text-dark-cyan-light"}`}>
                            {formattedDate}
                        </span>
                        {isSameDay(day, today) && !isSelected && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-dark-cyan-light rounded-full" />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 px-4" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="pb-4">{rows}</div>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-full left-0 mt-3 bg-background rounded-[2.5rem] shadow-2xl z-[100] border border-foreground/10 overflow-hidden w-[320px]"
        >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="px-6 py-4 bg-foreground/5 flex items-center justify-between">
                <button
                    onClick={() => {
                        onSelect(format(today, "yyyy-MM-dd"));
                        onClose();
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-dark-cyan-light hover:underline"
                >
                    Today
                </button>
                <button
                    onClick={onClose}
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground"
                >
                    Close
                </button>
            </div>
        </motion.div>
    );
}
