package com.loom.incident.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmbeddingService {

    private static final int EMBEDDING_DIMENSION = 384;

    /**
     * Generates a dense vector for the given text.
     * For MVP, this allows for deterministic random generation based on text hash
     * to simulate reproducible embeddings.
     */
    public float[] generateEmbedding(String text) {
        float[] embedding = new float[EMBEDDING_DIMENSION];
        // Use text hashcode as seed for deterministic "random" vector for the same text
        Random random = new Random(text.hashCode());

        for (int i = 0; i < EMBEDDING_DIMENSION; i++) {
            // value between -1.0 and 1.0
            embedding[i] = (random.nextFloat() * 2) - 1.0f;
        }
        return embedding;
    }
}
