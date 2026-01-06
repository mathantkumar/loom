import React from 'react';
import { Card } from './brand/Card';
import type { IncidentStatsResponse } from '../types';

interface DashboardStatsProps {
    stats: IncidentStatsResponse | null;
    onStatusClick?: (status: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, onStatusClick }) => {
    if (!stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    const statusCounts = stats?.statusCounts || {};
    const openCount = (statusCounts['OPEN'] || 0) + (statusCounts['INVESTIGATING'] || 0);
    const resolvedCount = (statusCounts['RESOLVED'] || 0) + (statusCounts['CLOSED'] || 0) + (statusCounts['MITIGATED'] || 0);
    const pendingCount = statusCounts['PENDING_CONFIRMATION'] || 0;

    // Calculate resolution rate
    const resolutionRate = stats.totalIncidents > 0
        ? Math.round((resolvedCount / stats.totalIncidents) * 100)
        : 0;

    const cards = [
        {
            label: 'Total Incidents',
            value: stats.totalIncidents,
            icon: (
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: 'bg-blue-50 border-blue-100',
            onClick: () => onStatusClick?.('All')
        },
        {
            label: 'Open / Active',
            value: openCount,
            icon: (
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            color: 'bg-orange-50 border-orange-100',
            onClick: () => onStatusClick?.('OPEN')
        },
        {
            label: 'Pending Confirmation',
            value: pendingCount,
            icon: (
                <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'bg-purple-50 border-purple-100',
            onClick: () => onStatusClick?.('PENDING_CONFIRMATION')
        },
        {
            label: 'Resolution Rate',
            value: `${resolutionRate}%`,
            icon: (
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-50 border-green-100',
            onClick: undefined
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => {
                const isClickable = !!card.onClick;
                return (
                    <Card
                        key={idx}
                        onClick={card.onClick}
                        className={`h-full transition-all duration-200 border-gray-100 shadow-sm ${isClickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : ''
                            }`}
                        noPadding
                    >
                        <div className="p-6 flex items-center justify-between h-full bg-white gap-4">
                            <div className="flex flex-col justify-center gap-1">
                                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                                <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-2xl ${card.color.split(' ')[0]} bg-opacity-50`}>
                                <div className="w-8 h-8">
                                    {React.cloneElement(card.icon as React.ReactElement, {
                                        className: `w-full h-full ${card.color.includes('red') ? 'text-red-600' :
                                                card.color.includes('orange') ? 'text-orange-600' :
                                                    card.color.includes('purple') ? 'text-purple-600' :
                                                        card.color.includes('green') ? 'text-green-600' :
                                                            'text-blue-600'
                                            }`
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
