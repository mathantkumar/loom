import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Cpu,
    GitBranch,
    Globe,
    ShieldCheck,
    Zap,

    Server,
    Layers,
    BrainCircuit,

} from 'lucide-react';
import { BRAND_NAME } from '../config/branding';

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-indigo-50 selection:text-indigo-900 overflow-x-hidden">

            {/* 1. HERO SECTION (Above the Fold) */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 mb-8 tracking-wide uppercase shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            AI for Engineering Decisions
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
                            From Projects to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                Intelligence.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-lg mb-10 leading-relaxed font-light">
                            {BRAND_NAME} transforms incidents, deployments, and engineering signals into actionable project intelligence — before risks become failures.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                            >
                                Open Dashboard <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/documentation')}
                                className="px-8 py-4 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                            >
                                See How It Works
                            </button>
                        </div>
                    </div>

                    {/* Right: Abstract System Visual (Parallax Nodes) */}
                    <div className="relative h-[600px] w-full flex items-center justify-center">
                        <div className="relative w-full h-full">
                            {/* Central Core */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-float">
                                <div className="w-32 h-32 bg-white rounded-2xl border border-indigo-100 shadow-2xl flex items-center justify-center relative z-10">
                                    <BrainCircuit className="w-16 h-16 text-indigo-600" />
                                </div>
                                {/* Pulse Ring */}
                                <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl scale-125 animate-pulse-subtle"></div>
                            </div>

                            {/* Floating Nodes */}
                            {[
                                { icon: Activity, label: 'Incidents', bg: 'bg-rose-50', text: 'text-rose-500', top: '20%', left: '15%', delay: '0s' },
                                { icon: GitBranch, label: 'Deployments', bg: 'bg-blue-50', text: 'text-blue-500', top: '15%', right: '10%', delay: '1s' },
                                { icon: Globe, label: 'Projects', bg: 'bg-emerald-50', text: 'text-emerald-500', bottom: '25%', left: '10%', delay: '2s' },
                                { icon: Server, label: 'Services', bg: 'bg-amber-50', text: 'text-amber-500', bottom: '20%', right: '15%', delay: '1.5s' },
                            ].map((node, i) => (
                                <div
                                    key={i}
                                    className={`absolute px-4 py-3 ${node.bg} rounded-xl border border-white shadow-lg flex items-center gap-3 z-10 transition-transform hover:scale-105 duration-500 cursor-default animate-float`}
                                    style={{
                                        top: node.top,
                                        left: node.left,
                                        right: node.right,
                                        bottom: node.bottom,
                                        animationDelay: node.delay
                                    }}
                                >
                                    <node.icon className={`w-5 h-5 ${node.text}`} />
                                    <span className={`text-sm font-bold ${node.text.replace('500', '700')}`}>{node.label}</span>
                                    {/* Connection Line (Fake) */}
                                    <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
                                        {/* Lines would require absolute positioning logic based on center, simplified here */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. AI CAPABILITIES SECTION */}
            <section className="bg-slate-50 py-32 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20 max-w-2xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Intelligence, not just Alerts.</h2>
                        <p className="text-slate-500 text-lg">
                            Move beyond reactive monitoring. {BRAND_NAME} proactively analyzes risk, patterns, and anomalies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Project Risk */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-100 transition-colors">
                                <Globe className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Project Risk Intelligence</h3>
                            <p className="text-slate-500 leading-relaxed mb-6">Predicts which projects are drifting off-track and identifies the contributing engineering factors.</p>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors"></div>
                        </div>

                        {/* Card 2: Incident Pattern Detection */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-100 transition-colors">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Incident Pattern Detection</h3>
                            <p className="text-slate-500 leading-relaxed mb-6">Identifies recurring failure patterns across services and timelines to prevent repeat outages.</p>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors"></div>
                        </div>

                        {/* Card 3: Preventive Warnings */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden">
                            <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-100 transition-colors">
                                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Preventive Warnings</h3>
                            <p className="text-slate-500 leading-relaxed mb-6">Detects subtle baseline deviations and warns your team before they escalate into incidents.</p>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. WORKFLOW ("How Sentinel Works") */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-24">The {BRAND_NAME} Workflow</h2>

                    <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>

                        {[
                            { title: 'Signals Collected', icon: Zap, color: 'text-amber-500' },
                            { title: 'Context Enriched', icon: Layers, color: 'text-blue-500' },
                            { title: 'AI Analysis', icon: Cpu, color: 'text-indigo-500' },
                            { title: 'Guided Decisions', icon: CheckCircle2, color: 'text-emerald-500' },
                            { title: 'Org Memory', icon: BrainCircuit, color: 'text-violet-500' },
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-6 z-10 group-hover:border-indigo-200 group-hover:shadow-md transition-all duration-300">
                                    <step.icon className={`w-8 h-8 ${step.color}`} />
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. VALUE & TRUST */}
            <section className="bg-slate-900 py-32 text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                            Traditional tools react. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
                                {BRAND_NAME} thinks.
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                            Stop getting lost in noise. Sentinel replaces fragmented monitoring with a single source of engineering truth.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            "No manual triage or incident setup",
                            "No fragmented tools or lost context",
                            "No lost institutional knowledge",
                            "Confidence scores, not blind automation"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                </div>
                                <span className="text-lg text-slate-200 font-light">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Row */}
                <div className="max-w-7xl mx-auto px-6 mt-32 pt-16 border-t border-slate-800/50">
                    <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-12">Enterprise Ready & Secure</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
                        {['Security-First', 'Explainable AI', 'Audit-Ready', 'SOC2 Compliant'].map((badge, i) => (
                            <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FINAL CTA */}
            <section className="py-32 bg-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-slate-900 mb-8">Make better engineering decisions — automatically.</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-5 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-900/20"
                    >
                        Enter {BRAND_NAME} Dashboard
                    </button>
                </div>
            </section>

            {/* 6. CORPORATE FOOTER */}
            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
                    <div className="flex gap-8 mb-4 md:mb-0 items-center">
                        <span className="font-bold text-slate-900 tracking-widest uppercase">{BRAND_NAME}</span>
                        <span>© 2025 Incident Intelligence Inc.</span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            OPERATIONAL
                        </span>
                    </div>
                    <div className="flex gap-8">
                        <button onClick={() => navigate('/documentation')} className="hover:text-slate-600 transition-colors">Documentation</button>
                        <button onClick={() => navigate('/help')} className="hover:text-slate-600 transition-colors">Support</button>
                        <button className="hover:text-slate-600 transition-colors">Privacy & Terms</button>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 0.05; transform: scale(1.25); }
                    50% { opacity: 0.1; transform: scale(1.3); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
