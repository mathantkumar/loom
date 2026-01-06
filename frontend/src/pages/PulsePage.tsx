import React, { useState } from 'react';
import {
    Activity, Brain, Zap, Clock, Users, Sparkles, ChevronRight,
    AlertTriangle, CheckCircle, TrendingUp, AlertCircle, PlayCircle,
    ArrowRight, Lightbulb, GitMerge
} from 'lucide-react';
import type { EngineerPulse } from '../types/pulse';

// --- MOCK DATA ---
const MOCK_ENGINEERS: EngineerPulse[] = [
    {
        id: '1', name: 'Sarah Jenkins', role: 'Staff SRE', avatarInitials: 'SJ',
        status: 'Overloaded',
        activeLoadScore: 9,
        activeIncidents: 2,
        severityBreakdown: { sev1: 1, sev2: 1, sev3: 0 },
        timeOnIncidentToday: '6h 45m',
        longestStretch: '4h 10m',
        pageFrequency24h: 12,
        contextSwitchingScore: 'High',
        contextServicesCount: 8,
        decisionFatigueRisk: true,
        burnoutRisk: true,
    },
    {
        id: '2', name: 'Mike T.', role: 'Senior Backend', avatarInitials: 'MT',
        status: 'In flow',
        activeLoadScore: 4,
        activeIncidents: 1,
        severityBreakdown: { sev1: 0, sev2: 1, sev3: 0 },
        timeOnIncidentToday: '2h 15m',
        longestStretch: '1h 30m',
        pageFrequency24h: 3,
        contextSwitchingScore: 'Low',
        contextServicesCount: 2,
        decisionFatigueRisk: false,
        burnoutRisk: false,
    },
    {
        id: '3', name: 'Alex R.', role: 'DevOps', avatarInitials: 'AR',
        status: 'On-call',
        activeLoadScore: 7,
        activeIncidents: 1,
        severityBreakdown: { sev1: 0, sev2: 1, sev3: 0 },
        timeOnIncidentToday: '5h 10m',
        longestStretch: '2h 45m',
        pageFrequency24h: 8,
        contextSwitchingScore: 'Medium',
        contextServicesCount: 5,
        decisionFatigueRisk: true,
        burnoutRisk: false,
    },
    {
        id: '4', name: 'David Chen', role: 'Database Lead', avatarInitials: 'DC',
        status: 'Stable',
        activeLoadScore: 3, // Low load
        activeIncidents: 0,
        severityBreakdown: { sev1: 0, sev2: 0, sev3: 0 },
        timeOnIncidentToday: '0h 00m',
        longestStretch: '0h 00m',
        pageFrequency24h: 0,
        contextSwitchingScore: 'Low',
        contextServicesCount: 1,
        decisionFatigueRisk: false,
        burnoutRisk: false,
    },
];

const AI_INSIGHTS = [
    {
        id: 1, type: 'risk', text: "Decision fatigue risk detected for Sarah Jenkins (92% confidence).",
        time: '2m ago', action: 'Suggest Rotation'
    },
    {
        id: 2, type: 'context', text: "High context switching correlated with INC-204 and INC-198.",
        time: '14m ago', action: 'View Contexts'
    },
    {
        id: 3, type: 'pattern', text: "Predicted +40% load spike in 2 hours based on deployment cycle.",
        time: '1h ago', action: 'View Forecast'
    }
];

// --- COMPONENTS ---

// 1. Metric Card (Clean, standard style)
const MetricCard = ({ label, value, subtext, icon: Icon, trend, alert }: { label: string; value: string; subtext?: string; icon: any; trend?: 'up' | 'down' | 'neutral'; alert?: boolean }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <Icon size={18} />
            </div>
            {alert && <div className="w-2 h-2 rounded-full bg-amber-500" />}
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
        {subtext && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                <Lightbulb size={12} className="text-indigo-500" />
                {subtext}
            </div>
        )}
    </div>
);

