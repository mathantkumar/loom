package com.loom.incident.service;

import com.loom.incident.ai.AiClient;
import com.loom.incident.api.dto.AnalysisResponse;
import com.loom.incident.api.dto.SimilarIncidentResponse;
import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AIAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(AIAnalysisService.class);

    private final IncidentRepository incidentRepository;
    private final IncidentSearchService incidentSearchService;
    private final AiClient aiClient;

    public AIAnalysisService(IncidentRepository incidentRepository,
            IncidentSearchService incidentSearchService,
            AiClient aiClient) {
        this.incidentRepository = incidentRepository;
        this.incidentSearchService = incidentSearchService;
        this.aiClient = aiClient;
    }

    public AnalysisResponse analyzeIncident(UUID incidentId) {
        // 1. Fetch current incident
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with id: " + incidentId));

        // 2. Fetch similar resolved incidents (Context for RAG)
        List<SimilarIncidentResponse> similarIncidents = incidentSearchService.findSimilarIncidents(incidentId);

        // 3. Construct Prompt
        String prompt = buildPrompt(incident, similarIncidents);

        // 4. Call AI Client
        String aiOutput = aiClient.generate(prompt);

        // 5. Parse output and construct response
        return parseAiOutput(incidentId, aiOutput, similarIncidents);
    }

    private String buildPrompt(Incident current, List<SimilarIncidentResponse> similar) {
        StringBuilder sb = new StringBuilder();
        sb.append(
                "You are an expert SRE assistant. Analyze the following active incident and provide a root cause and resolution, using the context of similar past resolved incidents.\n\n");

        sb.append("=== CURRENT INCIDENT ===\n");
        sb.append("Title: ").append(current.getTitle()).append("\n");
        sb.append("Description: ").append(current.getDescription()).append("\n");
        sb.append("\n");

        sb.append("=== SIMILAR PAST INCIDENTS ===\n");
        if (similar.isEmpty()) {
            sb.append("No similar incidents found.\n");
        } else {
            for (SimilarIncidentResponse past : similar) {
                sb.append("- Incident ID: ").append(past.getIncidentId()).append("\n");
                sb.append("  Title: ").append(past.getTitle()).append("\n");
                sb.append("  Root Cause: ").append(past.getRootCause()).append("\n");
                sb.append("  ---\n");
            }
        }
        sb.append("\n");

        sb.append("=== INSTRUCTIONS ===\n");
        sb.append("Based on the above, provide the following:\n");
        sb.append("1. Probable Root Cause\n");
        sb.append("2. Recommended Resolution\n");
        sb.append("3. Confidence Score (0.0 to 1.0)\n\n");
        sb.append("Format your response exactly as follows:\n");
        sb.append("ROOT_CAUSE: <text>\n");
        sb.append("RESOLUTION: <text>\n");
        sb.append("CONFIDENCE: <number>\n");

        return sb.toString();
    }

    private AnalysisResponse parseAiOutput(UUID incidentId, String aiOutput, List<SimilarIncidentResponse> similar) {
        String rootCause = extractValue(aiOutput, "ROOT_CAUSE:");
        String resolution = extractValue(aiOutput, "RESOLUTION:");
        String confidenceStr = extractValue(aiOutput, "CONFIDENCE:");

        Double confidence = 0.5; // Default
        try {
            if (confidenceStr != null && !confidenceStr.isEmpty()) {
                confidence = Double.parseDouble(confidenceStr.trim());
            }
        } catch (NumberFormatException e) {
            logger.warn("Failed to parse confidence score: {}", confidenceStr);
        }

        List<UUID> basedOnIds = similar.stream()
                .map(SimilarIncidentResponse::getIncidentId)
                .collect(Collectors.toList());

        // Construct Hypotheses List
        List<AnalysisResponse.Hypothesis> hypotheses = new java.util.ArrayList<>();

        // 1. Primary AI Hypothesis
        if (rootCause != null && !rootCause.equals("Unknown")) {
            hypotheses.add(new AnalysisResponse.Hypothesis(rootCause, confidence, "AI GenAI Analysis"));
        }

        // 2. Secondary Hypotheses from Similar Incidents
        for (SimilarIncidentResponse sim : similar) {
            // Avoid duplicates if possible, or just add them as secondary signals
            if (sim.getRootCause() != null && !sim.getRootCause().isEmpty()) {
                // Simple heuristic confidence based on similarity score (mock calculation if
                // score > 1.0 needed)
                double simConf = Math.min(0.9, sim.getSimilarityScore() * 0.1);
                // Wait, Sim score is usually Lucene score. Let's assume normalized or just
                // flat.
                // Let's us flat 0.6 for similar incidents for now or use the score passing
                // through.
                hypotheses.add(new AnalysisResponse.Hypothesis(
                        sim.getRootCause(),
                        0.65, // Static moderate confidence for similar incidents
                        "Similar Incident #" + sim.getIncidentId().toString().substring(0, 8)));
            }
        }

        // Sort by confidence desc
        hypotheses.sort((h1, h2) -> Double.compare(h2.getConfidence(), h1.getConfidence()));

        return new AnalysisResponse(incidentId, rootCause, resolution, confidence, basedOnIds, hypotheses);
    }

    private String extractValue(String text, String prefix) {
        Pattern pattern = Pattern.compile(prefix + "\\s*(.*)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        // Fallback for multi-line parsing if needed, but simple regex works for single
        // line.
        // For MVP mock, it's consistent. Real impl might need more robust parsing.

        // Let's try to match lines starting with prefix
        for (String line : text.split("\\n")) {
            if (line.trim().toUpperCase().startsWith(prefix.trim().toUpperCase())) {
                return line.substring(line.indexOf(":") + 1).trim();
            }
        }
        return "Unknown";
    }
}
