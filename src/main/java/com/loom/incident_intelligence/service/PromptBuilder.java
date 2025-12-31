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
            You are an intelligent assistant for incident management.
            Your goal is to answer questions based ONLY on the provided context chunks.
            If the answer is not in the context, say "I don't know based on the provided context."
            Always cite your sources using the format [source_id] at the end of the sentence or paragraph where the information is used.
            Do not makeup information.
            """;

    private static final int MAX_TOKENS = 6000;

    public String build(String question, List<ChunkMetadata> chunks) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Context:\n");

        int currentTokens = estimateTokens(SYSTEM_PROMPT) + estimateTokens("Context:\n")
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

        prompt.append("\nQuestion: ").append(question);

        return prompt.toString();
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
