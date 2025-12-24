import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

interface PatternResponse {
    patternType: 'RECURRING' | 'FIRST_OCCURRENCE';
    occurrenceCount: number;
    timeWindow: string;
    message: string;
}

interface PatternDetectorProps {
    incidentId: string;
}

export const PatternDetector: React.FC<PatternDetectorProps> = ({ incidentId }) => {
    const [pattern, setPattern] = useState<PatternResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPattern = async () => {
            try {
                const data = await api.getPattern(incidentId);
                setPattern(data);
            } catch (err) {
                console.error('Failed to fetch/detect pattern', err);
            } finally {
                setLoading(false);
            }
        };

        if (incidentId) {
            fetchPattern();
        }
    }, [incidentId]);

    if (loading) {
        return <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />;
    }

    if (!pattern) return null;

    const isRecurring = pattern.patternType === 'RECURRING';

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${isRecurring
            ? 'bg-orange-50 text-orange-700 border-orange-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
            <span className="mr-2 text-base">
                {isRecurring ? '🔁' : '🆕'}
            </span>
            <span>
                {pattern.message}
            </span>
        </div>
    );
};
