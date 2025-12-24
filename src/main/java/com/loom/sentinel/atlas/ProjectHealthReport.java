package com.loom.sentinel.atlas;

import java.time.Instant;
import java.util.List;

public class ProjectHealthReport {
    private String projectId;
    private double riskScore; // 0.0 to 1.0
    private String confidenceScore; // "HIGH", "MEDIUM", "LOW"
    private List<String> contributingFactors;
    private String predictedOutcome;
    private Instant lastEvaluatedAt;

    public ProjectHealthReport(String projectId, double riskScore, String confidenceScore,
            List<String> contributingFactors, String predictedOutcome) {
        this.projectId = projectId;
        this.riskScore = riskScore;
        this.confidenceScore = confidenceScore;
        this.contributingFactors = contributingFactors;
        this.predictedOutcome = predictedOutcome;
        this.lastEvaluatedAt = Instant.now();
    }

    // Getters and Setters
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(double riskScore) {
        this.riskScore = riskScore;
    }

    public String getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(String confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public List<String> getContributingFactors() {
        return contributingFactors;
    }

    public void setContributingFactors(List<String> contributingFactors) {
        this.contributingFactors = contributingFactors;
    }

    public String getPredictedOutcome() {
        return predictedOutcome;
    }

    public void setPredictedOutcome(String predictedOutcome) {
        this.predictedOutcome = predictedOutcome;
    }

    public Instant getLastEvaluatedAt() {
        return lastEvaluatedAt;
    }

    public void setLastEvaluatedAt(Instant lastEvaluatedAt) {
        this.lastEvaluatedAt = lastEvaluatedAt;
    }
}
