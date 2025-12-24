import React from 'react';
import { Avatar } from '../ui/Avatar';
import type { EngineerLoadMetric } from '../../types';

interface EngineerLoadListProps {
    engineers: EngineerLoadMetric[];
}

export const EngineerLoadList: React.FC<EngineerLoadListProps> = ({ engineers }) => {
    // Safe array access
    const safeEngineers = engineers || [];

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Engineer Load</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Schedule</button>
            </div>

            <div className="space-y-4">
                {safeEngineers.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No active assignments</div>
                ) : (
                    engineers.map((eng, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Avatar name={eng.engineerName} size="sm" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{eng.engineerName}</p>
                                    <p className="text-xs text-gray-500">SRE Team</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-end">
                                    <span className={`text-sm font-bold ${eng.activeIncidents > 2 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {eng.activeIncidents}
                                    </span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Active</span>
                                </div>
                                {eng.activeIncidents > 2 && (
                                    <div className="relative group/tooltip">
                                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                    AI Monitor: <span className="text-green-600 font-medium">Load is balanced</span>. No fatigue risk detected.
                </p>
            </div>
        </div>
    );
};
