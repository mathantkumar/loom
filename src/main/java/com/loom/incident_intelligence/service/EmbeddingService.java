package com.loom.incident_intelligence.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class EmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingService.class);

    private final OllamaClient ollamaClient;

    private final Cache<String, float[]> cache = Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(12, TimeUnit.HOURS)
            .build();

    public EmbeddingService(OllamaClient ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    public float[] embed(String text) {
        return cache.get(text, key -> {
            log.debug("Cache miss for embedding. Calling Ollama...");
            return ollamaClient.getEmbeddingInternal(key);
        });
    }
}
