import React from 'react';
import type { IncidentStatsResponse } from '../../types';

interface StatsHeroCardsProps {
    stats: IncidentStatsResponse;
}

export const StatsHeroCards: React.FC<StatsHeroCardsProps> = ({ stats }) => {
    // Helper to format minutes/hours
    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${(seconds / 3600).toFixed(1)}h`;
    };

    const severityCounts = stats?.severityCounts || {};
    const criticalCount = (severityCounts['SEV1'] || 0) + (severityCounts['SEV2'] || 0);

    const cards = [
        {
            label: 'Total Incidents',
            value: stats.totalIncidents,
            change: `${stats.frequencyTrendPercent > 0 ? '+' : ''}${stats.frequencyTrendPercent}%`,
            trend: stats.frequencyTrendPercent > 0 ? 'up' : stats.frequencyTrendPercent < 0 ? 'down' : 'neutral',
            inverse: true // More incidents is bad usually
        },
        {
            label: 'MTTR (Avg)',
            value: formatDuration(stats.avgMttrSeconds),
            change: `${stats.mttrTrendPercent > 0 ? '+' : ''}${stats.mttrTrendPercent}%`,
            trend: stats.mttrTrendPercent > 0 ? 'up' : stats.mttrTrendPercent < 0 ? 'down' : 'neutral',
            inverse: true // Higher MTTR is bad
        },
        {
            label: 'Critical (SEV1/2)',
            value: criticalCount,
            change: '0%', // Mocked for now if not tracked in backend diff
            trend: 'neutral',
            inverse: true
        },
        {
            label: 'Resolution Rate',
            value: Math.round((stats.statusCounts['RESOLVED'] || 0) / (stats.totalIncidents || 1) * 100) + '%',
            change: '+2%',
            trend: 'up',
            inverse: false // Higher is good
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {cards.map((card, i) => {
                // Determine color based on trend and inverse flag
                // If inverse=true (bad thing), Up is Red, Down is Green
                // If inverse=false (good thing), Up is Green, Down is Red
                let trendColor = 'bg-gray-100 text-gray-600';
                if (card.trend === 'up') {
                    trendColor = card.inverse ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700';
                } else if (card.trend === 'down') {
                    trendColor = card.inverse ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';
                }

                return (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-gray-500">{card.label}</p>
                        <div className="mt-3 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendColor} flex items-center`}>
                                {card.change}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
