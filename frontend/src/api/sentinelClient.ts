import { API_BASE_URL } from './client';

export interface ProjectHealthReport {
    projectId: string;
    riskScore: number;
    confidenceScore: string;
    contributingFactors: string[];
    predictedOutcome: string;
    lastEvaluatedAt: string;
}

export interface CausalityGraph {
    nodes: {
        id: string;
        type: string;
        label: string;
        status: string;
    }[];
    edges: {
        source: string;
        target: string;
        relationship: string;
        confidence: number;
    }[];
}

export interface HistoricalContext {
    insight: string;
    similarIncidents: {
        id: string;
        title: string;
        resolution: string;
        similarityScore: number;
    }[];
}

export const sentinelApi = {
    getProjectHealth: async (projectId: string): Promise<ProjectHealthReport> => {
        const response = await fetch(`${API_BASE_URL}/sentinel/atlas/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project health');
        return response.json();
    },

    getCausalityGraph: async (incidentId: string): Promise<CausalityGraph> => {
        const response = await fetch(`${API_BASE_URL}/sentinel/causality/${incidentId}`);
        if (!response.ok) throw new Error('Failed to fetch causality graph');
        return response.json();
    },

    getServiceCausalityGraph: async (serviceId: string): Promise<CausalityGraph> => {
        const response = await fetch(`${API_BASE_URL}/sentinel/causality/service/${serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch service causality graph');
        return response.json();
    },

    getHistoricalContext: async (incidentId: string): Promise<HistoricalContext> => {
        const response = await fetch(`${API_BASE_URL}/sentinel/memory/${incidentId}`);
        if (!response.ok) throw new Error('Failed to fetch historical context');
        return response.json();
    },

    getServiceHistoricalContext: async (serviceId: string): Promise<HistoricalContext> => {
        const response = await fetch(`${API_BASE_URL}/sentinel/memory/service/${serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch service historical context');
        return response.json();
    }
};
