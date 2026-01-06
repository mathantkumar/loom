import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { Incident } from '../../types';
import { AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';

interface ContextPanelProps {
    incidentId: string;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ incidentId }) => {
    const [incident, setIncident] = useState<Incident | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const data = await api.getIncident(incidentId);
                setIncident(data);
            } catch (error) {
                console.error("Failed to load incident context", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [incidentId]);

    if (loading) return <div className="p-4 text-slate-400 text-sm">Loading context...</div>;
    if (!incident) return <div className="p-4 text-slate-400 text-sm">Incident not found</div>;

    return (
        <div className="h-full bg-slate-50 border-r border-slate-200 flex flex-col w-80">
            <div className="p-4 border-b border-slate-200 bg-white">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Incident Context</h2>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${incident.severity === 'SEV1' ? 'bg-red-100 text-red-700' :
                        incident.severity === 'SEV2' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {incident.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{incident.publicId}</span>
                </div>
                <h3 className="font-semibold text-slate-800 mt-2 leading-tight">{incident.title}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Status */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Status</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        {incident.status === 'RESOLVED' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-blue-500" />}
                        {incident.status}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Description</h4>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{incident.description}</p>
                </div>

                {/* Service */}
                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Impacted Service</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {incident.service}
                    </div>
                </div>

                {/* Root Cause (if available) */}
                {incident.rootCause && (
                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Root Cause</h4>
                        <div className="bg-indigo-50 p-3 rounded-md text-sm text-indigo-900 border border-indigo-100">
                            <Info className="w-4 h-4 inline mr-1 text-indigo-500" />
                            {incident.rootCause}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
