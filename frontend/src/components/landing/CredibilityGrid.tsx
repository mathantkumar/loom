import React from 'react';
import { motion } from 'framer-motion';

const items = [
    {
        title: "Vector-Native",
        desc: "We don't match keywords. We embed your entire infrastructure state to find semantic relationships.",
        stats: "384-dim embeddings"
    },
    {
        title: "Confidence-First",
        desc: "Sentinel never guesses blindly. Every insight comes with a confidence score and reasoning trace.",
        stats: "82% Reduction in noise"
    },
    {
        title: "Code Aware",
        desc: "We link stack traces back to specific commits and PRs, pinpointing the author and the change.",
        stats: "Git Integration"
    },
    {
        title: "Recurring Patterns",
        desc: "The system remembers every incident. If it happens again, we flag it instantly as a recurring pattern.",
        stats: "Historical Memory"
    }
];

export const CredibilityGrid: React.FC = () => {
    return (
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
            {/* Dark abstract overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-gray-900 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-16">
                    <h2 className="text-3xl font-display font-bold sm:text-4xl mb-4">
                        Built on Deep Intelligence.
                    </h2>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Not just regex and grep. Sentinel uses advanced LLMs and Vector Search to actually read your logs.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-12">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="flex items-baseline justify-between border-b border-gray-800 pb-4 mb-4 group-hover:border-blue-500/50 transition-colors">
                                <h3 className="text-xl font-display font-semibold text-white">{item.title}</h3>
                                <span className="text-xs font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded">{item.stats}</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
