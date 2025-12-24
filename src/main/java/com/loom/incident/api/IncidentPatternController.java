package com.loom.incident.api;

import com.loom.incident.api.dto.IncidentPatternResponse;
import com.loom.incident.service.IncidentPatternService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentPatternController {

    private final IncidentPatternService incidentPatternService;

    public IncidentPatternController(IncidentPatternService incidentPatternService) {
        this.incidentPatternService = incidentPatternService;
    }

    @GetMapping("/{id}/pattern")
    public ResponseEntity<IncidentPatternResponse> getIncidentPattern(@PathVariable UUID id) {
        return ResponseEntity.ok(incidentPatternService.detectPattern(id));
    }
}
