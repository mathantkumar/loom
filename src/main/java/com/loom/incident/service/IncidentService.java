package com.loom.incident.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.repository.IncidentRepository;
import com.loom.integration.cicd.DeploymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class IncidentService {

    private static final Logger logger = LoggerFactory.getLogger(IncidentService.class);

    private final IncidentRepository incidentRepository;
    private final IncidentIndexService incidentIndexService;
    private final DeploymentService deploymentService;

    public IncidentService(IncidentRepository incidentRepository, IncidentIndexService incidentIndexService,
            DeploymentService deploymentService) {
        this.incidentRepository = incidentRepository;
        this.incidentIndexService = incidentIndexService;
        this.deploymentService = deploymentService;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(String id) {
        // 1. Try finding by Public ID (e.g., INCLO-1234)
        java.util.Optional<Incident> byPublicId = incidentRepository.findByPublicId(id);
        if (byPublicId.isPresent()) {
            return byPublicId.get();
        }

        // 2. Fallback: Try finding by UUID (legacy support or direct UUID access)
        try {
            java.util.UUID uuid = java.util.UUID.fromString(id);
            return incidentRepository.findById(uuid)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found: " + id));
        } catch (IllegalArgumentException e) {
            // Not a valid UUID and not found as Public ID
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found: " + id);
        }
    }

    /**
     * Persists the incident and triggers async indexing.
     * The transaction commits when this method returns, ensuring data is safe in DB
     * before the async thread likely starts processing (though race conditions are
     * possible,
     * relying on DB commit usually happens fast enough or isolation levels handle
     * it).
     */
    @Transactional
    public Incident createIncident(Incident incident) {
        // 0. Generate Public ID if missing
        if (incident.getPublicId() == null) {
            Long nextSeq = incidentRepository.getNextSequenceValue();
            incident.setSequenceId(nextSeq);
            incident.setPublicId("INCLO-" + nextSeq);
        }

        // Core Logic: Correlate with CI/CD
        if (incident.getService() != null && !incident.getService().isEmpty()) {
            List<com.loom.integration.cicd.Deployment> recentDeployments = deploymentService.findRecentDeployments(
                    incident.getService(), "prod"); // Defaulting to 'prod' for correlation for now

            if (!recentDeployments.isEmpty()) {
                incident.setCorrelatedDeployments(recentDeployments);

                // Simple AI Insight Generation (Heuristic)
                com.loom.integration.cicd.Deployment latest = recentDeployments.get(0);
                long minutesAgo = java.time.temporal.ChronoUnit.MINUTES.between(latest.getDeploymentTime(),
                        java.time.Instant.now());
                incident.setDeploymentInsight(
                        String.format("This incident occurred %d minutes after a deployment to %s by %s (commit %s).",
                                minutesAgo, incident.getService(), latest.getAuthor(),
                                latest.getCommitHash().substring(0, 7)));
            }
        }

        // 1. Save to PostgreSQL (Primary Source of Truth)
        Incident savedIncident = incidentRepository.save(incident);
        logger.info("Incident saved to DB with ID: {} ({})", savedIncident.getPublicId(), savedIncident.getId());

        // 2. Trigger Async Indexing
        // This runs in a separate thread and does not block the response.
        // If indexing fails, the DB transaction is NOT rolled back.
        incidentIndexService.indexIncidentAsync(savedIncident);

        return savedIncident;
    }

    @Transactional
    public Incident updateIncident(Incident incident) {
        // 1. Save to PostgreSQL
        Incident savedIncident = incidentRepository.save(incident);
        logger.info("Incident updated in DB with ID: {}", savedIncident.getId());

        // 2. Trigger Async Indexing
        incidentIndexService.indexIncidentAsync(savedIncident);

        return savedIncident;
    }

    @Transactional
    public Incident updateIncidentStatus(String id, com.loom.incident.domain.IncidentStatus newStatus) {
        Incident incident = getIncidentById(id);

        logger.info("Updating status for incident {} from {} to {}", id, incident.getStatus(), newStatus);

        // Timeline side-effects: Manage resolvedAt based on status
        if (newStatus == com.loom.incident.domain.IncidentStatus.RESOLVED
                || newStatus == com.loom.incident.domain.IncidentStatus.CLOSED) {
            if (incident.getResolvedAt() == null) {
                incident.setResolvedAt(java.time.Instant.now());
            }
        } else if (newStatus == com.loom.incident.domain.IncidentStatus.OPEN
                || newStatus == com.loom.incident.domain.IncidentStatus.INVESTIGATING) {
            // If reopening, clear resolvedAt
            incident.setResolvedAt(null);
        }

        incident.setStatus(newStatus);

        Incident saved = incidentRepository.save(incident);
        incidentIndexService.indexIncidentAsync(saved);

        return saved;
    }

    public com.loom.incident.api.dto.IncidentStatsResponse getStats() {
        List<Incident> incidents = incidentRepository.findAll();

        // 1. Existing Counts
        java.util.Map<com.loom.incident.domain.Severity, Long> severityCounts = incidents.stream()
                .collect(java.util.stream.Collectors.groupingBy(Incident::getSeverity,
                        java.util.stream.Collectors.counting()));

        java.util.Map<com.loom.incident.domain.IncidentStatus, Long> statusCounts = incidents.stream()
                .collect(java.util.stream.Collectors.groupingBy(Incident::getStatus,
                        java.util.stream.Collectors.counting()));

        // 2. MTTR Calculation (in seconds)
        double totalResolutionTime = 0;
        long resolvedCount = 0;
        for (Incident i : incidents) {
            if (i.getResolvedAt() != null) {
                long diff = java.time.Duration.between(i.getCreatedAt(), i.getResolvedAt()).getSeconds();
                if (diff > 0) {
                    totalResolutionTime += diff;
                    resolvedCount++;
                }
            }
        }
        double avgMttr = resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0;

        // 3. Incidents by Day (Last 30 Days mainly, but let's do all for the chart)
        // Group by YYYY-MM-DD
        java.util.Map<String, Long> incidentsByDay = incidents.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        i -> i.getCreatedAt().toString().substring(0, 10), // Simple substring for date
                        java.util.stream.Collectors.counting()));

        // 4. Incidents by Service
        java.util.Map<String, Long> incidentsByService = incidents.stream()
                .collect(java.util.stream.Collectors.groupingBy(Incident::getService,
                        java.util.stream.Collectors.counting()));

        // 5. Engineer Load (Active Incidents per Engineer)
        // Active = NOT (RESOLVED or CLOSED)
        java.util.Map<String, Long> engineerCounts = incidents.stream()
                .filter(i -> (i.getStatus() != com.loom.incident.domain.IncidentStatus.RESOLVED
                        && i.getStatus() != com.loom.incident.domain.IncidentStatus.CLOSED))
                .filter(i -> i.getAssigneeName() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        Incident::getAssigneeName,
                        java.util.stream.Collectors.counting()));

        List<com.loom.incident.api.dto.IncidentStatsResponse.EngineerLoadMetric> engineerStats = engineerCounts
                .entrySet()
                .stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue())) // Descending
                .limit(5)
                .map(e -> new com.loom.incident.api.dto.IncidentStatsResponse.EngineerLoadMetric(e.getKey(),
                        e.getValue()))
                .collect(java.util.stream.Collectors.toList());

        // Dummy trends for MVP (requires historical comparison logic)
        double mttrTrend = -5.0;
        double freqTrend = 12.0;

        return new com.loom.incident.api.dto.IncidentStatsResponse(
                severityCounts,
                statusCounts,
                (long) incidents.size(),
                avgMttr,
                mttrTrend,
                freqTrend,
                incidentsByDay,
                incidentsByService,
                engineerStats);
    }

    public void syncIndex() {
        try {
            logger.info("Starting manual index synchronization...");
            incidentIndexService.clearAllIncidents();
            List<Incident> all = incidentRepository.findAll();
            logger.info("Found {} incidents in DB to re-index.", all.size());
            for (Incident i : all) {
                incidentIndexService.indexIncidentAsync(i);
            }
            logger.info("Sync triggered for all incidents.");
        } catch (Exception e) {
            logger.error("Index synchronization failed", e);
            throw new RuntimeException("Sync failed", e);
        }
    }
}
