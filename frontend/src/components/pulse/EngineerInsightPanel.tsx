import React, { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Engineer {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    currentLoadScore: number;
    burnoutRisk: number;
    activeIncidents: number; // Used for context
    assignedProjects: number;
    statusNarrative: string;
    trendHistory?: number[]; // [0.1, 0.2, ...]
    dailyInterruptions?: number;
    teamId?: string;
}

interface Props {
    engineer: Engineer;
}

export const EngineerInsightPanel: React.FC<Props> = ({ engineer }) => {
    const [expanded, setExpanded] = useState(false);

    // Helpers
    const getRiskLevel = (risk: number) => {
        if (risk > 0.7) return { label: 'High Risk', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle };
        if (risk > 0.4) return { label: 'Elevated', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock };
        return { label: 'Optimal', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle2 };
    };

    const riskMeta = getRiskLevel(engineer.burnoutRisk);
    const RiskIcon = riskMeta.icon;

    // Trend Sparkline (Simple SVG)
    const renderSparkline = (data: number[] | undefined) => {
        if (!data || data.length === 0) return null;
        const width = 100;
        const height = 30;

        const step = width / (data.length - 1);

        const path = data.map((val, i) => {
            const x = i * step;
            const y = height - (val * height); // Invert Y
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="overflow-visible">
                <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                <circle cx={(data.length - 1) * step} cy={height - (data[data.length - 1] * height)} r="3" className="fill-indigo-500" />
            </svg>
        );
    };

    return (
        <div className={`bg-white border transition-all duration-300 ${expanded ? 'border-indigo-200 shadow-md rounded-xl my-4' : 'border-slate-100 rounded-lg hover:border-slate-300 my-2'}`}>

            {/* Main Row */}
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>

                {/* 1. Identity */}
                <div className="flex items-center gap-4 w-1/3">
                    <Avatar src={engineer.avatarUrl} name={engineer.name} className="h-10 w-10" />
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{engineer.name}</h4>
                        <p className="text-xs text-slate-500">{engineer.role} • {engineer.teamId || 'Engineering'}</p>
                    </div>
                </div>

                {/* 2. Load Bar */}
                <div className="flex-1 px-8">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">Cognitive Load</span>
                        <span className="text-slate-900 font-bold">{(engineer.currentLoadScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ${engineer.currentLoadScore > 0.7 ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                            style={{ width: `${engineer.currentLoadScore * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* 3. Risk Status */}
                <div className="w-1/6 flex justify-end">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${riskMeta.color}`}>
                        <RiskIcon className="w-3.5 h-3.5" />
                        {riskMeta.label}
                    </div>
                </div>

                {/* 4. Expand Icon */}
                <div className="ml-4 text-slate-400">
                    {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-4 pb-6 pt-2 border-t border-slate-50 grid grid-cols-12 gap-8 animate-in slide-in-from-top-2 duration-200">

                    {/* Left: Narrative & Context */}
                    <div className="col-span-8 space-y-4">
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pulse Analysis</h5>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {engineer.statusNarrative}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                                <span className="text-xs text-slate-500 block mb-1">Estimated Interruptions</span>
                                <span className="text-xl font-bold text-slate-800">{engineer.dailyInterruptions || 0} / day</span>
                            </div>
                            <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                                <span className="text-xs text-slate-500 block mb-1">Context Switches</span>
                                <span className="text-xl font-bold text-slate-800">{engineer.activeIncidents} Incidents + {engineer.assignedProjects} Projects</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Trend & Recommendation */}
                    <div className="col-span-4 border-l border-slate-100 pl-8">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">14-Day Trend</h5>
                        <div className="mb-6">
                            {renderSparkline(engineer.trendHistory)}
                            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                                <span>14 days ago</span>
                                <span>Today</span>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommendation</h5>
                            <p className="text-xs text-indigo-600 font-medium">
                                {engineer.burnoutRisk > 0.6
                                    ? "Reduce incident rotation frequency. Consider offloading 1 project."
                                    : "Capacity looks healthy. Good candidate for new initiative lead."}
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
