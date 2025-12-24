package com.loom.sentinel.causality;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentinel/causality")
@CrossOrigin(origins = "${loom.cors.allowed-origins:http://localhost:5173}")
public class CausalityController {

    private final CausalityService causalityService;

    public CausalityController(CausalityService causalityService) {
        this.causalityService = causalityService;
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<CausalityGraph> getIncidentCausalityGraph(@PathVariable String incidentId) {
        CausalityGraph graph = causalityService.buildGraph(incidentId);
        return ResponseEntity.ok(graph);
    }
}
