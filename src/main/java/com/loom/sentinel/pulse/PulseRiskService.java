package com.loom.sentinel.pulse;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PulseRiskService {

    private final Random random = new Random();

    public RiskProjection calculateRisk(String serviceName) {
        // In a real implementation, we would fetch historical metrics from
        // Elasticsearch or Prometheus
        // and calculate standard deviation.

        // Simulating logic based on service name for demo consistency
        if ("payment-service".equalsIgnoreCase(serviceName)) {
            return new RiskProjection(
                    "HIGH",
                    25,
                    2.8,
                    "Memory usage deviating 2.8σ from baseline");
        } else if ("auth-service".equalsIgnoreCase(serviceName)) {
            return new RiskProjection(
                    "MEDIUM",
                    120,
                    1.5,
                    "Latency spike detected (1.5σ)");
        }

        // Default low risk
        return new RiskProjection("LOW", 0, 0.4, "Operating within normal parameters");
    }
}
