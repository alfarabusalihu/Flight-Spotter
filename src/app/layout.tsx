import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScreenSizeListener from "@/components/utils/ScreenSizeListener";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://flightspotter.com'),
  title: {
    default: "Flight Spotter - AI-Powered Flight Search Engine",
    template: "%s | Flight Spotter",
  },
  description: "Discover the best flight deals with AI-powered price predictions, real-time search, and destination insights. Compare prices, track trends, and book smarter with Flight Spotter.",
  keywords: [
    "flight search",
    "cheap flights",
    "flight deals",
    "AI price prediction",
    "flight comparison",
    "travel booking",
    "amadeus flights",
    "flight price trends",
    "destination insights",
    "real-time flight search",
  ],
  authors: [{ name: "Flight Spotter Team" }],
  creator: "Flight Spotter",
  publisher: "Flight Spotter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Flight Spotter - AI-Powered Flight Search Engine",
    description: "Discover the best flight deals with AI-powered price predictions and real-time search.",
    siteName: "Flight Spotter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flight Spotter - AI-Powered Flight Search Engine",
    description: "Discover the best flight deals with AI-powered price predictions and real-time search.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0d9488" />
      </head>
      <body
        className="antialiased min-h-screen relative bg-background text-foreground transition-colors duration-1000"
      >
        <ScreenSizeListener />
        <Header />
        <main className="relative z-0 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
