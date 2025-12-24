import React, { useState, useRef } from 'react';

interface DiscussionComposerProps {
    onSend: (message: string) => void;
    isSending: boolean;
}

export const DiscussionComposer: React.FC<DiscussionComposerProps> = ({ onSend, isSending }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim() || isSending) return;

        onSend(message);
        setMessage('');
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-expand
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="border-t border-gray-200 pt-4 bg-white">
            <div className="relative rounded-xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    className="block w-full py-3 px-4 rounded-xl border-none focus:ring-0 resize-none bg-transparent placeholder-gray-400 text-sm"
                    placeholder="Add an update, hypothesis, or observation... (Cmd+Enter to send)"
                    value={message}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    style={{ minHeight: '50px', maxHeight: '200px' }}
                />

                <div className="flex justify-between items-center px-2 pb-2">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors text-xs font-medium flex items-center gap-1"
                            title="Ask AI for insight"
                            onClick={() => setMessage(prev => prev + "/ask-ai ")}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Ask AI
                        </button>
                        <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={() => handleSubmit()}
                        disabled={!message.trim() || isSending}
                        className={`
                            inline-flex items-center p-1.5 rounded-md transition-all
                            ${message.trim() ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
                        `}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-right">Markdown supported • Cmd + Enter to submit</div>
        </div>
    );
};
