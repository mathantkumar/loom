package com.loom.incident_intelligence.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loom.incident_intelligence.model.ChunkMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RetrievalService {

    private static final Logger log = LoggerFactory.getLogger(RetrievalService.class);
    private static final String INDEX_NAME = "incident_index";

    private final EmbeddingService embeddingService;
    private final ElasticsearchClient elasticsearchClient;

    public RetrievalService(EmbeddingService embeddingService, ElasticsearchClient elasticsearchClient) {
        this.embeddingService = embeddingService;
        this.elasticsearchClient = elasticsearchClient;
    }

    public List<ChunkMetadata> search(String question, int topK) {
        try {
            // 1. Generate Embedding
            float[] queryVector = embeddingService.embed(question);
            List<Float> embeddingList = new ArrayList<>();
            for (float f : queryVector) {
                embeddingList.add(f);
            }

            // 2. Build k-NN Search Request
            SearchRequest searchRequest = SearchRequest.of(s -> s
                    .index(INDEX_NAME)
                    .knn(k -> k
                            .field("embedding")
                            .queryVector(embeddingList)
                            .k(topK)
                            .numCandidates(topK * 10))
                    .source(src -> src.filter(f -> f.includes(
                            "incident_id", "title", "description", "root_cause", "service", "status", "created_at"))));

            // 3. Execute Search
            SearchResponse<Map> response = elasticsearchClient.search(searchRequest, Map.class);

            // 4. Map Results
            return response.hits().hits().stream()
                    .map(hit -> {
                        Map<String, Object> source = hit.source();
                        if (source == null)
                            return null;

                        String id = (String) source.getOrDefault("incident_id", hit.id());
                        String title = (String) source.getOrDefault("title", "");
                        String description = (String) source.getOrDefault("description", "");
                        String rootCause = (String) source.getOrDefault("root_cause", "Unknown");
                        String service = (String) source.getOrDefault("service", "Unknown");
                        String status = (String) source.getOrDefault("status", "Unknown");

                        String content = String.format("[%s] %s\nDescription: %s\nRoot Cause: %s\nStatus: %s",
                                service, title, description, rootCause, status);

                        return new ChunkMetadata(
                                id,
                                content,
                                "Incident #" + id,
                                hit.score());
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("Error searching incidents in Elasticsearch", e);
            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Unexpected error in RetrievalService", e);
            return Collections.emptyList();
        }
    }

    public void addChunk(ChunkMetadata meta, float[] embedding) {
        try {
            Map<String, Object> document = new HashMap<>();
            document.put("incident_id", meta.getId());
            document.put("title", meta.getTitle());
            document.put("description", meta.getText());
            document.put("service", meta.getSource()); // Map source to service
            document.put("created_at", meta.getCreated());
            document.put("embedding", embedding);
            document.put("root_cause", "Imported Data");
            document.put("status", "UNKNOWN");

            co.elastic.clients.elasticsearch.core.IndexRequest<Map<String, Object>> request = co.elastic.clients.elasticsearch.core.IndexRequest
                    .of(i -> i
                            .index(INDEX_NAME)
                            .id(meta.getId())
                            .document(document));

            elasticsearchClient.index(request);
        } catch (Exception e) {
            log.error("Failed to index chunk " + meta.getId(), e);
        }
    }

    public void save() {
        try {
            elasticsearchClient.indices().refresh(r -> r.index(INDEX_NAME));
        } catch (IOException e) {
            log.error("Failed to refresh index", e);
        }
    }
}
