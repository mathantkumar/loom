import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../api/client';
import type { TimelineEvent } from '../types';

export function TimelinePanel({ incidentId }: { incidentId: string }) {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const loadTimeline = async () => {
            try {
                const data = await api.getTimeline(incidentId);
                setEvents(data.events);
            } catch (err) {
                console.error('Failed to load timeline', err);
            } finally {
                setLoading(false);
            }
        };
        loadTimeline();
    }, [incidentId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'AI_ANALYSIS': return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border-4 border-white shadow-sm absolute -left-4 top-0"><div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-pulse"></div></div>;
            case 'INCIDENT_RESOLVED': return <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-sm absolute -left-4 top-0"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>;
            case 'INCIDENT_CREATED': return <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm absolute -left-4 top-0"><AlertTriangle className="w-4 h-4 text-indigo-600" /></div>;
            default: return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-sm absolute -left-4 top-0"><MessageSquare className="w-3.5 h-3.5 text-slate-500" /></div>;
        }
    };

    if (loading) return <div className="animate-pulse h-20 bg-slate-50 rounded-lg"></div>;

    // Show only latest 2 events if NOT expanded
    const displayEvents = expanded ? events : events.slice(0, 2);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Incident Timeline</h3>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center gap-1"
                >
                    {expanded ? (
                        <>Collapse <ChevronUp className="w-3 h-3" /></>
                    ) : (
                        <>Show All Events ({events.length}) <ChevronDown className="w-3 h-3" /></>
                    )}
                </button>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-100 space-y-10 py-2 ml-3">
                {displayEvents.map((event, eventIdx) => (
                    <div key={eventIdx} className="relative animate-in slide-in-from-bottom-2 duration-500">
                        {getIcon(event.type)}

                        <div className="flex flex-col gap-1.5 ml-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 align-middle">
                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="group">
                                <p className="text-base text-slate-700 font-medium leading-relaxed group-hover:text-indigo-900 transition-colors">
                                    {event.description}
                                </p>
                                {event.type === 'AI_ANALYSIS' && (
                                    <div className="mt-3 text-sm text-purple-800 bg-purple-50/60 p-3 rounded-md border border-purple-100/50 inline-block font-medium">
                                        <span className="mr-2">✦</span>
                                        AI Insight Generated
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Gradient fade if collapsed */}
                {!expanded && events.length > 2 && (
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                )}

                {/* End Cap */}
                <div className="absolute -left-[5px] -bottom-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white"></div>
            </div>
        </div>
    );
}
