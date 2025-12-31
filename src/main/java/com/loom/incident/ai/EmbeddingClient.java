package com.loom.incident.ai;

import java.util.List;

public interface EmbeddingClient {
    List<Double> getEmbedding(String text);
}
