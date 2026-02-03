"use server";

import Amadeus from "amadeus";

console.log("Amadeus Server: Verifying credentials...");
if (!process.env.amadeus_api_key) console.error("Missing amadeus_api_key");
if (!process.env.amadeus_api_secret) console.error("Missing amadeus_api_secret");

const amadeus = new Amadeus({
    clientId: process.env.amadeus_api_key,
    clientSecret: process.env.amadeus_api_secret,
    hostname: process.env.AMADEUS_ENVIRONMENT === 'production' ? 'production' : 'test'
});

export async function searchLocationsAction(keyword: string) {
    console.log("Amadeus Search Locations Request:", keyword);
    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: keyword.toUpperCase(),
            subType: Amadeus.location.city,
        });
        console.log(`[AMADEUS] Search Success for "${keyword.toUpperCase()}":`, response.data.length, "results");
        return response.data;
    } catch (error) {
        console.error("Amadeus Location Search Error:", error);
        return [];
    }
}

export async function getNearestAirportAction(lat: number, lon: number) {
    try {
        const response = await amadeus.referenceData.locations.airports.get({
            latitude: lat,
            longitude: lon,
            sort: "distance",
        });
        return response.data;
    } catch (error) {
        console.error("Amadeus Nearest Airport Error:", error);
        return [];
    }
}

const SUPPORTED_SANDBOX_ORIGINS = ['MAD', 'PAR', 'LON', 'BER', 'FRA', 'MUC'];

export async function getFlightInspirationAction(origin: string) {
    const originCode = origin.includes(" - ") ? origin.split(" - ")[0] : origin;

    const isSandbox = (process.env.AMADEUS_ENVIRONMENT || 'sandbox').toLowerCase() === 'sandbox';

    // In sandbox mode, we proactively skip unsupported origins to avoid 500 errors
    if (isSandbox && !SUPPORTED_SANDBOX_ORIGINS.includes(originCode.toUpperCase())) {
        console.warn(`[Amadeus] [Sandbox] Skipping inspiration call for ${originCode}. User will see tip/fallback.`);
        return [];
    }

    try {
        const response = await amadeus.shopping.flightDestinations.get({
            origin: originCode.toUpperCase(),
        });
        console.log(`[AMADEUS] Inspiration Success for "${originCode.toUpperCase()}":`, response.data?.length || 0, "deals");
        return response.data;
    } catch (error: any) {
        console.error("--- Amadeus Flight Inspiration ERROR ---");
        console.error("Status Code:", error.response?.statusCode);

        if (error.response?.statusCode === 500 || error.response?.statusCode === 400) {
            console.warn("DIAGNOSIS: Unexpected Amadeus Test Tier restriction.");
        }

        return [];
    }
}

export async function searchFlightsAction(params: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: string;
}) {
    console.log("--- Amadeus Search Flights Initiation ---");
    console.log("Parameters:", JSON.stringify(params, null, 2));

    try {
        const normalizedParams = {
            ...params,
            originLocationCode: params.originLocationCode.toUpperCase(),
            destinationLocationCode: params.destinationLocationCode.toUpperCase(),
        };
        const response = await amadeus.shopping.flightOffersSearch.get(normalizedParams);
        console.log(`[AMADEUS] Search Success: ${response.statusCode} - Found ${response.data?.length || 0} results`);

        if (response.data && response.data.length > 0) {
            // console.log("First Result Sample:", JSON.stringify(response.data[0], null, 2).slice(0, 200) + "...");
        } else {
            console.warn(`[AMADEUS] Search returned 0 results for ${params.originLocationCode}->${params.destinationLocationCode} on ${params.departureDate}`);
        }

        return response.data;
    } catch (error: any) {
        console.error("--- Amadeus Search ERROR ---");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message || "Unknown Error");
        if (error.response) {
            console.error("Error Response Status:", error.response.statusCode);
            console.error("Error Response Data:", JSON.stringify(error.response.data, null, 2));
        }
        return [];
    }
}

export async function getPriceTrendsAction(params: {
    originIataCode: string;
    destinationIataCode: string;
}) {
    console.log("Amadeus Price Trends Request:", params);
    try {
        const response = await amadeus.analytics.itineraryPriceMetrics.get({
            originIataCode: params.originIataCode,
            destinationIataCode: params.destinationIataCode,
        });
        console.log("Amadeus Price Trends Success:", response.data?.length || 0);
        return response.data;
    } catch (error: any) {
        console.error("Amadeus Price Trends Error:", error.message);
        return [];
    }
}

export async function getAirlinesAction(carrierCodes: string) {
    console.log("Amadeus Airline Lookup:", carrierCodes);
    try {
        const response = await amadeus.referenceData.airlines.get({
            airlineCodes: carrierCodes
        });
        return response.data;
    } catch (error: any) {
        console.error("Amadeus Airline Lookup Error:", error.message);
        return [];
    }
}

export async function getNearbyAirportsAction(lat: number, lon: number) {
    console.log("Amadeus Nearby Airports Discovery:", lat, lon);
    try {
        const response = await amadeus.referenceData.locations.airports.get({
            latitude: lat,
            longitude: lon,
            sort: "distance"
        });
        return response.data;
    } catch (error: any) {
        console.error("Amadeus Nearby Discovery Error:", error.message);
        return [];
    }
}

export async function getPointsOfInterestAction(lat: number, lon: number) {
    console.log("Amadeus POI Discovery:", lat, lon);
    try {
        const response = await amadeus.referenceData.locations.pointsOfInterest.get({
            latitude: lat,
            longitude: lon,
            radius: 5
        });
        return response.data;
    } catch (error: any) {
        console.error("--- Amadeus POI Error ---");
        console.error("Status:", error.response?.statusCode || "N/A");
        console.error("Details:", error.response?.data?.errors?.[0]?.detail || error.message || "Unknown error");
        return [];
    }
}
export async function getLocationDetailsAction(iataCode: string) {
    console.log("Amadeus Location Detail Lookup:", iataCode);
    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: iataCode,
            subType: Amadeus.location.airport,
        });
        return response.data;
    } catch (error: any) {
        console.error("Amadeus Location Detail Error:", error.message);
        return [];
    }
}
