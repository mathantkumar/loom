import React from 'react';
import { GitCommit, Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';
import type { Deployment } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface DeploymentContextCardProps {
    deployments?: Deployment[];
    insight?: string;
}

export const DeploymentContextCard: React.FC<DeploymentContextCardProps> = ({ deployments, insight }) => {
    if (!deployments || deployments.length === 0) {
        return null;
    }

    // const latestDeployment = deployments[0]; // Removed unused variable
    // const isSuccess = latestDeployment.status === 'success'; // Removed unused variable

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                        <GitCommit size={18} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Deployment Context</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        AI Insight Generated
                    </span>
                </div>
            </div>

            <div className="p-5">
                {/* AI Insight Section */}
                {insight && (
                    <div className="mb-5 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 rounded-lg p-4 border border-indigo-100/50">
                        <div className="flex gap-3">
                            <div className="mt-0.5 flex-shrink-0">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                    {insight}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Deployment Details */}
                <div className="space-y-4">
                    {deployments.map((deployment) => (
                        <div key={deployment.id} className="flex items-start gap-4 p-3 rounded-md hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${deployment.status === 'success' ? 'bg-green-100 text-green-600' :
                                deployment.status === 'failure' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                {deployment.status === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {deployment.serviceName} <span className="text-gray-400 font-normal">deploy to</span> {deployment.environment}
                                    </h4>
                                    <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatDistanceToNow(new Date(deployment.deploymentTime))} ago
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">
                                        <GitCommit size={12} />
                                        {deployment.commitHash?.substring(0, 7) || 'unknown'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={12} />
                                        {deployment.author || 'system'}
                                    </div>
                                    <div className="truncate max-w-[200px]" title={deployment.commitMessage}>
                                        {deployment.commitMessage}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
