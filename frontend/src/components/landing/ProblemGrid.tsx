import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        title: "Traditional Tools",
        icon: (
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        description: "Alert fatigue. Wake up at 3AM. Manually correlate logs. Repeat.",
        color: "bg-red-50 border-red-100"
    },
    {
        title: "The Missing Link",
        icon: (
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        description: "Dashboards show 'what' broke, but never 'why' or 'where'.",
        color: "bg-amber-50 border-amber-100"
    },
    {
        title: "Sentinel's Approach",
        icon: (
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        description: "AI that understands code & context. We solve it before you see it.",
        color: "bg-blue-50 border-blue-100"
    }
];

export const ProblemGrid: React.FC = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        Stop Fighting Fires. <span className="text-gray-400">Start Predicting Them.</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Traditional observability tools are great at showing you red graphs. Sentinel is built to tell you what to do about them.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-2xl border ${f.color} hover:shadow-lg transition-shadow bg-opacity-50`}
                        >
                            <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{f.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 border-t border-gray-100 pt-10 text-center">
                    <p className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                        Sentinel Changes The Paradigm
                    </p>
                </div>
            </div>
        </section>
    );
};
