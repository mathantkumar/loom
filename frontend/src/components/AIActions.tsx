import React, { useState } from 'react';

interface AIActionsProps {
    onWhatHappened: () => void;
    onCheckTrends: () => void;
    onSendEmail: () => void;
    isAnalyzing: boolean;
    isCheckingTrends: boolean;
    isSendingEmail: boolean;
    analysisVisible: boolean;
}

export const AIActions: React.FC<AIActionsProps> = ({
    onWhatHappened,
    onCheckTrends,
    onSendEmail,
    isAnalyzing,
    isCheckingTrends,
    isSendingEmail,
    analysisVisible
}) => {
    const [emailSuccess, setEmailSuccess] = useState(false);

    const handleEmailClick = () => {
        onSendEmail();
        setEmailSuccess(true);
        setTimeout(() => setEmailSuccess(false), 3000);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">⚡</span>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Agent Actions</h2>
                </div>
                <p className="text-xs text-gray-500">AI-assisted workflows</p>
            </div>

            <div className="space-y-3">
                {/* Primary Action: What Happened? */}
                <button
                    onClick={onWhatHappened}
                    disabled={isAnalyzing}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-md border shadow-sm transition-all group ${analysisVisible
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200 origin-center">👉</span>
                        <div className="text-left">
                            <p className={`text-sm font-bold ${analysisVisible ? 'text-indigo-700' : 'text-gray-800'}`}>What Happened?</p>
                            <p className="text-[10px] text-gray-400">Analyze behavior & baseline</p>
                        </div>
                    </div>
                    {isAnalyzing ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg className={`w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors ${analysisVisible ? 'rotate-90 text-indigo-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={onCheckTrends}
                        disabled={isCheckingTrends}
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                        {isCheckingTrends ? (
                            <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />
                        ) : (
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        )}
                        Check Trends
                    </button>

                    <button
                        onClick={handleEmailClick}
                        disabled={isSendingEmail || emailSuccess}
                        className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-md border text-sm font-medium transition-colors
                        ${emailSuccess
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'}`}
                    >
                        {isSendingEmail ? (
                            <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />
                        ) : emailSuccess ? (
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        )}
                        {emailSuccess ? 'Opened Gmail' : 'Email (Gmail)'}
                    </button>
                </div>
            </div>
        </div>
    );
};
