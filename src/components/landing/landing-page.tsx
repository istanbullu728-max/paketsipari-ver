"use client";

import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { SocialProof } from "./social-proof";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { Pricing } from "./pricing";
import { Footer } from "./footer";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            <Navbar />
            <main>
                <Hero />
                <SocialProof />
                <Features />
                <HowItWorks />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
}
