import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Flight Spotter',
    description: 'Read our strict privacy policy. We do not use local storage or trackers.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12 space-y-8">
                <h1 className="text-4xl font-display font-black text-foreground tracking-tighter">
                    Privacy <span className="text-dark-cyan-light">Policy</span>
                </h1>

                <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Last Updated: February 2026</p>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">1. No Local Storage</h2>
                    <p className="text-foreground/70 leading-relaxed">
                        We adhere to a strict <strong>No Local Storage</strong> policy. We do not save your search history, personal details, or preferences in your browser's Local Storage or Cookies. All session data is ephemeral and cleared when you close the tab.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">2. Data Collection</h2>
                    <p className="text-foreground/70 leading-relaxed">
                        We only process data necessary to fulfill your flight search request (e.g., Origin, Destination, Dates). This data is transmitted securely to our providers (Amadeus) and is not retained by our servers after the session ends.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">3. Third-Party Services</h2>
                    <p className="text-foreground/70 leading-relaxed">
                        We use Google Gemini for price predictions and Amadeus for flight inventory. Please refer to their respective privacy policies for how they handle transient data processing.
                    </p>
                </section>
            </div>
        </div>
    );
}
