import React from 'react';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import type { Incident } from '../types';

interface IncidentTableProps {
    incidents: Incident[];
    selectedId: string | null;
    onSelect: (incident: Incident) => void;
    isLoading?: boolean;
    hasFilters?: boolean;
    onClearFilters?: () => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
    incidents,
    selectedId,
    onSelect,
    isLoading = false,
    hasFilters = false,
    onClearFilters
}) => {
    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[...Array(8)].map((_, i) => (
                                    <th key={i} className="px-6 py-4 text-left">
                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(8)].map((_, j) => (
                                        <td key={j} className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500 tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-4">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left">ID</th>
                            <th scope="col" className="px-6 py-3 text-left">Title</th>
                            <th scope="col" className="px-6 py-3 text-left">Service</th>
                            <th scope="col" className="px-6 py-3 text-left">Assignee</th>
                            <th scope="col" className="px-6 py-3 text-left">Severity</th>
                            <th scope="col" className="px-6 py-3 text-left">Status</th>
                            <th scope="col" className="px-6 py-3 text-left">Created</th>
                            <th scope="col" className="px-6 py-3 relative"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {incidents.map((incident) => {
                            const isSelected = selectedId === incident.id;
                            const isSev1 = incident.severity === 'SEV1';

                            return (
                                <tr
                                    key={incident.id}
                                    onClick={() => onSelect(incident)}
                                    className={`group hover:bg-gray-50 cursor-pointer transition-colors duration-150 
                                        ${isSelected ? 'bg-blue-50' : ''}
                                        ${isSev1 && !isSelected ? 'bg-red-50' : ''}
                                    `}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => { }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                        #{incident.id ? incident.id.split('-')[0] : '???'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-sm" title={incident.title}>
                                            {incident.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {incident.service}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {incident.assignee ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar name={incident.assignee.name} src={incident.assignee.avatarUrl} size="sm" />
                                                <span className="text-sm text-gray-700">{incident.assignee.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={incident.severity}>{incident.severity}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={incident.status === 'PENDING_CONFIRMATION' ? 'outline' : incident.status}>
                                            {incident.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(incident.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); }}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {incidents.length === 0 && !isLoading && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {hasFilters ? 'No incidents match these filters' : 'No incidents found'}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                            {hasFilters
                                ? 'Try adjusting your search terms or filters to find what you looking for.'
                                : 'Get started by creating a new ticket manually or waiting for incoming alerts.'}
                        </p>
                        <div className="mt-6">
                            {hasFilters && onClearFilters ? (
                                <button
                                    onClick={onClearFilters}
                                    className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Clear all filters
                                </button>
                            ) : (
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Create new incident
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
