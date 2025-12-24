package com.loom.incident.api;

import com.loom.incident.api.dto.IncidentTimelineResponse;
import com.loom.incident.service.IncidentTimelineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentTimelineController {

    private final IncidentTimelineService incidentTimelineService;

    public IncidentTimelineController(IncidentTimelineService incidentTimelineService) {
        this.incidentTimelineService = incidentTimelineService;
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<IncidentTimelineResponse> getIncidentTimeline(@PathVariable UUID id) {
        IncidentTimelineResponse response = incidentTimelineService.buildTimeline(id);
        return ResponseEntity.ok(response);
    }
}
