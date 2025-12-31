package com.loom.incident_intelligence.util;

public class TokenizerUtil {

    /**
     * Approximates token count by splitting on whitespace.
     * Sufficient for the requirement of ~300 tokens per chunk.
     */
    public static int countTokens(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }
}
