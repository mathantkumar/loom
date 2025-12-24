import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface Engineer {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    currentLoadScore: number;
    burnoutRisk: number;
    activeIncidents: number;
    assignedProjects: number;
    statusNarrative: string;
}

interface EngineerCardProps {
    engineer: Engineer;
}

const EngineerCard: React.FC<EngineerCardProps> = ({ engineer }) => {
    // Determine color based on risk
    const getRiskColor = (risk: number) => {
        if (risk > 0.7) return 'text-red-500 bg-red-50 border-red-200';
        if (risk > 0.4) return 'text-amber-500 bg-amber-50 border-amber-200';
        return 'text-green-500 bg-green-50 border-green-200';
    };

    const getLoadColor = (load: number) => {
        if (load > 0.8) return 'bg-red-500';
        if (load > 0.5) return 'bg-amber-500';
        return 'bg-blue-500';
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-3 w-full">
                    <Avatar className="h-10 w-10 border border-slate-200" src={engineer.avatarUrl} name={engineer.name} />
                    <div className="flex-1">
                        <h3 className="font-medium text-slate-800 text-sm leading-tight">{engineer.name}</h3>
                        <p className="text-xs text-slate-400">{engineer.role}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(engineer.burnoutRisk)}`}>
                        {(engineer.burnoutRisk * 100).toFixed(0)}% Risk
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
                <p className="text-xs text-slate-500 italic mb-4 min-h-[40px]">"{engineer.statusNarrative}"</p>

                <div className="space-y-3">
                    {/* Load Score */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Cognitive Load</span>
                            <span className="text-slate-700 font-medium">{(engineer.currentLoadScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full ${getLoadColor(engineer.currentLoadScore)}`}
                                style={{ width: `${engineer.currentLoadScore * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <div className="text-lg font-semibold text-slate-700">{engineer.activeIncidents}</div>
                            <div className="text-slate-400">Active Incidents</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <div className="text-lg font-semibold text-slate-700">{engineer.assignedProjects}</div>
                            <div className="text-slate-400">Projects</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EngineerCard;
