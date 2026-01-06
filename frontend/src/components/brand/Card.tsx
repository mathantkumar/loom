import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'flat';
    noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', noPadding = false, children, ...props }, ref) => {

        const variants = {
            default: "bg-white border border-gray-100 shadow-sm",
            elevated: "bg-white border border-gray-100 shadow-xl shadow-gray-200/50",
            flat: "bg-gray-50 border border-transparent"
        };

        return (
            <div
                ref={ref}
                className={twMerge(
                    "rounded-2xl overflow-hidden transition-all",
                    variants[variant],
                    !noPadding && "p-6",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

export const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={twMerge("mb-6 flex flex-col gap-1", className)}>
        {children}
    </div>
);

export const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h3 className={twMerge("font-semibold text-lg text-gray-900 tracking-tight", className)}>
        {children}
    </h3>
);

export const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <p className={twMerge("text-sm text-gray-500", className)}>
        {children}
    </p>
);
