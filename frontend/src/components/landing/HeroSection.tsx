import React from 'react';
import { motion } from 'framer-motion';
import { MockAiInteraction } from './MockAiInteraction';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden pt-20 pb-20">
            {/* Background Grid/Gradients */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left: Text Content */}
                <div className="space-y-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Sentinel 2.0 is live
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
                            Engineering Intelligence. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                Before Escalatation.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Stop managing tickets. Start understanding incidents. Sentinel correlates logs, deployments, and patterns in real-time to prevent downtime.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg shadow-gray-900/20 text-center"
                        >
                            Open Dashboard
                        </Link>
                        <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all hover:border-gray-300 flex items-center justify-center gap-2 group">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Watch Demo
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="pt-8 flex items-center gap-8 justify-center lg:justify-start grayscale opacity-60"
                    >
                        {/* Trust Badges (Abstracted) */}
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse delay-75" />
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse delay-150" />
                    </motion.div>
                </div>

                {/* Right: Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-20 blur-2xl -z-10" />
                    <MockAiInteraction />
                </motion.div>
            </div>
        </section>
    );
};
