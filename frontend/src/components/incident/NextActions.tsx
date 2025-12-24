import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Search } from 'lucide-react';
import type { SuggestedAction } from '../../types';

interface NextActionsProps {
    actions?: SuggestedAction[];
}

export const NextActions: React.FC<NextActionsProps> = ({ actions }) => {
    // Default Mocks if no actions provided
    const displayActions: SuggestedAction[] = actions && actions.length > 0 ? actions : [
        { id: '1', label: 'Check memory leak in payment-service v2.4.1', type: 'investigation' },
        { id: '2', label: 'Scale JVM heap temporarily', type: 'mitigation' },
        { id: '3', label: 'Assign SRE on-call for deeper analysis', type: 'communication' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'investigation': return <Search className="w-4 h-4 text-blue-500" />;
            case 'mitigation': return <ShieldAlert className="w-4 h-4 text-amber-500" />;
            default: return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        }
    };

    return (
        <div className="bg-indigo-50/50 rounded-lg border border-indigo-100 p-5">
            <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                Recommended Next Actions
            </h2>

            <div className="space-y-3">
                {displayActions.map((action) => (
                    <button
                        key={action.id}
                        className="w-full flex items-center justify-between p-3 bg-white border border-indigo-200/60 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group text-left"
                    >
                        <div className="flex items-center gap-3">
                            {getIcon(action.type)}
                            <span className="text-sm font-medium text-slate-800 fill-mode-forwards group-hover:text-indigo-700 transition-colors">
                                {action.label}
                            </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>
        </div>
    );
};
