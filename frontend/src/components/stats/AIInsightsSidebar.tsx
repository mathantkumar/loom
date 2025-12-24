import React from 'react';

export const AIInsightsSidebar: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>

                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="font-bold text-lg tracking-tight">Cortex Insights</h3>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                        <h4 className="text-sm font-semibold text-purple-200 mb-1">Risk Signal</h4>
                        <p className="text-sm text-gray-200 leading-snug">
                            Repeated timeouts in <span className="font-mono bg-white/20 px-1 rounded text-xs">payment-service</span> suggest growing technical debt. 3 incidents this week.
                        </p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                        <h4 className="text-sm font-semibold text-green-200 mb-1">Efficiency Win</h4>
                        <p className="text-sm text-gray-200 leading-snug">
                            Reference to runbooks has improved Resolution Rate by 12% compared to last month.
                        </p>
                    </div>
                </div>

                <button className="mt-6 w-full py-2 bg-white text-purple-900 font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors">
                    Ask Cortex
                </button>
            </div>

            {/* Historical Patterns */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Historical Patterns</h3>
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Redis Cache Eviction</p>
                            <p className="text-xs text-gray-500 mt-0.5">Occurs every ~45 days. Next predicted: Jan 12.</p>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Auth Service</p>
                            <p className="text-xs text-gray-500 mt-0.5">Highest incident correlation (80%) with 'Login Failure'.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};
