import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Auth from "@/components/layout/Auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flight Spotter | Real-Time Flight Search & Trends",
  description: "A modern flight search engine featuring real-time price intelligence, complex filtering, and premium design.",
  keywords: ["flights", "travel", "price trends", "cheap flights", "flight search"],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body
        className="antialiased min-h-screen relative bg-background text-foreground transition-colors duration-1000"
      >
        <Header />
        <main className="relative z-0 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
