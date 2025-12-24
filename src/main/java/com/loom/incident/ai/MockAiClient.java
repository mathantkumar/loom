package com.loom.incident.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MockAiClient implements AiClient {

    private static final Logger logger = LoggerFactory.getLogger(MockAiClient.class);

    @Override
    public String generate(String prompt) {
        logger.info("Mock AI Client received prompt: \n{}", prompt);

        // Deterministic mock response simulating a RAG output
        return """
                ROOT_CAUSE: The high latency is likely caused by a connection pool exhaustion in the payment service database, as referenced in similar past incidents where connection leaks were observed under load.
                RESOLUTION: Recommend increasing the maximum pool size to 50 and investigating the transaction management logic for unclosed connections. A restart of the payment service pods is suggested as an immediate mitigation.
                CONFIDENCE: 0.85
                """;
    }
}
