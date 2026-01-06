package com.loom.incident_intelligence.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class EmbeddingServiceTest {

    @Test
    void testEmbed() {
        OllamaClient mockClient = Mockito.mock(OllamaClient.class);
        float[] expected = new float[768];
        expected[0] = 0.5f;

        when(mockClient.getEmbeddingInternal(anyString())).thenReturn(expected);

        EmbeddingService service = new EmbeddingService(mockClient);
        float[] result = service.embed("Test chunk");

        Assertions.assertNotNull(result);
        Assertions.assertEquals(768, result.length);
        Assertions.assertEquals(0.5f, result[0]);
    }
}
