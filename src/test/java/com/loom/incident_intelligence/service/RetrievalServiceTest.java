package com.loom.incident_intelligence.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loom.incident_intelligence.model.ChunkMetadata;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.mockito.Mockito.mock;

class RetrievalServiceTest {

    @Test
    void testRetrieve() {
        EmbeddingService embeddingService = mock(EmbeddingService.class);
        ObjectMapper objectMapper = new ObjectMapper();

        RetrievalService service = new RetrievalService(embeddingService, objectMapper);

        ReflectionTestUtils.setField(service, "indexPath", "./target/test-index");
        ReflectionTestUtils.setField(service, "metadataPath", "./target/test-metadata.json");
        ReflectionTestUtils.setField(service, "defaultTopK", 2);

        service.init();

        float[] v1 = new float[768];
        v1[0] = 1.0f;
        float[] v2 = new float[768];
        v2[0] = 0.0f; // orthogonal
        float[] v3 = new float[768];
        v3[0] = 0.9f; // close to v1
        for (int i = 1; i < 768; i++)
            v3[i] = 0.001f; // Ensure it's not identical but close

        ChunkMetadata m1 = ChunkMetadata.builder().id("1").title("T1").build();
        ChunkMetadata m2 = ChunkMetadata.builder().id("2").title("T2").build();
        ChunkMetadata m3 = ChunkMetadata.builder().id("3").title("T3").build();

        service.addChunk(m1, v1);
        service.addChunk(m2, v2);
        service.addChunk(m3, v3);

        // Query close to v1
        float[] q = new float[768];
        q[0] = 0.95f;
        List<ChunkMetadata> results = service.retrieve(q);

        Assertions.assertEquals(2, results.size());
        // Since order depends on distance, and v1 and v3 are closest.
        Assertions.assertTrue(results.stream().anyMatch(r -> r.getId().equals("1")));
        Assertions.assertTrue(results.stream().anyMatch(r -> r.getId().equals("3")));
    }
}
