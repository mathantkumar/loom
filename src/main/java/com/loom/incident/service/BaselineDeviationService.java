package com.loom.incident.service;

import com.loom.incident.domain.BaselineProfile;
import com.loom.incident.domain.Incident;
import com.loom.incident.domain.IncidentStatus;
import com.loom.incident.repository.BaselineProfileRepository;
import com.loom.incident.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class BaselineDeviationService {

    private final IncidentRepository incidentRepository;
    private final BaselineProfileRepository baselineProfileRepository;

    public BaselineDeviationService(IncidentRepository incidentRepository,
            BaselineProfileRepository baselineProfileRepository) {
        this.incidentRepository = incidentRepository;
        this.baselineProfileRepository = baselineProfileRepository;
    }

    public DeviationResult analyzeDeviation(UUID incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        // If no baseline exists, we can't really say it's deviating.
        BaselineProfile baseline = baselineProfileRepository
                .findByServiceNameAndSeverity(incident.getService(), incident.getSeverity())
                .orElse(null);

        if (baseline == null) {
            return new DeviationResult(false, 0.0, "No baseline data available for this service and severity.",
                    Collections.emptyList());
        }

        // Logic to compare
        List<String> deviationFactors = new ArrayList<>();
        double scoreAccumulator = 0.0;

        // 1. Resolution Time (if resolved) or Current Duration vs Median
        long durationSeconds = 0;
        if (incident.getStatus() == IncidentStatus.RESOLVED && incident.getResolvedAt() != null) {
            durationSeconds = Duration.between(incident.getCreatedAt(), incident.getResolvedAt()).getSeconds();
        } else {
            durationSeconds = Duration.between(incident.getCreatedAt(), Instant.now()).getSeconds();
        }

        // e.g. if duration > 1.5x Median
        if (baseline.getMedianResolutionTimeSeconds() > 0) {
            double ratio = (double) durationSeconds / baseline.getMedianResolutionTimeSeconds();
            if (ratio > 1.5) {
                deviationFactors.add(String.format("Duration (%.1fh) is %.1fx longer than median (%.1fh)",
                        durationSeconds / 3600.0, ratio, baseline.getMedianResolutionTimeSeconds() / 3600.0));
                scoreAccumulator += Math.min(1.0, (ratio - 1.0) * 0.2); // Cap impact
            }
        }

        // 2. Issue Type Rarity
        if (incident.getIssueType() != null && !baseline.getCommonIssueTypes().isEmpty()) {
            if (!baseline.getCommonIssueTypes().contains(incident.getIssueType())) {
                deviationFactors.add("Issue Type '" + incident.getIssueType() + "' is uncommon for this service");
                scoreAccumulator += 0.3;
            }
        }

        // 3. (Mock) Embedding Distance
        // In real impl, we'd compute cos sim between current incident embedding and
        // centroid
        // If dist > threshold, add to deviation.
        // Assuming we mock a check for MVP or if we had real embeddings:
        // double dist = computeDistance(incidentEmbedding,
        // baseline.getEmbeddingCentroid());
        // if (dist > 0.4) ...

        boolean isDeviating = !deviationFactors.isEmpty();
        double finalScore = Math.min(1.0, scoreAccumulator); // Normalize 0-1

        if (deviationFactors.isEmpty()) {
            return new DeviationResult(false, 0.0, "Incident behavior aligns with historical baseline.",
                    Collections.emptyList());
        }

        return new DeviationResult(true, finalScore, "Detected deviation from normal behavior.", deviationFactors);
    }

    public static class DeviationResult {
        public boolean isDeviating;
        public double deviationScore;
        public String summary;
        public List<String> factors;

        public DeviationResult(boolean isDeviating, double deviationScore, String summary, List<String> factors) {
            this.isDeviating = isDeviating;
            this.deviationScore = deviationScore;
            this.summary = summary;
            this.factors = factors;
        }
    }
}
