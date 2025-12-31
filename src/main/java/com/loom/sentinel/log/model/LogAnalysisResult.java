package com.loom.sentinel.log.model;

import java.util.List;

public class LogAnalysisResult {
    private List<LogPattern> patterns;
    private List<LogAnomaly> anomalies;
    private double overallRiskScore; // 0.0 to 1.0

    // Getters and Setters
    public List<LogPattern> getPatterns() {
        return patterns;
    }

    public void setPatterns(List<LogPattern> patterns) {
        this.patterns = patterns;
    }

    public List<LogAnomaly> getAnomalies() {
        return anomalies;
    }

    public void setAnomalies(List<LogAnomaly> anomalies) {
        this.anomalies = anomalies;
    }

    public double getOverallRiskScore() {
        return overallRiskScore;
    }

    public void setOverallRiskScore(double overallRiskScore) {
        this.overallRiskScore = overallRiskScore;
    }

    public static class LogPattern {
        private String signature; // e.g., "ConnectionTimeoutException: *"
        private int count;
        private String sampleMessage;
        private List<String> sampleLogIds;
        private boolean isError;

        public LogPattern(String signature, int count, String sampleMessage, List<String> sampleLogIds,
                boolean isError) {
            this.signature = signature;
            this.count = count;
            this.sampleMessage = sampleMessage;
            this.sampleLogIds = sampleLogIds;
            this.isError = isError;
        }

        // Getters and Setters
        public String getSignature() {
            return signature;
        }

        public void setSignature(String signature) {
            this.signature = signature;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public String getSampleMessage() {
            return sampleMessage;
        }

        public void setSampleMessage(String sampleMessage) {
            this.sampleMessage = sampleMessage;
        }

        public List<String> getSampleLogIds() {
            return sampleLogIds;
        }

        public void setSampleLogIds(List<String> sampleLogIds) {
            this.sampleLogIds = sampleLogIds;
        }

        public boolean isError() {
            return isError;
        }

        public void setError(boolean error) {
            isError = error;
        }
    }

    public static class LogAnomaly {
        private String type; // SPIKE, NEW_ERROR, RARE_EVENT
        private String description;
        private double confidence;

        public LogAnomaly(String type, String description, double confidence) {
            this.type = type;
            this.description = description;
            this.confidence = confidence;
        }

        // Getters and Setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public double getConfidence() {
            return confidence;
        }

        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }
    }
}
