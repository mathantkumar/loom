export type CognitiveLoadLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type FamiliarityLevel = 'Low' | 'Medium' | 'High';

export interface EngineerPulse {
    id: string;
    name: string;
    role: string;
    avatarInitials: string;
    status: 'Available' | 'In flow' | 'Overloaded' | 'On-call';

    // MVP: Individual Load
    activeLoadScore: number; // Derived from Sev weights
    activeIncidents: number;
    severityBreakdown: {
        sev1: number;
        sev2: number;
        sev3: number;
    };

    // Fatigue Indicators
    timeOnIncidentToday: string; // e.g., "5h 20m"
    longestStretch: string; // e.g., "3h 10m"
    pageFrequency24h: number;

    // Context Indicators
    contextSwitchingScore: 'Low' | 'Medium' | 'High';
    contextServicesCount: number; // Distinct services touched

    // AI Signals
    decisionFatigueRisk: boolean;
    burnoutRisk: boolean;

    lastShiftEnd?: string; // For recovery window calculation

    // Dynamic Fields
    masteredServices: string[];
    recentIncidents: { id: string; title: string; severity: string; service: string }[];
}

export interface TeamPulseSummary {
    teamName: string;
    averageLoadScore: number;
    overloadedCount: number;
    availableCount: number;
    knowledgeConcentrationRisks: string[]; // List of categories where risk is high
}
