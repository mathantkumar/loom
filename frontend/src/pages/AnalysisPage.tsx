import { useState, useEffect } from 'react';
import { BrainCircuit, Globe, GitBranch, History } from 'lucide-react';
import { BRAND_NAME } from '../config/branding';
import { sentinelApi } from '../api/sentinelClient';
import type { ProjectHealthReport, CausalityGraph, HistoricalContext } from '../api/sentinelClient';

export const AnalysisPage = () => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('auth-service');
    const [selectedIncidentId] = useState<string>('noc-123'); // Default hook for MVP

    const [projectRisk, setProjectRisk] = useState<ProjectHealthReport | null>(null);
    const [causalityGraph, setCausalityGraph] = useState<CausalityGraph | null>(null);
    const [history, setHistory] = useState<HistoricalContext | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Atlas Data
                const health = await sentinelApi.getProjectHealth(selectedProjectId);
                setProjectRisk(health); // This might fail if backend not ready, will retain null

                // 2. Fetch Causality Data (Simulate selecting an incident)
                // In real app, we'd only fetch when incident is selected.
                // For MVP demo, we try to fetch for a known ID or the mock ID
                try {
                    const graph = await sentinelApi.getCausalityGraph(selectedIncidentId);
                    setCausalityGraph(graph);

                    const hist = await sentinelApi.getHistoricalContext(selectedIncidentId);
                    setHistory(hist);
                } catch (e) {
                    console.log("Graph/History data not available for this ID mock");
                }

            } catch (err) {
                console.error("Failed to load Sentinel data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedProjectId, selectedIncidentId]);

    // Simple Force-Directed-like Layout for MVP Graph (Static for now)
    const renderGraph = () => {
        if (!causalityGraph || !causalityGraph.nodes.length) return <div className="text-slate-500">No graph data available.</div>;

        // Simple manual layout for MVP: Incident in center, others around
        const nodes = causalityGraph.nodes;
        const edges = causalityGraph.edges;

        // Find center node (Incident)
        const centerNode = nodes.find(n => n.type === 'INCIDENT') || nodes[0];

        // Calculate positions
        const width = 600;
        const height = 400;
        const cx = width / 2;
        const cy = height / 2;

        const positions: Record<string, { x: number, y: number }> = {};
        positions[centerNode.id] = { x: cx, y: cy };

        const otherNodes = nodes.filter(n => n.id !== centerNode.id);
        const radius = 120;

        otherNodes.forEach((node, i) => {
            const angle = (i / otherNodes.length) * 2 * Math.PI;
            positions[node.id] = {
                x: cx + radius * Math.cos(angle),
                y: cy + radius * Math.sin(angle)
            };
        });

        return (
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                {/* Edges */}
                {edges.map((edge, i) => {
                    const start = positions[edge.source];
                    const end = positions[edge.target];
                    if (!start || !end) return null;

                    return (
                        <g key={i}>
                            <line
                                x1={start.x} y1={start.y}
                                x2={end.x} y2={end.y}
                                stroke="#475569"
                                strokeWidth="2"
                                strokeOpacity={edge.confidence}
                            />
                            <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2} fill="#94a3b8" fontSize="10" textAnchor="middle" dy="-5">
                                {edge.relationship}
                            </text>
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                    const pos = positions[node.id];
                    if (!pos) return null;

                    let color = "#64748b"; // default slate
                    if (node.type === 'INCIDENT') color = "#ef4444"; // red
                    if (node.type === 'SERVICE') color = "#f59e0b"; // amber
                    if (node.type === 'DEPLOYMENT') color = "#3b82f6"; // blue

                    return (
                        <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                            <circle r="25" fill="#1e293b" stroke={color} strokeWidth="3" />
                            <text y="40" fill="#e2e8f0" fontSize="12" textAnchor="middle" fontWeight="bold">
                                {node.label}
                            </text>
                            <text y="5" fill="white" fontSize="10" textAnchor="middle" pointerEvents="none">
                                {node.type.substring(0, 3)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-indigo-600" />
                        {BRAND_NAME} Intelligence
                    </h1>
                    <p className="text-slate-500 mt-1">AI-driven analysis of project risk, causality, and institutional memory.</p>
                </div>
            </div>

            {/* 1. SENTINEL ATLAS - PROJECT RISK OVERVIEW */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-lg font-bold text-slate-800">Project Risk (Atlas)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Project Card */}
                    <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-white to-indigo-50/50 p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        {loading && !projectRisk ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                                <div className="h-24 bg-slate-200 rounded"></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-white border border-indigo-100 text-xs font-bold text-indigo-600 rounded mb-2">
                                            {projectRisk?.projectId || selectedProjectId}
                                        </span>
                                        <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                                            {projectRisk?.riskScore ? (projectRisk.riskScore).toFixed(2) : 0} Risk Score
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence</span>
                                        <div className="text-emerald-600 font-bold">{projectRisk?.confidenceScore || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="bg-white/80 p-4 rounded-xl border border-indigo-100 backdrop-blur-sm">
                                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">AI Prediction</div>
                                        <p className="text-slate-700 font-medium">{projectRisk?.predictedOutcome || 'No data available.'}</p>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contributing Factors</div>
                                        <ul className="space-y-2">
                                            {projectRisk?.contributingFactors.map((factor, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                                                    {factor}
                                                </li>
                                            ))}
                                            {!projectRisk?.contributingFactors?.length && <li className="text-sm text-slate-400">No major risk factors detected.</li>}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Other Projects List (Mini Cards) */}
                    <div className="space-y-4">
                        {['auth-service', 'payments-api', 'notification-worker'].map(proj => (
                            <div key={proj}
                                onClick={() => setSelectedProjectId(proj)}
                                className={`bg-white p-4 rounded-xl border shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group ${selectedProjectId === proj ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}
                            >
                                <span className="font-medium text-slate-700 group-hover:text-indigo-700">{proj}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                {/* 2. SENTINEL CAUSALITY - GRAPH */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <GitBranch className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-slate-800">Causality Graph</h2>
                    </div>
                    {/* Visualization Area */}
                    <div className="bg-slate-900 rounded-2xl h-[400px] flex items-center justify-center relative overflow-hidden border border-slate-800 shadow-inner">
                        {loading ? (
                            <div className="text-slate-500 animate-pulse">Computing correlation matrix...</div>
                        ) : (
                            renderGraph()
                        )}
                    </div>
                </section>

                {/* 3. SENTINEL MEMORY - HISTORICAL CONTEXT */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <History className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-slate-800">Organizational Memory</h2>
                    </div>
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden h-[400px] flex flex-col">
                        <div className="p-6 bg-amber-50/50 border-b border-amber-100">
                            <h3 className="text-amber-800 font-bold mb-2 text-sm uppercase tracking-wide">AI Insight</h3>
                            <p className="text-slate-700 italic">
                                "{history?.insight || 'Analyzing historical patterns...'}"
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {history?.similarIncidents?.map((inc, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="shrink-0 pt-1">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-col items-center justify-center text-xs font-bold text-slate-500 border-2 border-white shadow-sm">
                                            {(inc.similarityScore * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900 text-sm mb-1">{inc.title}</h4>
                                        <p className="text-xs text-slate-500 mb-2">ID: {inc.id}</p>
                                        <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block border border-emerald-100">
                                            Resolution: {inc.resolution.substring(0, 60)}...
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!history?.similarIncidents?.length && !loading && (
                                <div className="p-4 text-center text-slate-400 text-sm">No similar incidents found.</div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
