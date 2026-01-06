package com.loom.incident.api.dto;

import java.util.List;
import java.util.UUID;

public class TrendAnalysisResponse {
    private String trendSummary;
    private List<String> recurringPatterns;
    private String frequencyAnalysis;
    private String projectedImpact;
    private List<UUID> relatedIncidentIds;

    public TrendAnalysisResponse() {
    }

    public TrendAnalysisResponse(String trendSummary, List<String> recurringPatterns, String frequencyAnalysis,
            String projectedImpact, List<UUID> relatedIncidentIds) {
        this.trendSummary = trendSummary;
        this.recurringPatterns = recurringPatterns;
        this.frequencyAnalysis = frequencyAnalysis;
        this.projectedImpact = projectedImpact;
        this.relatedIncidentIds = relatedIncidentIds;
    }

    public String getTrendSummary() {
        return trendSummary;
    }

    public void setTrendSummary(String trendSummary) {
        this.trendSummary = trendSummary;
    }

    public List<String> getRecurringPatterns() {
        return recurringPatterns;
    }

    public void setRecurringPatterns(List<String> recurringPatterns) {
        this.recurringPatterns = recurringPatterns;
    }

    public String getFrequencyAnalysis() {
        return frequencyAnalysis;
    }

    public void setFrequencyAnalysis(String frequencyAnalysis) {
        this.frequencyAnalysis = frequencyAnalysis;
    }

    public String getProjectedImpact() {
        return projectedImpact;
    }

    public void setProjectedImpact(String projectedImpact) {
        this.projectedImpact = projectedImpact;
    }

    public List<UUID> getRelatedIncidentIds() {
        return relatedIncidentIds;
    }

    public void setRelatedIncidentIds(List<UUID> relatedIncidentIds) {
        this.relatedIncidentIds = relatedIncidentIds;
    }
}
