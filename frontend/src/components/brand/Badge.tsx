import React from 'react';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-50 text-green-700 border border-green-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        danger: "bg-red-50 text-red-700 border border-red-200",
        info: "bg-blue-50 text-blue-700 border border-blue-200",
        neutral: "bg-gray-50 text-gray-600 border border-gray-200"
    };

    return (
        <span className={twMerge(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};
