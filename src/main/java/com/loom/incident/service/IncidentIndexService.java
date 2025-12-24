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
    private final EmbeddingService embeddingService;

    public IncidentIndexService(ElasticsearchClient elasticsearchClient, EmbeddingService embeddingService) {
        this.elasticsearchClient = elasticsearchClient;
        this.embeddingService = embeddingService;
    }

    @Async("incidentTaskExecutor")
    public void indexIncidentAsync(Incident incident) {
        try {
            logger.info("Starting async indexing for incident id: {}", incident.getId());

            String textContent = incident.getTitle() + " " + incident.getDescription();
            float[] embedding = embeddingService.generateEmbedding(textContent);

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

        } catch (

        IOException e) {
            // Log error but do not throw - we don't want to affect transaction or retry
            // immediately in this MVP
            logger.error("Failed to index incident id: " + incident.getId(), e);
        } catch (Exception e) {
            logger.error("Unexpected error during indexing for incident id: " + incident.getId(), e);
        }
    }

    public void clearAllIncidents() {
        try {
            boolean exists = elasticsearchClient.indices().exists(e -> e.index(INDEX_NAME)).value();
            if (!exists) {
                logger.info("Index {} does not exist, skipping clear operation.", INDEX_NAME);
                return;
            }

            logger.info("Clearing all incidents from index {}", INDEX_NAME);
            elasticsearchClient.deleteByQuery(d -> d
                    .index(INDEX_NAME)
                    .ignoreUnavailable(true)
                    .query(q -> q.matchAll(m -> m)));
        } catch (Exception e) {
            logger.error("Failed to clear index during sync (safe to ignore if init)", e);
        }
    }

}
