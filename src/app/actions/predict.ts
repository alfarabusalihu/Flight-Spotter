"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize lazily to ensure environment variables are loaded
let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    }
    return genAI;
}

interface PredictionContext {
    origin: string;
    month?: string;
    dayOfWeek?: string;
}

/**
 * Predicts likely destinations based on origin and context using Gemini
 * This helps pre-fetch likely destination data for the autocomplete
 */
export async function predictDestinationsAction(context: PredictionContext): Promise<string[]> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("[GEMINI] API Key missing (GEMINI_API_KEY), skipping prediction");
        return [];
    }

    console.log("[GEMINI] Predicting destinations for:", context.origin);
    console.log("[GEMINI] API Key starts with:", process.env.GEMINI_API_KEY.substring(0, 5) + "...");

    try {
        const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `
        As a travel expert AI, predict the top 5 most popular and likely flight destinations from the origin airport/city: ${context.origin}.
        
        Context:
        - Origin: ${context.origin}
        - Current Month: ${context.month || 'Current'}
        - Day: ${context.dayOfWeek || 'Weekday'}
        
        Rules:
        1. Return ONLY a valid JSON array of 5 IATA codes (3-letter uppercase strings).
        2. Do not include any text, markdown formatting, or explanations.
        3. Prioritize major hubs and popular business/leisure routes.
        4. If the origin is obscure, provide 5 major global hubs.
        
        Example Output: ["LHR", "JFK", "DXB", "SIN", "CDG"]
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log("[GEMINI] Prompt Origin:", context.origin);
        console.log("[GEMINI] Raw Response Content:", text);

        // More flexible regex: Match anything that looks like a 3-letter uppercase code inside an array
        // Handles single quotes, double quotes, varying spaces, etc.
        const arrayMatch = text.match(/\[\s*(?:['"]?[A-Z]{3}[']?\s*,\s*)*['"]?[A-Z]{3}[']?\s*\]/i);

        if (!arrayMatch) {
            console.warn("[GEMINI] No IATA array found in AI response.");
            return [];
        }

        // Clean and parse
        const cleanJson = arrayMatch[0].replace(/'/g, '"').toUpperCase();
        try {
            const predictions = JSON.parse(cleanJson);
            if (Array.isArray(predictions)) {
                console.log("[GEMINI] Successfully predicted:", predictions);
                return predictions.map(s => String(s).toUpperCase()).slice(0, 5);
            }
        } catch (e) {
            console.error("[GEMINI] JSON parse error on:", cleanJson);
        }

        return [];
    } catch (error) {
        console.error("[GEMINI] API Error:", error);
        return [];
    }
}

export async function predictPriceTrendsAction(
    origin: string,
    destination: string,
    currentPrice: number
): Promise<{ date: string; price: number }[]> {
    if (!process.env.GEMINI_API_KEY) return [];

    try {
        const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `
        As a flight pricing analyst, predict a realistic 14-day price trend for a flight from the origin airport (${origin}) to the destination airport (${destination}).
        Ground the prediction starting with today's price of ${currentPrice}.
        
        CRITICAL CONTEXT:
        - Route: ${origin} ➝ ${destination}
        - Base Price: ${currentPrice}
        - Start Date: ${new Date().toISOString().split('T')[0]}
        
        Rules:
        1. Return ONLY a valid JSON array of 14 objects.
        2. Format: { "date": "YYYY-MM-DD", "price": number }
        3. The first item MUST be for today (${new Date().toISOString().split('T')[0]}) and match the base price of ${currentPrice}.
        4. Prices should fluctuate realistically (+/- 20%) based on typical airline logic, holidays, and route popularity.
        5. Ignore any other geographical context; ONLY predict for the provided ${origin} to ${destination} route.
        6. No text or markdown formatting.
        
        Example: [{"date": "2024-03-01", "price": 450}, ...]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log(`[GEMINI] Price Trend Raw Output:`, text);

        let trends: any[] = [];
        try {
            // Find the outermost [ ] to handle potential markdown or conversational noise
            const startIndex = text.indexOf('[');
            const endIndex = text.lastIndexOf(']');

            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const jsonStr = text.substring(startIndex, endIndex + 1);
                trends = JSON.parse(jsonStr);
                console.log(`[GEMINI] ✅ Parsed ${trends.length} items from boundary extraction`);
            } else {
                // Regex fallback
                const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
                if (arrayMatch) {
                    trends = JSON.parse(arrayMatch[0]);
                    console.log(`[GEMINI] ✅ Parsed ${trends.length} items from regex fallback`);
                }
            }
        } catch (e) {
            console.error("[GEMINI] Price Trend Parse Error:", e);
            return [];
        }

        if (Array.isArray(trends) && trends.length > 0) {
            return trends;
        }
        return [];
    } catch (error) {
        console.error("[GEMINI] Price Trend Critical Error:", error);
        return [];
    }
}

