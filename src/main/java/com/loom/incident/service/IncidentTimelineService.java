package com.loom.incident.service;

import com.loom.incident.api.dto.IncidentTimelineResponse;
import com.loom.incident.api.dto.TimelineEvent;
import com.loom.incident.domain.Incident;
import com.loom.incident.domain.TimelineEventType;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class IncidentTimelineService {

    private final IncidentRepository incidentRepository;

    public IncidentTimelineService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public IncidentTimelineResponse buildTimeline(UUID incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with id: " + incidentId));

        List<TimelineEvent> events = new ArrayList<>();

        // 1. INCIDENT_CREATED
        if (incident.getCreatedAt() != null) {
            events.add(new TimelineEvent(
                    incident.getCreatedAt(),
                    TimelineEventType.INCIDENT_CREATED,
                    "Incident was created"));
        }

        // 2. SIMILAR_INCIDENTS_FOUND & 3. AI_ANALYSIS
        // Deterministic logic: If root cause is present, we assume analysis happened.
        // We simulate timestamps relative to creation time for deterministic
        // replayability.
        if (incident.getRootCause() != null && !incident.getRootCause().isEmpty() && incident.getCreatedAt() != null) {

            // Assume similarity search finished 1 second after creation
            Instant similarityTime = incident.getCreatedAt().plusSeconds(1);
            events.add(new TimelineEvent(
                    similarityTime,
                    TimelineEventType.SIMILAR_INCIDENTS_FOUND,
                    "Similar historical incidents identified"));

            // Assume AI analysis finished 2 seconds after creation
            Instant analysisTime = incident.getCreatedAt().plusSeconds(2);
            events.add(new TimelineEvent(
                    analysisTime,
                    TimelineEventType.AI_ANALYSIS,
                    "AI-based root cause and resolution generated"));
        }

        // 4. INCIDENT_RESOLVED
        if (incident.getResolvedAt() != null) {
            events.add(new TimelineEvent(
                    incident.getResolvedAt(),
                    TimelineEventType.INCIDENT_RESOLVED,
                    "Incident marked as resolved"));
        }

        // Sort by timestamp
        events.sort(Comparator.comparing(TimelineEvent::getTimestamp));

        return new IncidentTimelineResponse(incidentId, events);
    }
}
