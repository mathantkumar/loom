import { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { api } from '../api/client';
import type { AnalysisResponse } from '../types';

export function AIAnalysisCard({ incidentId, rootCause }: { incidentId: string, rootCause?: string }) {
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // If rootCause exists initially, we might want to display it or fetch full analysis.
    // For MVP, if local rootCause exists, we prefer that, but the props passed might be short.
    // We'll rely on state or manual trigger for the full "AI experience".

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await api.analyzeIncident(incidentId);
            setAnalysis(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!analysis && !rootCause) {
        return (
            <Card className="h-full">
                <CardHeader title="AI Analysis" />
                <CardContent>
                    <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">No analysis available for this incident.</p>
                        <Button onClick={handleAnalyze} isLoading={loading}>
                            Run AI Analysis
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Display data from either Props (if previously saved) or Local State (fresh analysis)
    const displayRootCause = analysis?.rootCause || rootCause;
    const displayResolution = analysis?.resolution;
    const score = analysis?.confidenceScore || 0.0;

    return (
        <Card className="h-full bg-gradient-to-br from-white to-purple-50 border-purple-100">
            <CardHeader title="AI Root Cause Analysis" />
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Probable Root Cause</h4>
                        <div className="mt-1 text-sm text-gray-900 prose prose-sm">
                            {displayRootCause}
                        </div>
                    </div>

                    {displayResolution && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended Resolution</h4>
                            <div className="mt-1 text-sm text-gray-900 prose prose-sm">
                                {displayResolution}
                            </div>
                        </div>
                    )}

                    {analysis && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-purple-700">Confidence Score</span>
                                <span className="text-xs font-medium text-purple-700">{(score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${score * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
