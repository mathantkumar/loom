import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ title, description, children, className = '' }: { title?: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}
