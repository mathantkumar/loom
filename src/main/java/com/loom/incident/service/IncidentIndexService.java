package com.loom.incident.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import com.loom.incident.domain.Incident;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class IncidentIndexService {

    private static final Logger logger = LoggerFactory.getLogger(IncidentIndexService.class);
    private static final String INDEX_NAME = "incident_index";

    private final ElasticsearchClient elasticsearchClient;
    private final com.loom.incident.ai.EmbeddingClient embeddingClient;

    public IncidentIndexService(ElasticsearchClient elasticsearchClient,
            com.loom.incident.ai.EmbeddingClient embeddingClient) {
        this.elasticsearchClient = elasticsearchClient;
        this.embeddingClient = embeddingClient;
    }

    @Async("incidentTaskExecutor")
    public void indexIncidentAsync(Incident incident) {
        try {
            logger.info("Starting async indexing for incident id: {}", incident.getId());

            // Enrich embedding input: [Service] Title. Description. Root Cause. Status.
            // Tags.
            // "Resolution" is often implied by description or root cause if resolved.
            // We include Severity and IssueType as "Tags".
            String tags = String.format("%s, %s", incident.getIssueType(), incident.getSeverity());

            String textContent = String.format("[%s] %s. %s. Root Cause: %s. Status: %s. Tags: %s.",
                    incident.getService(),
                    incident.getTitle(),
                    incident.getDescription(),
                    incident.getRootCause() != null ? incident.getRootCause() : "Unknown",
                    incident.getStatus(),
                    tags);

            // Generate embedding using shared client (unified logic)
            java.util.List<Double> embeddingList = embeddingClient.getEmbedding(textContent);

            // Convert to float[] for ES
            float[] embedding = new float[embeddingList.size()];
            for (int i = 0; i < embeddingList.size(); i++) {
                embedding[i] = embeddingList.get(i).floatValue();
            }

            Map<String, Object> document = new HashMap<>();
            document.put("incident_id", incident.getId().toString());
            document.put("title", incident.getTitle());
            document.put("description", incident.getDescription());
            document.put("severity", incident.getSeverity().name());
            document.put("status", incident.getStatus().name());
            document.put("service", incident.getService());
            if (incident.getIssueType() != null) {
                document.put("issueType", incident.getIssueType().name());
            }
            document.put("created_at", incident.getCreatedAt().toString());
            // Safe check for null resolvedAt
            if (incident.getResolvedAt() != null) {
                document.put("resolved_at", incident.getResolvedAt().toString());
            }
            // Safe check for null rootCause
            if (incident.getRootCause() != null) {
                document.put("root_cause", incident.getRootCause());
            }
            // Assignee Fields
            if (incident.getAssigneeName() != null) {
                document.put("assignee_name", incident.getAssigneeName());
            }
            if (incident.getAssigneeAvatar() != null) {
                document.put("assignee_avatar", incident.getAssigneeAvatar());
            }
            document.put("embedding", embedding);

            IndexRequest<Map<String, Object>> request = IndexRequest.of(i -> i
                    .index(INDEX_NAME)
                    .id(incident.getId().toString())
                    .document(document));

            elasticsearchClient.index(request);
            logger.info("Successfully indexed incident id: {}", incident.getId());

        } catch (IOException e) {
            // Log error but do not throw - we don't want to affect transaction or retry
            // immediately in this MVP
            logger.error("Failed to index incident id: " + incident.getId(), e);
        } catch (Exception e) {
            logger.error("Unexpected error during indexing for incident id: " + incident.getId(), e);
        }
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        createIndexIfNotExists();
    }

    private void createIndexIfNotExists() {
        try {
            // FORCE DELETE for "Reset Architecture" phase to ensure 384-dim mapping is
            // applied
            // In production, we would check mapping or use an alias.
            boolean exists = elasticsearchClient.indices().exists(e -> e.index(INDEX_NAME)).value();
            if (exists) {
                logger.info("Deleting existing index {} to enforce 384-dim mapping...", INDEX_NAME);
                elasticsearchClient.indices().delete(d -> d.index(INDEX_NAME));
            }

            logger.info("Creating index {} with 384-dim dense_vector mapping...", INDEX_NAME);
            elasticsearchClient.indices().create(c -> c
                    .index(INDEX_NAME)
                    .mappings(m -> m
                            .properties("embedding", p -> p
                                    .denseVector(d -> d
                                            .dims(384)
                                            .index(true)
                                            .similarity("cosine")))
                            .properties("incident_id", p -> p.keyword(k -> k))
                            .properties("title",
                                    p -> p.text(
                                            t -> t.fields("keyword", k -> k.keyword(kw -> kw.ignoreAbove(256)))))
                            .properties("description",
                                    p -> p.text(
                                            t -> t.fields("keyword", k -> k.keyword(kw -> kw.ignoreAbove(256)))))
                            .properties("severity", p -> p.keyword(k -> k))
                            .properties("status", p -> p.keyword(k -> k))
                            .properties("service", p -> p.keyword(k -> k))
                            .properties("issueType", p -> p.keyword(k -> k))
                            .properties("root_cause",
                                    p -> p.text(
                                            t -> t.fields("keyword", k -> k.keyword(kw -> kw.ignoreAbove(256)))))
                            .properties("created_at", p -> p.date(d -> d))
                            .properties("resolved_at", p -> p.date(d -> d))));
            logger.info("Index {} created successfully.", INDEX_NAME);

        } catch (Exception e) {
            logger.error("Failed to create index " + INDEX_NAME, e);
        }
    }

    public void clearAllIncidents() {
        try {
            // Delete the index entirely to ensure mapping updates if needed (for dev/demo)
            boolean exists = elasticsearchClient.indices().exists(e -> e.index(INDEX_NAME)).value();
            if (exists) {
                logger.warn("Deleting index {} to enforce fresh mapping...", INDEX_NAME);
                elasticsearchClient.indices().delete(d -> d.index(INDEX_NAME));
            }
            createIndexIfNotExists();

        } catch (Exception e) {
            logger.error("Failed to clear/re-create index during sync", e);
        }

    }

    public java.util.List<ResolvedIncidentDto> findSimilarIncidents(String description, int topK) {
        try {
            java.util.List<Double> embeddingList = embeddingClient.getEmbedding(description);
            java.util.List<Float> embedding = new java.util.ArrayList<>();
            for (Double d : embeddingList) {
                embedding.add(d.floatValue());
            }

            co.elastic.clients.elasticsearch.core.SearchRequest searchRequest = co.elastic.clients.elasticsearch.core.SearchRequest
                    .of(s -> s
                            .index(INDEX_NAME)
                            .knn(k -> k
                                    .field("embedding")
                                    .queryVector(embedding)
                                    .k(topK)
                                    .numCandidates(100))
                            .source(src -> src.filter(f -> f.includes("incident_id", "created_at", "title"))));

            co.elastic.clients.elasticsearch.core.SearchResponse<Map> response = elasticsearchClient
                    .search(searchRequest, Map.class);

            java.util.List<ResolvedIncidentDto> results = new java.util.ArrayList<>();
            for (co.elastic.clients.elasticsearch.core.search.Hit<Map> hit : response.hits().hits()) {
                Map<String, Object> source = hit.source();
                if (source != null) {
                    ResolvedIncidentDto dto = new ResolvedIncidentDto();
                    dto.setIncidentId((String) source.get("incident_id"));
                    dto.setCreatedAt((String) source.get("created_at"));
                    dto.setTitle((String) source.get("title"));
                    dto.setScore(hit.score());
                    results.add(dto);
                }
            }
            return results;

        } catch (Exception e) {
            logger.error("Error finding similar incidents", e);
            return java.util.Collections.emptyList();
        }
    }

    public static class ResolvedIncidentDto {
        private String incidentId;
        private String createdAt;
        private String title;
        private Double score;

        public String getIncidentId() {
            return incidentId;
        }

        public void setIncidentId(String incidentId) {
            this.incidentId = incidentId;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }
    }
}
