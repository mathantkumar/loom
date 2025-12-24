package com.loom.incident.api.dto;

import java.util.List;
import java.util.UUID;

public class IncidentTimelineResponse {
    private UUID incidentId;
    private List<TimelineEvent> events;

    public IncidentTimelineResponse(UUID incidentId, List<TimelineEvent> events) {
        this.incidentId = incidentId;
        this.events = events;
    }

    public UUID getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(UUID incidentId) {
        this.incidentId = incidentId;
    }

    public List<TimelineEvent> getEvents() {
        return events;
    }

    public void setEvents(List<TimelineEvent> events) {
        this.events = events;
    }
}
