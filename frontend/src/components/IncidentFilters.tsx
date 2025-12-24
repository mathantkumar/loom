import React, { useEffect, useState } from 'react';
import { type SearchOptions, type Severity, type IncidentStatus, type IssueType } from '../types';

interface IncidentFiltersProps {
    onFilterChange: (filters: SearchOptions) => void;
    onClear: () => void;
    currentFilters: SearchOptions;
}

export function IncidentFilters({ onFilterChange, onClear, currentFilters }: IncidentFiltersProps) {
    const [query, setQuery] = useState(currentFilters.q || '');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== currentFilters.q) {
                onFilterChange({ ...currentFilters, q: query });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, currentFilters, onFilterChange]);

    useEffect(() => {
        setQuery(currentFilters.q || '');
    }, [currentFilters.q]);

    const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onFilterChange({ ...currentFilters, severity: val === 'All' ? 'All' as any : val as Severity });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onFilterChange({ ...currentFilters, status: val === 'All' ? 'All' as any : val as IncidentStatus });
    };

    const handleIssueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onFilterChange({ ...currentFilters, issueType: val === 'All' ? 'All' as any : val as IssueType });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center gap-4">
            {/* Search Bar - Dominant */}
            <div className="flex-1 w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search incidents by ID, title, or description..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-11 transition-shadow"
                />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <select
                    value={currentFilters.severity || 'All'}
                    onChange={handleSeverityChange}
                    className="block w-40 pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-11"
                >
                    <option value="All">Severity: All</option>
                    <option value="SEV1">SEV1</option>
                    <option value="SEV2">SEV2</option>
                    <option value="SEV3">SEV3</option>
                    <option value="SEV4">SEV4</option>
                </select>

                <select
                    value={currentFilters.status || 'OPEN'}
                    onChange={handleStatusChange}
                    className="block w-40 pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-11"
                >
                    <option value="All">Status: All</option>
                    <option value="OPEN">Open</option>
                    <option value="INVESTIGATING">Investigating</option>
                    <option value="MITIGATED">Mitigated</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="PENDING_CONFIRMATION">Pending</option>
                </select>

                <select
                    value={currentFilters.issueType || 'All'}
                    onChange={handleIssueTypeChange}
                    className="block w-40 pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-11"
                >
                    <option value="All">Type: All</option>
                    <option value="DATABASE">Database</option>
                    <option value="API">API</option>
                    <option value="UI">UI</option>
                </select>

                <button
                    onClick={() => {
                        setQuery('');
                        onClear();
                    }}
                    className="ml-2 px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-11 whitespace-nowrap"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
