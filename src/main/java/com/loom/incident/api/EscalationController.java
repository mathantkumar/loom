package com.loom.incident.api;

import com.loom.incident.service.EscalationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "${loom.cors.allowed-origins:http://localhost:5173}")
public class EscalationController {

    private final EscalationService escalationService;

    public EscalationController(EscalationService escalationService) {
        this.escalationService = escalationService;
    }

    @PostMapping("/{incidentId}/escalate")
    public ResponseEntity<EscalationService.EscalationResponse> escalate(@PathVariable String incidentId) {
        EscalationService.EscalationResponse response = escalationService.escalateToOnCall(incidentId);
        return ResponseEntity.ok(response);
    }
}
