import type { Severity, IncidentStatus } from '../../types';

interface BadgeProps {
    variant?: Severity | IncidentStatus | 'outline';
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant, children, className: customClass = '' }: BadgeProps) {
    let className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';

    if (variant === 'outline') {
        className += 'bg-transparent border border-gray-300 text-gray-700';
    } else if (variant) {
        // Soft backgrounds, no borders, calm colors
        const colors: Record<string, string> = {
            SEV1: 'bg-red-50 text-red-700',
            SEV2: 'bg-orange-50 text-orange-700',
            SEV3: 'bg-yellow-50 text-yellow-700',
            SEV4: 'bg-blue-50 text-blue-700',
            OPEN: 'bg-blue-50 text-blue-700',
            INVESTIGATING: 'bg-purple-50 text-purple-700',
            MITIGATED: 'bg-yellow-50 text-yellow-700',
            RESOLVED: 'bg-green-50 text-green-700',
            CLOSED: 'bg-gray-100 text-gray-700',
            PENDING_CONFIRMATION: 'bg-cyan-50 text-cyan-700'
        };
        className += colors[variant] || 'bg-gray-50 text-gray-700';
    } else {
        className += 'bg-gray-50 text-gray-700';
    }

    return (
        <span className={`${className} ${customClass}`}>
            {children}
        </span>
    );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
    return <Badge variant={severity}>{severity}</Badge>;
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
    return <Badge variant={status}>{status.replace('_', ' ')}</Badge>;
}


