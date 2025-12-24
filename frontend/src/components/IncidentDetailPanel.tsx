import React, { useState, useEffect } from 'react';
import type { Incident } from '../types';
import { Badge } from './ui/Badge';
import { api } from '../api/client';


interface IncidentDetailPanelProps {
    incident: Incident;
    onClose: () => void;
}

export const IncidentDetailPanel: React.FC<IncidentDetailPanelProps> = ({ incident, onClose }) => {
    const [activeTab, setActiveTab] = useState<'summary' | 'timeline' | 'comments'>('summary');
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        if (activeTab === 'comments') {
            fetchComments();
        }
    }, [activeTab, incident.id]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const data = await api.getComments(incident.id);
            setComments(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const comment = await api.addComment(incident.id, newComment);
            setComments([comment, ...comments]); // Prepend logic since we simulate newest first or we can sort
            setNewComment('');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start bg-gray-50">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-gray-500">#{incident.id.split('-')[0]}</span>
                        <Badge variant={incident.severity}>{incident.severity}</Badge>
                        <Badge variant={incident.status === 'PENDING_CONFIRMATION' ? 'outline' : incident.status} className={incident.status === 'OPEN' ? 'bg-orange-100 text-orange-800' : ''}>{incident.status}</Badge>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{incident.title}</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {(['summary', 'timeline', 'comments'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'summary' && (
                    <div className="space-y-6">
                        {/* FIXME: Update AIActions props or remove if not used 
                        <AIActions incidentId={incident.id} /> 
                        */}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Service</label>
                                <div className="mt-1 text-sm font-medium text-gray-900">{incident.service}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Issue Type</label>
                                <div className="mt-1 text-sm font-medium text-gray-900">{incident.issueType || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Created</label>
                                <div className="mt-1 text-sm text-gray-900">{new Date(incident.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Assigned Team</label>
                                <div className="mt-1 flex gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        @SRE
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        + Add Team
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Description</label>
                            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 leading-relaxed border border-gray-100">
                                {incident.description}
                            </div>
                        </div>

                        {incident.rootCause && (
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Root Cause Analysis</label>
                                <div className="bg-yellow-50 p-3 rounded-md text-sm text-gray-800 leading-relaxed border border-yellow-100">
                                    {incident.rootCause}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-2">
                        {/* Mock Timeline */}
                        {[
                            { title: 'Incident Resolved', time: 'Just now', type: 'success' },
                            { title: 'AI Analysis Completed', time: '10 mins ago', type: 'info' },
                            { title: 'Status changed to Investigating', time: '1 hour ago', type: 'neutral' },
                            { title: 'Incident Created', time: new Date(incident.createdAt).toLocaleTimeString(), type: 'neutral' }
                        ].map((event, idx) => (
                            <div key={idx} className="relative pl-6">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${event.type === 'success' ? 'bg-green-500' :
                                    event.type === 'info' ? 'bg-indigo-500' : 'bg-gray-400'
                                    }`} />
                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                <div className="text-xs text-gray-500">{event.time}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'comments' && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 space-y-4 mb-4">
                            {loadingComments ? (
                                <p className="text-center text-sm text-gray-400 py-4">Loading updates...</p>
                            ) : comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                                        {comment.author.charAt(0)}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none border border-gray-100 flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                                            <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddComment} className="mt-auto pt-4 border-t border-gray-100">
                            <label htmlFor="comment" className="sr-only">Add comment</label>
                            <div className="relative">
                                <textarea
                                    id="comment"
                                    rows={3}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border resize-none bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="Add an update... (@mention to tag team)"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="absolute bottom-2 right-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            {/* Footer with sticky action if needed? details usually sticky top */}
        </div>
    );
};
