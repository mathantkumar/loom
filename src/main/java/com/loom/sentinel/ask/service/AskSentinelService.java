package com.loom.sentinel.ask.service;

import com.loom.incident.ai.EmbeddingClient;
import com.loom.incident.ai.OpenAiChatClient;
import com.loom.incident.domain.Incident;
import com.loom.incident.service.IncidentSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
public class AskSentinelService {

    private static final Logger logger = LoggerFactory.getLogger(AskSentinelService.class);

    private final EmbeddingClient embeddingClient;
    private final IncidentSearchService incidentSearchService;
    private final OpenAiChatClient chatClient;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    // 5. Memory
    private final ConcurrentMap<String, String> conversationContext = new ConcurrentHashMap<>();

    public AskSentinelService(EmbeddingClient embeddingClient,
            IncidentSearchService incidentSearchService,
            OpenAiChatClient chatClient) {
        this.embeddingClient = embeddingClient;
        this.incidentSearchService = incidentSearchService;
        this.chatClient = chatClient;
    }

    public void processQuery(String userQuery, SseEmitter emitter) {
        executor.submit(() -> {
            try {
                String sessionId = "default-session"; // MVP Assumption

                // NODE A: Intent & Rewrite (Reasoning Start)
                emitStatus(emitter, "Analyzing intent...");
                String intent = detectIntent(userQuery);
                logger.info("Detected intent: {}", intent);

                if ("AMBIGUOUS".equalsIgnoreCase(intent)) {
                    // Branch 3: Ambiguous - Ask for Clarification
                    emitSection(emitter, "root_cause", "Clarification Needed",
                            "Could you please specify which service or error you are referring to? I cannot find a specific context.",
                            1.0);
                    emitter.complete();
                    return;
                }

                String previousContext = conversationContext.getOrDefault(sessionId, "");
                String rewrittenQuery;
                if ("FOLLOW_UP".equalsIgnoreCase(intent) && !previousContext.isEmpty()) {
                    rewrittenQuery = rewriteFollowUp(userQuery, previousContext);
                } else {
                    rewrittenQuery = rewriteQuery(userQuery, intent);
                }

                // NODE B: Retrieval
                emitStatus(emitter, "Scanning Sentinel extraction graph...");
                List<Double> queryVector = embeddingClient.getEmbedding(rewrittenQuery);

                // Fetch Scored Incidents
                List<IncidentSearchService.ScoredIncident> scoredIncidents = incidentSearchService
                        .findByVector(queryVector, 5);

                // NODE C: Quality Gate
                double maxScore = scoredIncidents.stream().mapToDouble(IncidentSearchService.ScoredIncident::score)
                        .max().orElse(0.0);
                boolean isHighQuality = maxScore > 0.75;
                boolean hasResults = !scoredIncidents.isEmpty();

                // BRANCHING LOGIC
                String systemPrompt;
                String finalQuery = userQuery;
                List<Incident> contextIncidents = scoredIncidents.stream()
                        .map(IncidentSearchService.ScoredIncident::incident)
                        .collect(Collectors.toList());

                if (isHighQuality) {
                    // BRANCH 1: Strict Grounding
                    emitStatus(emitter, "Deep Analysis (High Confidence)...");
                    String context = buildContext(contextIncidents);
                    systemPrompt = buildStrictSystemPrompt(context);

                    // Update Memory
                    String incidentSummary = contextIncidents.stream().map(Incident::getPublicId)
                            .collect(Collectors.joining(","));
                    conversationContext.put(sessionId,
                            "User asked: " + userQuery + ". Found incidents: " + incidentSummary);
                } else {
                    // BRANCH 2: Weak/Inferred (Fallback)
                    emitStatus(emitter, "Inferring patterns (Limited Data)...");
                    systemPrompt = buildFallbackSystemPrompt();
                    // We technically don't have specific incidents to cite, but we pass the query.
                    // We might include weak matches if they exist, but prompt says "Inferred".
                    // Let's NOT include weak context to avoid hallucination, or only include if >
                    // 0.65?
                    // For MVP, if score < 0.75, strictly fallback to Generative Knowledge with
                    // warning.
                }

                // NODE D: Generation (Streaming)
                emitStatus(emitter, "Synthesizing insights...");

                chatClient.streamChat(systemPrompt, finalQuery, new OpenAiChatClient.StreamingResponseCallback() {
                    @Override
                    public void onStatus(String message) {
                        try {
                            emitStatus(emitter, message);
                        } catch (Exception e) {
                        }
                    }

                    @Override
                    public void onSection(String key, String title, String content, double confidence) {
                        try {
                            // If fallback, force confidence display lower or prefix content?
                            // The prompt will handle the "Based on inferred patterns" prefix.
                            emitSection(emitter, key, title, content, isHighQuality ? 0.95 : 0.40);
                        } catch (IOException e) {
                            logger.error("Emit error", e);
                        }
                    }

                    @Override
                    public void onError(Throwable t) {
                        logger.error("Stream error", t);
                        emitter.completeWithError(t);
                    }

                    @Override
                    public void onComplete() {
                        emitter.complete();
                    }
                });

            } catch (Exception e) {
                logger.error("Ask Sentinel Pipeline Failed", e);
                emitter.completeWithError(e);
            }
        });
    }

