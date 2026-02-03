import Amadeus from "amadeus";

const amadeus = new Amadeus({
    clientId: process.env.amadeus_api_key,
    clientSecret: process.env.amadeus_api_secret,
});

export async function searchFlights(params: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    adults: string;
}) {
    try {
        const response = await amadeus.shopping.flightOffersSearch.get(params);
        return response.data;
    } catch (error) {
        console.error("Amadeus Search Error:", error);
        throw error;
    }
}

export async function getPriceTrends(params: {
    originIataCode: string;
    destinationIataCode: string;
}) {
    try {
        // Note: This endpoint might require a specific Amadeus subscription or be under a different name
        // For the test/free tier, we might use flight-price-analysis
        const response = await amadeus.analytics.itineraryPriceMetrics.get({
            originIataCode: params.originIataCode,
            destinationIataCode: params.destinationIataCode,
        });
        return response.data;
    } catch (error) {
        console.error("Amadeus Price Trends Error:", error);
        // Fallback or return empty if not available in test environment
        return [];
    }
}

export async function searchLocations(keyword: string) {
    try {
        const response = await amadeus.referenceData.locations.get({
            keyword,
            subType: Amadeus.location.city,
        });
        return response.data;
    } catch (error) {
        console.error("Amadeus Location Search Error:", error);
        return [];
    }
}
