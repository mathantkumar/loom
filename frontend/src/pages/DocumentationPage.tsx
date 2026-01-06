// Minimal design for DocumentationPage
import { Book, FileText, Code } from 'lucide-react';

export const DocumentationPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Documentation</h1>
                <p className="text-gray-500 mt-2">Guides, references, and examples for Sentinel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            Learn how to integrate Sentinel into your existing infrastructure. We support all major cloud providers and container orchestration platforms.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Installation Guide",
                                "Configuration Reference",
                                "API Authentication",
                                "Deploying your first Agent"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors group">
                                    <FileText size={18} className="text-gray-400 group-hover:text-indigo-600" />
                                    {item}
                                </li>
                            ))}

                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">API Reference</h2>
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                            <span className="text-purple-400">curl</span> -X POST https://api.sentinel.ai/v1/incidents \<br />
                            &nbsp;&nbsp;-H <span className="text-green-400">"Authorization: Bearer TOKEN"</span> \<br />
                            &nbsp;&nbsp;-d <span className="text-yellow-300">'&#123;"title": "Database Outage"&#125;'</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Book size={18} />
                            Topics
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-indigo-600 cursor-pointer py-1">Core Concepts</li>
                            <li className="hover:text-indigo-600 cursor-pointer py-1">Architecture</li>
                            <li className="hover:text-indigo-600 cursor-pointer py-1">Security Model</li>
                            <li className="hover:text-indigo-600 cursor-pointer py-1">Webhooks</li>
                            <li className="hover:text-indigo-600 cursor-pointer py-1">Client Libraries</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl text-white shadow-md">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Code size={18} />
                            Developer Hub
                        </h3>
                        <p className="text-indigo-100 text-sm mb-4">Join our developer community to build custom integrations.</p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                            Join Discord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
