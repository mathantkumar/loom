package com.loom.incident.api;

import com.loom.incident.api.dto.IncidentRequest;
import com.loom.incident.domain.Incident;
import com.loom.incident.domain.Severity;
import com.loom.incident.service.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final com.loom.incident.service.IncidentSearchService incidentSearchService;
    private final com.loom.incident.service.BaselineDeviationService baselineDeviationService;
    private final com.loom.incident.service.BaselineExplanationService baselineExplanationService;

    public IncidentController(IncidentService incidentService,
            com.loom.incident.service.IncidentSearchService incidentSearchService,
            com.loom.incident.service.BaselineDeviationService baselineDeviationService,
            com.loom.incident.service.BaselineExplanationService baselineExplanationService) {
        this.incidentService = incidentService;
        this.incidentSearchService = incidentSearchService;
        this.baselineDeviationService = baselineDeviationService;
        this.baselineExplanationService = baselineExplanationService;
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody IncidentRequest request) {
        Incident incident = new Incident();
        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setService(request.getService());
        incident.setIssueType(request.getIssueType());

        Incident createdIncident = incidentService.createIncident(incident);
        return new ResponseEntity<>(createdIncident, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncident(@PathVariable String id) {
        System.out.println("Fetching incident with ID: " + id);
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Incident>> searchIncidents(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Severity severity,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) com.loom.incident.domain.IssueType issueType,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {

        return ResponseEntity
                .ok(incidentSearchService.searchIncidents(q, severity, status, issueType, fromDate, toDate));
    }

    @GetMapping("/stats")
    public ResponseEntity<com.loom.incident.api.dto.IncidentStatsResponse> getStats() {
        return ResponseEntity.ok(incidentService.getStats());
    }

    @PostMapping("/sync")
    public ResponseEntity<Void> syncIndex() {
        incidentService.syncIndex();
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Incident> updateStatus(@PathVariable String id,
            @RequestParam com.loom.incident.domain.IncidentStatus status) {
        return ResponseEntity.ok(incidentService.updateIncidentStatus(id, status));
    }

    @GetMapping("/{id}/baseline-analysis")
    public ResponseEntity<com.loom.incident.service.BaselineExplanationService.BaselineAnalysisResponse> getBaselineAnalysis(
            @PathVariable String id) {
        // Resolve ID to UUID for internal service compatibility
        Incident incident = incidentService.getIncidentById(id);
        var deviation = baselineDeviationService.analyzeDeviation(incident.getId());
        var explanation = baselineExplanationService.explainDeviation(deviation);
        return ResponseEntity.ok(explanation);
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<List<com.loom.incident.api.dto.SimilarIncidentResponse>> getSimilarIncidents(
            @PathVariable String id) {
        // Resolve ID to UUID for internal service compatibility
        Incident incident = incidentService.getIncidentById(id);
        return ResponseEntity.ok(incidentSearchService.findSimilarIncidents(incident.getId()));
    }
}
