package com.loom.incident.api;

import com.loom.incident.api.dto.AnalysisResponse;
import com.loom.incident.service.AIAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/incidents")

public class IncidentAnalysisController {

    private final AIAnalysisService aiAnalysisService;
    private final com.loom.incident.service.IncidentService incidentService;

    public IncidentAnalysisController(AIAnalysisService aiAnalysisService,
            com.loom.incident.service.IncidentService incidentService) {
        this.aiAnalysisService = aiAnalysisService;
        this.incidentService = incidentService;
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<AnalysisResponse> analyzeIncident(@PathVariable String id) {
        // Resolve ID (e.g. INCSEN-123) to UUID if needed, or verify existence
        var incident = incidentService.getIncidentById(id);
        AnalysisResponse response = aiAnalysisService.analyzeIncident(incident.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/trends")
    public ResponseEntity<com.loom.incident.api.dto.TrendAnalysisResponse> analyzeTrends(@PathVariable String id) {
        var incident = incidentService.getIncidentById(id);
        return ResponseEntity.ok(aiAnalysisService.analyzeTrends(incident.getId()));
    }
}
