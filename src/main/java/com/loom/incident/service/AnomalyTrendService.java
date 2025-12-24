package com.loom.incident.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnomalyTrendService {

    private static final Logger logger = LoggerFactory.getLogger(AnomalyTrendService.class);

    private final IncidentRepository incidentRepository;

    public AnomalyTrendService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public AnomalyTrendResult analyzeTrend(UUID incidentId) {
        // 1. Fetch the target incident
        Incident currentIncident = incidentRepository.findById(incidentId).orElse(null);
        if (currentIncident == null) {
            return new AnomalyTrendResult("UNKNOWN", "Incident not found.", 0.0);
        }

        // 2. Fetch recent incidents for the same service (Heuristic: last 50 incidents)
        // In a real app, use a proper DB query by service and date range.
        // Here we just stream all for MVP simplicity as repository custom methods
        // aren't defined yet
        List<Incident> serviceIncidents = incidentRepository.findAll().stream()
                .filter(i -> i.getService() != null && i.getService().equals(currentIncident.getService()))
                .collect(Collectors.toList());

        // 3. Simple Heuristic Analysis
        int count = serviceIncidents.size();

        // Check for specific keywords in recent incidents
        long memoryIssues = serviceIncidents.stream()
                .filter(i -> i.getDescription() != null && i.getDescription().toLowerCase().contains("memory"))
                .count();

        long latencyIssues = serviceIncidents.stream()
                .filter(i -> i.getDescription() != null && i.getDescription().toLowerCase().contains("latency"))
                .count();

        // Check if this service is "spamming"
        // If we have > 5 incidents for this service, it's a pattern.

        String riskLevel = "NORMAL";
        StringBuilder message = new StringBuilder("Service behavior appears normal.");
        double confidence = 0.5;

        if (count > 5) {
            if (memoryIssues > 2) {
                riskLevel = "WARNING";
                message = new StringBuilder("Silent Warning: Detected increasing memory-related alerts for "
                        + currentIncident.getService() + ".");
                confidence = 0.85;
            } else if (latencyIssues > 2) {
                riskLevel = "WARNING";
                message = new StringBuilder(
                        "Silent Warning: Latency degradation trend detected for " + currentIncident.getService() + ".");
                confidence = 0.78;
            } else {
                riskLevel = "WARNING";
                message = new StringBuilder("Elevated incident volume detected for " + currentIncident.getService()
                        + " (" + count + " incidents).");
                confidence = 0.65;
            }
        }

        // "High Risk" mock trigger for specific keywords in THIS incident
        if (currentIncident.getDescription().toLowerCase().contains("oom") ||
                currentIncident.getDescription().toLowerCase().contains("deadlock")) {
            riskLevel = "HIGH_RISK";
            message = new StringBuilder("CRITICAL: " + currentIncident.getService()
                    + " is showing signs of critical failure (OOM/Deadlock patterns).");
            confidence = 0.95;
        }

        return new AnomalyTrendResult(riskLevel, message.toString(), confidence);
    }

    // Inner DTO class
    public static class AnomalyTrendResult {
        private String riskLevel;
        private String message;
        private double confidence;

        public AnomalyTrendResult(String riskLevel, String message, double confidence) {
            this.riskLevel = riskLevel;
            this.message = message;
            this.confidence = confidence;
        }

        public String getRiskLevel() {
            return riskLevel;
        }

        public String getMessage() {
            return message;
        }

        public double getConfidence() {
            return confidence;
        }
    }
}
