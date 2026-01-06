import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SentinelLogo } from '../brand/SentinelLogo';

// --- Demo 1: Ask Sentinel (Conversational Intelligence) ---
const AskSentinelDemo = () => {
    const [step, setStep] = useState(0);
    const query = "Why is checkout latency spiking in eu-west-1?";
    const response = "Correlated with high DB connections in checkout-db-04. The connection pool is exhausted.";

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(prev => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[300px] flex flex-col font-sans">
            <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center gap-6">
                {/* User Query */}
                <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                        US
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-700 max-w-[85%]">
                        <motion.span>
                            {step === 0 ? (
                                <Typewriter text={query} />
                            ) : (
                                query
                            )}
                        </motion.span>
                    </div>
                </div>

                {/* AI Response */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-3 items-center text-gray-400 text-sm ml-11"
                        >
                            <SentinelLogo variant="symbol" size="sm" animated={true} />
                            <span>Analyzing logs...</span>
                        </motion.div>
                    )}
                    {step >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 items-start"
                        >
                            <div className="mt-1">
                                <SentinelLogo variant="symbol" size="sm" />
                            </div>
                            <div className="bg-sentinel-50 border border-sentinel-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 max-w-[90%] shadow-sm">
                                <p className="font-medium text-sentinel-900 mb-1">Root Cause Identified</p>
                                <p className="leading-relaxed">
                                    {step === 2 ? <Typewriter text={response} speed={0.01} /> : response}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- Demo 2: Silent Warnings (Chart/Glow) ---
const SilentWarningDemo = () => {
    return (
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden relative min-h-[300px] flex flex-col justify-center p-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50 blur-sm" />

            <div className="flex justify-between items-end mb-8 text-gray-400 text-xs font-mono uppercase tracking-wider">
                <span>Latency (ms)</span>
                <span className="text-amber-400 animate-pulse">Deviation Detected</span>
            </div>

            <div className="h-40 flex items-end justify-between gap-1">
                {[20, 22, 19, 21, 23, 20, 25, 35, 48, 62, 75, 88].map((value, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: "20%" }}
                        whileInView={{ height: `${value}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className={`w-full rounded-t-sm relative ${value > 40 ? 'bg-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-gray-700'}`}
                    >
                        {value > 40 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none"
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="mt-6 flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 backdrop-blur"
            >
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs text-gray-300">Projected to cross SLA in 12 mins</span>
            </motion.div>
        </div>
    );
};

// --- Demo 3: Recurring Patterns (Timeline) ---
const RecurringPatternDemo = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[300px] flex flex-col p-8 font-sans">
            <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    <SentinelLogo variant="symbol" size="sm" className="w-3 h-3 text-purple-600" />
                    Memory Match: 98%
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center relative">
                {/* Historical Event */}
                <motion.div
                    initial={{ opacity: 0.3, scale: 0.9, y: 0 }}
                    whileInView={{ opacity: 0.6, scale: 0.95, y: 30 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-x-0 top-10 bg-gray-50 border border-gray-200 p-4 rounded-xl -z-10"
                >
                    <div className="text-xs text-gray-400 mb-1">INC-1024 • 3 weeks ago</div>
                    <div className="h-2 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                </motion.div>

                {/* Current Event */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white border border-purple-200 shadow-lg shadow-purple-900/5 p-5 rounded-xl z-10"
                >
                    <div className="flex justify-between mb-3">
                        <div className="text-xs font-bold text-gray-900">INC-2091 • Active Now</div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-gray-100 rounded w-3/4" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: 'auto', opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                    >
                        <p className="text-xs text-purple-700 font-medium">
                            Use fix from INC-1024: <span className="font-mono bg-purple-50 px-1 py-0.5 rounded">restart_payment_pod</span>
                        </p>
                    </motion.div>
                </motion.div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 pointer-events-none z-0" style={{ overflow: 'visible' }}>
                    <motion.path
                        d="M 150 60 L 150 120"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </svg>
            </div>
        </div>
    );
};

// --- Helper: Typewriter ---
const Typewriter = ({ text, speed = 0.03 }: { text: string, speed?: number }) => {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        setDisplayed("");
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayed(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed * 1000);
        return () => clearInterval(timer);
    }, [text, speed]);

    return <span>{displayed}</span>;
}

// --- Main Layout ---

export const ProductDemoScroll: React.FC = () => {
    const demos = [
        {
            title: "Conversational Intelligence",
            headline: "Ask questions only Sentinel can answer.",
            desc: "Stop querying databases. Ask Sentinel to trace errors, explain latency, or summarize deployments in plain English. It correlates logic you didn't even know existed.",
            component: <AskSentinelDemo />
        },
        {
            title: "Pre-Incident Awareness",
            headline: "Sentinel notices drift before failure begins.",
            desc: "Dashboards are reactive. Sentinel is predictive. It continually baselines your architecture and flags subtle deviations—memory leaks, latency creep, or error spikes—hours before they trigger an alert.",
            component: <SilentWarningDemo />
        },
        {
            title: "Memory & Learning",
            headline: "Sentinel remembers what humans forget.",
            desc: "Every incident is learned. When a similar failure pattern re-emerges, Sentinel instantly links it to the past root cause and solution, turning tribal knowledge into system intelligence.",
            component: <RecurringPatternDemo />
        }
    ];

    return (
        <section className="py-32 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
            {/* Center Thread Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent hidden lg:block -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-32 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-display font-bold text-gray-900 tracking-tight sm:text-5xl mb-6">
                        A glimpse into how an <span className="text-sentinel-600">intelligent system</span> thinks.
                    </h2>
                    <p className="text-xl text-gray-500">
                        See beyond the logs. Sentinel turns raw data into engineering foresight.
                    </p>
                </div>

                <div className="space-y-40">
                    {demos.map((d, i) => (
                        <div key={i} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

                            {/* Text Side */}
                            <div className="flex-1 space-y-6 relative">
                                {/* Thread Connector Dot (Desktop only) */}
                                <div className={`hidden lg:block absolute top-8 w-4 h-4 bg-white border-4 border-sentinel-100 rounded-full shadow-sm z-20 ${i % 2 === 0 ? '-right-[66px]' : '-left-[66px]'}`}>
                                    <div className="w-1.5 h-1.5 bg-sentinel-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>

                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sentinel-50 border border-sentinel-100 text-sentinel-600 text-xs font-bold uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sentinel-500 animate-pulse" />
                                    0{i + 1} — {d.title}
                                </div>

                                <h3 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                                    {d.headline}
                                </h3>
                                <p className="text-lg text-gray-500 leading-relaxed">
                                    {d.desc}
                                </p>
                            </div>

                            {/* Demo Side */}
                            <div className="flex-1 w-full">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    className="relative"
                                >
                                    {/* Background decoration */}
                                    <div className={`absolute -inset-4 bg-gradient-to-r rounded-3xl opacity-30 blur-2xl -z-10 ${i === 1 ? 'from-amber-200 to-orange-100' : 'from-blue-200 to-purple-100'}`} />

                                    {d.component}
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

