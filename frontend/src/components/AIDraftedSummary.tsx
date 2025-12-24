import React, { useState, useEffect } from 'react';

interface AIDraftedSummaryProps {
    initialContent: string;
    onAccept: (content: string) => void;
    onDismiss: () => void;
}

export const AIDraftedSummary: React.FC<AIDraftedSummaryProps> = ({ initialContent, onAccept, onDismiss }) => {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    return (
        <div className="bg-white rounded-lg border border-purple-100 shadow-sm overflow-hidden animate-fade-in mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-white px-4 py-3 border-b border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h4 className="font-semibold text-gray-900 text-sm">AI Drafted Summary</h4>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-0.5 rounded-full">
                        Draft
                    </span>
                </div>
            </div>

            {/* Editable Content */}
            <div className="p-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-gray-700 text-sm leading-relaxed border-0 bg-transparent resize-none focus:ring-0 p-0"
                    rows={Math.max(3, content.split('\n').length)}
                    placeholder="Generative summary..."
                />
            </div>

            {/* Actions Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                    onClick={onDismiss}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Dismiss
                </button>
                <button
                    onClick={() => onAccept(content)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm transition-all"
                >
                    Accept & Save
                </button>
            </div>
        </div>
    );
};
