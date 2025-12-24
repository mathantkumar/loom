import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { IncidentStatsResponse } from '../types';

export function IncidentStatsChart({ stats }: { stats: IncidentStatsResponse }) {
    if (!stats) return null;

    const data = Object.entries(stats.severityCounts).map(([severity, count]) => ({
        name: severity,
        count,
    }));

    // Colors matching Badge.tsx
    const colors: Record<string, string> = {
        SEV1: '#ef4444', // red-500
        SEV2: '#f97316', // orange-500
        SEV3: '#eab308', // yellow-500
        SEV4: '#3b82f6', // blue-500
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Incident Overview</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[entry.name] || '#9ca3af'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded p-2">
                    <p className="text-sm text-gray-500">Total Incidents</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalIncidents}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                    <p className="text-sm text-green-600">Resolved</p>
                    <p className="text-xl font-bold text-green-700">
                        {stats.statusCounts['RESOLVED'] || 0}
                    </p>
                </div>
            </div>
        </div>
    );
}
