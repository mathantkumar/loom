package com.loom.incident_intelligence.controller;

import com.loom.incident_intelligence.model.ChunkMetadata;
import com.loom.incident_intelligence.model.QueryRequest;
import com.loom.incident_intelligence.model.QueryResponse;
import com.loom.incident_intelligence.service.OllamaClient;
import com.loom.incident_intelligence.service.PromptBuilder;
import com.loom.incident_intelligence.service.RetrievalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class IncidentQueryControllerTest {

    private RetrievalService retrievalService;
    private PromptBuilder promptBuilder;
    private OllamaClient ollamaClient;
    private IncidentQueryController controller;

    @BeforeEach
    void setUp() {
        retrievalService = Mockito.mock(RetrievalService.class);
        promptBuilder = Mockito.mock(PromptBuilder.class);
        ollamaClient = Mockito.mock(OllamaClient.class);
        controller = new IncidentQueryController(retrievalService, promptBuilder, ollamaClient);
    }

    @Test
    void testQuery_Successful() {
        // Arrange
        String question = "What happened to payment service?";
        QueryRequest request = new QueryRequest();
        request.setQuestion(question);

        ChunkMetadata chunk1 = ChunkMetadata.builder()
                .id("1")
                .source("payment-service-incident-123.json")
                .text("Incident details...")
                .build();
        ChunkMetadata chunk2 = ChunkMetadata.builder()
                .id("2")
                .source("app.log")
                .text("Error log...")
                .build();

        List<ChunkMetadata> chunks = List.of(chunk1, chunk2);
        when(retrievalService.search(anyString(), anyInt())).thenReturn(chunks);
        when(promptBuilder.build(anyString(), anyList())).thenReturn("Prompt");
        when(promptBuilder.getSystemPrompt()).thenReturn("System");
        when(ollamaClient.chat(anyList(), anyBoolean(), any(Duration.class)))
                .thenReturn("The payment service failed due to timeout [1].");

        // Act
        ResponseEntity<QueryResponse> responseEntity = controller.query(request);

        // Assert
        assertNotNull(responseEntity);
        assertEquals(200, responseEntity.getStatusCodeValue());
        QueryResponse response = responseEntity.getBody();
        assertNotNull(response);
        assertEquals("The payment service failed due to timeout [1].", response.getAnswer());

        // Verify Content
        assertTrue(response.getCitations().contains("1"));
        assertEquals(2, response.getSources().size());

        // Verify Confidence (Base 0.5 + 0.1 for incident + 0.01 for log = 0.61)
        assertEquals(0.61, response.getConfidenceScore(), 0.001);

        // Verify Data Sources
        Map<String, Integer> sources = response.getDataSources();
        assertEquals(1, sources.get("incidents"));
        assertEquals(1, sources.get("logs"));
    }

    @Test
    void testQuery_EmptyQuestion() {
        QueryRequest request = new QueryRequest();
        request.setQuestion("");

        ResponseEntity<QueryResponse> response = controller.query(request);
        assertEquals(400, response.getStatusCodeValue());
    }
}
