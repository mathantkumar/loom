import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { label: "Logs Analyzed", value: "10M+" },
    { label: "Early Warnings", value: "24/7" },
    { label: "Confidence", value: "98%" },
    { label: "Setup Time", value: "< 5min" }
];

export const MetricsStrip: React.FC = () => {
    return (
        <div className="w-full bg-white border-y border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center flex-1 min-w-[150px]"
                    >
                        <div className="text-4xl font-display font-bold text-gray-900 tracking-tight mb-1">{s.value}</div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{s.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
