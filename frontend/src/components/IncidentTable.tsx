import React, { useState } from 'react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset to first page when incidents change (e.g. filtering)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [incidents.length, hasFilters]);

    const totalPages = Math.ceil(incidents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentIncidents = incidents.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
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
                        {currentIncidents.map((incidents: Incident) => {
                            const isSelected = selectedId === incidents.id;
                            const isSev1 = incidents.severity === 'SEV1';

                            return (
                                <tr
                                    key={incidents.id}
                                    onClick={() => onSelect(incidents)}
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
                                        {incidents.publicId || incidents.id.substring(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-sm" title={incidents.title}>
                                            {incidents.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {incidents.service}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {incidents.assignee ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar name={incidents.assignee.name} src={incidents.assignee.avatarUrl} size="sm" />
                                                <span className="text-sm text-gray-700">{incidents.assignee.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={incidents.severity}>{incidents.severity}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={incidents.status === 'PENDING_CONFIRMATION' ? 'outline' : incidents.status}>
                                            {incidents.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(incidents.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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

            {/* Pagination Controls */}
            {!isLoading && incidents.length > 0 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, incidents.length)}</span> of <span className="font-medium">{incidents.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {/* Page Numbers (Simplified for now - can accept loop if needed but simple next/prev is safer for quick edit) */}
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    // Simple logic to show first 5 pages or sliding window could be complex. 
                                    // Let's stick to simple Prev/Next and maybe current page display if many pages.
                                    // For now, let's just render the current page button and maybe neighbors. 
                                    // Actually, let's keep it simple: Prev, [Current of Total], Next
                                    return null;
                                })}
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
