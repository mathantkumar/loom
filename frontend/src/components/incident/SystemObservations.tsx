import React, { useState } from 'react';
import { Upload, FileText, Server, Activity, ChevronDown, ChevronRight } from 'lucide-react';
import { EvidenceUpload } from '../EvidenceUpload';
import type { Evidence } from '../../types';

interface SystemObservationsProps {
    incidentId: string;
    evidence?: Evidence[];
}

export const SystemObservations: React.FC<SystemObservationsProps> = ({ incidentId, evidence = [] }) => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Mocked Auto-detected Signals
    const signals = [
        { icon: Server, label: 'Memory Usage Spike', detail: '> 92% heap utilization detected on payment-service-04', time: '10m ago' },
        { icon: Activity, label: 'Latency Degradation', detail: 'p99 latency increased by 450ms', time: '12m ago' },
        { icon: FileText, label: 'Log Error Rate', detail: 'Exception "ConnectionPoolTimeout" frequency > 50/min', time: '15m ago' },
    ];

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    System Observations
                </h2>
                <span className="text-xs text-slate-500">3 Signals Detected</span>
            </div>

            <div className="p-0">
                {/* Signals List */}
                <div className="divide-y divide-slate-100">
                    {signals.map((signal, idx) => (
                        <div key={idx} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <signal.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className="text-sm font-semibold text-slate-800">{signal.label}</h3>
                                    <span className="text-xs font-mono text-slate-400">{signal.time}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{signal.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Evidence / Upload Section */}
                <div className="border-t border-slate-100">
                    <button
                        onClick={() => setIsUploadOpen(!isUploadOpen)}
                        className="w-full flex items-center justify-between p-3 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Manual Evidence ({evidence.length} files)</span>
                        </div>
                        {isUploadOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {isUploadOpen && (
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                            <EvidenceUpload incidentId={incidentId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
