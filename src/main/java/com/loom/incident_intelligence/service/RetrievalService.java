package com.loom.incident_intelligence.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jelmerk.knn.DistanceFunctions;
import com.github.jelmerk.knn.SearchResult;
import com.github.jelmerk.knn.hnsw.HnswIndex;
import com.loom.incident_intelligence.model.ChunkMetadata;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class RetrievalService {

    private static final Logger log = LoggerFactory.getLogger(RetrievalService.class);

    private final EmbeddingService embeddingService;
    private final ObjectMapper objectMapper;

    @Value("${faiss.index-path:./data/incident.index}")
    private String indexPath;

    @Value("${faiss.metadata-path:./data/metadata.json}")
    private String metadataPath;

    @Value("${retrieval.top-k:5}")
    private int defaultTopK;

    // HNSW Index: ID type String, Vector type float[], Item type VectorItem,
    // Distance type Float
    private HnswIndex<String, float[], VectorItem, Float> index;
    private final Map<String, ChunkMetadata> metadataMap = new ConcurrentHashMap<>();

    // Inner class for HNSW Item
    public static class VectorItem implements com.github.jelmerk.knn.Item<String, float[]> {
        private static final long serialVersionUID = 1L;
        private final String id;
        private final float[] vector;

        public VectorItem(String id, float[] vector) {
            this.id = id;
            this.vector = vector;
        }

        @Override
        public String id() {
            return id;
        }

        @Override
        public float[] vector() {
            return vector;
        }

        @Override
        public int dimensions() {
            return vector.length;
        }
    }

    // Manual constructor for dependency injection
    public RetrievalService(EmbeddingService embeddingService, ObjectMapper objectMapper) {
        this.embeddingService = embeddingService;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        try {
            // Ensure data directory exists
            File indexFile = new File(indexPath);
            File metadataFile = new File(metadataPath);
            File dataDir = indexFile.getParentFile();
            if (dataDir != null && !dataDir.exists()) {
                dataDir.mkdirs();
            }

            // Load Metadata
            if (metadataFile.exists()) {
                List<ChunkMetadata> metadataList = objectMapper.readValue(metadataFile,
                        new TypeReference<List<ChunkMetadata>>() {
                        });
                for (ChunkMetadata meta : metadataList) {
                    metadataMap.put(meta.getId(), meta);
                }
                log.info("Loaded {} metadata entries.", metadataMap.size());
            }

            // Load Index
            if (indexFile.exists()) {
                log.info("Loading existing index from {}", indexFile.getAbsolutePath());
                index = HnswIndex.load(indexFile);
            } else {
                log.info("Creating new HNSW index.");
                // Dimensions for nomic-embed-text is 768. M=16, efConstruction=100 are
                // reasonable defaults.
                index = HnswIndex.newBuilder(768, DistanceFunctions.FLOAT_INNER_PRODUCT, 3000) // max item count
                        .withM(16)
                        .withEfConstruction(100)
                        .build();
            }
        } catch (Exception e) {
            log.error("Failed to initialize RetrievalService", e);
            // Fallback to empty index to allow app verification even if load fails
            index = HnswIndex.newBuilder(768, DistanceFunctions.FLOAT_INNER_PRODUCT, 1000).build();
        }
    }

    public void addChunk(ChunkMetadata metadata, float[] embedding) {
        String id = metadata.getId();
        metadataMap.put(id, metadata);
        index.add(new VectorItem(id, embedding));
    }

    public synchronized void save() {
        try {
            index.save(new File(indexPath));
            objectMapper.writeValue(new File(metadataPath), new ArrayList<>(metadataMap.values()));
            log.info("Saved index and metadata.");
        } catch (IOException e) {
            log.error("Error saving index", e);
        }
    }

    public List<ChunkMetadata> search(String question, int topK) {
        if (index == null || index.size() == 0) {
            return Collections.emptyList();
        }

        float[] queryVector = embeddingService.embed(question);

        List<SearchResult<VectorItem, Float>> results = index.findNearest(queryVector, topK);

        return results.stream()
                .map(result -> metadataMap.get(result.item().id()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // Kept for backward compatibility or test if needed, but search(String) is
    // preferred
    public List<ChunkMetadata> retrieve(float[] queryVector) {
        if (index == null || index.size() == 0)
            return Collections.emptyList();

        List<SearchResult<VectorItem, Float>> results = index.findNearest(queryVector, defaultTopK);

        return results.stream()
                .map(result -> metadataMap.get(result.item().id()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
