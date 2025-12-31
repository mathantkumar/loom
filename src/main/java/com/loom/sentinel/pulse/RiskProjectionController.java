package com.loom.sentinel.pulse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
public class RiskProjectionController {

    private final PulseRiskService riskService;

    public RiskProjectionController(PulseRiskService riskService) {
        this.riskService = riskService;
    }

    @GetMapping("/{service}/risk-projection")
    public ResponseEntity<RiskProjection> getRiskProjection(@PathVariable String service) {
        RiskProjection projection = riskService.calculateRisk(service);
        return ResponseEntity.ok(projection);
    }
}
