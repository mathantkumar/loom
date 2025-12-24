package com.loom.sentinel.atlas.model;

import java.time.Instant;
import java.util.Map;

/**
 * Represents a normalized event or data point that Atlas uses for reasoning.
 * e.g., "High Incident Volume", "Deployment Failure", "Latency Spike".
 */
public class AtlasSignal {
    private String id;
    private SignalType type;
    private String sourceId; // e.g., Incident ID, Deployment ID, Service Name
    private Instant detectedAt;
    private double strength; // 0.0 to 1.0 (Severity or Magnitude)
    private Map<String, String> metadata; // Context (e.g., "author": "john", "error": "NPE")

    public AtlasSignal(String id, SignalType type, String sourceId, Instant detectedAt, double strength,
            Map<String, String> metadata) {
        this.id = id;
        this.type = type;
        this.sourceId = sourceId;
        this.detectedAt = detectedAt;
        this.strength = strength;
        this.metadata = metadata;
    }

    public enum SignalType {
        INCIDENT_SEVERITY,
        INCIDENT_VOLUME_SPIKE,
        DEPLOYMENT_FAILURE,
        DEPLOYMENT_SUCCESS,
        CODE_CHURN_SPIKE,
        TEAM_ASSIGNMENT_LOAD,
        LATENCY_DEVIATION,
        ERROR_RATE_DEVIATION
    }

    public String getId() {
        return id;
    }

    public SignalType getType() {
        return type;
    }

    public String getSourceId() {
        return sourceId;
    }

    public Instant getDetectedAt() {
        return detectedAt;
    }

    public double getStrength() {
        return strength;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }
}
