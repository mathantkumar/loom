import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MockAiInteraction: React.FC = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-lg mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden font-sans">
            {/* Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="ml-3 text-xs font-medium text-gray-400">Sentinel Intelligence Module</div>
            </div>

            {/* Chat Area */}
            <div className="p-6 space-y-6 min-h-[320px]">
                {/* User Query */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        US
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Eng Lead</div>
                        <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 shadow-sm">
                            Why are checkout transactions failing in EU-West?
                        </div>
                    </div>
                </motion.div>

                {/* AI Processing / Response */}
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
                                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-2 mb-2">
                                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Scanning Logs</span>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Correlating Traces</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full w-3/4 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "linear" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step >= 1 && (
                        <motion.div
                            key="response"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="space-y-3 flex-1">
                                <div className="text-sm text-gray-500 mb-1">Sentinel AI</div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm text-sm text-gray-800">
                                    <p className="font-semibold text-gray-900 mb-2">High Confidence Root Cause (94%)</p>
                                    <p className="leading-relaxed mb-3">
                                        Active deadlock detected in <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600 font-mono text-xs">PaymentService.lockFunds()</code>.
                                        Correlated with recent deployment <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono text-xs">v2.4.1</code> dealing with idempotent retries.
                                    </p>

                                    {/* Confidence Bar */}
                                    <div className="flex items-center gap-3 mt-4 text-xs">
                                        <div className="flex-1 bg-gray-100 h-1.5 rounded-full">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "94%" }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full bg-green-500 rounded-full"
                                            />
                                        </div>
                                        <span className="font-medium text-green-600">94% Certainty</span>
                                    </div>
                                </div>

                                {/* Action Buttons - Appear later */}
                                {step >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-2"
                                    >
                                        <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                            Rollback to v2.4.0
                                        </button>
                                        <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                            View Stack Trace
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Abstract Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-100/50 via-blue-100/30 to-transparent blur-3xl -z-10 pointer-events-none" />
        </div>
    );
};
