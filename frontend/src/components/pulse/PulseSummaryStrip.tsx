import React from 'react';
import { Activity, Users, AlertTriangle, Layers } from 'lucide-react';

interface Props {
    orgLoad: number;
    totalEngineers: number;
    highRiskCount: number;
    teamCount: number;
}

export const PulseSummaryStrip: React.FC<Props> = ({ orgLoad, totalEngineers, highRiskCount, teamCount }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

            {/* 1. Org Load Index */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Activity className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                        ↓ 2% vs last week
                    </span>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{(orgLoad * 100).toFixed(0)}%</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Org Load Index</p>
                </div>
            </div>

            {/* 2. Engineers Tracked */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{totalEngineers}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Engineers Active</p>
                </div>
            </div>

            {/* 3. Teams Tracked - Replaces old "Avg Load" which was redundant with Org Load */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{teamCount}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Teams Monitored</p>
                </div>
            </div>

            {/* 4. Rising Risks */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    {highRiskCount > 0 && (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center animate-pulse">
                            Action Required
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{highRiskCount}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Elevated Burnout Risks</p>
                </div>
            </div>

        </div>
    );
};
