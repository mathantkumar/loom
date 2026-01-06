import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
}

interface ChatSidebarProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export function ChatSidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession
}: ChatSidebarProps) {
    return (
        <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col h-full font-sans">
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-start gap-2 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
                <div className="text-[10px] font-bold text-gray-400 mb-2 px-3 uppercase tracking-wider">
                    Recent Logic
                </div>
                {sessions.map(session => (
                    <div
                        key={session.id}
                        onClick={() => onSelectSession(session.id)}
                        className={`
                            group flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-sm mb-1 transition-all
                            ${currentSessionId === session.id
                                ? 'bg-white border border-gray-200 text-purple-700 shadow-sm font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'}
                        `}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <MessageSquare className={`h-4 w-4 shrink-0 ${currentSessionId === session.id ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            <span className="truncate">{session.title}</span>
                        </div>
                        <button
                            onClick={(e) => onDeleteSession(session.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-all"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

    );
}
