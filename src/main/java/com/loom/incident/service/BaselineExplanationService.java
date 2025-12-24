package com.loom.incident.service;

import com.loom.incident.service.BaselineDeviationService.DeviationResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BaselineExplanationService {

    /**
     * Explains the deviation using Generative AI (Simulated for MVP).
     */
    public BaselineAnalysisResponse explainDeviation(DeviationResult deviation) {
        if (!deviation.isDeviating) {
            return new BaselineAnalysisResponse(
                    false,
                    0.0,
                    0.95,
                    "Behavior within normal limits.",
                    List.of("Incident metrics align with the 30-day baseline for this service."));
        }

        // Simulate LLM call based on the Prompt Template provided in requirements
        // SYSTEM: "You are an SRE assistant that explains incident deviations from
        // normal behavior."
        // USER: Incident summary + Baseline metrics + Deviation metrics

        // In a real implementation:
        // String prompt = buildPrompt(deviation);
        // String aiResponse = openAiClient.chat(prompt);
        // BaselineAnalysisResponse response = parse(aiResponse);

        // Mocking the AI output for stability/demo:
        StringBuilder explanation = new StringBuilder();
        explanation.append("This incident exhibits unusual characteristics compared to the historical baseline. ");

        List<String> keyFactors = new ArrayList<>();

        for (String factor : deviation.factors) {
            if (factor.contains("Duration")) {
                explanation.append("The resolution time is significantly longer than the median. ");
                keyFactors.add("Extended resolution time suggests complex underlying dependency issues.");
            } else if (factor.contains("Issue Type")) {
                explanation.append("The issue classification is rare for this service. ");
                keyFactors.add("Rare issue type indicates a potential regression or new failure mode.");
            } else {
                keyFactors.add(factor); // Fallback
            }
        }

        // Add a "SRE-friendly" conclusion
        explanation.append("Recommended immediate investigation into recent deployments or config changes.");

        return new BaselineAnalysisResponse(
                true,
                deviation.deviationScore,
                0.88, // Confidence score (simulated)
                explanation.toString(),
                keyFactors);
    }

    public static class BaselineAnalysisResponse {
        public boolean isDeviating;
        public double deviationScore;
        public double confidenceScore;
        public String explanation;
        public List<String> keyFactors;

        public BaselineAnalysisResponse(boolean isDeviating, double deviationScore, double confidenceScore,
                String explanation, List<String> keyFactors) {
            this.isDeviating = isDeviating;
            this.deviationScore = deviationScore;
            this.confidenceScore = confidenceScore;
            this.explanation = explanation;
            this.keyFactors = keyFactors;
        }
    }
}
