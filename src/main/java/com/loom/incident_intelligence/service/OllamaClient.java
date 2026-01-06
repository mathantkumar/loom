package com.loom.incident_intelligence.service;

import reactor.core.publisher.Flux;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loom.incident_intelligence.config.OllamaProperties;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.util.Timeout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;

import com.loom.incident.ai.EmbeddingClient;

@Service
@org.springframework.context.annotation.Primary
public class OllamaClient implements EmbeddingClient {

    private static final Logger log = LoggerFactory.getLogger(OllamaClient.class);

    private final CloseableHttpClient httpClient;
    private final OllamaProperties ollamaProperties;
    private final ObjectMapper objectMapper;
    private final Semaphore semaphore;

    public OllamaClient(CloseableHttpClient httpClient, OllamaProperties ollamaProperties, ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.ollamaProperties = ollamaProperties;
        this.objectMapper = objectMapper;
        this.semaphore = new Semaphore(ollamaProperties.getMaxConcurrentGenerations());
    }

    public String chat(List<Message> messages, boolean stream, Duration timeout) {
        try {
            semaphore.acquire();
            try {
                return executeChat(messages, stream, timeout);
            } finally {
                semaphore.release();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while waiting for Ollama semaphore", e);
        }
    }

    private String executeChat(List<Message> messages, boolean stream, Duration timeout) {
        String url = ollamaProperties.getBaseUrl() + "/api/chat";
        HttpPost post = new HttpPost(url);

        // Per-request timeout
        RequestConfig config = RequestConfig.custom()
                .setResponseTimeout(Timeout.ofMilliseconds(timeout.toMillis()))
                .build();
        post.setConfig(config);

        ChatPayload payload = new ChatPayload();
        payload.setModel(ollamaProperties.getLlmModel());
        payload.setMessages(messages);
        payload.setStream(stream);
        payload.setTemperature(ollamaProperties.getTemperature());
        payload.setNum_ctx(ollamaProperties.getNumCtx());
        payload.setTop_p(0.9);

        try {
            String json = objectMapper.writeValueAsString(payload);
            post.setEntity(new StringEntity(json, StandardCharsets.UTF_8));
            post.setHeader("Content-Type", "application/json");

            return httpClient.execute(post, response -> {
                if (response.getCode() != 200) {
                    throw new RuntimeException("Ollama chat failed: " + response.getCode());
                }
                JsonNode root = objectMapper.readTree(response.getEntity().getContent());
                JsonNode messageContent = root.path("message").path("content");
                if (messageContent.isMissingNode()) {
                    throw new RuntimeException("Invalid chat response from Ollama");
                }
                return messageContent.asText();
            });
        } catch (IOException e) {
            log.error("Error calling Ollama chat", e);
            throw new RuntimeException("Failed to chat with Ollama", e);
        }
    }

    public Flux<String> streamChat(List<Message> messages) {
        return Flux.create(sink -> {
            try {
                semaphore.acquire();

                String url = ollamaProperties.getBaseUrl() + "/api/chat";
                HttpPost post = new HttpPost(url);

                // Set extended timeout for streaming
                RequestConfig config = RequestConfig.custom()
                        .setResponseTimeout(Timeout.ofMinutes(2))
                        .setConnectTimeout(Timeout.ofSeconds(60))
                        .build();
                post.setConfig(config);

                ChatPayload payload = new ChatPayload();
                payload.setModel(ollamaProperties.getLlmModel());
                payload.setMessages(messages);
                payload.setStream(true);
                payload.setTemperature(ollamaProperties.getTemperature());
                payload.setNum_ctx(ollamaProperties.getNumCtx());

                String json = objectMapper.writeValueAsString(payload);
                post.setEntity(new StringEntity(json, StandardCharsets.UTF_8));
                post.setHeader("Content-Type", "application/json");

                httpClient.execute(post, response -> {
                    if (response.getCode() != 200) {
                        sink.error(new RuntimeException("Ollama stream failed: " + response.getCode()));
                        return null;
                    }

                    try (java.io.BufferedReader reader = new java.io.BufferedReader(
                            new java.io.InputStreamReader(response.getEntity().getContent(), StandardCharsets.UTF_8))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            JsonNode node = objectMapper.readTree(line);
                            if (node.has("message") && node.get("message").has("content")) {
                                String content = node.get("message").get("content").asText();
                                sink.next(content);
                            }
                            if (node.has("done") && node.get("done").asBoolean()) {
                                sink.complete();
                                break;
                            }
                        }
                    } catch (Exception e) {
                        sink.error(e);
                    }
                    return null;
                });
            } catch (Exception e) {
                sink.error(e);
            } finally {
                semaphore.release();
            }
        });
    }

    @Override
    public List<Double> getEmbedding(String text) {
        float[] embedding = getEmbeddingInternal(text);
        List<Double> result = new java.util.ArrayList<>(embedding.length);
        for (float f : embedding) {
            result.add((double) f);
        }
        return result;
    }

    public float[] getEmbeddingInternal(String text) {
        String url = ollamaProperties.getBaseUrl() + "/api/embeddings";
        HttpPost post = new HttpPost(url);

        // Default timeout for embeddings (can be shorter/longer)
        RequestConfig config = RequestConfig.custom()
                .setResponseTimeout(Timeout.ofSeconds(30))
                .build();
        post.setConfig(config);

        try {
            Map<String, Object> payload = Map.of(
                    "model", ollamaProperties.getEmbedModel(),
                    "prompt", text);

            post.setEntity(new StringEntity(objectMapper.writeValueAsString(payload), StandardCharsets.UTF_8));
            post.setHeader("Content-Type", "application/json");

            return httpClient.execute(post, response -> {
                if (response.getCode() != 200) {
                    throw new RuntimeException("Ollama embedding failed: " + response.getCode());
                }
                JsonNode root = objectMapper.readTree(response.getEntity().getContent());
                JsonNode embeddingNode = root.get("embedding");
                if (embeddingNode == null || !embeddingNode.isArray()) {
                    throw new RuntimeException("Invalid embedding response from Ollama");
                }
                float[] embedding = new float[embeddingNode.size()];
                for (int i = 0; i < embeddingNode.size(); i++) {
                    embedding[i] = (float) embeddingNode.get(i).asDouble();
                }
                return embedding;
            });
        } catch (IOException e) {
            log.error("Error calling Ollama embedding", e);
            throw new RuntimeException("Failed to get embedding", e);
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ChatPayload {
        private String model;
        private List<Message> messages;
        private boolean stream;
        private double temperature;
        private double top_p;
        private Integer max_tokens;
        private int num_ctx;

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public List<Message> getMessages() {
            return messages;
        }

        public void setMessages(List<Message> messages) {
            this.messages = messages;
        }

        public boolean isStream() {
            return stream;
        }

        public void setStream(boolean stream) {
            this.stream = stream;
        }

        public double getTemperature() {
            return temperature;
        }

        public void setTemperature(double temperature) {
            this.temperature = temperature;
        }

        public double getTop_p() {
            return top_p;
        }

        public void setTop_p(double top_p) {
            this.top_p = top_p;
        }

        public Integer getMax_tokens() {
            return max_tokens;
        }

        public void setMax_tokens(Integer max_tokens) {
            this.max_tokens = max_tokens;
        }

        public int getNum_ctx() {
            return num_ctx;
        }

        public void setNum_ctx(int num_ctx) {
            this.num_ctx = num_ctx;
        }
    }

    public static class Message {
        private final String role;
        private final String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public String getContent() {
            return content;
        }
    }
}
