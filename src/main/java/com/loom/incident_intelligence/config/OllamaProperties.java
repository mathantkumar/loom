package com.loom.incident_intelligence.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ollama")
public class OllamaProperties {
    private String baseUrl = "http://127.0.0.1:11434";
    private String llmModel = "mixtral";
    private String embedModel = "nomic-embed-text";
    private int maxConcurrentGenerations = 2;
    private int topK = 5;

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getLlmModel() {
        return llmModel;
    }

    public void setLlmModel(String llmModel) {
        this.llmModel = llmModel;
    }

    public String getEmbedModel() {
        return embedModel;
    }

    public void setEmbedModel(String embedModel) {
        this.embedModel = embedModel;
    }

    public int getMaxConcurrentGenerations() {
        return maxConcurrentGenerations;
    }

    public void setMaxConcurrentGenerations(int maxConcurrentGenerations) {
        this.maxConcurrentGenerations = maxConcurrentGenerations;
    }

    public int getTopK() {
        return topK;
    }

    public void setTopK(int topK) {
        this.topK = topK;
    }
}
