package com.loom.incident.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.elasticsearch.indices.ExistsRequest;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringReader;

import com.loom.incident.service.IncidentService;

@Component
public class ElasticsearchIndexInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger logger = LoggerFactory.getLogger(ElasticsearchIndexInitializer.class);

    private final ElasticsearchClient elasticsearchClient;
    private final IncidentService incidentService;

    // Use @Lazy to avoid potential circular dependencies if IncidentService depends
    // on something that interacts with this
    public ElasticsearchIndexInitializer(ElasticsearchClient elasticsearchClient,
            @org.springframework.context.annotation.Lazy IncidentService incidentService) {
        this.elasticsearchClient = elasticsearchClient;
        this.incidentService = incidentService;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            initializeIndex(ElasticsearchIndexConstants.INCIDENT_INDEX, true);
        } catch (Exception e) {
            logger.error("Error initializing Elasticsearch indices", e);
        }
    }

    private void initializeIndex(String indexName, boolean syncData) {
        try {
            logger.info("Checking if Elasticsearch index '{}' exists...", indexName);
            BooleanResponse exists = elasticsearchClient.indices().exists(ExistsRequest.of(e -> e.index(indexName)));

            if (!exists.value()) {
                logger.info("Index '{}' does not exist. Creating with mapping...", indexName);
                if (ElasticsearchIndexConstants.INCIDENT_INDEX.equals(indexName)) {
                    createIncidentIndex();
                }

                if (syncData && ElasticsearchIndexConstants.INCIDENT_INDEX.equals(indexName)) {
                    logger.info("Triggering initial data sync for '{}'...", indexName);
                    incidentService.syncIndex();
                }
            } else {
                logger.info("Index '{}' already exists.", indexName);
            }
        } catch (Exception e) {
            logger.error("Failed to initialize index: {}", indexName, e);
        }
    }

    private void createIncidentIndex() throws IOException {
        String mappingJson = """
                {
                  "mappings": {
                    "properties": {
                      "incident_id": { "type": "keyword" },
                      "title": { "type": "text" },
                      "description": { "type": "text" },
                      "service": { "type": "keyword" },
                      "status": { "type": "keyword" },
                      "severity": { "type": "keyword" },
                      "root_cause": { "type": "text" },
                      "created_at": { "type": "date" },
                      "embedding": {
                        "type": "dense_vector",
                        "dims": 1536,
                        "index": true,
                        "similarity": "cosine"
                      }
                    }
                  }
                }
                """;

        elasticsearchClient.indices().create(CreateIndexRequest.of(c -> c
                .index(ElasticsearchIndexConstants.INCIDENT_INDEX)
                .withJson(new StringReader(mappingJson))));
        logger.info("Index '{}' created successfully with vector mapping.", ElasticsearchIndexConstants.INCIDENT_INDEX);
    }
}
