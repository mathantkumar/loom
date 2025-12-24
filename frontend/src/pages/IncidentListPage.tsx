import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { type Incident, type IncidentStatsResponse, type SearchOptions } from '../types';
import { IncidentFilters } from '../components/IncidentFilters';
import { DashboardStats } from '../components/DashboardStats';
import { IncidentTable } from '../components/IncidentTable';
import { CreateIncidentModal } from '../components/CreateIncidentModal';

export const IncidentListPage: React.FC = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [stats, setStats] = useState<IncidentStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState<SearchOptions>({
        status: 'OPEN'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchIncidents = async () => {
            setLoading(true);
            try {
                const data = await api.searchIncidents(filters);
                setIncidents(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch incidents:", err);
                setError('Failed to load incidents. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchIncidents();
    }, [filters]);

    const handleFilterChange = (newFilters: SearchOptions) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({ status: 'OPEN' });
    };

    return (
        <div className="pb-20">
            {/* Main Layout Container */}
            <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="mt-2 text-base text-gray-500">
                            Monitor, track, and resolve incidents across all services.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await api.syncIndex();
                                    // Reload page or re-fetch
                                    window.location.reload();
                                } catch (e) {
                                    console.error(e);
                                    setLoading(false);
                                }
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Sync Data
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Incident
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <DashboardStats
                    stats={stats}
                    onStatusClick={(status) => setFilters({ ...filters, status: status as any })}
                />

                {/* Filters */}
                <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-4 pb-2">
                    <IncidentFilters
                        currentFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                    />
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-100">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <IncidentTable
                    incidents={incidents}
                    selectedId={null} // No selection state in list anymore
                    onSelect={(incident) => navigate(`/incidents/${incident.id}`)}
                    isLoading={loading}
                    hasFilters={
                        (filters.status !== 'OPEN') ||
                        (!!filters.severity) ||
                        (!!filters.issueType) ||
                        (!!filters.q)
                    }
                    onClearFilters={handleClearFilters}
                />
            </div>
            {/* Create Incident Modal */}
            <CreateIncidentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    // Refresh incidents
                    const fetchIncidents = async () => {
                        setLoading(true);
                        try {
                            // Re-fetch using current filters
                            const data = await api.searchIncidents(filters);
                            setIncidents(data);
                            // Also refresh stats
                            const statsData = await api.getStats();
                            setStats(statsData);
                        } catch (err) {
                            console.error("Failed to refresh data after creation:", err);
                        } finally {
                            setLoading(false);
                        }
                    };
                    fetchIncidents();
                }}
            />
        </div>
    );
};
