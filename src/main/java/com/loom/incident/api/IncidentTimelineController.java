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
    private final com.loom.incident.service.IncidentService incidentService;

    public IncidentTimelineController(IncidentTimelineService incidentTimelineService,
            com.loom.incident.service.IncidentService incidentService) {
        this.incidentTimelineService = incidentTimelineService;
        this.incidentService = incidentService;
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<IncidentTimelineResponse> getIncidentTimeline(@PathVariable String id) {
        com.loom.incident.domain.Incident incident = incidentService.getIncidentById(id);
        IncidentTimelineResponse response = incidentTimelineService.buildTimeline(incident.getId());
        return ResponseEntity.ok(response);
    }
}
