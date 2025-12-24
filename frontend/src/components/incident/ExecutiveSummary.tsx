import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

interface Props {
    summary?: string;
    rootCause?: string;
    className?: string;
}

export const ExecutiveSummary: React.FC<Props> = ({ summary, rootCause, className }) => {
    return (
        <div className={` ${className}`}>
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Executive Briefing</h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI Generated Assessment</p>
                </div>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
                {summary ? (
                    <p className="text-slate-700 leading-relaxed font-serif text-[1.05rem]">
                        {summary}
                    </p>
                ) : (
                    <div className="flex items-center gap-3 text-slate-400 italic p-4 bg-slate-50/50 rounded-lg justify-center border border-dashed border-slate-200">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                        Gathering patterns effectively...
                    </div>
                )}

                {rootCause && (
                    <div className="mt-8 flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50 to-white rounded-xl border border-indigo-100/60 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertCircle className="w-24 h-24 text-indigo-500 transform rotate-12" />
                        </div>

                        <div className="min-w-fit mt-1">
                            <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center shadow-sm text-indigo-600">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <span className="block text-xs font-bold text-indigo-900 uppercase tracking-widest mb-1.5 opacity-70">
                                Likely Root Cause
                            </span>
                            <p className="text-indigo-950 font-medium text-lg leading-snug">
                                {rootCause}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
