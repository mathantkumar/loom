import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../api/client';
import { DiscussionMessage } from './DiscussionMessage';
import { DiscussionComposer } from './DiscussionComposer';

interface DiscussionPanelProps {
    incidentId: string;
}

export const DiscussionPanel: React.FC<DiscussionPanelProps> = ({ incidentId }) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const fetchComments = async () => {
        try {
            const data = await api.getComments(incidentId);
            setComments(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
        // Poll for updates every 30s as a simple real-time mech for MVP
        const interval = setInterval(fetchComments, 30000);
        return () => clearInterval(interval);
    }, [incidentId]);

    const [shouldScrollBottom, setShouldScrollBottom] = useState(false);

    useEffect(() => {
        if (shouldScrollBottom && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            setShouldScrollBottom(false);
        }
    }, [comments, shouldScrollBottom]);

    const handleSend = async (message: string) => {
        setIsSending(true);
        try {
            const newComment = await api.addComment(incidentId, message);
            setComments(prev => [...prev, newComment]);
            setShouldScrollBottom(true);
        } catch (e) {
            console.error("Failed to send comment", e);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Live Discussion</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-mono">{comments.length}</span>
                </div>
                <div className="flex -space-x-1">
                    {/* Mock participants */}
                    <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white"></div>
                    <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
                    <div className="h-6 w-6 rounded-full bg-purple-500 border-2 border-white"></div>
                    <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-500 font-medium">+2</div>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading ? (
                    <div className="space-y-4 p-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                        <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>No active discussion. Start the war room.</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <DiscussionMessage key={comment.id} comment={comment} />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <div className="p-4 bg-gray-50/50">
                <DiscussionComposer onSend={handleSend} isSending={isSending} />
            </div>
        </div>
    );
};
