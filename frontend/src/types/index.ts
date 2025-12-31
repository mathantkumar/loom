export type Severity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED' | 'CLOSED' | 'PENDING_CONFIRMATION';
export type IssueType = 'DATABASE' | 'API' | 'UI' | 'INFRASTRUCTURE' | 'DEPLOYMENT' | 'OTHER';
export type TimelineEventType = 'INCIDENT_CREATED' | 'SIMILAR_INCIDENTS_FOUND' | 'AI_ANALYSIS' | 'INCIDENT_RESOLVED';

export interface IncidentRequest {
    title: string;
    description: string;
    service: string;
    severity: Severity;
    status: IncidentStatus;
    issueType: IssueType;
    assignee?: string; // User ID or null
}

export interface Incident {
    id: string;
    publicId?: string;
    title: string;
    description: string;
    severity: Severity;
    status: IncidentStatus;
    issueType?: IssueType;
    service: string;
    createdAt: string;
    resolvedAt?: string;
    rootCause?: string;
    assignee?: {
        name: string;
        email?: string;
        avatarUrl?: string;
    };
    evidence?: Evidence[];
    correlatedDeployments?: Deployment[];
    deploymentInsight?: string;
}

export interface Deployment {
    id: string;
    repoName: string;
    serviceName: string;
    branch?: string;
    commitHash?: string;
    commitMessage?: string;
    author?: string;
    environment: string;
    deploymentTime: string;
    status: 'success' | 'failure' | 'rollback';
}

export interface Evidence {
    id: string;
    filename: string;
    fileType: string;
    size: number;
    url: string;
    uploadedAt: string;
}

export interface IncidentTimelineResponse {
    incidentId: string;
    events: TimelineEvent[];
}

export interface TimelineEvent {
    timestamp: string;
    type: TimelineEventType;
    description: string;
}

export interface SimilarIncidentResponse {
    incidentId: string;
    title: string;
    severity: Severity;
    rootCause: string;
    score: number;
}

export interface AnalysisResponse {
    incidentId: string;
    rootCause: string;
    resolution: string;
    confidenceScore: number;
    basedOnIncidentIds: string[];
    hypotheses: Hypothesis[];
    summary?: string;
    suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
    id: string;
    label: string;
    type: 'investigation' | 'mitigation' | 'communication';
}

export interface Hypothesis {
    rootCause: string;
    confidence: number;
    source: string;
}

export interface IncidentStatsResponse {
    severityCounts: Record<Severity, number>;
    statusCounts: Record<IncidentStatus, number>;
    totalIncidents: number;
    avgMttrSeconds: number;
    mttrTrendPercent: number;
    frequencyTrendPercent: number;
    incidentsByDay: Record<string, number>;
    incidentsByService: Record<string, number>;
    engineerStats: EngineerLoadMetric[];
}

export interface EngineerLoadMetric {
    engineerName: string;
    activeIncidents: number;
}

export interface SearchOptions {
    q?: string;
    severity?: Severity;
    status?: IncidentStatus;
    issueType?: IssueType;
    fromDate?: string;
    toDate?: string;
}
export interface BaselineAnalysisResponse {
    isDeviating: boolean;
    deviationScore: number;
    confidenceScore: number;
    explanation: string;
    keyFactors: string[];
}
