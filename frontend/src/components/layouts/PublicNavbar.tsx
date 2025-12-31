import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

export const PublicNavbar: React.FC = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
                    ? 'bg-white/80 backdrop-blur-md border-gray-200 py-3'
                    : 'bg-transparent border-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        S
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Sentinel</span>
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <a href="#" className="hover:text-gray-900 transition-colors">Product</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Solutions</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Pricing</a>
                    <Link to="/documentation" className="hover:text-gray-900 transition-colors">Docs</Link>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/dashboard"
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors hidden sm:block"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all hover:scale-105"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};
