// Minimal design for AlertsPage
import React from 'react';
import { Bell, AlertCircle, Check } from 'lucide-react';

export const AlertsPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Alerts</h1>
                <p className="text-gray-500 mt-2">Real-time notifications and warnings.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-semibold text-gray-900">Recent Alerts</h2>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">Mark all as read</button>
                </div>
                <div className="divide-y divide-gray-100">
                    {[
                        { title: "High memory usage on pod-worker-01", time: "2 mins ago", severity: "Warning", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50" },
                        { title: "API latency exceeds 500ms threshold", time: "15 mins ago", severity: "Critical", icon: Bell, color: "text-red-500", bg: "bg-red-50" },
                        { title: "Deployment successful: v2.4.0", time: "1 hour ago", severity: "Info", icon: Check, color: "text-green-500", bg: "bg-green-50" },
                    ].map((alert, i) => (
                        <div key={i} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className={`p-2 rounded-full ${alert.bg} mt-1`}>
                                <alert.icon size={16} className={alert.color} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{alert.title}</h3>
                                    <span className="text-xs text-gray-400">{alert.time}</span>
                                </div>
                                <p className="text-xs text-gray-500">Severity: <span className="font-medium">{alert.severity}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 text-center border-t border-gray-100">
                    <button className="text-sm text-gray-500 hover:text-gray-900 font-medium">View Archived Alerts</button>
                </div>
            </div>
        </div>
    );
};
