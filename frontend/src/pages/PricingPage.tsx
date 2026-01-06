import React from 'react';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
    return (
        <div className="font-landing bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center">
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 tracking-tight mb-6">
                    Transparent Pricing <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                        No Surprises.
                    </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Start for free, scale as you grow. Pay only for the data you process.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-8 mb-24">
                {/* Starter */}
                <div className="rounded-3xl border border-gray-200 p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">Starter</h3>
                    <p className="text-gray-500 mb-6">Perfect for side projects and small teams.</p>
                    <div className="text-4xl font-bold text-gray-900 mb-6">$0 <span className="text-lg font-medium text-gray-400">/ mo</span></div>

                    <Link to="/dashboard" className="w-full py-3 rounded-xl border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 transition-colors text-center mb-8">
                        Start for Free
                    </Link>

                    <ul className="space-y-4 flex-1">
                        {["Up to 3 Services", "7-day Retention", "Basic Alerts", "Community Support"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-600">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pro */}
                <div className="rounded-3xl border-2 border-indigo-600 p-8 shadow-2xl bg-white relative flex flex-col scale-105 z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                        Most Popular
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">Pro</h3>
                    <p className="text-gray-500 mb-6">For scaling startups and teams.</p>
                    <div className="text-4xl font-bold text-gray-900 mb-6">$49 <span className="text-lg font-medium text-gray-400">/ user / mo</span></div>

                    <Link to="/dashboard" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors text-center mb-8 shadow-lg shadow-indigo-200">
                        Get Started
                    </Link>

                    <ul className="space-y-4 flex-1">
                        {["Unlimited Services", "30-day Retention", "AI Root Cause Analysis", "Slack & PagerDuty Integration", "Priority Support"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-900 font-medium">
                                <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Enterprise */}
                <div className="rounded-3xl border border-gray-200 p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">Enterprise</h3>
                    <p className="text-gray-500 mb-6">For large scale organizations.</p>
                    <div className="text-4xl font-bold text-gray-900 mb-6">Custom</div>

                    <Link to="/help" className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:border-gray-900 hover:text-gray-900 transition-colors text-center mb-8">
                        Contact Sales
                    </Link>

                    <ul className="space-y-4 flex-1">
                        {["Unlimited Retention", "SSO & SAML", "Dedicated Success Manager", "Custom SLAs", "On-premise Deployment Code"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-600">
                                <Check className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Comparisons Table */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-32 hidden md:block">
                <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Feature Comparison</h2>
                <div className="overflow-hidden border border-gray-200 rounded-3xl">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-display font-bold">
                            <tr>
                                <th className="px-6 py-4">Feature</th>
                                <th className="px-6 py-4">Starter</th>
                                <th className="px-6 py-4">Pro</th>
                                <th className="px-6 py-4">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {[
                                { name: "Data Retention", s: "7 days", p: "30 days", e: "Unlimited" },
                                { name: "User Accounts", s: "1", p: "Unlimited", e: "Unlimited" },
                                { name: "Alert Destinations", s: "Email only", p: "Slack, PD, Webhooks", e: "All + Custom" },
                                { name: "AI Resolution Suggestion", s: "Limited", p: "Standard", e: "Advanced Fine-tuning" },
                                { name: "SSO (SAML/OIDC)", s: "—", p: "—", e: <Check className="w-5 h-5 text-green-500" /> },
                                { name: "Support SLA", s: "Community", p: "Business Day", e: "24/7/365 (<1hr)" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                                    <td className="px-6 py-4">{row.s}</td>
                                    <td className="px-6 py-4 font-medium text-indigo-600">{row.p}</td>
                                    <td className="px-6 py-4">{row.e}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-8">
                    {[
                        { q: "Can I self-host Sentinel?", a: "Yes. Our Enterprise plan includes full self-hosting capabilities via Docker or Kubernetes helm charts to ensure data never leaves your VPC." },
                        { q: "What happens if I exceed my data limit?", a: "We don't hard stop your data. We'll alert you when you reach 90% and 100% usage. You have a 3-day grace period to upgrade or reduce volume." },
                        { q: "Do you offer startup discounts?", a: "Absolutely. Early stage startups (<$1M funding) can apply for $5,000 in Sentinel credits. Contact sales for details." }
                    ].map((faq, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-8 hover:bg-white border border-gray-100 hover:border-gray-200 transition-all shadow-sm">
                            <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-start gap-3">
                                <HelpCircle className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                                {faq.q}
                            </h3>
                            <p className="text-gray-600 leading-relaxed ml-9">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
