package com.loom.incident.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.loom.integration.git.CodeIngestionService;

@RestController
@RequestMapping("/api/integrations/git")
public class GitIntegrationController {

    private final CodeIngestionService codeIngestionService;

    public GitIntegrationController(CodeIngestionService codeIngestionService) {
        this.codeIngestionService = codeIngestionService;
    }

    @PostMapping("/connect")
    public ResponseEntity<String> connectRepository(@RequestBody ConnectRequest request) {
        // In a real app, validation and saving config happens here.
        // For now, we trigger ingestion immediately.
        try {
            codeIngestionService.ingestRepository(request.owner, request.repo, request.serviceName);
            return ResponseEntity.ok("Repository connected and ingestion started.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to connect/ingest: " + e.getMessage());
        }
    }

    public static class ConnectRequest {
        public String owner;
        public String repo;
        public String serviceName;
    }
}
