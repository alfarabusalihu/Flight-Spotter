"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { useFlightStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart2, Info, ChevronRight } from "lucide-react";

// --- D3 Area Chart (Forecast) ---
function D3AreaChart({ data, currency, activeMinPrice, departureDate }: { data: any[], currency: string, activeMinPrice: number, departureDate?: string }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [rerender, setRerender] = useState(0);

    // Re-draw on resize using ResizeObserver
    useEffect(() => {
        if (!svgRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            setRerender(prev => prev + 1);
        });
        resizeObserver.observe(svgRef.current.parentElement!);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        if (width <= margin.left + margin.right || height <= margin.top + margin.bottom) return;

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => d.price) as number * 0.9, d3.max(data, d => d.price) as number * 1.1])
            .range([height - margin.bottom, margin.top]);

        // Area generator
        const area = d3.area<any>()
            .x(d => x(new Date(d.date)))
            .y0(height - margin.bottom)
            .y1(d => y(d.price))
            .curve(d3.curveMonotoneX);

        // Line generator
        const line = d3.line<any>()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.price))
            .curve(d3.curveMonotoneX);

        // Gradient
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "area-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#0d9488").attr("stop-opacity", 0.4);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#0d9488").attr("stop-opacity", 0);

        // Draw Area
        svg.append("path")
            .datum(data)
            .attr("fill", "url(#area-gradient)")
            .attr("d", area);

        // Draw Line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#0d9488")
            .attr("stroke-width", 3)
            .attr("d", line);

        // Selected Date Line
        if (departureDate) {
            const depDateObj = new Date(departureDate);
            if (!isNaN(depDateObj.getTime())) {
                const xPos = x(depDateObj);
                if (xPos >= margin.left && xPos <= width - margin.right) {
                    svg.append("line")
                        .attr("x1", xPos)
                        .attr("x2", xPos)
                        .attr("y1", margin.top)
                        .attr("y2", height - margin.bottom)
                        .attr("stroke", "#0d9488")
                        .attr("stroke-width", 2)
                        .attr("stroke-dasharray", "4 2")
                        .attr("opacity", 0.8);

                    svg.append("circle")
                        .attr("cx", xPos)
                        .attr("cy", margin.top)
                        .attr("r", 4)
                        .attr("fill", "#0d9488")
                        .attr("filter", "drop-shadow(0 0 4px #0d9488)");
                }
            }
        }

        // Reference Line (Best Entry)
        if (activeMinPrice > 0) {
            svg.append("line")
                .attr("x1", margin.left)
                .attr("x2", width - margin.right)
                .attr("y1", y(activeMinPrice))
                .attr("y2", y(activeMinPrice))
                .attr("stroke", "#0d9488")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "4 4")
                .attr("opacity", 0.5);

            svg.append("text")
                .attr("x", width - margin.right)
                .attr("y", y(activeMinPrice) - 5)
                .attr("text-anchor", "end")
                .attr("fill", "#0d9488")
                .attr("font-size", "9px")
                .attr("font-weight", "900")
                .text("BEST ENTRY");
        }

        // Axes
        const xAxis = d3.axisBottom(x)
            .ticks(5)
            .tickFormat(d3.timeFormat("%b %d") as any);

        const yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickFormat(d => `${currency === 'EUR' ? '€' : '$'}${d}`);

        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .attr("font-size", "9px")
            .attr("font-weight", "bold")
            .attr("color", "#64748b")
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis)
            .attr("font-size", "9px")
            .attr("font-weight", "bold")
            .attr("color", "#64748b")
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

    }, [data, currency, activeMinPrice, departureDate, rerender]);

    return <svg ref={svgRef} className="w-full h-full" />;
}

// --- D3 Bar Chart (Market) ---
function D3BarChart({ data }: { data: any[] }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [rerender, setRerender] = useState(0);

    // Re-draw on resize using ResizeObserver
    useEffect(() => {
        if (!svgRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            setRerender(prev => prev + 1);
        });
        resizeObserver.observe(svgRef.current.parentElement!);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const margin = { top: 20, right: 10, bottom: 30, left: 10 };

        if (width <= margin.left + margin.right || height <= margin.top + margin.bottom) return;

        const x = d3.scaleBand()
            .domain(data.map(d => d.bin))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) as number])
            .range([height - margin.bottom, margin.top]);

        // Draw Bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.bin) as number)
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => Math.max(0, height - margin.bottom - y(d.count)))
            .attr("fill", (d, i) => i === 0 ? "#0d9488" : "rgba(13, 148, 136, 0.2)")
            .attr("rx", 6);

        // X Axis
        const xAxis = d3.axisBottom(x);
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .attr("font-size", "9px")
            .attr("font-weight", "bold")
            .attr("color", "#64748b")
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

    }, [data, rerender]);

    return <svg ref={svgRef} className="w-full h-full" />;
}

