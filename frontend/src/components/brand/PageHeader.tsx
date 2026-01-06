import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, className }) => {
    return (
        <div className={twMerge("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                {description && (
                    <p className="mt-1 text-gray-500">{description}</p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
};
