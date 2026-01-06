import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Activity, BrainCircuit, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Video, Calendar } from 'lucide-react';
import { api } from '../../api/client';
import type { EscalationResponse } from '../../types';

interface SREEscalationProps {
    incidentId: string;
    onEscalate?: (response: EscalationResponse) => void;
}

export const SREEscalation: React.FC<SREEscalationProps> = ({ incidentId, onEscalate }) => {
    const navigate = useNavigate();
    const [state, setState] = useState<'idle' | 'engaging' | 'active'>('idle');
    const [data, setData] = useState<EscalationResponse | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleClick = async () => {
        if (state !== 'idle') return;

        setState('engaging');
        try {
            // Immediate feedback (optimistic)
            const res = await api.escalateIncident(incidentId);
            setData(res);
            setState('active');
            setIsExpanded(true);
            if (onEscalate) onEscalate(res);
        } catch (e) {
            console.error("Escalation failed", e);
            setState('idle');
        }
    };

    if (state === 'idle') {
        return (
            <button
                onClick={handleClick}
                className="w-full flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-400 hover:bg-indigo-100 transition-all group text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-200 rounded-full group-hover:bg-indigo-300 transition-colors">
                        <UserCheck className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">
                            Assign SRE on-call for deeper analysis
                        </span>
                        <span className="text-xs text-slate-500">Escalates to human + Triggers AI Deep Dive</span>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>
        );
    }

    if (state === 'engaging') {
        return (
            <div className="w-full p-4 bg-indigo-600 rounded-lg shadow-lg border border-indigo-500 flex items-center gap-3 text-white transition-all duration-500">
                <Activity className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold">Engaging On-Call SRE & Starting Deep Analysis...</span>
            </div>
        );
    }

    // Active State
    return (
        <div className="w-full bg-white rounded-lg border border-indigo-200 shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header: SRE Assigned */}
            <div
                className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center cursor-pointer hover:bg-indigo-100/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={data?.assigneeAvatar}
                            alt={data?.assigneeName}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border border-white"></div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">
                            {data?.assigneeName} <span className="text-xs font-normal text-slate-500">(On-Call • Database Lead)</span>
                        </h4>
                        <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Active now • ETA {data?.eta}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-white rounded-full border border-indigo-100 shadow-sm text-xs font-bold text-indigo-600">
                        SRE + AI Collaboration
                    </div>
                    <button
                        className="p-1 hover:bg-indigo-200 rounded-full text-indigo-400 hover:text-indigo-700 transition-colors"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* AI Deep Analysis View */}
            {isExpanded && (
                <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold uppercase tracking-wider">
                        <BrainCircuit className="w-4 h-4" />
                        AI Deep Analysis (Running)
                    </div>

                    <div className="space-y-2 h-32 overflow-hidden relative">
                        {/* Simulated Rolling Logs */}
                        <div className="space-y-1">
                            <div className="flex gap-2"><span className="text-slate-500">[18:42:01]</span> <span>Fetching recent deployment configs for diff analysis...</span></div>
                            <div className="flex gap-2"><span className="text-slate-500">[18:42:02]</span> <span className="text-blue-400">Correlating 24k log lines with Kubernetes events</span></div>
                            <div className="flex gap-2"><span className="text-slate-500">[18:42:04]</span> <span>Detected anomalous DB connection spikes (latency &gt; 2s)</span></div>
                            <div className="flex gap-2"><span className="text-slate-500">[18:42:05]</span> <span className="text-amber-400">Found 3 similar incidents related to connection pooling</span></div>
                            <div className="flex gap-2"><span className="text-slate-500">[18:42:06]</span> <span>Generating technical brief with suggested rollbacks...</span></div>
                            <div className="flex gap-2"><span className="text-slate-500">[18:42:07]</span> <span className="text-emerald-500">Briefing sent to SRE. Awaiting human input...</span></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center text-slate-400">
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/huddle/${incidentId}`)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
                            >
                                <Video className="w-3 h-3" />
                                Join Huddle
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md transition-colors">
                                <Calendar className="w-3 h-3" />
                                Schedule Sync
                            </button>
                        </div>
                        <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="w-3 h-3" /> Context Shared</span>
                    </div>
                </div>
            )}
        </div>
    );
};
