package com.loom.sentinel.atlas;

import com.loom.sentinel.atlas.model.AtlasSignal;
import com.loom.sentinel.atlas.model.Insight;
import com.loom.sentinel.atlas.service.ReasoningEngine;
import com.loom.sentinel.atlas.service.SignalDetector;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AtlasService {

    private final SignalDetector signalDetector;
    private final ReasoningEngine reasoningEngine;

    public AtlasService(SignalDetector signalDetector, ReasoningEngine reasoningEngine) {
        this.signalDetector = signalDetector;
        this.reasoningEngine = reasoningEngine;
    }

    public ProjectHealthReport generateReport(String projectId) {
        // 1. Detect Signals
        List<AtlasSignal> signals = signalDetector.detectSignals(projectId);

        // 2. Apply Reasoning
        List<Insight> insights = reasoningEngine.analyze(signals);

        // 3. Calculate Aggregate Scores
        double riskScore = calculateRiskScore(insights);
        String confidence = calculateConfidence(signals.size());

        // 4. Map to DTO
        List<String> factors = insights.stream()
                .map(i -> i.getSummary() + ": " + i.getDescription())
                .collect(Collectors.toList());

        // Fallback factors if no insights but raw signals exist
        if (factors.isEmpty() && !signals.isEmpty()) {
            factors.add("Operational noise detected (" + signals.size() + " signals), but no critical patterns.");
        } else if (factors.isEmpty()) {
            factors.add("No significant risk factors detected.");
        }

        String prediction = generatePrediction(insights, riskScore);

        return new ProjectHealthReport(projectId, riskScore, confidence, factors, prediction);
    }

    private double calculateRiskScore(List<Insight> insights) {
        if (insights.isEmpty())
            return 0.05; // Baseline low risk

        // Sum severity of insights, capped at 1.0
        double score = insights.stream().mapToDouble(Insight::getSeverity).sum();
        return Math.min(score, 1.0);
    }

    private String calculateConfidence(int signalCount) {
        if (signalCount > 10)
            return "HIGH";
        if (signalCount > 3)
            return "MEDIUM";
        return "LOW";
    }

    private String generatePrediction(List<Insight> insights, double riskScore) {
        if (riskScore > 0.8) {
            return "CRITICAL: High probability of service outage. Immediate freeze recommended.";
        } else if (riskScore > 0.4) {
            return "WARNING: Signs of instability detected. Monitor latency and error rates.";
        } else {
            return "STABLE: Service operating within normal baselines.";
        }
    }
}
