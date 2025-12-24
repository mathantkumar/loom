package com.loom.sentinel.atlas;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentinel/atlas")
@CrossOrigin(origins = "${loom.cors.allowed-origins:http://localhost:5173}")
public class AtlasController {

    private final AtlasService atlasService;

    public AtlasController(AtlasService atlasService) {
        this.atlasService = atlasService;
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectHealthReport> getProjectHealth(@PathVariable String projectId) {
        ProjectHealthReport report = atlasService.generateReport(projectId);
        return ResponseEntity.ok(report);
    }
}
