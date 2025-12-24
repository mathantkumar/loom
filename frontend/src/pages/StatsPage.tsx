
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { StatsHeroCards } from '../components/stats/StatsHeroCards';
import { IncidentFrequencyChart } from '../components/stats/IncidentFrequencyChart';
import { StatusDistributionChart } from '../components/stats/StatusDistributionChart';
import { EngineerLoadList } from '../components/stats/EngineerLoadList';
import { AIInsightsSidebar } from '../components/stats/AIInsightsSidebar';
import type { IncidentStatsResponse } from '../types';

export function StatsPage() {
    const [stats, setStats] = useState<IncidentStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getStats()
            .then(data => setStats(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                    <p className="text-gray-500 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!stats) return <div className="text-center py-20">Failed to load stats</div>;

    return (
        <div className="bg-gray-50/50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operations Intelligence</h1>
                        <p className="text-gray-500 mt-1">Real-time health of your incident response ecosystem</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Time Range</span>
                        <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                            <option>Year to Date</option>
                        </select>
                    </div>
                </div>

                {/* KPI Cards */}
                <StatsHeroCards stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content (Left 8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Frequency Chart */}
                        <IncidentFrequencyChart data={stats.incidentsByDay} />

                        {/* Distribution Charts */}
                        <StatusDistributionChart
                            statusCounts={stats.statusCounts}
                            serviceCounts={stats.incidentsByService}
                        />
                    </div>

                    {/* Sidebar (Right 4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* AI Insights */}
                        <AIInsightsSidebar />

                        {/* Engineer Load */}
                        <EngineerLoadList engineers={stats.engineerStats} />
                    </div>
                </div>
            </div>
        </div>
    );
}
