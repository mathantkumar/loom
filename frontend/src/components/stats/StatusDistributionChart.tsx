import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface StatusDistributionChartProps {
    statusCounts: Record<string, number>;
    serviceCounts: Record<string, number>;
}

// Enterprise Palette - Status (Accessible, Muted)
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    'OPEN': { label: 'Open', color: '#e11d48' },           // Rose-600
    'INVESTIGATING': { label: 'Investigating', color: '#d97706' }, // Amber-600
    'MITIGATED': { label: 'Mitigated', color: '#059669' },     // Emerald-600
    'RESOLVED': { label: 'Resolved', color: '#3b82f6' },       // Blue-500
    'CLOSED': { label: 'Closed', color: '#6b7280' },           // Gray-500
    'PENDING_CONFIRMATION': { label: 'Pending', color: '#7c3aed' } // Violet-600
};

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ statusCounts, serviceCounts }) => {

    const safeStatusCounts = statusCounts || {};
    const safeServiceCounts = serviceCounts || {};

    // ---------------------------
    // Data Prep: Incident State
    // ---------------------------
    const totalIncidents = Object.values(safeStatusCounts).reduce((acc, curr) => acc + curr, 0);
    const resolveData = Object.entries(safeStatusCounts)
        .map(([key, value]) => ({
            name: key,
            value,
            config: STATUS_CONFIG[key] || { label: key, color: '#9ca3af' }
        }))
        .filter(d => d.value > 0)
        .sort((a, b) => b.value - a.value);

    // ---------------------------
    // Data Prep: Top Services
    // ---------------------------
    const allServices = Object.entries(safeServiceCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const topServices = allServices.slice(0, 5);
    const othersCount = allServices.slice(5).reduce((acc, curr) => acc + curr.value, 0);

    // Final Service List (Top 5 + Others)
    const serviceList = [...topServices];
    if (othersCount > 0) {
        serviceList.push({ name: 'Others', value: othersCount });
    }

    const maxServiceCount = Math.max(...serviceList.map(s => s.value), 1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CARD 1: Incident State (Donut) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">Incident State</h3>
                </div>

                <div className="p-6 flex items-center justify-between flex-1">
                    {/* Left: Chart */}
                    <div className="relative w-48 h-48 flex-shrink-0">
                        {/* Centered Total */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                            <span className="text-3xl font-bold text-gray-900 tracking-tight">{totalIncidents}</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Total</span>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={resolveData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    cornerRadius={4}
                                >
                                    {resolveData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.config.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | undefined) => [value, 'Incidents']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Right: Legend */}
                    <div className="flex-1 pl-8 space-y-3">
                        {resolveData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm"
                                        style={{ backgroundColor: item.config.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                        {item.config.label}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md min-w-[2rem] text-center">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CARD 2: Top Affected Services (Ranked List) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900">Top Affected Services</h3>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Impact</span>
                </div>

                <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                    {serviceList.map((service, i) => {
                        const percent = (service.value / maxServiceCount) * 100;
                        return (
                            <div key={i} className="group cursor-default">
                                <div className="flex justify-between items-end mb-1.5 ">
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]" title={service.name}>
                                        {service.name}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {service.value}
                                    </span>
                                </div>
                                {/* Progress Bar */}
                                <div className="contain-layout w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-90"
                                        style={{
                                            width: `${percent}%`,
                                            backgroundColor: i === 0 ? '#3b82f6' :  // Top 1: Blue
                                                i === 1 ? '#60a5fa' :  // Top 2: Lighter Blue
                                                    i === 2 ? '#93c5fd' :  // Top 3: Even Lighter
                                                        '#cbd5e1'    // Others: Slate-300
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {serviceList.length === 0 && (
                        <div className="text-center text-gray-400 py-10">No data available</div>
                    )}
                </div>
            </div>

        </div>
    );
};
