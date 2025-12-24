import React from 'react';

interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 text-[10px]',
        md: 'w-8 h-8 text-xs',
        lg: 'w-10 h-10 text-sm'
    };

    const initials = name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Generate a consistent pastel color based on name length/char code roughly
    const colors = [
        'bg-blue-100 text-blue-700',
        'bg-green-100 text-green-700',
        'bg-purple-100 text-purple-700',
        'bg-orange-100 text-orange-700',
        'bg-teal-100 text-teal-700',
        'bg-indigo-100 text-indigo-700',
    ];
    const colorIndex = name.length % colors.length;
    const colorClass = colors[colorIndex];

    return (
        <div
            className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${sizeClasses[size]} ${!src ? colorClass : 'bg-gray-100'} ${className}`}
            title={name}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className="font-semibold leading-none">{initials}</span>
            )}
        </div>
    );
};
