package com.loom.incident.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import com.loom.incident.service.IncidentIndexService.ResolvedIncidentDto;
import com.loom.integration.cicd.DeploymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class IncidentServiceTest {

    private IncidentRepository incidentRepository;
    private IncidentIndexService incidentIndexService;
    private DeploymentService deploymentService;
    private IncidentService incidentService;

    @BeforeEach
    void setUp() {
        incidentRepository = Mockito.mock(IncidentRepository.class);
        incidentIndexService = Mockito.mock(IncidentIndexService.class);
        deploymentService = Mockito.mock(DeploymentService.class);
        incidentService = new IncidentService(incidentRepository, incidentIndexService, deploymentService);
    }

    @Test
    void testCreateIncident_DetectsRecurring() {
        // Arrange
        Incident incident = new Incident();
        incident.setService("payment-service");
        incident.setDescription("Payment timeout error");

        // Mock Sequence
        when(incidentRepository.getNextSequenceValue()).thenReturn(1001L);
        when(incidentRepository.save(any(Incident.class))).thenAnswer(i -> {
            Incident saved = (Incident) i.getArgument(0);
            saved.setId(java.util.UUID.randomUUID());
            return saved;
        });

        // Mock Similar Incidents
        ResolvedIncidentDto similar1 = new ResolvedIncidentDto();
        similar1.setScore(0.90);
        similar1.setCreatedAt(Instant.now().minusSeconds(86400).toString()); // 1 day ago

        ResolvedIncidentDto similar2 = new ResolvedIncidentDto();
        similar2.setScore(0.88);
        similar2.setCreatedAt(Instant.now().minusSeconds(172800).toString()); // 2 days ago

        when(incidentIndexService.findSimilarIncidents(anyString(), anyInt()))
                .thenReturn(List.of(similar1, similar2));

        // Act
        Incident result = incidentService.createIncident(incident);

        // Assert
        assertNotNull(result);
        assertTrue(result.isRecurring());
        assertEquals(3, result.getRecurringCount()); // 2 similar + 1 current
        assertNotNull(result.getFirstSeen());

        // Verify index called
        verify(incidentIndexService).findSimilarIncidents(eq("Payment timeout error"), eq(10));
        verify(incidentIndexService).indexIncidentAsync(result);
    }

    @Test
    void testCreateIncident_NoRecurring() {
        // Arrange
        Incident incident = new Incident();
        incident.setService("auth-service");
        incident.setDescription("Unique error");

        when(incidentRepository.getNextSequenceValue()).thenReturn(1002L);
        when(incidentRepository.save(any(Incident.class))).thenReturn(incident);
        when(incidentIndexService.findSimilarIncidents(anyString(), anyInt()))
                .thenReturn(Collections.emptyList());

        // Act
        Incident result = incidentService.createIncident(incident);

        // Assert
        assertFalse(result.isRecurring());
        assertEquals(0, result.getRecurringCount());
        verify(incidentIndexService).findSimilarIncidents(anyString(), anyInt());
    }
}
