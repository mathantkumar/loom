package com.loom.sentinel.memory;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MemoryService {

    private final IncidentRepository incidentRepository;
    private final com.loom.incident.service.IncidentSearchService incidentSearchService;
    private final com.loom.incident.ai.AiClient aiClient;

    public MemoryService(IncidentRepository incidentRepository,
            com.loom.incident.service.IncidentSearchService incidentSearchService,
            com.loom.incident.ai.AiClient aiClient) {
        this.incidentRepository = incidentRepository;
        this.incidentSearchService = incidentSearchService;
        this.aiClient = aiClient;
    }

    @Transactional(readOnly = true)
    public HistoricalContext getHistoricalContext(String incidentIdStr) {
        Incident current = null;

        // Try UUID
        try {
            UUID id = UUID.fromString(incidentIdStr);
            current = incidentRepository.findById(id).orElse(null);
        } catch (IllegalArgumentException e) {
            // Not a UUID, ignore
        }

        // Try Public ID if not found
        if (current == null) {
            current = incidentRepository.findByPublicId(incidentIdStr)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.NOT_FOUND,
                            "Incident not found: " + incidentIdStr));
        }

        // Real Vector Search
        List<com.loom.incident.api.dto.SimilarIncidentResponse> similarResponses = incidentSearchService
                .findSimilarIncidents(current.getId());

        List<HistoricalContext.SimilarIncident> similarList = similarResponses.stream()
                .limit(3)
                .map(s -> new HistoricalContext.SimilarIncident(
                        s.getIncidentId().toString(),
                        s.getTitle(),
                        s.getRootCause() != null ? s.getRootCause() : "Resolution not available.",
                        s.getSimilarityScore()))
                .collect(Collectors.toList());

        // AI Synthesis
        String aiInsight;
        if (similarList.isEmpty()) {
            aiInsight = "No historical precedence found. This appears to be a unique incident pattern for "
                    + current.getService();
        } else {
            // Generate insight using AI
            try {
                String prompt = buildInsightPrompt(current, similarResponses);
                aiInsight = aiClient.generate(prompt);

                // Cleanup AI output if it's too verbose (simple heuristic)
                if (aiInsight.length() > 300) {
                    aiInsight = aiInsight.substring(0, 297) + "...";
                }
            } catch (Exception e) {
                // Fallback if AI fails
                aiInsight = "Similar patterns detected in " + similarList.size() + " past incidents.";
            }
        }

        return new HistoricalContext(aiInsight, similarList);
    }

    @Transactional(readOnly = true)
    public HistoricalContext getServiceHistoricalContext(String serviceId) {
        // 1. Find latest incident for this service
        List<Incident> recent = incidentRepository.findTop5ByServiceOrderByCreatedAtDesc(serviceId);

        if (recent.isEmpty()) {
            return new HistoricalContext(
                    "No recent incidents found for " + serviceId + ". Organizational memory is clean.",
                    List.of());
        }

        // 2. Analyze the most recent one to give "current" context
        Incident latest = recent.get(0);
        return getHistoricalContext(latest.getId().toString());
    }

    private String buildInsightPrompt(Incident current,
            List<com.loom.incident.api.dto.SimilarIncidentResponse> similar) {
        StringBuilder sb = new StringBuilder();
        sb.append("Analyze the following active incident in context of similar past incidents.\n");
        sb.append("Current Incident: ").append(current.getTitle()).append(" - ").append(current.getDescription())
                .append("\n\n");
        sb.append("Similar Past Incidents:\n");
        for (var s : similar) {
            sb.append("- ").append(s.getTitle()).append(": ").append(s.getRootCause()).append("\n");
        }
        sb.append(
                "\nProvide a single sentence insight (max 40 words) summarizing the historical pattern and likely resolution strategy. Do not include headers.");
        return sb.toString();
    }
}
