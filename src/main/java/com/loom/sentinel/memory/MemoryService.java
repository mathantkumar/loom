package com.loom.sentinel.memory;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MemoryService {

    private final IncidentRepository incidentRepository;

    public MemoryService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public HistoricalContext getHistoricalContext(String incidentIdStr) {
        Incident current = null;

        // Try UUID
        try {
            UUID id = UUID.fromString(incidentIdStr);
            current = incidentRepository.findById(id).orElse(null);
        } catch (IllegalArgumentException e) {
            // Not a UUID, ignore
        }

        // Try Public ID if not found
        if (current == null) {
            current = incidentRepository.findByPublicId(incidentIdStr)
                    .orElseThrow(() -> new RuntimeException("Incident not found: " + incidentIdStr));
        }

        // For MVP: Simple mock logic to find "similar" incidents
        // In real impl: Vector search on 'description' + 'rootCause'
        final String currentId = current.getId().toString();
        final String currentService = current.getService();
        List<HistoricalContext.SimilarIncident> similarList = incidentRepository.findAll().stream()
                .filter(i -> !i.getId().toString().equals(currentId)) // Exclude self
                .filter(i -> i.getService().equalsIgnoreCase(currentService)) // Same service
                .filter(i -> i.getResolvedAt() != null) // Only resolved ones
                .limit(3)
                .map(i -> new HistoricalContext.SimilarIncident(
                        i.getId().toString(),
                        i.getTitle(),
                        i.getRootCause() != null ? i.getRootCause() : "No root cause recorded",
                        0.85 // Mock confidence
                ))
                .collect(Collectors.toList());

        String aiInsight;
        if (similarList.isEmpty()) {
            aiInsight = "No historical precedence found. This appears to be a novel incident for "
                    + current.getService();
        } else {
            aiInsight = "Similar patterns detected in " + similarList.size() + " past incidents. " +
                    "Previous resolutions involved database scaling and cache invalidation strategies.";
        }

        return new HistoricalContext(aiInsight, similarList);
    }
}