/**
 * Generates popular tourist places using Gemini (AI Knowledge)
 * Uses location name as primary identifier for better reliability
 */
export async function getAIInsightsAction(locationName: string, iataCode?: string) {
    if (!process.env.GEMINI_API_KEY) return [];

    console.log(`[GEMINI] Generating Tourist Insights for: ${locationName} (${iataCode || 'N/A'})`);

    try {
        const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `
        As a local travel guide, list 20 of the most popular tourist attractions or hidden gems in or near "${locationName}"${iataCode ? ` (IATA: ${iataCode})` : ''}.
        
        Rules:
        1. Return ONLY a valid JSON array.
        2. Format: [{ "id": "unique_id", "name": "Place Name", "category": "Category", "rank": "4.x", "tags": ["tag1", "tag2"], "intro": "Detailed 2-sentence intro about why this place is special." }]
        3. Sort by popularity (most popular first).
        4. Category examples: "Historic_Site", "Nature", "Museum", "Shopping", "Beach".
        5. "id" should be a random numeric string.
        6. "rank" should be a string between "4.0" and "5.0".
        7. Ensure the places are actually in or very close to "${locationName}".
        
        Example for Paris:
        [{"id": "101", "name": "Eiffel Tower", "category": "Landmark", "rank": "4.9", "tags": ["Romance", "View"], "intro": "The iron lady of Paris, offering breathtaking views of the city. A must-visit for any traveler."}]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const arrayMatch = cleanJson.match(/\[[\s\S]*\]/);
        const finalJson = arrayMatch ? arrayMatch[0] : cleanJson;

        try {
            const data = JSON.parse(finalJson);
            console.log(`[GEMINI] Generated ${data.length} insights for ${locationName}`);
            return data;
        } catch (e) {
            console.error("[GEMINI] JSON Parse Error for Insights:", e);
            return [];
        }
    } catch (error) {
        console.error("[GEMINI] Insight Generation Error:", error);
        return [];
    }
}

/**
 * Generates human-like descriptions for Points of Interest
 * (Kept for compatibility if used elsewhere, or could be deprecated)
 */
export async function getPOIIntroAction(poiName: string, category: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) return "A must-visit landmark known for its cultural significance and breathtaking views.";

    try {
        const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const prompt = `Write a very short (max 15 words) catchy introduction/description for a tourist attraction called "${poiName}" which is categorized as ${category}. Make it sound like a premium travel guide. Return ONLY the description.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (e) {
        return "Experience the unique charm and history of this highly-rated destination.";
    }
}

/**
 * Returns a list of associated airlines for the navbar display
 */
export async function getAssociatedAirlinesAction() {
    // In a real app, this might come from a DB or specific partnership list
    return [
        { name: "Lufthansa", code: "LH", logo: "https://www.lufthansa.com/etc.clientlibs/lufthansa/clientlibs/clientlib-resources/resources/img/logo/lh_logo.svg" },
        { name: "Delta Air Lines", code: "DL", logo: "" },
        { name: "Emirates", code: "EK", logo: "" },
        { name: "British Airways", code: "BA", logo: "" },
        { name: "Singapore Airlines", code: "SQ", logo: "" },
        { name: "Qatar Airways", code: "QR", logo: "" },
        { name: "Air France", code: "AF", logo: "" }
    ];
}
