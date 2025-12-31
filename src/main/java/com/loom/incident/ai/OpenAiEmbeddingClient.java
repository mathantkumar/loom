package com.loom.incident.ai;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class OpenAiEmbeddingClient implements EmbeddingClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private static final String LOCAL_EMBEDDING_URL = "http://localhost:8001/embed";

    public OpenAiEmbeddingClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(2))
                .build();
    }

    @Override
    public List<Double> getEmbedding(String text) {
        try {
            Map<String, String> body = new HashMap<>();
            body.put("text", text);
            String jsonBody = objectMapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(LOCAL_EMBEDDING_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Expecting strict JSON array of doubles
                return objectMapper.readValue(response.body(), List.class);
            } else {
                System.err.println("Embedding Service returned: " + response.statusCode());
            }

        } catch (Exception e) {
            System.err.println("Embedding Service Error: " + e.getMessage());
        }
        return Collections.emptyList();
    }
}
