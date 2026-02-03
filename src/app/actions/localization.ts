"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { FALLBACK_RATES } from "@/constants/localizationData";

let genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    }
    return genAI;
}

/**
 * Fetches real-time currency rates relative to USD
 * Uses a zero-auth public API for reliability
 */
export async function getCurrencyRatesAction() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!response.ok) throw new Error("API Limit reached");
        const data = await response.json();
        return data.rates || FALLBACK_RATES;
    } catch (e) {
        console.warn("[Localization] Falling back to hardcoded currency rates.");
        return FALLBACK_RATES;
    }
}

/**
 * AI-powered translation for main headings and navigation
 */
export async function translateContentAction(lang: string, keys: string[]): Promise<Record<string, string>> {
    if (lang === "en") return Object.fromEntries(keys.map(k => [k, k]));

    try {
        const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const prompt = `Translate the following travel website navigation and heading keys into ${lang}. 
        Return ONLY a JSON object where the key is the original English and the value is the translation. 
        Do NOT translate brand names like "Flight Spotter".
        
        Keys: ${JSON.stringify(keys)}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (e) {
        return {};
    }
}

/**
 * Get a list of top global airlines for the marquee using AI context
 */
export async function getGlobalAirlinesAction(): Promise<string[]> {
    try {
        const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const prompt = `Return a list of the top 30 most famous global airlines as dynamic IATA 2-letter codes. Return ONLY a JSON array of strings. Example: ["LH", "BA", "EK"]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : ["LH", "BA", "EK", "QR", "SQ", "AF", "KL", "UA", "DL", "AA"];
    } catch (e) {
        return ["LH", "BA", "EK", "QR", "SQ", "AF", "KL", "UA", "DL", "AA"];
    }
}
