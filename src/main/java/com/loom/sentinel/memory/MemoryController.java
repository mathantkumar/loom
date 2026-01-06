package com.loom.sentinel.memory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentinel/memory")
@CrossOrigin(origins = "${loom.cors.allowed-origins:http://localhost:5173}")
public class MemoryController {

    private final MemoryService memoryService;

    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<HistoricalContext> getHistoricalContext(@PathVariable String incidentId) {
        HistoricalContext context = memoryService.getHistoricalContext(incidentId);
        return ResponseEntity.ok(context);
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<HistoricalContext> getServiceHistoricalContext(@PathVariable String serviceId) {
        HistoricalContext context = memoryService.getServiceHistoricalContext(serviceId);
        return ResponseEntity.ok(context);
    }
}
