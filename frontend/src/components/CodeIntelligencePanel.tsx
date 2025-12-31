import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { GitCommit, AlertTriangle, ExternalLink } from 'lucide-react';

interface CodeIntelligenceProps {
    incidentId: string;
}

interface CodeCorrelation {
    commitSha: string;
    confidenceScore: number;
    reason: string;
    message: string;
    author: string;
    timestamp: string;
    avatarUrl: string;
}

export const CodeIntelligencePanel: React.FC<CodeIntelligenceProps> = ({ incidentId }) => {
    const [correlations, setCorrelations] = useState<CodeCorrelation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, use the API client
        fetch(`http://localhost:8080/api/incidents/${incidentId}/code-intelligence`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCorrelations(data);
                } else {
                    console.warn("Received non-array data for code intelligence:", data);
                    setCorrelations([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch code intelligence", err);
                setCorrelations([]);
                setLoading(false);
            });
    }, [incidentId]);

    if (loading) {
        return (
            <Card className="mb-6 border-blue-100 shadow-sm">
                <CardContent className="p-6 text-center text-gray-500">
                    Analyzing codebase for correlations...
                </CardContent>
            </Card>
        );
    }

    if (correlations.length === 0) {
        return null; // Or show empty state
    }

    const topCorrelation = correlations[0];

    return (
        <Card className="mb-6 border-blue-200 shadow-md bg-gradient-to-r from-white to-blue-50/30">
            <CardHeader className="pb-2 border-b border-blue-100/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                        <GitCommit className="h-5 w-5 text-blue-600" />
                        Code Intelligence
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
                            AI Analysis
                        </span>
                    </CardTitle>
                    {topCorrelation.confidenceScore > 0.8 && (
                        <div className="flex items-center gap-1 text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                            <AlertTriangle className="h-4 w-4" />
                            High Confidence
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-4">
                    {correlations.map((corr) => (
                        <div key={corr.commitSha} className="group relative p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-sm">
                            <div className="flex items-start gap-4">
                                <img
                                    src={corr.avatarUrl || "https://github.com/github.png"}
                                    alt={corr.author}
                                    className="w-10 h-10 rounded-full border border-slate-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {corr.author}
                                        </p>
                                        <span className="text-xs text-slate-500 font-mono">
                                            {corr.commitSha.substring(0, 7)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-2 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                                        {corr.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${corr.confidenceScore > 0.8
                                                ? "bg-red-50 text-red-700 border-red-200"
                                                : "bg-blue-50 text-blue-700 border-blue-200"
                                                }`}>
                                                {(corr.confidenceScore * 100).toFixed(0)}% Match
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Reason: {corr.reason}
                                            </span>
                                        </div>
                                        <a
                                            href={`https://github.com/search?q=${corr.commitSha}&type=commits`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            View Commit <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
