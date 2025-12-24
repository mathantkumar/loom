import React, { useState } from 'react';
import type { IncidentStatus } from '../types';

interface StatusSelectProps {
    currentStatus: IncidentStatus;
    onStatusChange: (newStatus: IncidentStatus) => Promise<void>;
}

const STATUS_OPTIONS: { value: IncidentStatus; label: string; color: string }[] = [
    { value: 'OPEN', label: 'Open', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'INVESTIGATING', label: 'Investigating', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'PENDING_CONFIRMATION', label: 'Pending Confirmation', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'CLOSED', label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-200' },
];

export const StatusSelect: React.FC<StatusSelectProps> = ({ currentStatus, onStatusChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = async (status: IncidentStatus) => {
        if (status === currentStatus) {
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            await onStatusChange(status);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const currentOption = STATUS_OPTIONS.find(o => o.value === currentStatus) || STATUS_OPTIONS[0];

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    onClick={() => !isLoading && setIsOpen(!isOpen)}
                    className={`inline-flex items-center justify-between w-48 px-4 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
                    ${currentOption.color} ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-opacity-80'}`}
                >
                    <span className="flex items-center gap-2">
                        {isLoading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {currentOption.label}
                    </span>
                    <svg className={`w-5 h-5 ml-2 -mr-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="py-1" role="none">
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    block w-full text-left px-4 py-2 text-sm
                                    ${option.value === currentStatus ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                                `}
                                role="menuitem"
                            >
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${option.color.split(' ')[0].replace('bg-', 'bg-')}`}></span>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Backdrop to close */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
};
