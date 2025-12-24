package com.loom.sentinel.atlas.service;

import com.loom.sentinel.atlas.model.AtlasSignal;
import com.loom.sentinel.atlas.model.Insight;
import com.loom.sentinel.atlas.model.Insight.InsightType;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReasoningEngine {

    public List<Insight> analyze(List<AtlasSignal> signals) {
        List<Insight> insights = new ArrayList<>();

        // Rule 1: unstable Release (Deployment Failure + Incidents)
        if (detectUnstableRelease(signals)) {
            insights.add(new Insight(
                    UUID.randomUUID().toString(),
                    InsightType.UNSTABLE_RELEASE,
                    "Unstable Release Detected",
                    "Recent deployment failure followed by incident activity suggests a bad release.",
                    0.9,
                    0.8,
                    signals.stream().map(AtlasSignal::getId).collect(Collectors.toList())));
        }

        // Rule 2: High Severity Pattern
        if (detectHighSeverity(signals)) {
            insights.add(new Insight(
                    UUID.randomUUID().toString(),
                    InsightType.PROJECT_RISK_SPIKE,
                    "Critical Risk Elevating",
                    "Multiple critical signals detected in the last 24h.",
                    0.95,
                    1.0,
                    signals.stream()
                            .filter(s -> s.getType() == AtlasSignal.SignalType.INCIDENT_SEVERITY)
                            .map(AtlasSignal::getId)
                            .collect(Collectors.toList())));
        }

        return insights;
    }

    private boolean detectUnstableRelease(List<AtlasSignal> signals) {
        boolean hasFailure = signals.stream().anyMatch(s -> s.getType() == AtlasSignal.SignalType.DEPLOYMENT_FAILURE);
        boolean hasIncidents = signals.stream().anyMatch(s -> s.getType() == AtlasSignal.SignalType.INCIDENT_SEVERITY
                || s.getType() == AtlasSignal.SignalType.INCIDENT_VOLUME_SPIKE);

        return hasFailure && hasIncidents;
    }

    private boolean detectHighSeverity(List<AtlasSignal> signals) {
        return signals.stream().filter(s -> s.getType() == AtlasSignal.SignalType.INCIDENT_SEVERITY).count() >= 1;
    }
}
