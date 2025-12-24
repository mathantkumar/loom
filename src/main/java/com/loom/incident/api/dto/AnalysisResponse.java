package com.loom.incident.api.dto;

import java.util.List;
import java.util.UUID;

public class AnalysisResponse {
    private UUID incidentId;
    private String probableRootCause;
    private String recommendedResolution;
    private Double confidenceScore;
    private List<UUID> basedOnIncidentIds;
    private List<Hypothesis> hypotheses;

    public AnalysisResponse() {
    }

    public AnalysisResponse(UUID incidentId, String probableRootCause, String recommendedResolution,
            Double confidenceScore, List<UUID> basedOnIncidentIds, List<Hypothesis> hypotheses) {
        this.incidentId = incidentId;
        this.probableRootCause = probableRootCause;
        this.recommendedResolution = recommendedResolution;
        this.confidenceScore = confidenceScore;
        this.basedOnIncidentIds = basedOnIncidentIds;
        this.hypotheses = hypotheses;
    }

    public UUID getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(UUID incidentId) {
        this.incidentId = incidentId;
    }

    public String getProbableRootCause() {
        return probableRootCause;
    }

    public void setProbableRootCause(String probableRootCause) {
        this.probableRootCause = probableRootCause;
    }

    public String getRecommendedResolution() {
        return recommendedResolution;
    }

    public void setRecommendedResolution(String recommendedResolution) {
        this.recommendedResolution = recommendedResolution;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public List<UUID> getBasedOnIncidentIds() {
        return basedOnIncidentIds;
    }

    public void setBasedOnIncidentIds(List<UUID> basedOnIncidentIds) {
        this.basedOnIncidentIds = basedOnIncidentIds;
    }

    public List<Hypothesis> getHypotheses() {
        return hypotheses;
    }

    public void setHypotheses(List<Hypothesis> hypotheses) {
        this.hypotheses = hypotheses;
    }

    public static class Hypothesis {
        private String rootCause;
        private double confidence;
        private String source;

        public Hypothesis() {
        }

        public Hypothesis(String rootCause, double confidence, String source) {
            this.rootCause = rootCause;
            this.confidence = confidence;
            this.source = source;
        }

        public String getRootCause() {
            return rootCause;
        }

        public void setRootCause(String rootCause) {
            this.rootCause = rootCause;
        }

        public double getConfidence() {
            return confidence;
        }

        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }
    }
}
