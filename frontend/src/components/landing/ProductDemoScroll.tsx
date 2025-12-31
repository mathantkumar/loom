import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const demos = [
    {
        title: "Ask Anything",
        desc: "Natural language queries against your entire infrastructure state.",
        mock: (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl w-full max-w-md mx-auto aspect-video flex flex-col justify-center gap-3">
                <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">Q</div>
                    <div className="text-sm text-gray-300 bg-gray-900 px-4 py-2 rounded-lg">"Summarize the impact of the last deployment."</div>
                </div>
                <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">AI</div>
                    <div className="text-sm text-gray-300 bg-gray-700 px-4 py-3 rounded-lg flex-1">
                        <div className="h-2 bg-gray-600 rounded w-full mb-2"></div>
                        <div className="h-2 bg-gray-600 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Silent Warnings",
        desc: "We detect deviation from baseline performance before it triggers an alert.",
        mock: (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xl w-full max-w-md mx-auto aspect-video flex flex-col justify-center">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-semibold text-gray-700">Checkout Latency</span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Deviation Detected</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-2 px-2">
                    {[40, 45, 42, 48, 44, 46, 75, 82, 90, 95].map((h, i) => (
                        <div key={i} className={`w-full rounded-t ${h > 70 ? 'bg-amber-400' : 'bg-blue-200'}`} style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </div>
        )
    },
    {
        title: "Recurring Patterns",
        desc: "Sentinel flags incidents that look like repeats of past failures.",
        mock: (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xl w-full max-w-md mx-auto aspect-video flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 animate-pulse">
                        Recurring Pattern (98%)
                    </span>
                </div>
                <div className="space-y-4 pt-6">
                    <div className=" p-3 rounded-lg border border-red-100 bg-red-50">
                        <div className="text-xs text-red-600 font-bold mb-1">INC-204 (Today)</div>
                        <div className="h-2 bg-red-200 rounded w-3/4"></div>
                    </div>
                    <div className="flex justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 opacity-60">
                        <div className="text-xs text-gray-500 font-bold mb-1">INC-189 (2 weeks ago)</div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        )
    }
];

export const ProductDemoScroll: React.FC = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Sentinel In Action</h2>
                </div>

                <div className="space-y-32">
                    {demos.map((d, i) => (
                        <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 space-y-4">
                                <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">0{i + 1}</div>
                                <h3 className="text-2xl font-bold text-gray-900">{d.title}</h3>
                                <p className="text-lg text-gray-500 leading-relaxed">{d.desc}</p>
                            </div>
                            <div className="flex-1 w-full">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {d.mock}
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