// 2. Cognitive Load Table (Structured Data)
const CognitiveLoadTable = ({ engineers }: { engineers: EngineerPulse[] }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Users size={16} className="text-slate-400" /> Engineer Load
            </h3>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live Monitoring</div>
        </div>
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                    <th className="px-6 py-3">Engineer</th>
                    <th className="px-6 py-3">Current Load</th>
                    <th className="px-6 py-3">Active Incidents</th>
                    <th className="px-6 py-3">Context Switching</th>
                    <th className="px-6 py-3">Risk Status</th>
                    <th className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {engineers.map((eng) => (
                    <tr key={eng.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">
                                    {eng.avatarInitials}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">{eng.name}</div>
                                    <div className="text-xs text-slate-400">{eng.role}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 w-48">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium text-slate-500">
                                    <span>{eng.activeLoadScore * 10}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${eng.activeLoadScore > 7 ? 'bg-amber-500' :
                                            eng.activeLoadScore > 4 ? 'bg-indigo-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${eng.activeLoadScore * 10}%` }}
                                    />
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-medium text-slate-700">{eng.activeIncidents}</div>
                            {eng.activeIncidents > 0 && <div className="text-xs text-slate-400 mt-0.5">Primary Resolver</div>}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${eng.contextSwitchingScore === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                                eng.contextSwitchingScore === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                {eng.contextSwitchingScore}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {eng.burnoutRisk ? (
                                <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-md w-fit">
                                    <AlertTriangle size={12} /> Burnout Risk
                                </div>
                            ) : eng.decisionFatigueRisk ? (
                                <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md w-fit">
                                    <Activity size={12} /> Fatigue
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md w-fit">
                                    <CheckCircle size={12} /> Stable
                                </div>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
            <span>Showing {engineers.length} active engineers</span>
            <button className="hover:text-indigo-600 font-medium">View All Team Members</button>
        </div>
    </div>
);

// 3. Human Load Timeline (Clean Chart)
const HumanLoadTimeline = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-semibold text-slate-900">Human Load Forecast</h3>
                <p className="text-sm text-slate-500">Projected cognitive load over the next 12 hours based on incident patterns.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
                <TrendingUp size={14} /> Peak predicted at 19:30
            </div>
        </div>

        {/* Simple Bar Chart Visualization */}
        <div className="h-32 flex items-end justify-between gap-1">
            {Array.from({ length: 48 }).map((_, i) => {
                const height = 20 + Math.random() * 40 + (i > 30 ? 30 : 0); // Peak at end
                const isPeak = i > 30;
                return (
                    <div
                        key={i}
                        className={`flex-1 rounded-t-sm transition-all hover:opacity-80 ${i === 24 ? 'bg-indigo-600' : // Current
                            isPeak ? 'bg-amber-400' : 'bg-slate-200'
                            }`}
                        style={{ height: `${height}%` }}
                    />
                );
            })}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
            <span>12:00</span>
            <span className="text-indigo-600 font-bold">NOW</span>
            <span>24:00</span>
        </div>
    </div>
);

// 4. AI Insights Panel (Jira-style)
const AIInsightsPanel = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" /> AI Insights
            </h3>
        </div>
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {AI_INSIGHTS.map((insight) => (
                <div key={insight.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-slate-500">{insight.time}</span>
                        {insight.type === 'risk' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                    <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                        {insight.text}
                    </p>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase tracking-wider">
                        {insight.action} <ArrowRight size={12} />
                    </button>
                </div>
            ))}

            <div className="p-4 rounded-lg border border-dashed border-slate-200 flex flex-col items-center text-center justify-center gap-2 text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
                <Brain size={20} className="mb-1" />
                <span className="text-sm font-medium">Ask Sentinel analyzing...</span>
            </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Team Vitality</h4>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">Burnout Risk</span>
                        <span className="text-amber-600 font-bold">Elevated</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[65%]" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">Knowledge Distribution</span>
                        <span className="text-emerald-600 font-bold">Healthy</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[88%]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE ---

const PulsePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* 1. Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-20">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        Sentinel Pulse <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">BETA</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Cognitive load & human reliability intelligence</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        SYSTEM ACTIVE
                    </div>
                    <div className="text-sm text-slate-400">
                        Updated <span className="font-mono text-slate-600">now</span>
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-8 pt-8 space-y-8">

                {/* 2. Summary Row */}
                <div className="grid grid-cols-4 gap-6">
                    <MetricCard
                        label="Team Load Index"
                        value="72%"
                        icon={Activity}
                        subtext="+12% from last shift due to incident volume"
                    />
                    <MetricCard
                        label="Overloaded Engineers"
                        value="1"
                        icon={AlertCircle}
                        alert={true}
                        subtext="Sarah J. approaching 7h active incident time"
                    />
                    <MetricCard
                        label="Active Contexts"
                        value="8"
                        icon={GitMerge}
                        subtext="3 High-priority incidents concurrent"
                    />
                    <MetricCard
                        label="Risk Window"
                        value="19:30"
                        icon={Clock}
                        subtext="Shift handover overlaps with peak traffic"
                    />
                </div>

                {/* 3. Main Content Grid */}
                <div className="grid grid-cols-12 gap-8 items-start h-[600px]">
                    {/* Left: Table & Timeline (9 cols) */}
                    <div className="col-span-9 flex flex-col gap-8 h-full">
                        <CognitiveLoadTable engineers={MOCK_ENGINEERS} />
                        <HumanLoadTimeline />
                    </div>

                    {/* Right: AI Panel (3 cols) */}
                    <div className="col-span-3 h-full">
                        <AIInsightsPanel />
                    </div>
                </div>

            </div>
        </div>
    );
};



export default PulsePage;
