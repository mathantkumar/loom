package com.loom.incident.api.dto;

import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.Severity;

import java.util.Map;

public class IncidentStatsResponse {
    private Map<Severity, Long> severityCounts;
    private Map<IncidentStatus, Long> statusCounts;
    private long totalIncidents;

    public IncidentStatsResponse() {
    }

    private double avgMttrSeconds;
    private double mttrTrendPercent;
    private double frequencyTrendPercent;
    private Map<String, Long> incidentsByDay;
    private Map<String, Long> incidentsByService;
    private java.util.List<EngineerLoadMetric> engineerStats;

    public IncidentStatsResponse(Map<Severity, Long> severityCounts, Map<IncidentStatus, Long> statusCounts,
            long totalIncidents) {
        this.severityCounts = severityCounts;
        this.statusCounts = statusCounts;
        this.totalIncidents = totalIncidents;
    }

    public IncidentStatsResponse(Map<Severity, Long> severityCounts, Map<IncidentStatus, Long> statusCounts,
            long totalIncidents, double avgMttrSeconds, double mttrTrendPercent, double frequencyTrendPercent,
            Map<String, Long> incidentsByDay, Map<String, Long> incidentsByService,
            java.util.List<EngineerLoadMetric> engineerStats) {
        this.severityCounts = severityCounts;
        this.statusCounts = statusCounts;
        this.totalIncidents = totalIncidents;
        this.avgMttrSeconds = avgMttrSeconds;
        this.mttrTrendPercent = mttrTrendPercent;
        this.frequencyTrendPercent = frequencyTrendPercent;
        this.incidentsByDay = incidentsByDay;
        this.incidentsByService = incidentsByService;
        this.engineerStats = engineerStats;
    }

    public Map<Severity, Long> getSeverityCounts() {
        return severityCounts;
    }

    public void setSeverityCounts(Map<Severity, Long> severityCounts) {
        this.severityCounts = severityCounts;
    }

    public Map<IncidentStatus, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<IncidentStatus, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }

    public long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public double getAvgMttrSeconds() {
        return avgMttrSeconds;
    }

    public void setAvgMttrSeconds(double avgMttrSeconds) {
        this.avgMttrSeconds = avgMttrSeconds;
    }

    public double getMttrTrendPercent() {
        return mttrTrendPercent;
    }

    public void setMttrTrendPercent(double mttrTrendPercent) {
        this.mttrTrendPercent = mttrTrendPercent;
    }

    public double getFrequencyTrendPercent() {
        return frequencyTrendPercent;
    }

    public void setFrequencyTrendPercent(double frequencyTrendPercent) {
        this.frequencyTrendPercent = frequencyTrendPercent;
    }

    public Map<String, Long> getIncidentsByDay() {
        return incidentsByDay;
    }

    public void setIncidentsByDay(Map<String, Long> incidentsByDay) {
        this.incidentsByDay = incidentsByDay;
    }

    public Map<String, Long> getIncidentsByService() {
        return incidentsByService;
    }

    public void setIncidentsByService(Map<String, Long> incidentsByService) {
        this.incidentsByService = incidentsByService;
    }

    public java.util.List<EngineerLoadMetric> getEngineerStats() {
        return engineerStats;
    }

    public void setEngineerStats(java.util.List<EngineerLoadMetric> engineerStats) {
        this.engineerStats = engineerStats;
    }

    public static class EngineerLoadMetric {
        private String engineerName;
        private long activeIncidents;

        public EngineerLoadMetric(String engineerName, long activeIncidents) {
            this.engineerName = engineerName;
            this.activeIncidents = activeIncidents;
        }

        public String getEngineerName() {
            return engineerName;
        }

        public long getActiveIncidents() {
            return activeIncidents;
        }
    }
}
