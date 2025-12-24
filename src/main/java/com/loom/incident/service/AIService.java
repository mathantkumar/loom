package com.loom.incident.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AIService {

    private final IncidentRepository incidentRepository;

    public AIService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public IncidentSummary generateSummary(UUID incidentId) {
        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident == null) {
            throw new RuntimeException("Incident not found");
        }

        // Mock AI Generation Logic
        // In reality, this would call an LLM with the incident context.
        String title = incident.getTitle();
        String desc = incident.getDescription();
        String service = incident.getService();
        String status = incident.getStatus().name();

        StringBuilder sb = new StringBuilder();
        sb.append("**Incident Summary**: ").append(title).append("\n\n");
        sb.append("**Impact Analysis**: The ").append(service).append(" service is currently experiencing issues. ");
        sb.append("Initial reports indicate: \"").append(desc).append("\".\n\n");
        sb.append("**Current Status**: ").append(status).append(".\n\n");
        sb.append("**Recommended Next Steps**:\n");
        sb.append("1. Check application logs for ").append(service).append(".\n");
        sb.append("2. Verify database connectivity if applicable.\n");
        sb.append("3. Monitor error rates for the next 15 minutes.\n");

        return new IncidentSummary(sb.toString(), "High impact on " + service, status);
    }

    public static class IncidentSummary {
        private String summary;
        private String impact;
        private String status;

        public IncidentSummary(String summary, String impact, String status) {
            this.summary = summary;
            this.impact = impact;
            this.status = status;
        }

        public String getSummary() {
            return summary;
        }

        public String getImpact() {
            return impact;
        }

        public String getStatus() {
            return status;
        }
    }
}
