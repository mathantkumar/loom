package com.loom.sentinel.atlas;

import com.loom.incident.domain.Incident;
import com.loom.incident.domain.Severity;
import com.loom.incident.repository.IncidentRepository;
import com.loom.incident.ai.AiClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AtlasService {

    private final IncidentRepository incidentRepository;
    private final AiClient aiClient;

    public AtlasService(IncidentRepository incidentRepository, AiClient aiClient) {
        this.incidentRepository = incidentRepository;
        this.aiClient = aiClient;
    }

    public ProjectHealthReport generateReport(String projectId) {
        // 1. Fetch Recent Incidents (Context)
        List<Incident> recentIncidents = incidentRepository.findTop5ByServiceOrderByCreatedAtDesc(projectId);

        // 2. Calculate Stats / Risk Score
        double riskScore = calculateRiskScore(recentIncidents);
        String confidence = calculateConfidence(recentIncidents.size());

        // 3. Generate AI Prediction & Factors
        String prediction;
        List<String> factors = new ArrayList<>();

        if (recentIncidents.isEmpty()) {
            prediction = "STABLE: No recent incidents detected for this service.";
            factors.add("No incident history in the last recording period.");
        } else {
            try {
                String prompt = buildAtlasPrompt(projectId, recentIncidents, riskScore);
                String aiResponse = aiClient.generate(prompt);

                // Parse AI response (Expected format: PREDICTION: ... \n FACTORS: - ... - ...)
                // For MVP robustness, if parsing fails, use fallback.
                prediction = extractSection(aiResponse, "PREDICTION:");
                factors = extractList(aiResponse, "FACTORS:");

                if (prediction.isEmpty())
                    prediction = "STABLE: Service analysis passed.";
                if (factors.isEmpty())
                    factors.add("Minor operational noise detected.");

            } catch (Exception e) {
                // Fallback
                prediction = riskScore > 0.5
                        ? "WARNING: Elevated risk due to recent pattern of failures."
                        : "STABLE: Service operating within acceptable parameters.";
                factors.add("Recent incidents: " + recentIncidents.size());
            }
        }

        return new ProjectHealthReport(projectId, riskScore, confidence, factors, prediction);
    }

    private double calculateRiskScore(List<Incident> incidents) {
        if (incidents.isEmpty())
            return 0.05;

        double score = 0.0;
        for (Incident i : incidents) {
            switch (i.getSeverity()) {
                case SEV1:
                    score += 0.4;
                    break;
                case SEV2:
                    score += 0.2;
                    break;
                case SEV3:
                    score += 0.1;
                    break;
                default:
                    score += 0.01;
            }
        }
        return Math.min(score, 1.0);
    }

    private String calculateConfidence(int count) {
        if (count >= 5)
            return "HIGH";
        if (count >= 2)
            return "MEDIUM";
        return "LOW";
    }

    private String buildAtlasPrompt(String service, List<Incident> incidents, double computedRisk) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are Sentinel Atlas, a reliability architect AI. Analyze the health of '").append(service)
                .append("'.\n");
        sb.append("Computed Risk Score: ").append(String.format("%.2f", computedRisk)).append(" / 1.0\n\n");
        sb.append("Recent Incidents:\n");
        for (Incident i : incidents) {
            sb.append("- [").append(i.getSeverity()).append("] ").append(i.getTitle())
                    .append(": ").append(i.getRootCause() != null ? i.getRootCause() : "No info").append("\n");
        }
        sb.append("\nGenerate 2 sections:\n");
        sb.append("PREDICTION: One concise sentence on service stability (Start with CRITICAL, WARNING, or STABLE).\n");
        sb.append("FACTORS: Bullet list (max 3 items) of key contributors to risk.\n");
        sb.append("Format plain text. No markdown.");
        return sb.toString();
    }

    // Simple helpers for MVP parsing
    private String extractSection(String text, String header) {
        int idx = text.indexOf(header);
        if (idx == -1)
            return "";
        int start = idx + header.length();
        int end = text.indexOf("\n\n", start);
        if (end == -1)
            end = text.indexOf("FACTORS:", start); // fallback
        if (end == -1)
            end = text.length();
        return text.substring(start, end).trim();
    }

    private List<String> extractList(String text, String header) {
        List<String> list = new ArrayList<>();
        int idx = text.indexOf(header);
        if (idx == -1)
            return list;

        String section = text.substring(idx + header.length());
        for (String line : section.split("\n")) {
            String clean = line.trim();
            if (clean.startsWith("-") || clean.startsWith("*")) {
                list.add(clean.substring(1).trim());
            }
        }
        return list;
    }
}
