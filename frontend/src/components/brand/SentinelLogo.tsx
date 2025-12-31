import React from 'react';
import { motion } from 'framer-motion';

export type LogoVariant = 'full' | 'symbol' | 'wordmark';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoMode = 'light' | 'dark'; // Context background

interface SentinelLogoProps {
    variant?: LogoVariant;
    size?: LogoSize;
    animated?: boolean; // If true, enables "thinking" pulse
    className?: string;
    mode?: LogoMode;
}

export const SentinelLogo: React.FC<SentinelLogoProps> = ({
    variant = 'full',
    size = 'md',
    animated = false,
    className = '',
    mode = 'light'
}) => {
    // Size mapping
    const sizes = {
        sm: { h: 6, w: 6, text: 'text-lg' },
        md: { h: 8, w: 8, text: 'text-xl' },
        lg: { h: 12, w: 12, text: 'text-3xl' },
        xl: { h: 16, w: 16, text: 'text-5xl' },
    };

    const currentSize = sizes[size];
    const textColor = mode === 'dark' ? 'text-white' : 'text-gray-900';
    const symbolColor = 'text-sentinel-600'; // Deep Intelligence Green

    // Geometric Star Symbol (4-pointed spark + center core)
    // Represents: Signal, Convergence, Intelligence
    const Symbol = () => (
        <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-${currentSize.h} h-${currentSize.h} ${symbolColor}`}
            animate={animated ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Core */}
            <circle cx="12" cy="12" r="2" fill="currentColor" className="opacity-90" />

            {/* Rays - "Vigilance" */}
            <motion.path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                animate={animated ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Outer Pulse Ring (Thinking State Only) */}
            {animated && (
                <motion.circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.5, 0], scale: 1.5 }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </motion.svg>
    );

    return (
        <div className={`flex items-center gap-3 font-sans select-none ${className}`}>
            {(variant === 'full' || variant === 'symbol') && <Symbol />}

            {(variant === 'full' || variant === 'wordmark') && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`font-semibold tracking-tight ${currentSize.text} ${textColor}`}
                >
                    sentinel
                </motion.span>
            )}
        </div>
    );
};
