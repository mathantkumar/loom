import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';

export const PublicNavbar: React.FC = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 20);
        });
    }, [scrollY]);

    return (
        <>
            {/* Logo - Fixed Top Left */}
            <Link
                to="/"
                className="fixed top-8 left-8 z-50 flex items-center gap-2.5 group"
            >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                    <img src="/sentinel_logo.png" alt="Sentinel Logo" />
                </div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-gray-700 font-display transition-colors">
                    sentinel
                </span>
            </Link>

            {/* Main Navigation - Floating Center Pill (Links Only) */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`pointer-events-auto rounded-full transition-all duration-300 ${isScrolled
                        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50 ring-1 ring-black/5 py-2.5 px-6'
                        : 'bg-white/50 backdrop-blur-md border border-white/20 py-3 px-8 shadow-sm'
                        }`}
                >
                    <div className="flex items-center gap-1">
                        {[
                            { label: 'Product', path: '/product' },
                            { label: 'Solutions', path: '/solutions' },
                            { label: 'Pricing', path: '/pricing' },
                            { label: 'Docs', path: '/documentation' }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-black/5 rounded-full transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </motion.nav>
            </div>

            {/* CTA - Fixed Top Right */}
            <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
                <Link
                    to="/dashboard"
                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors hidden sm:block px-2"
                >
                    Log in
                </Link>
                <Link
                    to="/dashboard"
                    className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md shadow-gray-900/10"
                >
                    Get Started
                </Link>
            </div>
        </>
    );
};
