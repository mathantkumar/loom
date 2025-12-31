package com.loom.sentinel.code;

import org.springframework.stereotype.Service;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.StringQuery;
import org.springframework.data.elasticsearch.core.query.Query;

import java.util.List;

import com.loom.incident.domain.Incident;
import com.loom.incident.ai.EmbeddingClient;
import com.loom.integration.git.search.CommitDocument;

@Service
public class CodeIncidentCorrelationService {

  private final EmbeddingClient embeddingClient;
  private final ElasticsearchOperations elasticsearchOperations;
  private final IncidentCodeCorrelationRepository correlationRepository;

  public CodeIncidentCorrelationService(EmbeddingClient embeddingClient,
      ElasticsearchOperations elasticsearchOperations,
      IncidentCodeCorrelationRepository correlationRepository) {
    this.embeddingClient = embeddingClient;
    this.elasticsearchOperations = elasticsearchOperations;
    this.correlationRepository = correlationRepository;
  }

  public void correlateIncident(Incident incident) {
    if (incident == null)
      return;

    // 1. Generate embedding for incident
    String textToEmbed = incident.getTitle() + " "
        + (incident.getDescription() != null ? incident.getDescription() : "");
    List<Double> embedding = embeddingClient.getEmbedding(textToEmbed);

    if (embedding == null || embedding.isEmpty()) {
      return;
    }

    // 2. Search for similar commits using StringQuery (JSON)
    // We construct the script_score query manually.
    String vectorString = embedding.toString(); // e.g. [0.1, 0.2]

    String queryJson = String.format("""
        {
          "script_score": {
            "query": { "match_all": {} },
            "script": {
              "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
              "params": {
                "query_vector": %s
              }
            }
          }
        }
        """, vectorString);

    Query query = new StringQuery(queryJson);
    // ((StringQuery) query).setMaxResults(5); // setMaxResults not directly on
    // interface in some versions, but set via builder or request usually.
    // Actually StringQuery extends AbstractQuery which has setMaxResults.

    query.setPageable(org.springframework.data.domain.PageRequest.of(0, 5));

    SearchHits<CommitDocument> hits = elasticsearchOperations.search(query, CommitDocument.class);

    // 3. Save Correlations
    hits.stream().forEach(hit -> {
      CommitDocument doc = hit.getContent();
      double score = hit.getScore(); // Raw score

      double confidence = (score - 1.0);

      if (confidence > 0.7) {
        // Check if already correlated or unique constraint
        IncidentCodeCorrelation correlation = new IncidentCodeCorrelation();
        correlation.setIncident(incident);
        correlation.setCommitSha(doc.getSha());
        correlation.setConfidenceScore(confidence);
        correlation.setReason("High semantic similarity to incident description. Author: " + doc.getAuthor());
        correlationRepository.save(correlation);
      }
    });
  }
}
