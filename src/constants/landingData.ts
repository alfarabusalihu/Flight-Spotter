import { Globe, Zap, Shield, ShieldCheck, Plane as PlaneIcon } from "lucide-react";

export { PlaneIcon as Plane };

export const LANDING_FEATURES = [
    {
        icon: Globe,
        iconColor: "text-dark-cyan-light",
        title: "Global Reach",
        desc: "Access real-time flight data from over 500 airlines worldwide including low-cost carriers."
    },
    {
        icon: Zap,
        iconColor: "text-amber-500",
        title: "Smart Insights",
        desc: "Our AI-powered engine predicts price trends and suggests the best time to book your tickets."
    },
    {
        icon: Shield,
        iconColor: "text-green-500",
        title: "Secure Booking",
        desc: "Every search is direct and secure, ensuring you get the exact price without hidden fees or trackers."
    }
];

export const ABOUT_STATS = [
    {
        icon: ShieldCheck,
        iconColor: "text-dark-cyan",
        title: "Privacy First",
        desc: "No local storage. No trackers. Your search data serves only you, in the moment."
    },
    {
        icon: Zap,
        iconColor: "text-amber-500",
        title: "AI Powered",
        desc: "Real-time price prediction and route intelligence powered by Gemini models."
    }
];

export const FOOTER_LINKS = {
    platform: [
        { label: "Search Flights", href: "/flights" },
        { label: "Price Trends", href: "#" },
        { label: "Smart Destinations", href: "#" },
        { label: "Mobile App", href: "#", badge: "Soon" }
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Sustainability", href: "#" },
        { label: "Newsroom", href: "#" },
        { label: "Careers", href: "#" }
    ],
    support: [
        { label: "Help Center", href: "#" },
        { label: "Safety Info", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" }
    ]
};
export const HERO_CONTENT = {
    title: "FLIGHT",
    subtitle: "SPOTTER",
    description: "Find your perfect flight at the best price",
    buttonLabel: "Search Flights"
};

export const MISSION_CONTENT = {
    tag: "Our Mission",
    title: "Elevating the Art of Discovery.",
    description: "Flight Spotter was born from a simple idea: flight data should be beautiful, accessible, and transparent. We leverage advanced AI predictive models to bring you the most accurate flight information available, without the clutter.",
    insightTag: "Latest Insight",
    insightText: "Global travel is up 24% this season.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
};

export const GUIDE_CONTENT = {
    placeholder: "Where to next, explorer?",
    instruction: "Select your origin and destination above"
};