export default function PriceGraph() {
    const { priceTrends, currency, flightResults, departureDate } = useFlightStore();
    const [view, setView] = useState<'forecast' | 'market'>(priceTrends && priceTrends.length > 0 ? 'forecast' : 'market');

    // AI Forecast Data
    const forecastData = useMemo(() => {
        if (!priceTrends || priceTrends.length === 0) return [];
        return priceTrends;
    }, [priceTrends]);

    // Market Distribution Data (Histogram)
    const marketData = useMemo(() => {
        if (!flightResults || flightResults.length === 0) return [];

        const prices = flightResults.map(f => parseFloat(f.price?.total || f.price?.amount || 0)).filter(p => !isNaN(p));
        if (prices.length === 0) return [];

        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;
        const bucketCount = 10;
        const bucketSize = Math.max(range / bucketCount, 1);

        const buckets = Array.from({ length: bucketCount }, (_, i) => {
            const start = min + i * bucketSize;
            const end = start + bucketSize;
            return {
                bin: `$${Math.round(start)}`,
                count: prices.filter(p => p >= start && p < (i === bucketCount - 1 ? end + 0.01 : end)).length,
                price: Math.round(start)
            };
        });

        return buckets;
    }, [flightResults]);

    const activeMinPrice = forecastData.length > 0
        ? Math.min(...forecastData.map(t => t.price))
        : 0;

    if (flightResults.length === 0) return null;

    return (
        <div className="p-6 glass rounded-3xl relative overflow-hidden group border border-white/5 shadow-2xl">
            {/* Header with View Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-black font-display text-foreground flex items-center gap-2 tracking-tighter">
                        {view === 'forecast' ? <TrendingUp className="w-5 h-5 text-dark-cyan-light" /> : <BarChart2 className="w-5 h-5 text-dark-cyan-light" />}
                        {view === 'forecast' ? 'Price Forecast' : 'Market Analysis'}
                    </h3>
                    <p className="text-[10px] text-silver font-black uppercase tracking-[0.2em] mt-1">
                        {view === 'forecast' ? 'AI-Powered 14-Day Prediction' : 'Current Search Distribution'}
                    </p>
                </div>

                <div className="flex items-center bg-black/20 p-1 rounded-2xl border border-white/5 self-start md:self-center">
                    <button
                        onClick={() => setView('market')}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'market' ? 'bg-dark-cyan text-white shadow-lg' : 'text-silver hover:text-foreground'}`}
                    >
                        Market
                    </button>
                    <button
                        onClick={() => setView('forecast')}
                        disabled={!priceTrends || priceTrends.length === 0}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'forecast' ? 'bg-dark-cyan text-white shadow-lg' : 'text-silver hover:text-foreground disabled:opacity-30'}`}
                    >
                        Forecast
                    </button>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="h-48 md:h-64 w-full relative">
                <AnimatePresence mode="wait">
                    {view === 'forecast' ? (
                        forecastData.length > 0 ? (
                            <motion.div
                                key="forecast"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full h-full"
                            >
                                <D3AreaChart data={forecastData} currency={currency} activeMinPrice={activeMinPrice} departureDate={departureDate} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="forecast-empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-2xl"
                            >
                                <div className="p-3 bg-dark-cyan/5 rounded-full">
                                    <TrendingUp className="w-6 h-6 text-dark-cyan/20" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-black text-foreground/60 uppercase tracking-widest">Not Enough Forecast Data</p>
                                    <p className="text-[9px] text-silver font-bold uppercase mt-1">AI needs more historical context for this specific route</p>
                                </div>
                            </motion.div>
                        )
                    ) : (
                        marketData.length > 0 ? (
                            <motion.div
                                key="market"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full h-full"
                            >
                                {(!priceTrends || priceTrends.length === 0) && flightResults.length > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                        <div className="flex flex-col items-center gap-2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                                            <div className="w-4 h-4 rounded-full border-2 border-dark-cyan-light border-t-transparent animate-spin" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Generating AI Forecast...</span>
                                        </div>
                                    </div>
                                )}
                                <D3BarChart data={marketData} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="market-empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-2xl"
                            >
                                <div className="p-3 bg-dark-cyan/5 rounded-full">
                                    <BarChart2 className="w-6 h-6 text-dark-cyan/20" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-black text-foreground/60 uppercase tracking-widest">Not Enough Market Data</p>
                                    <p className="text-[9px] text-silver font-bold uppercase mt-1">Try expanding your filters or search criteria</p>
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Insight Bar */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dark-cyan/10 flex items-center justify-center text-dark-cyan-light">
                        <Info className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-foreground uppercase tracking-tight">Market Confidence: High</span>
                        <span className="text-[9px] text-silver font-bold uppercase">Based on {flightResults.length} real-time search results</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 group/btn">
                    <span className="text-[9px] font-black text-dark-cyan-light uppercase tracking-widest group-hover/btn:pr-2 transition-all">Deep Analysis</span>
                    <ChevronRight className="w-3 h-3 text-dark-cyan-light" />
                </div>
            </div>
        </div>
    );
}
