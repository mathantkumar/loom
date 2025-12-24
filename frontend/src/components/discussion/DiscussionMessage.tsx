import React from 'react';
import { Avatar } from '../ui/Avatar';

interface Comment {
    id: number;
    author: string;
    message: string;
    timestamp: string;
    role?: string; // e.g., 'SRE', 'AI', 'Manager'
}

interface DiscussionMessageProps {
    comment: Comment;
}

export const DiscussionMessage: React.FC<DiscussionMessageProps> = ({ comment }) => {
    const isAI = comment.author === 'System AI';

    return (
        <div className={`flex gap-4 p-4 rounded-xl transition-colors ${isAI ? 'bg-indigo-50/50 border border-indigo-100' : 'hover:bg-gray-50'}`}>
            <div className="flex-shrink-0">
                <Avatar
                    name={comment.author}
                    size="sm"
                    src={isAI ? undefined : undefined} // Could add AI avatar icon here
                />
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${isAI ? 'text-indigo-700' : 'text-gray-900'}`}>
                        {comment.author}
                    </span>
                    {isAI && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            AI
                        </span>
                    )}
                    <span className="text-xs text-gray-400">
                        {new Date(comment.timestamp).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </span>
                </div>

                <div className={`text-sm leading-relaxed ${isAI ? 'text-indigo-900' : 'text-gray-700'}`}>
                    {/* Basic Rich Text - converting newlines to breaks for MVP */}
                    {comment.message.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {/* Simple highlighting logic for keywords */}
                            {line.split(' ').map((word, wIdx) => {
                                const lower = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                                if (['error', 'latency', 'timeout', 'fail', 'exception', 'critical'].includes(lower)) {
                                    return <span key={wIdx} className="font-medium text-red-600 bg-red-50 px-0.5 rounded">{word} </span>;
                                }
                                return word + ' ';
                            })}
                        </p>
                    ))}
                </div>

                {/* Reactions / Actions Row (Mocked) */}
                <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        React
                    </button>
                    <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
};
