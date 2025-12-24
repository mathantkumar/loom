package com.loom.incident.ai;

/**
 * Interface for AI client to generate text analysis.
 */
public interface AiClient {

    /**
     * Generates a completion based on the provided prompt.
     *
     * @param prompt The input prompt for the AI.
     * @return The generated text response.
     */
    String generate(String prompt);
}
