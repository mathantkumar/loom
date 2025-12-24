import React, { useState, useEffect } from 'react';
import { Send, Bot, FileEdit } from 'lucide-react';
import { api } from '../../api/client';
import { Button } from '../ui/Button';

interface Comment {
    id: number;
    author: string;
    message: string;
    timestamp: string;
}

interface Props {
    incidentId: string;
}

export const DecisionLog: React.FC<Props> = ({ incidentId }) => {
    const [entries, setEntries] = useState<Comment[]>([]);
    const [newEntry, setNewEntry] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEntries();
    }, [incidentId]);

    const loadEntries = async () => {
        try {
            const data = await api.getComments(incidentId);
            setEntries(data);
        } catch (error) {
            console.error("Failed to load log", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEntry.trim()) return;
        try {
            const comment = await api.addComment(incidentId, newEntry);
            setEntries(prev => [...prev, comment]);
            setNewEntry('');
        } catch (error) {
            console.error("Failed to add entry", error);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-slate-500" />
                    Decision & Investigation Log
                </h2>
                <span className="text-xs font-mono text-slate-400">Live Sync</span>
            </div>

            <div className="flex-1 overflow-y-auto p-0 bg-slate-50/30">
                {loading ? (
                    <div className="p-6 text-center text-slate-400 italic text-sm">Loading log...</div>
                ) : entries.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No entries yet. Document your findings here.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {/* Mock AI System Entry at the start */}
                        <div className="p-4 bg-indigo-50/30 flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center">
                                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">System Analysis</span>
                                    <span className="text-[10px] font-mono text-slate-400">Auto</span>
                                </div>
                                <p className="text-sm text-slate-700 font-medium">
                                    Detected anomaly pattern matching "Database Connection Pool Exhaustion". Initiated automatic trace analysis.
                                </p>
                            </div>
                        </div>

                        {entries.map((entry) => (
                            <div key={entry.id} className="p-4 flex gap-4 hover:bg-white transition-colors group">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {entry.author.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-700">{entry.author}</span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-800 leading-relaxed">
                                        {entry.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Area - Notebook Style */}
            <div className="p-3 bg-white border-t border-slate-200">
                <form onSubmit={handleAddEntry} className="relative">
                    <input
                        type="text"
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder="Log a finding, decision, or action..."
                        className="w-full pl-3 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 font-mono text-slate-700"
                    />
                    <button
                        type="submit"
                        disabled={!newEntry.trim()}
                        className="absolute right-1.5 top-1.5 p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};
