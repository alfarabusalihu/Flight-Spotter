import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Flight Spotter',
    description: 'Terms and conditions for using Flight Spotter.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12 space-y-8">
                <h1 className="text-4xl font-display font-black text-foreground tracking-tighter">
                    Terms of <span className="text-dark-cyan-light">Service</span>
                </h1>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
                    <p className="text-foreground/70 leading-relaxed">
                        By accessing Flight Spotter, you agree to be bound by these Terms of Service. If you do not agree, you certainly don't have to use our awesome flight finding tool.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">2. Use License</h2>
                    <p className="text-foreground/70 leading-relaxed">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Flight Spotter's website for personal, non-commercial transitory viewing only.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">3. Disclaimer</h2>
                    <p className="text-foreground/70 leading-relaxed">
                        The materials on Flight Spotter's website are provided on an 'as is' basis. flight prices are dynamic and subject to change by airlines without notice.
                    </p>
                </section>
            </div>
        </div>
    );
}
