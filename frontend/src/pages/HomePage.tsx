import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemGrid } from '../components/landing/ProblemGrid';
import { ProductDemoScroll } from '../components/landing/ProductDemoScroll';
import { CredibilityGrid } from '../components/landing/CredibilityGrid';
import { MetricsStrip } from '../components/landing/MetricsStrip';

export const HomePage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen font-landing">
            <HeroSection />
            <MetricsStrip />
            <ProblemGrid />
            <ProductDemoScroll />
            <CredibilityGrid />

            {/* Final CTA */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                        Sentinel doesn't manage incidents. <br />
                        <span className="text-blue-600">It understands them.</span>
                    </h2>
                    <p className="text-xl text-gray-500 mb-10">
                        Join forward-thinking engineering teams detecting failures before they happen.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="/dashboard" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg text-lg">
                            Start Free Trial
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <div>© 2025 Sentinel AI. All rights reserved.</div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-900">Privacy</a>
                        <a href="#" className="hover:text-gray-900">Terms</a>
                        <a href="#" className="hover:text-gray-900">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
