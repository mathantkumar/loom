import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { SimilarIncidentResponse } from '../../types';

interface PastContextPanelProps {
    incidentId: string;
}

export const PastContextPanel: React.FC<PastContextPanelProps> = ({ incidentId }) => {
    const [similar, setSimilar] = useState<SimilarIncidentResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getSimilar(incidentId)
            .then(data => setSimilar(data.slice(0, 3))) // Top 3
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [incidentId]);

    return (
        <div className="space-y-6">

            {/* 1. Historical Signals Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-900">Historical Signals</h3>
                </div>
                <div className="p-4 space-y-3">
                    {/* Mocked Insights */}
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600">
                            Service <span className="font-medium text-gray-900">payment-service</span> has had <span className="font-medium text-amber-600">3 SEV2+ incidents</span> in the last 30 days.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600">
                            Database latency issues typically spike on <span className="font-medium text-gray-900">Fridays between 4-6 PM EST</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Similar Incidents */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Similar Incidents</h3>
                    <span className="text-xs text-gray-500 font-mono">Based on embedding</span>
                </div>
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-400">Loading context...</div>
                    ) : similar.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500 mb-1">This appears to be a new pattern.</p>
                            <p className="text-xs text-green-600 font-medium">Loom will monitor for recurrence.</p>
                        </div>
                    ) : (
                        similar.map(inc => (
                            <div key={inc.incidentId} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-medium text-blue-600 group-hover:underline truncate w-3/4">
                                        {inc.title}
                                    </h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${inc.severity === 'SEV1' ? 'bg-red-50 text-red-700 border-red-100' :
                                        inc.severity === 'SEV2' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                        {inc.severity}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{inc.rootCause}</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 flex-grow bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${inc.score * 100}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400">{(inc.score * 100).toFixed(0)}% match</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 3. Potential Fixes */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-900">Suggested Fixes</h3>
                </div>
                <div className="p-4">
                    <ul className="space-y-3">
                        <li className="flex gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span>
                            <span>Restarting the <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">payment-consumer</code> pod resolved 2 similar incidents.</span>
                        </li>
                        <li className="flex gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span>
                            <span>Check for <span className="font-medium text-gray-900">connection pool exhaustion</span> in RDS metrics.</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
};
