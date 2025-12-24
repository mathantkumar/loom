package com.loom.incident.api.dto;

import com.loom.incident.domain.Severity;
import java.util.UUID;

public class SimilarIncidentResponse {
    private UUID incidentId;
    private String title;
    private Severity severity;
    private String rootCause;
    private double similarityScore;

    public SimilarIncidentResponse(UUID incidentId, String title, Severity severity, String rootCause,
            double similarityScore) {
        this.incidentId = incidentId;
        this.title = title;
        this.severity = severity;
        this.rootCause = rootCause;
        this.similarityScore = similarityScore;
    }

    public UUID getIncidentId() {
        return incidentId;
    }

    public String getTitle() {
        return title;
    }

    public Severity getSeverity() {
        return severity;
    }

    public String getRootCause() {
        return rootCause;
    }

    public double getSimilarityScore() {
        return similarityScore;
    }
}
