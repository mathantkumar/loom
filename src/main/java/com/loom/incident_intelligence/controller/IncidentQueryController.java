package com.loom.incident_intelligence.controller;

import com.loom.incident_intelligence.model.ChunkMetadata;
import com.loom.incident_intelligence.model.QueryRequest;
import com.loom.incident_intelligence.model.QueryResponse;
import com.loom.incident_intelligence.service.OllamaClient;
import com.loom.incident_intelligence.service.PromptBuilder;
import com.loom.incident_intelligence.service.RetrievalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/v1/incident")
public class IncidentQueryController {

    private static final Logger log = LoggerFactory.getLogger(IncidentQueryController.class);

    private final RetrievalService retrievalService;
    private final PromptBuilder promptBuilder;
    private final OllamaClient ollamaClient;

    public IncidentQueryController(RetrievalService retrievalService, PromptBuilder promptBuilder,
            OllamaClient ollamaClient) {
        this.retrievalService = retrievalService;
        this.promptBuilder = promptBuilder;
        this.ollamaClient = ollamaClient;
    }

    @PostMapping("/query")
    public ResponseEntity<QueryResponse> query(@RequestBody QueryRequest request) {
        long startTime = System.currentTimeMillis();
        String question = request.getQuestion();

        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 1. Retrieve context
        List<ChunkMetadata> chunks = retrievalService.search(question, 5);

        // 2. Build Prompt
        String prompt = promptBuilder.build(question, chunks);

        // 3. Chat with LLM
        String systemPrompt = promptBuilder.getSystemPrompt();

        List<OllamaClient.Message> messages = new ArrayList<>();
        messages.add(new OllamaClient.Message("system", systemPrompt));
        messages.add(new OllamaClient.Message("user", prompt));

        String answer = ollamaClient.chat(messages, false, Duration.ofSeconds(30));

        // 4. Extract Citations
        Set<String> citations = extractCitations(answer);

        // 5. Correlate sources
        Map<String, ChunkMetadata> sources = new HashMap<>();
        for (ChunkMetadata c : chunks) {
            sources.put(c.getId(), c);
        }

        // 6. Calculate Confidence & Data Sources
        double confidenceScore = calculateConfidence(chunks);
        Map<String, Integer> dataSources = countDataSources(chunks);

        long duration = System.currentTimeMillis() - startTime;
        log.info("Query processed in {} ms ({} chunks)", duration, chunks.size());

        QueryResponse response = QueryResponse.builder()
                .answer(answer)
                .citations(new ArrayList<>(citations))
                .sources(new ArrayList<>(chunks))
                .confidenceScore(confidenceScore)
                .dataSources(dataSources)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    private Set<String> extractCitations(String text) {
        Set<String> citations = new HashSet<>();
        Pattern pattern = Pattern.compile("\\[(.+?)\\]");
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            citations.add(matcher.group(1)); // Extract ID from [ID]
        }
        return citations;
    }

    private double calculateConfidence(List<ChunkMetadata> chunks) {
        if (chunks == null || chunks.isEmpty()) {
            return 0.0;
        }
        double score = 0.5; // Base confidence
        for (ChunkMetadata chunk : chunks) {
            if (chunk.getSource() != null) {
                if (chunk.getSource().toLowerCase().contains("incident")
                        || chunk.getSource().toLowerCase().contains("ticket")) {
                    score += 0.1;
                } else if (chunk.getSource().toLowerCase().contains("log")) {
                    score += 0.01;
                } else {
                    score += 0.05; // Other sources
                }
            }
        }
        return Math.min(1.0, score);
    }

    private Map<String, Integer> countDataSources(List<ChunkMetadata> chunks) {
        Map<String, Integer> counts = new HashMap<>();
        counts.put("incidents", 0);
        counts.put("logs", 0);
        counts.put("deployments", 0);
        counts.put("other", 0);

        if (chunks == null)
            return counts;

        for (ChunkMetadata chunk : chunks) {
            if (chunk.getSource() == null)
                continue;
            String source = chunk.getSource().toLowerCase();
            if (source.contains("incident") || source.contains("ticket")) {
                counts.put("incidents", counts.get("incidents") + 1);
            } else if (source.contains("log")) {
                counts.put("logs", counts.get("logs") + 1);
            } else if (source.contains("deployment")) {
                counts.put("deployments", counts.get("deployments") + 1);
            } else {
                counts.put("other", counts.get("other") + 1);
            }
        }
        return counts;
    }
}
