package com.loom.incident.api;

import com.loom.incident.service.AIService;
import com.loom.incident.service.AnomalyTrendService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
public class IncidentAIController {

    private final AIService aiService;
    private final AnomalyTrendService anomalyTrendService;

    public IncidentAIController(AIService aiService, AnomalyTrendService anomalyTrendService) {
        this.aiService = aiService;
        this.anomalyTrendService = anomalyTrendService;
    }

    @PostMapping("/{id}/ai/summary")
    public ResponseEntity<AIService.IncidentSummary> draftSummary(@PathVariable UUID id) {
        return ResponseEntity.ok(aiService.generateSummary(id));
    }

    // Also support analyze alias for existing card if needed, but per plan we keep
    // separation.
    // However, the prompt mentioned "Fix AI Agent Action: Draft Incident Summary is
    // NOT working".
    // AND the frontend `AIAnalysisCard` calls `analyzeIncident` which calls `POST
    // /api/incidents/{id}/analyze`.
    // My plan said `client.ts` update `draftIncidentSummary` mapping to `POST
    // /api/incidents/{id}/ai/summary`.
    // I will stick to the plan.

    @GetMapping("/{id}/anomaly-trend")
    public ResponseEntity<AnomalyTrendService.AnomalyTrendResult> checkAnomalyTrend(@PathVariable UUID id) {
        return ResponseEntity.ok(anomalyTrendService.analyzeTrend(id));
    }
}
