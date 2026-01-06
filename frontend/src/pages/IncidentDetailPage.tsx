import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { api } from '../api/client';
import type { Incident, AnalysisResponse, TrendAnalysisResponse, IncidentStatus } from '../types';
import { IncidentHeader } from '../components/incident/IncidentHeader';
import { SystemObservations } from '../components/incident/SystemObservations';
import { AIInsightPanel } from '../components/incident/AIInsightPanel';
import { DecisionLog } from '../components/incident/DecisionLog';
import { NextActions } from '../components/incident/NextActions';
import { TimelinePanel } from '../components/TimelinePanel';
import { AIActions } from '../components/AIActions';
import { CodeIntelligencePanel } from '../components/CodeIntelligencePanel';
import { SentinelDiagnosisPanel } from '../components/incident/SentinelDiagnosisPanel';
import { AnalysisModal } from '../components/incident/AnalysisModal';
import { TrendsModal } from '../components/incident/TrendsModal';

const IncidentDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [incident, setIncident] = useState<Incident | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [trends, setTrends] = useState<TrendAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // AI Action States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCheckingTrends, setIsCheckingTrends] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Modal State
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showTrendsModal, setShowTrendsModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchIncidentData(id);
        }
    }, [id]);

    const fetchIncidentData = async (incidentId: string) => {
        try {
            setLoading(true);
            const data = await api.getIncident(incidentId);
            setIncident(data);

            // Fetch analysis silently - it populates the header/insight panel
            try {
                const analysisData = await api.analyzeIncident(incidentId);
                setAnalysis(analysisData);
            } catch (e) {
                console.log("Analysis not ready yet");
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load incident');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: IncidentStatus) => {
        if (!incident) return;
        try {
            await api.updateStatus(incident.id, newStatus);
            setIncident({ ...incident, status: newStatus });
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleWhatHappened = async () => {
        if (!incident) return;
        setIsAnalyzing(true);
        setShowAnalysisModal(true); // Open modal immediately, it will show loading
        try {
            const result = await api.analyzeIncident(incident.id);
            setAnalysis(result);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCheckTrends = async () => {
        if (!incident) return;
        setIsCheckingTrends(true);
        setShowTrendsModal(true);
        try {
            const result = await api.analyzeTrends(incident.id);
            setTrends(result);
        } catch (error) {
            console.error("Trend analysis failed", error);
        } finally {
            setIsCheckingTrends(false);
        }
    };

    const handleSendEmail = async () => {
        setIsSendingEmail(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=Incident Report: ${incident?.title}&body=Analysis: ${analysis?.summary || 'Pending...'}`, '_blank');
        setIsSendingEmail(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !incident) return (
        <div className="max-w-7xl mx-auto py-12 px-6 text-center text-slate-500">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Unavailable</h2>
            <p>{error || 'Incident not found'}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Back Nav */}
                <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                {/* 1. Header & AI Summary */}
                <IncidentHeader
                    incident={incident}
                    onStatusChange={handleStatusChange}
                    aiSummary={analysis?.summary || incident.description}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">

                    {/* LEFT COLUMN (Main Narrative) */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Sentinel Diagnosis - NEW SECTION */}
                        <div className="animate-in slide-in-from-bottom-2 duration-500 delay-50">
                            <SentinelDiagnosisPanel incidentId={incident.id} />
                        </div>

                        {/* 2. Next Actions (Critical Path) */}
                        <div className="animate-in slide-in-from-bottom-2 duration-500 delay-100">
                            <NextActions actions={analysis?.suggestedActions} incidentId={incident.id} />
                        </div>

                        {/* 3. System Observations (Evidence) */}
                        <div className="animate-in slide-in-from-bottom-2 duration-500 delay-200">
                            <SystemObservations incidentId={incident.id} evidence={incident.evidence} />
                        </div>

                        {/* Code Intelligence */}
                        <div className="animate-in slide-in-from-bottom-2 duration-500 delay-250">
                            <CodeIntelligencePanel incidentId={incident.id} />
                        </div>

                        {/* 4. Decision Log (Forensic Notebook) */}
                        <div className="h-[500px] animate-in slide-in-from-bottom-2 duration-500 delay-300">
                            <DecisionLog incidentId={incident.id} />
                        </div>

                        {/* 5. Timeline (Collapsed Context) */}
                        <div className="opacity-80 hover:opacity-100 transition-opacity">
                            <TimelinePanel incidentId={incident.id} />
                        </div>

                    </div>

                    {/* RIGHT COLUMN (AI Insights & Tools) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* 6. AI Insight Panel (Sticky) */}
                        <div className="sticky top-6 space-y-8">
                            <div className="bg-white rounded-xl shadow-lg shadow-indigo-100/50 border border-slate-100 p-1">
                                <AIInsightPanel incident={incident} analysis={analysis} />
                            </div>

                            {/* Agent Tools */}
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Agent Actions</h3>
                                <AIActions
                                    onWhatHappened={handleWhatHappened}
                                    onCheckTrends={handleCheckTrends}
                                    onSendEmail={handleSendEmail}
                                    isAnalyzing={isAnalyzing}
                                    isCheckingTrends={isCheckingTrends}
                                    isSendingEmail={isSendingEmail}
                                    analysisVisible={!!analysis}
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Analysis Modal */}
            <AnalysisModal
                isOpen={showAnalysisModal}
                onClose={() => setShowAnalysisModal(false)}
                analysis={analysis}
                isLoading={isAnalyzing}
            />

            {/* Trends Modal */}
            <TrendsModal
                isOpen={showTrendsModal}
                onClose={() => setShowTrendsModal(false)}
                trends={trends}
                isLoading={isCheckingTrends}
            />
        </div>
    );
};

export default IncidentDetailPage;
