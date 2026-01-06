import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {

        const variants = {
            primary: "bg-sentinel-600 text-white hover:bg-sentinel-700 shadow-sm shadow-sentinel-600/20",
            secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs rounded-lg",
            md: "px-4 py-2 text-sm rounded-xl",
            lg: "px-6 py-3 text-base rounded-xl"
        };

        return (
            <button
                ref={ref}
                className={twMerge(
                    "inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
