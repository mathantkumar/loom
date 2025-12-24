import React from 'react';
import { Activity, Target } from 'lucide-react';
import type { IncidentStatus } from '../../types';

interface Props {
    status: IncidentStatus;
    healthStatus?: 'Stable' | 'Degrading' | 'Recovering';
    hypothesis: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const HealthConfidence: React.FC<Props> = ({ healthStatus = 'Stable', hypothesis, confidence }) => {

    // Visual Meter for Confidence
    const getConfidenceMeter = () => {
        const levels = {
            HIGH: { width: 'w-full', color: 'bg-emerald-500', label: 'High Confidence', text: 'text-emerald-700' },
            MEDIUM: { width: 'w-2/3', color: 'bg-amber-500', label: 'Medium Confidence', text: 'text-amber-700' },
            LOW: { width: 'w-1/3', color: 'bg-red-500', label: 'Low Confidence', text: 'text-red-700' }
        };
        const active = levels[confidence];

        return (
            <div className="min-w-[140px]">
                <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Confidence</span>
                    <span className={`text-[10px] font-bold ${active.text}`}>{active.label}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${active.color} ${active.width} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            {/* 1. Health Signal */}
            <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${healthStatus === 'Degrading' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">System Health</span>
                    <div className="font-semibold text-slate-800 text-base">{healthStatus}</div>
                </div>
            </div>

            {/* 2. Primary Hypothesis (Center Stage) */}
            <div className="flex items-start gap-4 md:col-span-1 md:border-x md:border-slate-100 md:px-8">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Primary Hypothesis</span>
                    <p className="font-medium text-slate-900 text-sm leading-snug line-clamp-2" title={hypothesis}>
                        {hypothesis}
                    </p>
                </div>
            </div>

            {/* 3. Confidence Meter */}
            <div className="flex items-center justify-end pl-4">
                {getConfidenceMeter()}
            </div>

        </div>
    );
};
