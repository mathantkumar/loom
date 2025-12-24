import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { api } from '../api/client';
import type { IncidentRequest, IssueType, Severity, IncidentStatus } from '../types';

interface CreateIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SERVICES = [
    'payment-service',
    'auth-service',
    'inventory-service',
    'search-service',
    'notification-service',
    'frontend-app'
];

const ISSUE_TYPES: IssueType[] = ['DATABASE', 'API', 'UI', 'INFRASTRUCTURE', 'DEPLOYMENT', 'OTHER'];
const SEVERITIES: Severity[] = ['SEV1', 'SEV2', 'SEV3'];
const STATUSES: IncidentStatus[] = ['OPEN', 'PENDING_CONFIRMATION', 'RESOLVED', 'CLOSED'];

export function CreateIncidentModal({ isOpen, onClose, onSuccess }: CreateIncidentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<IncidentRequest>({
        title: '',
        description: '',
        service: SERVICES[0],
        severity: 'SEV2',
        status: 'OPEN',
        issueType: 'API',
        assignee: '' // Optional
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isValid = formData.title.trim().length > 0 &&
        formData.description.trim().length > 0 &&
        formData.service.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setLoading(true);
        setError(null);

        try {
            await api.createIncident({
                ...formData,
                assignee: formData.assignee || undefined
            });
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                service: SERVICES[0],
                severity: 'SEV2', // Default back to SEV2
                status: 'OPEN',
                issueType: 'API',
                assignee: ''
            });

        } catch (err) {
            console.error(err);
            setError('Failed to create incident. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Incident">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Incident Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        maxLength={200}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        placeholder="e.g. Database connection timeout on payment-service"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        required
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        placeholder="Describe what happened, symptoms, and impact"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Row: Service & Issue Type */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                            Service <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="service"
                            id="service"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                            value={formData.service}
                            onChange={handleChange}
                        >
                            {SERVICES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">
                            Issue Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="issueType"
                            id="issueType"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                            value={formData.issueType}
                            onChange={handleChange}
                        >
                            {ISSUE_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row: Severity & Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                            Severity <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="severity"
                            id="severity"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                            value={formData.severity}
                            onChange={handleChange}
                        >
                            {SEVERITIES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            id="status"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Assignee (Optional) */}
                <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                        Assignee (Optional)
                    </label>
                    <input
                        type="text"
                        name="assignee"
                        id="assignee"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        placeholder="Unassigned"
                        value={formData.assignee}
                        onChange={handleChange}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                        type="submit"
                        disabled={!isValid || loading}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm ${(!isValid || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create Incident'}
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
