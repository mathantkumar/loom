package com.loom.incident_intelligence.service;

import com.loom.incident_intelligence.model.ChunkMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromptBuilder {

    private static final Logger log = LoggerFactory.getLogger(PromptBuilder.class);

    private static final String SYSTEM_PROMPT = """
            You are Ask Sentinel, an incident intelligence system.

            RULES:
            - You MUST answer ONLY using the provided incident context.
            - If the context does not directly answer the question:
              - Say: "I don't have enough incident data yet."
              - Ask ONE clarifying question.
            - Do NOT give general engineering advice.
            - Do NOT speculate.
            - Do NOT repeat previous answers unless explicitly asked.
            - Cite incident IDs using [INCSEN-xxx] format.
            - Structure your response with explicit headers like:
              ### Root Cause
              (content)
              ### Resolution
              (content)
            """;

    private static final int MAX_TOKENS = 6000;

    public String build(String question, List<ChunkMetadata> chunks, String previousUserMsg,
            String previousAssistantMsg) {
        StringBuilder prompt = new StringBuilder();

        // 1. Inject History (Minimal)
        if (previousUserMsg != null && previousAssistantMsg != null) {
            prompt.append("Previous exchange:\n");
            prompt.append("User: ").append(previousUserMsg).append("\n");
            prompt.append("Assistant: ").append(previousAssistantMsg).append("\n\n");
        }

        // 2. Inject Context
        prompt.append("Context:\n");
        int currentTokens = estimateTokens(SYSTEM_PROMPT) + estimateTokens(prompt.toString())
                + estimateTokens("\nQuestion: " + question);

        int chunksUsed = 0;
        for (ChunkMetadata chunk : chunks) {
            String chunkText = String.format("Source: [%s] %s\nContent: %s\n\n", chunk.getId(), chunk.getSource(),
                    chunk.getText());
            int chunkTokens = estimateTokens(chunkText);

            if (currentTokens + chunkTokens > MAX_TOKENS) {
                log.info("Truncating context at {} tokens (limit {}). Used {} chunks.", currentTokens, MAX_TOKENS,
                        chunksUsed);
                break;
            }

            prompt.append(chunkText);
            currentTokens += chunkTokens;
            chunksUsed++;
        }

        // 3. Inject Current Question
        prompt.append("\nCurrent question:\nUser: ").append(question);

        return prompt.toString();
    }

    // Overload for backward compatibility if needed, though we should migrate all
    // calls
    public String build(String question, List<ChunkMetadata> chunks) {
        return build(question, chunks, null, null);
    }

    private int estimateTokens(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }
        return text.split("\\s+").length;
    }

    public String getSystemPrompt() {
        return SYSTEM_PROMPT;
    }
}
