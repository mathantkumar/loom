package com.loom.sentinel.atlas.model;

import java.time.Instant;
import java.util.List;

/**
 * Represents the aggregate calculated state of a project at a point in time.
 * This is the "Truth" that Atlas presents to the user.
 */
public class ProjectState {
    private String projectId;
    private double overallRiskScore; // 0.0 (Safe) to 1.0 (Critical)
    private HealthStatus status; // HEALTHY, DEGRADED, CRITICAL
    private List<Insight> activeInsights;
    private Instant lastUpdated;

    public ProjectState(String projectId, double overallRiskScore, List<Insight> activeInsights) {
        this.projectId = projectId;
        this.overallRiskScore = overallRiskScore;
        this.activeInsights = activeInsights;
        this.lastUpdated = Instant.now();
        this.status = calculateStatus(overallRiskScore);
    }

    private HealthStatus calculateStatus(double risk) {
        if (risk > 0.75)
            return HealthStatus.CRITICAL;
        if (risk > 0.4)
            return HealthStatus.DEGRADED;
        return HealthStatus.HEALTHY;
    }

    public enum HealthStatus {
        HEALTHY,
        DEGRADED,
        CRITICAL
    }

    public String getProjectId() {
        return projectId;
    }

    public double getOverallRiskScore() {
        return overallRiskScore;
    }

    public HealthStatus getStatus() {
        return status;
    }

    public List<Insight> getActiveInsights() {
        return activeInsights;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }
}
