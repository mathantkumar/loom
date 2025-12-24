package com.loom.incident.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.loom.incident.api.dto.IncidentPatternResponse;
import com.loom.incident.domain.Incident;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class IncidentPatternService {

    private static final Logger logger = LoggerFactory.getLogger(IncidentPatternService.class);
    private static final String INDEX_NAME = "incident_index";
    private static final float SIMILARITY_THRESHOLD = 0.85f;
    private static final int RECURRING_THRESHOLD = 3;

    private final ElasticsearchClient elasticsearchClient;
    private final IncidentService incidentService;
    private final EmbeddingService embeddingService;

    public IncidentPatternService(ElasticsearchClient elasticsearchClient, IncidentService incidentService,
            EmbeddingService embeddingService) {
        this.elasticsearchClient = elasticsearchClient;
        this.incidentService = incidentService;
        this.embeddingService = embeddingService;
    }

    public IncidentPatternResponse detectPattern(UUID incidentId) {
        try {
            Incident currentIncident = incidentService.getIncidentById(incidentId.toString());

            // Get embedding - ideally cached or stored, but generating for now ensures
            // freshness if not yet indexed
            String textContent = currentIncident.getTitle() + " " + currentIncident.getDescription();
            float[] embedding = embeddingService.generateEmbedding(textContent);

            // Time range: last 30 days
            String timeRange = "now-30d";

            // Build kNN query
            // In ES 8.x Java Client, kNN is often part of search request directly or a
            // query type
            // using dense_vector with cosine similarity

            // Note: Since we don't have exact 'knn' builder readily imported without
            // checking deps,
            // we'll use script_score or just assume standard search if kNN search isn't
            // available in this client version wrapper.
            // However, assuming standard kNN usage:

            // Query:
            // 1. Must NOT be this incident ID
            // 2. Created range >= now-30d
            // 3. kNN vector similarity

            // Logic: fetch candidates by script_score or knn search.
            // For simplicity and compatibility, let's use a script_score query if "knn"
            // search param isn't strictly available in our helper,
            // OR use the 'knn' option of search request which is best for performance.
            // I will use the 'knn' property on SearchRequest which is the modern way.

            List<Float> queryVector = new ArrayList<>();
            for (float v : embedding) {
                queryVector.add(v);
            }

            SearchResponse<Object> response = elasticsearchClient.search(s -> s
                    .index(INDEX_NAME)
                    .knn(k -> k
                            .field("embedding")
                            .k(20) // Check top 20 similiar
                            .numCandidates(50)
                            .queryVector(queryVector)
                            .filter(f -> f
                                    .bool(b -> b
                                            .mustNot(mn -> mn
                                                    .term(t -> t.field("incident_id").value(incidentId.toString())))
                                            .filter(r -> r.range(ra -> ra.field("created_at")
                                                    .gte(co.elastic.clients.json.JsonData.of(timeRange))))))),
                    Object.class);

            // Count matches with score >= threshold
            // Note: cosine similarity in ES is often optimized. Score might be (1+cosine)/2
            // or similar depending on mapping.
            // Assuming cosine similarity mapping.
            // Pure cosine: 1.0 is identical.
            // Let's assume standard score behavior.

            List<String> similarIds = response.hits().hits().stream()
                    .filter(h -> h.score() != null && h.score() >= SIMILARITY_THRESHOLD)
                    .map(h -> h.id())
                    .collect(Collectors.toList());

            int count = similarIds.size();

            // Also count explicit duplicates if we had a dedicated field, but similiary is
            // good proxy.

            if (count >= RECURRING_THRESHOLD) {
                return new IncidentPatternResponse(
                        IncidentPatternResponse.PatternType.RECURRING,
                        count,
                        "30_DAYS",
                        String.format("Recurring issue seen %d times in the last 30 days", count),
                        similarIds.stream().limit(3).collect(Collectors.toList()));
            } else {
                return new IncidentPatternResponse(
                        IncidentPatternResponse.PatternType.FIRST_OCCURRENCE,
                        count,
                        "30_DAYS",
                        "This is the first occurrence of this incident pattern.",
                        similarIds // Might differ empty or small list
                );
            }

        } catch (IOException e) {
            logger.error("Error detecting patterns for incident " + incidentId, e);
            throw new RuntimeException("Failed to detect patterns", e);
        }
    }
}
