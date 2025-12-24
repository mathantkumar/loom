package com.loom.sentinel.atlas.model;

import java.time.Instant;
import java.util.List;

/**
 * Represents a high-level finding or conclusion derived from signals.
 * e.g., "Unstable Release detected", "Team Fatigue Risk".
 */
public class Insight {
    private String id;
    private InsightType type;
    private String summary;
    private String description;
    private double confidence; // 0.0 to 1.0
    private double severity; // 0.0 to 1.0 (Impact)
    private List<String> contributingSignalIds;
    private Instant generatedAt;

    public Insight(String id, InsightType type, String summary, String description, double confidence, double severity,
            List<String> contributingSignalIds) {
        this.id = id;
        this.type = type;
        this.summary = summary;
        this.description = description;
        this.confidence = confidence;
        this.severity = severity;
        this.contributingSignalIds = contributingSignalIds;
        this.generatedAt = Instant.now();
    }

    public enum InsightType {
        UNSTABLE_RELEASE, // Incidents following a deployment
        CASCADING_FAILURE, // Failures propagating across services
        TEAM_FATIGUE, // High load on specific people
        BASELINE_DRIFT, // Gradual degradation of metrics
        RECURRING_PATTERN, // Same issue happening repeatedly
        PROJECT_RISK_SPIKE // General aggregate risk increase
    }

    public String getId() {
        return id;
    }

    public InsightType getType() {
        return type;
    }

    public String getSummary() {
        return summary;
    }

    public String getDescription() {
        return description;
    }

    public double getConfidence() {
        return confidence;
    }

    public double getSeverity() {
        return severity;
    }

    public List<String> getContributingSignalIds() {
        return contributingSignalIds;
    }

    public Instant getGeneratedAt() {
        return generatedAt;
    }
}
