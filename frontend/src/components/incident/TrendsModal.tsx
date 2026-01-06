import React from 'react';
import { X, TrendingUp, AlertCircle, Clock, ArrowRight, Activity } from 'lucide-react';
import type { TrendAnalysisResponse } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendsModalProps {
    isOpen: boolean;
    onClose: () => void;
    trends: TrendAnalysisResponse | null;
    isLoading: boolean;
}

export const TrendsModal: React.FC<TrendsModalProps> = ({ isOpen, onClose, trends, isLoading }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2 text-indigo-900">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-semibold">Trend Analysis</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <p className="text-slate-500 animate-pulse">Analyzing service trends...</p>
                            </div>
                        ) : trends ? (
                            <div className="space-y-6">
                                {/* Summary */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-500" />
                                        Summary
                                    </h3>
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-slate-700 leading-relaxed font-medium">
                                        {trends.trendSummary}
                                    </div>
                                </div>

                                {/* Frequency Analysis */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        Frequency
                                    </h3>
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-slate-700 leading-relaxed">
                                        {trends.frequencyAnalysis}
                                    </div>
                                </div>

                                {/* Patterns */}
                                {trends.recurringPatterns && trends.recurringPatterns.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-slate-500" />
                                            Recurring Patterns
                                        </h3>
                                        <ul className="space-y-2">
                                            {trends.recurringPatterns.map((pattern, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                                    {pattern}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Impact */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                        Projected Impact
                                    </h3>
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-slate-700 leading-relaxed">
                                        {trends.projectedImpact}
                                    </div>
                                </div>

                                {/* Based On Incidents */}
                                {trends.relatedIncidentIds && trends.relatedIncidentIds.length > 0 && (
                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Based on Incidents
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {trends.relatedIncidentIds.map((id) => (
                                                <span key={id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    {id}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No trend analysis available.
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
