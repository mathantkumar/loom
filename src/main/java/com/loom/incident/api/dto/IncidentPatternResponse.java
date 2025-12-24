package com.loom.incident.api.dto;

import java.util.List;

public class IncidentPatternResponse {
    private PatternType patternType;
    private int occurrenceCount;
    private String timeWindow;
    private String message;
    private List<String> similarIncidentIds;

    public enum PatternType {
        RECURRING,
        FIRST_OCCURRENCE
    }

    public IncidentPatternResponse() {
    }

    public IncidentPatternResponse(PatternType patternType, int occurrenceCount, String timeWindow, String message,
            List<String> similarIncidentIds) {
        this.patternType = patternType;
        this.occurrenceCount = occurrenceCount;
        this.timeWindow = timeWindow;
        this.message = message;
        this.similarIncidentIds = similarIncidentIds;
    }

    // Getters and Setters
    public PatternType getPatternType() {
        return patternType;
    }

    public void setPatternType(PatternType patternType) {
        this.patternType = patternType;
    }

    public int getOccurrenceCount() {
        return occurrenceCount;
    }

    public void setOccurrenceCount(int occurrenceCount) {
        this.occurrenceCount = occurrenceCount;
    }

    public String getTimeWindow() {
        return timeWindow;
    }

    public void setTimeWindow(String timeWindow) {
        this.timeWindow = timeWindow;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getSimilarIncidentIds() {
        return similarIncidentIds;
    }

    public void setSimilarIncidentIds(List<String> similarIncidentIds) {
        this.similarIncidentIds = similarIncidentIds;
    }
}
