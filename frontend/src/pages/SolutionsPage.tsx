import React from 'react';
import { Server, Users, Laptop, ArrowRight, Building, ShoppingCart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SolutionsPage: React.FC = () => {
    return (
        <div className="font-landing bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 tracking-tight mb-6">
                    Built for Teams that <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Move Fast
                    </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                    Whether you are an SRE keeping the lights on or a CTO planning the next quarter, Sentinel adapts to your workflow.
                </p>
            </div>

            {/* Role Based Solutions */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 mb-32">
                <div className="bg-gray-50 rounded-3xl p-10 lg:p-14 hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-8">
                        <Server className="w-8 h-8 text-teal-700" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">For SREs & DevOps</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Eliminate alert fatigue. Sentinel groups related alerts into incidents, provides root cause analysis instantly, and automates page-outs only when action is truly required.
                    </p>
                    <ul className="space-y-3 mb-8">
                        {["Automated Root Cause Analysis", "Smart Alert Grouping", "Infrastructure Topology Mapping"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-5 h-5 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 text-xs">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/documentation" className="text-teal-700 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        Explore SRE Docs <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-gray-50 rounded-3xl p-10 lg:p-14 hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8">
                        <Laptop className="w-8 h-8 text-indigo-700" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">For Engineering Leaders</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Gain visibility into system stability and team health. Understand where your technical debt lies and make data-driven decisions on where to invest engineering resources.
                    </p>
                    <ul className="space-y-3 mb-8">
                        {["DORA Metrics Dashboard", "System Health Pulse", "Team Load Balancing"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 text-xs">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/stats" className="text-indigo-700 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        View Management Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Industry Verticals */}
            <div className="bg-gray-900 py-24 text-white rounded-[3rem] mx-4 mb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6">Solutions by Industry</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Critical infrastructure requires specialized care. We've optimized Sentinel for high-stakes environments.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Building,
                                title: "FinTech",
                                desc: "Zero-tolerance for downtime. Track transaction latency anomalies in real-time and ensure regulatory logging compliance.",
                                stat: "99.999% Uptime"
                            },
                            {
                                icon: ShoppingCart,
                                title: "E-Commerce",
                                desc: "Survive Black Friday. Sentinel automatically scales remediation actions during high-traffic burst events.",
                                stat: "Auto-scaling Support"
                            },
                            {
                                icon: Activity,
                                title: "Healthcare",
                                desc: "Patient data integrity is paramount. Detect unauthorized access patterns and audit log anomalies instantly.",
                                stat: "HIPAA Compliant Logging"
                            }
                        ].map((industry, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <industry.icon className="w-10 h-10 text-blue-400 mb-6" />
                                <h3 className="text-2xl font-bold mb-3">{industry.title}</h3>
                                <p className="text-gray-400 leading-relaxed mb-6">{industry.desc}</p>
                                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                                    {industry.stat}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Case Study Snippet */}
            <div className="max-w-5xl mx-auto px-6 text-center">
                <div className="bg-indigo-50 rounded-2xl p-12">
                    <div className="mb-6 font-display font-bold text-2xl text-indigo-900">
                        "Sentinel reduced our Mean Time To Resolution by 70% in the first month."
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="text-left">
                            <div className="font-bold text-gray-900">Sarah Jenkins</div>
                            <div className="text-sm text-gray-600">VP of Engineering, CloudScale</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
