"use client";

import { useEffect } from 'react';
import { useFlightStore } from '@/lib/store';

export default function ScreenSizeListener() {
    const { setScreenSize } = useFlightStore();

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) setScreenSize('sm'); // Mobile
            else if (width < 1024) setScreenSize('md'); // Tablet
            else if (width < 1280) setScreenSize('lg'); // Desktop
            else setScreenSize('xl'); // Large Desktop
        };

        // Initial check
        handleResize();

        // Optimized listener (could debounce, but resizing isn't super frequent/expensive here)
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setScreenSize]);

    return null;
}
