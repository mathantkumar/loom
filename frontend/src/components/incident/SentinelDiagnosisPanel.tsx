import { useState, useRef, useEffect } from 'react';
import { Activity, Play, CheckCircle, AlertTriangle, Cpu, Terminal } from 'lucide-react';

interface DiagnosisEvent {
    type: 'STEP' | 'INSIGHT' | 'TIMELINE' | 'ERROR' | 'CONCLUSION' | 'INFO' | 'STREAM';
    message: string;
    payload?: any;
}

interface Props {
    incidentId: string;
}

export const SentinelDiagnosisPanel = ({ incidentId }: Props) => {

    const [events, setEvents] = useState<DiagnosisEvent[]>([]);
    const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'COMPLETE'>('IDLE');
    const logsEndRef = useRef<HTMLDivElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const scrollToBottom = () => {
        if (shouldAutoScroll && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShouldAutoScroll(isNearBottom);
    };

    useEffect(() => {
        scrollToBottom();
    }, [events, shouldAutoScroll]);

    const runDiagnosis = () => {
        setStatus('RUNNING');
        setEvents([]);

        const eventSource = new EventSource(`http://localhost:8080/api/diagnosis/${incidentId}/stream`);

        eventSource.onmessage = (event) => {
            const parsed = JSON.parse(event.data) as DiagnosisEvent;

            if (parsed.type === 'STREAM') {
                setEvents(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.type === 'INSIGHT') {
                        // Append to last insight
                        const updated = { ...last, message: last.message + parsed.message };
                        return [...prev.slice(0, -1), updated];
                    } else {
                        // Start new insight
                        return [...prev, { type: 'INSIGHT', message: parsed.message }];
                    }
                });
            } else {
                setEvents(prev => [...prev, parsed]);
            }

            if (parsed.type === 'CONCLUSION' || parsed.type === 'ERROR') {
                eventSource.close();
                setStatus('COMPLETE');
            }
        };

        eventSource.onerror = () => {
            // If error occurs, assume stream closed or failed
            eventSource.close();
            setStatus('COMPLETE');
        };
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Sentinel Diagnosis</h3>
                        <p className="text-sm text-slate-500">Live Log Intelligence & Correlation</p>
                    </div>
                </div>
                {status === 'IDLE' && (
                    <button
                        onClick={runDiagnosis}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"
                    >
                        <Play className="w-4 h-4" /> Run Diagnosis
                    </button>
                )}
                {status === 'RUNNING' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                        Analyzing System...
                    </div>
                )}
                {status === 'COMPLETE' && (
                    <button
                        onClick={runDiagnosis}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                    >
                        Re-run
                    </button>
                )}
            </div>

            {/* Console / Stream Area */}
            {(status !== 'IDLE' || events.length > 0) && (
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="p-6 bg-slate-950 min-h-[300px] max-h-[500px] overflow-y-auto font-mono text-sm leading-relaxed scroll-smooth"
                >
                    <div className="space-y-3">
                        {events.map((event, idx) => (
                            <div key={idx} className={`animate-in fade-in slide-in-from-left-2 duration-300 ${getEventStyle(event.type)}`}>
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 opacity-70">{getEventIcon(event.type)}</span>
                                    <div className="flex-1">
                                        <p>{event.message}</p>
                                        {event.payload && renderPayload(event.payload)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {status === 'RUNNING' && (
                            <div className="flex items-center gap-2 text-slate-500 mt-4 pl-8">
                                <span className="w-2 h-4 bg-indigo-500/50 animate-pulse block"></span>
                            </div>
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            )}

            {/* Scroll/Updates Indicator */}
            {status === 'RUNNING' && !shouldAutoScroll && (
                <button
                    onClick={() => {
                        setShouldAutoScroll(true);
                        if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
                    }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce cursor-pointer z-10 hover:bg-indigo-700"
                >
                    <Activity className="w-3 h-3" /> New updates
                </button>
            )}

            {status === 'IDLE' && events.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                    <Cpu className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Ready to analyze logs, traces, and metrics.</p>
                </div>
            )}
        </div>
    );
};

function getEventStyle(type: string) {
    switch (type) {
        case 'STEP': return 'text-slate-400';
        case 'INSIGHT': return 'text-amber-400 font-medium bg-amber-400/10 p-2 rounded border border-amber-400/20';
        case 'CONCLUSION': return 'text-emerald-400 font-bold text-base mt-4 p-4 bg-emerald-950/30 border border-emerald-900 rounded-lg';
        case 'ERROR': return 'text-red-400';
        default: return 'text-slate-300';
    }
}

function getEventIcon(type: string) {
    switch (type) {
        case 'STEP': return <Terminal className="w-4 h-4" />;
        case 'INSIGHT': return <Activity className="w-4 h-4" />;
        case 'CONCLUSION': return <CheckCircle className="w-4 h-4" />;
        case 'ERROR': return <AlertTriangle className="w-4 h-4" />;
        default: return <div className="w-4 h-4 rounded-full border border-current opacity-50" />;
    }
}

function renderPayload(payload: any) {
    if (!payload) return null;
    // Simple render for LogAnalysisResult or strings
    if (payload.anomalies && Array.isArray(payload.anomalies)) {
        return (
            <div className="mt-2 space-y-1 text-xs text-slate-300">
                {payload.anomalies.map((a: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 pl-2 border-l border-slate-700">
                        <span className="text-amber-500">[{a.type}]</span> {a.description}
                    </div>
                ))}
            </div>
        );
    }
    if (typeof payload === 'string') {
        return <div className="mt-1 text-slate-400 pl-4">{payload}</div>;
    }
    return null; // Fallback
}
