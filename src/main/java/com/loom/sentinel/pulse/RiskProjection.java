package com.loom.sentinel.pulse;

public class RiskProjection {
    private String riskLevel; // LOW, MEDIUM, HIGH
    private int estimatedFailureInMinutes;
    private double deviationScore;
    private String explanation;

    public RiskProjection() {
    }

    public RiskProjection(String riskLevel, int estimatedFailureInMinutes, double deviationScore, String explanation) {
        this.riskLevel = riskLevel;
        this.estimatedFailureInMinutes = estimatedFailureInMinutes;
        this.deviationScore = deviationScore;
        this.explanation = explanation;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public int getEstimatedFailureInMinutes() {
        return estimatedFailureInMinutes;
    }

    public void setEstimatedFailureInMinutes(int estimatedFailureInMinutes) {
        this.estimatedFailureInMinutes = estimatedFailureInMinutes;
    }

    public double getDeviationScore() {
        return deviationScore;
    }

    public void setDeviationScore(double deviationScore) {
        this.deviationScore = deviationScore;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
