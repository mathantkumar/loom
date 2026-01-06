import React from 'react';
import { Bot, Zap, Shield, Search, ArrowRight, Activity, GitBranch, Database, Cloud, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductPage: React.FC = () => {
    return (
        <div className="font-landing bg-white min-h-screen pt-24 pb-12">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Sentinel Product Tour
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 tracking-tight mb-8">
                    The Intelligence Layer <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        For Your Infrastructure
                    </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Sentinel isn't just a monitoring tool. It's an autonomous AI engineer that understands your system's architecture, predicts failures, and guides resolution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/dashboard" className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                        Get Started Free <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/documentation" className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all">
                        Read Documentation
                    </Link>
                </div>
            </div>

            {/* Core Capabilities */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Bot,
                            title: "Autonomous Root Cause Analysis",
                            desc: "Sentinel traces errors across microservices, identifying the exact commit or config change that caused the outage.",
                            color: "text-purple-600",
                            bg: "bg-purple-50"
                        },
                        {
                            icon: Zap,
                            title: "Predictive Anomaly Detection",
                            desc: "Don't wait for alerts. Sentinel spots deviations in latency and error rates hours before they impact customers.",
                            color: "text-amber-600",
                            bg: "bg-amber-50"
                        },
                        {
                            icon: Shield,
                            title: "Automated Incident Response",
                            desc: "Generate runbooks on the fly. Sentinel suggests remediation steps and can even rollback deployments automatically.",
                            color: "text-blue-600",
                            bg: "bg-blue-50"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
                            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Deep Dives */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-32 space-y-32">
                {/* Feature 1: Causal Graphs */}
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                            <GitBranch className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Visual Causal Graphs</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            Understanding a distributed system is hard. Sentinel automatically builds a real-time causal graph of your services, databases, and message queues. When an incident occurs, it doesn't just show you a list of errors—it highlights the <i>path of propagation</i>.
                        </p>
                        <ul className="space-y-3">
                            {["Automatic Dependency Mapping", "Latency Propagation Tracing", "Database Lock Detection"].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Replaced complex SVG with a safer implementation */}
                    <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-8 shadow-sm relative overflow-hidden h-80">
                        {/* Graph Nodes */}
                        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 z-10">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center animate-pulse">
                                <Database className="w-6 h-6 text-blue-500 mb-1" />
                                <span className="text-[10px] font-bold text-gray-600">DB-1</span>
                            </div>
                        </div>

                        <div className="absolute top-1/4 right-1/4 translate-x-1/2 z-10">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-lg border-2 border-red-500 ring-4 ring-red-50 flex flex-col items-center justify-center animate-bounce">
                                <Activity className="w-6 h-6 text-red-500 mb-1" />
                                <span className="text-[10px] font-bold text-gray-600">API</span>
                            </div>
                        </div>

                        <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 z-10">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                                <Cloud className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-[10px] font-bold text-gray-600">CDN</span>
                            </div>
                        </div>

                        {/* Connection Lines (CSS borders) */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Line 1: DB to API */}
                            <div className="absolute top-[35%] left-[25%] w-[40%] h-[2px] bg-red-200 -rotate-12 origin-left"></div>
                            {/* Line 2: API to CDN */}
                            <div className="absolute top-[40%] right-[30%] w-[2px] h-[30%] bg-gray-200"></div>
                        </div>

                        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500 font-mono">
                            Live Inference: <span className="text-red-500 font-bold">CRITICAL PATH DETECTED</span>
                        </div>
                    </div>
                </div>

                {/* Feature 2: Contextual Memory */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                    <div className="flex-1">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">It Remembers Everything</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            "Didn't we see this error last Tuesday?" <br />
                            Sentinel remembers. It stores embedding vectors of every incident, alert, and resolution. When a new issue pops up, it checks its <b>Long Term Memory</b> to see if it's a reoccurrence and suggests the previous fix.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            It's like having your most experienced senior engineer on call, 24/7.
                        </p>
                    </div>
                    {/* Restored Terminal View */}
                    <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl text-white font-mono text-sm h-80 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
                            <Terminal size={16} className="text-slate-400" />
                            <span className="text-slate-400">sentinel-cli — v2.4.0</span>
                            <div className="flex gap-1.5 ml-auto">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>
                        <div className="space-y-4 overflow-y-auto">
                            <div className="flex gap-3">
                                <span className="text-green-400 font-bold">$</span>
                                <span className="typing-effect">sentinel query "Redis timeout"</span>
                            </div>
                            <div className="pl-5 border-l-2 border-slate-600 ml-1 text-slate-300 space-y-3">
                                <p className="animate-pulse">Analyzing vector database...</p>
                                <div className="bg-white/5 p-3 rounded border border-white/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-amber-400 font-bold">INC-402 (94% Match)</span>
                                        <span className="text-xs text-slate-500">24 days ago</span>
                                    </div>
                                    <p className="opacity-80">Redis OOM due to unrestricted cache eviction policy.</p>
                                    <div className="mt-2 text-green-300 bg-green-900/20 p-2 rounded text-xs border border-green-900/30">
                                        <b>Suggested Fix:</b> Update `maxmemory-policy` to `allkeys-lru` in redis.conf.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Natural Language Query Strip */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                            <Search className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl font-display font-bold text-gray-900">Just Ask.</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Stop writing complex SQL or aggregation queries. Interface with your infrastructure using natural language.
                        </p>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg italic text-gray-800 text-lg">
                            "Show me all 5xx errors from the payment service in the last hour, grouped by endpoint."
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            {["Logs", "Metrics", "Traces", "Config", "Commits", "Docs"].map((item, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center font-medium text-gray-600">
                                    {item}
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-400 mt-4">Unified Data Lake</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
