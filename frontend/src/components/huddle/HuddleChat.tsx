import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}

interface HuddleChatProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    currentUserId: string;
}

export const HuddleChat: React.FC<HuddleChatProps> = ({ messages, onSendMessage, currentUserId }) => {
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200">
            <div className="p-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Huddle Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${isMe ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};
