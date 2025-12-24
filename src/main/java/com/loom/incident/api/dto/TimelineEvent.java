package com.loom.incident.api.dto;

import com.loom.incident.domain.TimelineEventType;
import java.time.Instant;

public class TimelineEvent {
    private Instant timestamp;
    private TimelineEventType type;
    private String description;

    public TimelineEvent(Instant timestamp, TimelineEventType type, String description) {
        this.timestamp = timestamp;
        this.type = type;
        this.description = description;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public TimelineEventType getType() {
        return type;
    }

    public void setType(TimelineEventType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
