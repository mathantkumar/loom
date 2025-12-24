import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PulseSummaryStrip } from '../components/pulse/PulseSummaryStrip';
import { EngineerInsightPanel } from '../components/pulse/EngineerInsightPanel';

interface PulseData {
    engineers: any[];
    teams: any[];
    systemicSignals: any[];
    orgLoadIndex: number;
}

const PulsePage = () => {
    const [data, setData] = useState<PulseData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.getPulseData();
                setData(response);
            } catch (error) {
                console.error('Failed to fetch pulse data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) return <div className="p-8 text-center text-slate-500">Unable to load Pulse intelligence.</div>;

    const totalEngineers = data.engineers.length;
    const highRiskCount = data.engineers.filter((e: any) => e.burnoutRisk > 0.7).length;
    const teamCount = data.teams ? data.teams.length : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Sentinel Pulse</h1>
                <p className="text-slate-500 mt-2 max-w-2xl">
                    Live organizational intelligence. Analyzing signals across <span className="font-medium text-slate-700">{totalEngineers} engineers</span> and <span className="font-medium text-slate-700">{data.teams.length} teams</span>.
                </p>
            </div>

            {/* 1. Summary Strip */}
            <PulseSummaryStrip
                orgLoad={data.orgLoadIndex}
                totalEngineers={totalEngineers}
                highRiskCount={highRiskCount}
                teamCount={teamCount}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT: Engineer Insights List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Engineer Health
                            <span className="text-xs font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{totalEngineers} Active</span>
                        </h2>
                        {/* Filter placeholder */}
                        <div className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline">
                            View All Teams
                        </div>
                    </div>

                    <div className="space-y-1">
                        {data.engineers.map((eng: any) => (
                            <EngineerInsightPanel key={eng.id} engineer={eng} />
                        ))}
                    </div>
                </div>

                {/* RIGHT: Systemic Signals & Teams (Simplified for now) */}
                <div className="space-y-8">

                    {/* Systemic Signals Panel */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                            Systemic Signals
                        </h3>

                        <div className="space-y-6">
                            {data.systemicSignals && data.systemicSignals.length > 0 ? (
                                data.systemicSignals.map((sig: any) => (
                                    <div key={sig.id} className="relative pl-4 border-l-2 border-indigo-500/30">
                                        <h4 className="font-semibold text-indigo-50 text-sm mb-1">{sig.title}</h4>
                                        <p className="text-xs text-indigo-200/80 leading-relaxed mb-2">{sig.description}</p>
                                        <span className="text-[10px] font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200">{sig.type}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-indigo-300 italic">No systemic anomalies detected.</p>
                            )}
                        </div>
                    </div>

                    {/* Team Load Distribution (Placeholder for TeamIntelligencePanel) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Team Stress Levels</h3>

                        <div className="space-y-5">
                            {data.teams && data.teams.map((team: any) => (
                                <div key={team.teamId}>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="font-semibold text-slate-700">{team.teamName}</span>
                                        <span className="text-slate-500">{(team.averageLoad * 100).toFixed(0)}% Load</span>
                                    </div>
                                    <div className="flex h-2 rounded-full overflow-hidden">
                                        {/* Low */}
                                        <div className="bg-green-400" style={{ width: `${(team.loadDistribution[0] || 0) * 100}%` }}></div>
                                        {/* Med */}
                                        <div className="bg-amber-400" style={{ width: `${(team.loadDistribution[1] || 0) * 100}%` }}></div>
                                        {/* High */}
                                        <div className="bg-red-500" style={{ width: `${(team.loadDistribution[2] || 0) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                        <span>{team.incidentCount} active incidents</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PulsePage;
