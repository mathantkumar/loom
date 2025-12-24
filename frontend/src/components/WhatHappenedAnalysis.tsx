import React from 'react';
import type { BaselineAnalysisResponse } from '../types';

interface WhatHappenedAnalysisProps {
    analysis: BaselineAnalysisResponse | null;
    loading: boolean;
    error?: string;
}

export const WhatHappenedAnalysis: React.FC<WhatHappenedAnalysisProps> = ({ analysis, loading, error }) => {
    if (loading) {
        return (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center space-y-3 min-h-[200px]">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 font-medium">Analyzing incident behavior...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 text-center text-gray-400 text-sm">
                Analysis unavailable
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden ring-1 ring-indigo-50/50">
            {/* Header */}
            <div className="bg-indigo-50/30 px-4 py-3 border-b border-indigo-100/50 flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <h3 className="text-sm font-bold text-gray-700">What Happened? <span className="text-gray-400 font-normal">(AI Analysis)</span></h3>
            </div>

            <div className="p-5 space-y-5">
                {/* Status */}
                <div className="flex items-center gap-3">
                    {analysis.isDeviating ? (
                        <>
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg">⚠️</span>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Deviates from normal behavior</h4>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">✅</span>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Within normal operating patterns</h4>
                            </div>
                        </>
                    )}
                </div>

                {/* Explanation */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Explanation</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {analysis.explanation}
                    </p>
                </div>

                {/* Key Factors */}
                {analysis.keyFactors && analysis.keyFactors.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Factors</h4>
                        <ul className="space-y-2">
                            {analysis.keyFactors.map((factor, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                    {factor}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Confidence */}
                <div>
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confidence</span>
                        <span className="text-xs font-mono text-indigo-600 font-medium">{(analysis.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.confidenceScore * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50/50 px-4 py-2 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">AI-assisted analysis based on historical incident patterns</p>
            </div>
        </div>
    );
};
