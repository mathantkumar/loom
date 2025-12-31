package com.loom.sentinel.ask.api;

import com.loom.sentinel.ask.service.AskSentinelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.Map;

@RestController
@RequestMapping("/api/ask")
@CrossOrigin(originPatterns = "*")
public class AskSentinelController {

    private final AskSentinelService askSentinelService;

    public AskSentinelController(AskSentinelService askSentinelService) {
        this.askSentinelService = askSentinelService;
    }

    @PostMapping("/stream")
    public ResponseEntity<SseEmitter> askStream(@RequestBody Map<String, String> payload) {
        String query = payload.get("query");
        // FIX: Increased timeout to 5 minutes (300000ms) to accommodate local LLM
        // latency
        SseEmitter emitter = new SseEmitter(300000L);

        if (query == null || query.isBlank()) {
            emitter.completeWithError(new IllegalArgumentException("Query cannot be empty"));
            return ResponseEntity.badRequest().body(emitter);
        }

        askSentinelService.processQuery(query, emitter);

        return ResponseEntity.ok()
                .header("Cache-Control", "no-cache")
                .header("X-Accel-Buffering", "no")
                .header("Content-Type", "text/event-stream")
                .body(emitter);
    }
}
