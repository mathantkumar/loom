package com.loom.incident.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.json.JsonData;

import com.loom.incident.api.dto.IncidentStatsResponse;
import com.loom.incident.api.dto.SimilarIncidentResponse;
import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.domain.IssueType;
import com.loom.incident.domain.Severity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class IncidentSearchService {

    private static final Logger logger = LoggerFactory.getLogger(IncidentSearchService.class);
    private static final String INDEX_NAME = "incident_index";

    private final ElasticsearchClient elasticsearchClient;

    public IncidentSearchService(ElasticsearchClient elasticsearchClient) {
        this.elasticsearchClient = elasticsearchClient;
    }

    public List<SimilarIncidentResponse> findSimilarIncidents(UUID incidentId) {
        List<SimilarIncidentResponse> similarIncidents = new ArrayList<>();
        try {
            // 1. Fetch the source incident document to get its embedding
            // We use generic Map<String, Object> or generic GetRequest because we just need
            // the embedding field.
            SearchResponse<Map> sourceResponse = elasticsearchClient.search(s -> s
                    .index(INDEX_NAME)
                    .query(q -> q.ids(i -> i.values(incidentId.toString())))
                    .size(1), Map.class);

            if (sourceResponse.hits().hits().isEmpty()) {
                logger.warn("Incident with ID {} not found in index", incidentId);
                return similarIncidents;
            }

            Map<String, Object> sourceSource = sourceResponse.hits().hits().get(0).source();
            if (sourceSource == null || !sourceSource.containsKey("embedding")) {
                logger.warn("Incident with ID {} has no embedding in index", incidentId);
                return similarIncidents;
            }

            // Extract embedding as List<Double> (JSON deserialization typically makes it a
            // List)
            Object embeddingObj = sourceSource.get("embedding");
            List<Double> embeddingList;
            if (embeddingObj instanceof List) {
                embeddingList = (List<Double>) embeddingObj;
            } else {
                logger.error("Embedding format error for incident {}", incidentId);
                return similarIncidents;
            }

            // Convert List<Double> to float[] required by newer ES clients or List<Float>
            // depending on exact version method signature.
            // But the Java client for dense_vector often takes List<Float> or just queries.
            // Actually, for kNN query in Java client, we often pass it as a field in a
            // builder.
            // Let's assume generic loose typing or standard Float arrays.
            // In modern Java Client 8.x: knn query accepts queryVector as List<Float>.

            List<Float> queryVector = new ArrayList<>();
            for (Number num : embeddingList) {
                queryVector.add(num.floatValue());
            }

            // 2. Execute kNN search
            SearchResponse<Map> searchResponse = elasticsearchClient.search(s -> s
                    .index(INDEX_NAME)
                    .knn(k -> k
                            .field("embedding")
                            .queryVector(queryVector)
                            .k(3)
                            .numCandidates(100)
                            .filter(f -> f
                                    .bool(b -> b
                                            .must(m -> m
                                                    .term(t -> t.field("status").value(IncidentStatus.RESOLVED.name())))
                                            .mustNot(mn -> mn.ids(i -> i.values(incidentId.toString())))))),
                    Map.class);

            // 3. Map results
            for (Hit<Map> hit : searchResponse.hits().hits()) {
                Map<String, Object> source = hit.source();
                if (source != null) {
                    String idStr = (String) source.get("incident_id");
                    String title = (String) source.get("title");
                    String sevStr = (String) source.get("severity");
                    String rootCause = (String) source.get("root_cause");
                    Double score = hit.score();

                    similarIncidents.add(new SimilarIncidentResponse(
                            UUID.fromString(idStr),
                            title,
                            Severity.valueOf(sevStr),
                            rootCause,
                            score != null ? score : 0.0));
                }
            }

        } catch (IOException e) {
            logger.error("Error finding similar incidents", e);
        } catch (Exception e) {
            logger.error("Unexpected error in similarity search", e);
        }

        return similarIncidents;
    }

    public List<Incident> searchIncidents(String queryText, Severity severity, String status,
            IssueType issueType, String fromDate, String toDate) {
        List<Incident> results = new ArrayList<>();
        try {
            SearchResponse<Map> response = elasticsearchClient.search(s -> s
                    .index(INDEX_NAME)
                    .query(q -> {
                        BoolQuery.Builder bool = new BoolQuery.Builder();

                        // 1. Keyword Search (if provided)
                        if (queryText != null && !queryText.isBlank()) {
                            bool.must(m -> m
                                    .multiMatch(mm -> mm
                                            .fields("title^3", "description^2", "service", "root_cause")
                                            .query(queryText)
                                            .fuzziness("AUTO")));
                        } else {
                            bool.must(m -> m.matchAll(ma -> ma));
                        }

                        // 2. Filters - Use .keyword for exact filtering on string/enum fields
                        if (severity != null) {
                            bool.filter(f -> f.term(t -> t.field("severity.keyword").value(severity.name())));
                        }

                        // Status Filter Logic
                        if (status == null) {
                            // Default to OPEN if unset
                            bool.filter(f -> f.term(t -> t.field("status.keyword").value(IncidentStatus.OPEN.name())));
                        } else if (!"ALL".equalsIgnoreCase(status)) {
                            // Filter by specific status if provided and NOT "ALL"
                            bool.filter(f -> f.term(t -> t.field("status.keyword").value(status)));
                        }
                        // If "ALL", apply no status filter (show all)

                        if (issueType != null) {
                            bool.filter(f -> f.term(t -> t.field("issueType.keyword").value(issueType.name())));
                        }
                        if (fromDate != null || toDate != null) {
                            bool.filter(f -> f.range(r -> {
                                r.field("created_at");
                                if (fromDate != null) {
                                    r.gte(JsonData.of(fromDate));
                                }
                                if (toDate != null) {
                                    r.lte(JsonData.of(toDate));
                                }
                                return r;
                            }));
                        }

                        return q.bool(bool.build());
                    })
                    .sort(so -> so.field(
                            f -> f.field("created_at").order(co.elastic.clients.elasticsearch._types.SortOrder.Desc)))
                    .size(50),
                    Map.class);

            for (Hit<Map> hit : response.hits().hits()) {
                Map<String, Object> source = hit.source();
                if (source != null) {
                    Incident incident = mapSourceToIncident(source);
                    results.add(incident);
                }
            }

        } catch (Exception e) { // Catch all to prevent 500
            logger.error("Error searching incidents", e);
        }
        return results;
    }

    public IncidentStatsResponse getIncidentStats() {
        try {
            // Use .keyword for aggregations to avoid "Fielddata is disabled on text fields"
            // error
            SearchResponse<Void> response = elasticsearchClient.search(s -> s
                    .index(INDEX_NAME)
                    .size(0) // We only care about aggregations
                    .aggregations("severity_counts", a -> a
                            .terms(t -> t.field("severity.keyword")))
                    .aggregations("status_counts", a -> a
                            .terms(t -> t.field("status.keyword"))),
                    Void.class);

            Map<Severity, Long> severityMap = new HashMap<>();
            if (response.aggregations() != null && response.aggregations().get("severity_counts") != null) {
                response.aggregations().get("severity_counts").sterms().buckets().array().forEach(b -> {
                    try {
                        severityMap.put(Severity.valueOf(b.key().stringValue()), b.docCount());
                    } catch (IllegalArgumentException e) {
                        // Ignore unknown enum values
                    }
                });
            }

            Map<IncidentStatus, Long> statusMap = new HashMap<>();
            if (response.aggregations() != null && response.aggregations().get("status_counts") != null) {
                response.aggregations().get("status_counts").sterms().buckets().array().forEach(b -> {
                    try {
                        statusMap.put(IncidentStatus.valueOf(b.key().stringValue()), b.docCount());
                    } catch (IllegalArgumentException e) {
                        // Ignore unknown enum values
                    }
                });
            }

            long total = response.hits().total() != null ? response.hits().total().value() : 0;

            return new IncidentStatsResponse(severityMap, statusMap, total);

        } catch (Exception e) {
            // Catch RuntimeException (e.g. index not found) and IOException
            logger.error("Error fetching incident stats (returning empty)", e);
            return new IncidentStatsResponse(new HashMap<>(), new HashMap<>(), 0);
        }
    }

    private Incident mapSourceToIncident(Map<String, Object> source) {
        Incident i = new Incident();
        if (source.get("incident_id") != null)
            i.setId(UUID.fromString((String) source.get("incident_id")));
        if (source.get("title") != null)
            i.setTitle((String) source.get("title"));
        if (source.get("description") != null)
            i.setDescription((String) source.get("description"));
        if (source.get("severity") != null)
            i.setSeverity(Severity.valueOf((String) source.get("severity")));
        if (source.get("status") != null)
            i.setStatus(IncidentStatus.valueOf((String) source.get("status")));
        if (source.get("service") != null)
            i.setService((String) source.get("service"));
        if (source.get("root_cause") != null)
            i.setRootCause((String) source.get("root_cause"));
        if (source.get("issueType") != null)
            i.setIssueType(IssueType.valueOf((String) source.get("issueType")));

        // Assignee Fields
        if (source.get("assignee_name") != null)
            i.setAssigneeName((String) source.get("assignee_name"));
        if (source.get("assignee_avatar") != null)
            i.setAssigneeAvatar((String) source.get("assignee_avatar"));

        // Handle dates (stored as ISO strings usually)
        if (source.get("created_at") != null)
            i.setCreatedAt(Instant.parse((String) source.get("created_at")));
        if (source.get("resolved_at") != null)
            i.setResolvedAt(Instant.parse((String) source.get("resolved_at")));

        return i;
    }
}