    private String detectIntent(String query) {
        String prompt = """
                Classify the intent of this SRE query into exactly one of: [ROOT_CAUSE, SEARCH, FOLLOW_UP, AMBIGUOUS].
                Query: %s
                If query is vague (e.g. "hi", "help"), output AMBIGUOUS.
                Intent:
                """.formatted(query);
        return chatClient.complete("You are a classification engine.", prompt).trim();
    }

    private String rewriteQuery(String query, String intent) {
        String prompt = """
                Rewrite this SRE query for vector retrieval. Include service names, error types.
                Query: %s
                Rewrite:
                """.formatted(query);
        return chatClient.complete("You are a query optimizer.", prompt).trim();
    }

    private String rewriteFollowUp(String query, String context) {
        String prompt = """
                Rewrite this follow-up question into a standalone SRE search query.
                Previous Context: %s
                Follow-up: %s
                Rewrite:
                """.formatted(context, query);
        return chatClient.complete("You are a context resolver.", prompt).trim();
    }

    private String buildContext(List<Incident> incidents) {
        return incidents.stream()
                .map(i -> String.format("[ID:%s] [Service:%s] %s\nRoot Cause: %s\nResolution: %s\nTags: %s",
                        i.getPublicId(), i.getService(), i.getTitle(),
                        i.getRootCause(), i.getDescription(), i.getIssueType()))
                .collect(Collectors.joining("\n\n"));
    }

    private String buildStrictSystemPrompt(String context) {
        return """
                You are Sentinal, an SRE assistant.

                ### STRICT INSTRUCTIONS
                1. Answer ONLY using these incidents.
                2. Cite Incident IDs (e.g., INCSEN-123).
                3. Structure: "Root Cause", "Evidence", "Action".

                ### CONTEXT
                %s
                """
                .formatted(context);
    }

    private String buildFallbackSystemPrompt() {
        return """
                You are Sentinal, an Senior SRE.

                ### INSTRUCTIONS
                1. The user asked a question but we found NO specific incidents in logs.
                2. Provide an answer based on GENERAL distributed systems principles for this type of service.
                3. PREFACE your answer with: "Based on inferred patterns (no direct logs found)..."
                4. Suggest logical debugging steps (Check CPU, Check DB Latency).
                5. Structure: "Root Cause" (Hypothetical), "Action" (Debugging Steps).
                """;
    }

    // SSE Helpers
    private void emitStatus(SseEmitter emitter, String message) throws IOException {
        String json = String.format("{\"type\": \"%s\", \"message\": \"%s\"}", "status", message);
        emitter.send(SseEmitter.event().data(json));
    }

    private void emitSection(SseEmitter emitter, String key, String title, String content, double confidence)
            throws IOException {
        // Simple JSON escape
        String jsonContent = content.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
        String json = String.format(
                "{\"type\": \"section\", \"key\": \"%s\", \"title\": \"%s\", \"content\": \"%s\", \"confidence\": %.2f}",
                key, title, jsonContent, confidence);
        emitter.send(SseEmitter.event().data(json));
    }
}
