import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { AnalysisResponse } from '../types';

interface LiveIntelligencePanelProps {
    incidentId: string;
    incidentCreatedAt: string; // To calculate Duration if needed
}

export const LiveIntelligencePanel: React.FC<LiveIntelligencePanelProps> = ({ incidentId }) => {
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [baselineAnalysis, setBaselineAnalysis] = useState<any | null>(null); // Using any for BaselineAnalysisResponse for now
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Parallel fetch for speed
                const [aiRes, baselineRes] = await Promise.allSettled([
                    api.analyzeIncident(incidentId),
                    fetch(`/api/incidents/${incidentId}/baseline-analysis`).then(res => res.ok ? res.json() : null)
                ]);

                if (aiRes.status === 'fulfilled') {
                    setAnalysis(aiRes.value);
                }
                if (baselineRes.status === 'fulfilled') {
                    setBaselineAnalysis(baselineRes.value);
                }
            } catch (error) {
                console.error("Failed to fetch intelligence", error);
            } finally {
                setLoading(false);
            }
        };

        if (incidentId) {
            fetchData();
        }
    }, [incidentId]);

    // Derived Health / Risk Logic
    const getRiskLevel = () => {
        if (baselineAnalysis?.deviationScore > 0.8) return 'CRITICAL';
        if (baselineAnalysis?.isDeviating) return 'AT RISK';
        // Fallback logic if we had duration data vs baseline
        return 'NORMAL';
    };

    const risk = getRiskLevel();

    if (loading) {
        return (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Live Intelligence
                </h3>
                <span className="text-[10px] text-gray-400">Auto-updating</span>
            </div>

            <div className="divide-y divide-gray-100">
                {/* 1. Health Snapshot */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Incident Health</span>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${risk === 'AT RISK' ? 'bg-amber-100 text-amber-700' :
                            risk === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                            {risk}
                        </span>
                    </div>
                    {baselineAnalysis?.deviationScore > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                            Deviation Score: {(baselineAnalysis.deviationScore * 100).toFixed(0)}/100
                        </div>
                    )}
                </div>

                {/* 2. Hypothesis Tracker */}
                {analysis?.hypotheses && analysis.hypotheses.length > 0 && (
                    <div className="p-4">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">Hypothesis Tracker</h4>
                        <div className="space-y-3">
                            {analysis.hypotheses.slice(0, 3).map((hyp, idx) => (
                                <div key={idx} className="relative pl-3 border-l-2 border-indigo-100">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-gray-800 font-medium leading-tight">{hyp.rootCause}</p>
                                        <span className="text-xs font-mono text-indigo-600 ml-2">{(hyp.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">Source: {hyp.source}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Baseline Deviations */}
                {baselineAnalysis?.isDeviating && baselineAnalysis?.keyFactors && (
                    <div className="p-4 bg-amber-50/30">
                        <h4 className="text-xs font-semibold text-amber-800/70 uppercase mb-2">Deviation Factors</h4>
                        <ul className="space-y-1">
                            {baselineAnalysis.keyFactors.map((factor: string, idx: number) => (
                                <li key={idx} className="text-xs text-amber-900 flex items-start gap-1.5">
                                    <span className="mt-1 block w-1 h-1 rounded-full bg-amber-400 flex-shrink-0"></span>
                                    {factor}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. Suggested Checks -> Using 'Resolution' as hint */}
                {analysis?.resolution && (
                    <div className="p-4">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Suggested Checks (AI)</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {analysis.resolution}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
