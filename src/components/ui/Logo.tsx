
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export default function Logo({ className }: LogoProps) {
    return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-auto drop-shadow-2xl", className)}>
            <path d="M98.5 160L100 190L101.5 160Z" fill="black" fillOpacity="0.2" className="blur-sm" />
            <path d="M100 20C95 20 90 25 90 40V140C90 155 95 160 100 160C105 160 110 155 110 140V40C110 25 105 20 100 20Z" fill="currentColor" className="text-foreground" />
            <path d="M100 60L20 100V120L100 90L180 120V100L100 60Z" fill="currentColor" className="text-foreground/90" />
            <path d="M100 140L70 160V170L100 155L130 170V160L100 140Z" fill="currentColor" className="text-foreground/90" />
            <path d="M96 35H104V40H96V35Z" fill="#38bdf8" />

            {/* Daylight Wing Lines (Light Mode Only) */}
            <path d="M30 110 L90 95" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-100 dark:opacity-0 transition-opacity duration-1000" />
            <path d="M170 110 L110 95" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-100 dark:opacity-0 transition-opacity duration-1000" />

            {/* Night Mode Neon Circles (3 per wing) */}
            <g className="opacity-0 dark:opacity-100 transition-opacity duration-1000">
                {/* Left Wing Neons */}
                <circle cx="35" cy="112" r="2" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse" />
                <circle cx="55" cy="107" r="2" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-[pulse_2s_infinite_0.3s]" />
                <circle cx="75" cy="102" r="2" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-[pulse_2s_infinite_0.6s]" />

                {/* Right Wing Neons */}
                <circle cx="165" cy="112" r="2" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse" />
                <circle cx="145" cy="107" r="2" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-[pulse_2s_infinite_0.3s]" />
                <circle cx="125" cy="102" r="2" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-[pulse_2s_infinite_0.6s]" />
            </g>

            {/* Tail Light */}
            <circle cx="100" cy="170" r="3" fill="white" className="opacity-0 dark:opacity-100 animate-[pulse_1s_infinite]" />
        </svg>
    );
}
