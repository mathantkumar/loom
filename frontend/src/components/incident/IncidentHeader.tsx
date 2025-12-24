import React from 'react';
import { Bot } from 'lucide-react';
import { SeverityBadge } from '../ui/Badge';
import { StatusSelect } from '../StatusSelect';
import type { Incident, IncidentStatus } from '../../types';

interface IncidentHeaderProps {
    incident: Incident;
    onStatusChange: (status: IncidentStatus) => Promise<void>;
    aiSummary?: string;
}

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({ incident, onStatusChange, aiSummary }) => {
    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Top Meta Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-slate-400">#{incident.id.slice(0, 8)}</span>
                    <SeverityBadge severity={incident.severity} />
                    <StatusSelect currentStatus={incident.status} onStatusChange={onStatusChange} />

                    {/* AI Status Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </div>
                        <span className="text-xs font-medium text-indigo-700">AI Monitoring Active</span>
                    </div>
                </div>

                <div className="flex items-center text-sm text-slate-500 gap-4">
                    <span>{incident.service}</span>
                    <span className="text-slate-300">|</span>
                    <span>{new Date(incident.createdAt).toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                {incident.title}
            </h1>

            {/* AI Executive Sentence */}
            <div className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700 text-lg leading-relaxed font-medium">
                        {aiSummary || incident.description}
                    </p>
                </div>
            </div>
        </div>
    );
};
