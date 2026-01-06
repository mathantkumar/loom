package com.loom.incident_intelligence.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.core.search.HitsMetadata;
import com.loom.incident_intelligence.model.ChunkMetadata;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RetrievalServiceTest {

    @Test
    void testSearch() throws IOException {
        // Arrange
        EmbeddingService embeddingService = mock(EmbeddingService.class);
        ElasticsearchClient elasticsearchClient = mock(ElasticsearchClient.class);
        
        RetrievalService service = new RetrievalService(embeddingService, elasticsearchClient);

        // Mock Embedding
        float[] mockVector = new float[768];
        mockVector[0] = 1.0f;
        when(embeddingService.embed(any(String.class))).thenReturn(mockVector);

        // Mock Elasticsearch Response
        SearchResponse<Map> mockResponse = mock(SearchResponse.class);
        HitsMetadata<Map> webParamsHits = mock(HitsMetadata.class);
        
        Map<String, Object> source = Map.of(
            "incident_id", "123",
            "title", "DB Failure",
            "description", "Database connection lost",
            "service", "db-service"
        );
        
        Hit<Map> hit = Hit.of(h -> h
            .index("incident_index")
            .id("123")
            .score(0.95)
            .source(source));
            
        when(webParamsHits.hits()).thenReturn(List.of(hit));
        when(mockResponse.hits()).thenReturn(webParamsHits);
        
        when(elasticsearchClient.search(ArgumentMatchers.<SearchRequest>any(), ArgumentMatchers.<Class<Map>>any()))
            .thenReturn(mockResponse);

        // Act
        List<ChunkMetadata> results = service.search("database down", 5);

        // Assert
        Assertions.assertEquals(1, results.size());
        Assertions.assertEquals("123", results.get(0).getId());
        Assertions.assertTrue(results.get(0).getText().contains("DB Failure"));
    }
}
