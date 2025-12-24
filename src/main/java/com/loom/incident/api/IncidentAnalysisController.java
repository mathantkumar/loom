package com.loom.incident.api;

import com.loom.incident.api.dto.AnalysisResponse;
import com.loom.incident.service.AIAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentAnalysisController {

    private final AIAnalysisService aiAnalysisService;

    public IncidentAnalysisController(AIAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<AnalysisResponse> analyzeIncident(@PathVariable UUID id) {
        AnalysisResponse response = aiAnalysisService.analyzeIncident(id);
        return ResponseEntity.ok(response);
    }
}
