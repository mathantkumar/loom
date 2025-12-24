import React from 'react';
import { Sparkles, History, Clock } from 'lucide-react';
import type { Incident, AnalysisResponse } from '../../types';

interface AIInsightPanelProps {
    incident: Incident;
    analysis?: AnalysisResponse | null;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ incident, analysis }) => {
    // Mock Data if Analysis not ready
    const confidence = analysis?.confidenceScore || 0.85;
    const confidenceLabel = confidence > 0.8 ? 'HIGH' : (confidence > 0.5 ? 'MEDIUM' : 'LOW');
    const rootCause = analysis?.rootCause || "Analysis in progress...";

    // Derived Health
    const healthStatus = incident.status === 'RESOLVED' ? 'Repaired' : (incident.severity === 'SEV1' ? 'Degrading' : 'Stable');
    const healthColor = healthStatus === 'Repaired' ? 'text-green-600' : (healthStatus === 'Degrading' ? 'text-red-600' : 'text-amber-600');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">AI Insights</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-auto">
                    Auto-updating
                </span>
            </div>

            {/* Primary Insight Card */}
            <div className="bg-white rounded-lg border border-indigo-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="p-5">

                    {/* Health & Confidence Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-xs text-slate-400 block mb-0.5">Incident Health</span>
                            <span className={`text-sm font-bold ${healthColor} flex items-center gap-1.5`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${healthStatus === 'Degrading' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                {healthStatus}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-400 block mb-0.5">Confidence</span>
                            <span className="text-sm font-bold text-slate-700">{confidenceLabel}</span>
                        </div>
                    </div>

                    {/* Hypothesis */}
                    <div className="mb-4">
                        <span className="text-xs text-slate-400 block mb-1">Primary Hypothesis</span>
                        <p className="text-sm font-medium text-slate-800 leading-snug">
                            {rootCause}
                        </p>
                    </div>

                    {/* Patterns */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                            <History className="w-3.5 h-3.5 text-purple-500 mt-0.5" />
                            <div>
                                <span className="block text-xs font-semibold text-slate-700">Recurring Signal</span>
                                <span className="text-xs text-slate-500">Matches 3 previous incidents in <strong>{incident.service}</strong> (High Similarity).</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                            <div>
                                <span className="block text-xs font-semibold text-slate-700">Time Projection</span>
                                <span className="text-xs text-slate-500">Similar incidents typically resolve within <strong>45 mins</strong>.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Context Stats (Mini) */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                    <span className="text-xs text-slate-400 block">Service Impact</span>
                    <span className="text-sm font-semibold text-slate-700">High</span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                    <span className="text-xs text-slate-400 block">Customer Report</span>
                    <span className="text-sm font-semibold text-slate-700">Yes (5)</span>
                </div>
            </div>

        </div>
    );
};
