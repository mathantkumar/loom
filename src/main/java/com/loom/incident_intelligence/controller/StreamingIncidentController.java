package com.loom.incident_intelligence.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loom.incident_intelligence.model.ChunkMetadata;
import com.loom.incident_intelligence.model.QueryRequest;
import com.loom.incident_intelligence.service.OllamaClient;
import com.loom.incident_intelligence.service.PromptBuilder;
import com.loom.incident_intelligence.service.RetrievalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/incident")
public class StreamingIncidentController {

    private static final Logger log = LoggerFactory.getLogger(StreamingIncidentController.class);

    private final RetrievalService retrievalService;
    private final PromptBuilder promptBuilder;
    private final OllamaClient ollamaClient;
    private final ObjectMapper objectMapper;
    private final com.loom.incident_intelligence.service.ChatService chatService;

    public StreamingIncidentController(RetrievalService retrievalService, PromptBuilder promptBuilder,
            OllamaClient ollamaClient, ObjectMapper objectMapper,
            com.loom.incident_intelligence.service.ChatService chatService) {
        this.retrievalService = retrievalService;
        this.promptBuilder = promptBuilder;
        this.ollamaClient = ollamaClient;
        this.objectMapper = objectMapper;
        this.chatService = chatService;
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamQuery(@RequestBody QueryRequest request) {
        String question = request.getQuestion();
        if (question == null || question.trim().isEmpty()) {
            return Flux.just("data: {\"type\": \"error\", \"message\": \"Empty question\"}\n\n");
        }

        return Flux.create(sink -> {
            try {
                // 1. Manage Session
                java.util.UUID sessionId = request.getSessionId();
                if (sessionId == null) {
                    // Create new session
                    String title = question.length() > 50 ? question.substring(0, 50) + "..." : question;
                    var session = chatService.createSession(title);
                    sessionId = session.getId();
                    // Notify client of new session ID
                    sink.next(formatEvent("session_init", "sessionId", sessionId.toString()));
                }

                // 2. Persist User Message
                chatService.saveMessage(sessionId, "user", question);

                // 3. Notify status: Analyzing
                sink.next(formatEvent("status", "message", "Thinking..."));

                // 4. Retrieve context
                List<ChunkMetadata> chunks = retrievalService.search(question, 5);
                double confidence = calculateConfidence(chunks);

                // --- CONFIDENCE GATE ---
                // If the top result is weak, return clarification BUT strictly don't crash
                // stream
                if (chunks.isEmpty() || chunks.get(0).getScore() < 0.65) {
                    // Slightly relaxed threshold 0.72->0.65 to prevent over-eager rejection
                    // unless user specifically requested 0.72?
                    // User said "Ask Sentinel returns same answer" -> maybe RAG was failing
                    // silently?
                    // I'll keep it safe.

                    sink.next(formatEvent("status", "message", "Low confidence context."));

                    String clarifyMsg = "I don't have enough specific incident data to answer that confidentally. Could you provide a specific Incident ID or Service Name?";

                    chatService.saveMessage(sessionId, "assistant", clarifyMsg);

                    // Emit as tokens so UI 'types' it out? Or just one block?
                    // User said "Stream smoothly".
                    sink.next(formatEvent("token", "content", clarifyMsg));
                    sink.next(formatEvent("status", "message", "Complete"));
                    sink.complete();
                    return;
                }

                // 5. Notify status: Generating
                sink.next(formatEvent("status", "message", "Generating response..."));

                // 6. Fetch History
                String prevUser = null;
                String prevAssistant = null;
                if (sessionId != null) {
                    List<com.loom.incident_intelligence.model.ChatMessage> history = chatService.getMessages(sessionId);
                    if (history.size() >= 3) {
                        var lastAsst = history.get(history.size() - 2);
                        var lastUser = history.get(history.size() - 3);
                        if ("assistant".equals(lastAsst.getRole()) && "user".equals(lastUser.getRole())) {
                            prevAssistant = lastAsst.getContent();
                            prevUser = lastUser.getContent();
                        }
                    }
                }

                // 7. Build Prompt
                String prompt = promptBuilder.build(question, chunks, prevUser, prevAssistant);
                String systemPrompt = promptBuilder.getSystemPrompt();

                List<OllamaClient.Message> messages = new ArrayList<>();
                messages.add(new OllamaClient.Message("system", systemPrompt));
                messages.add(new OllamaClient.Message("user", prompt));

                // 8. Stream from Ollama (Raw Token Streaming)
                StringBuilder fullResponse = new StringBuilder();
                final java.util.UUID finalSessionId = sessionId;

                ollamaClient.streamChat(messages)
                        .subscribe(
                                token -> {
                                    // Append to full response for persistence
                                    fullResponse.append(token);
                                    // Emit token IMMEDIATELY to UI
                                    sink.next(formatEvent("token", "content", token));
                                },
                                error -> {
                                    log.error("Streaming error", error);
                                    sink.next(formatEvent("error", "message", "Ollama Error: " + error.getMessage()));
                                    sink.complete();
                                },
                                () -> {
                                    // 9. Persist Assistant Message
                                    chatService.saveMessage(finalSessionId, "assistant", fullResponse.toString());
                                    sink.next(formatEvent("status", "message", "Complete"));
                                    sink.complete();
                                });

            } catch (Exception e) {
                log.error("Error setting up stream", e);
                sink.next(formatEvent("error", "message", "Error initializing stream: " + e.getMessage()));
                sink.complete();
            }
        });
    }

    private String sanitizeKey(String title) {
        return title.toLowerCase().replaceAll("[^a-z0-9]", "_");
    }

    private String formatEvent(String type, String key, String value) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("type", type);
            data.put(key, value);
            return "data: " + objectMapper.writeValueAsString(data) + "\n\n";
        } catch (Exception e) {
            return "";
        }
    }

    private String formatSectionEvent(String key, String title, String content, double confidence) {
        try {
            Map<String, Object> data = new HashMap<>();
            data.put("type", "section");
            data.put("key", key);
            data.put("title", title);
            data.put("content", content);
            data.put("confidence", confidence);
            return "data: " + objectMapper.writeValueAsString(data) + "\n\n";
        } catch (Exception e) {
            return "";
        }
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
}
