import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { SeverityBadge } from './ui/Badge';
import { api } from '../api/client';
import type { SimilarIncidentResponse } from '../types';

export function SimilarIncidentsPanel({ incidentId }: { incidentId: string }) {
    const [similar, setSimilar] = useState<SimilarIncidentResponse[]>([]);

    useEffect(() => {
        api.getSimilar(incidentId).then(setSimilar).catch(console.error);
    }, [incidentId]);

    if (similar.length === 0) return null;

    return (
        <Card>
            <CardHeader title="Similar Resolved Incidents" />
            <CardContent>
                <ul className="divide-y divide-gray-100">
                    {similar.map((inc) => (
                        <li key={inc.incidentId} className="py-3">
                            <div className="flex justify-between">
                                <p className="text-sm font-medium text-gray-900">{inc.title}</p>
                                <SeverityBadge severity={inc.severity} />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{inc.rootCause}</p>
                            <div className="mt-2 text-xs text-indigo-600">
                                Similarity Match: {(inc.score * 100).toFixed(1)}%
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
