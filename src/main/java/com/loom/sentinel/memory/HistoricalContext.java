package com.loom.sentinel.memory;

import java.util.List;

public class HistoricalContext {
    private String insight; // AI-generated summary
    private List<SimilarIncident> similarIncidents;

    public HistoricalContext(String insight, List<SimilarIncident> similarIncidents) {
        this.insight = insight;
        this.similarIncidents = similarIncidents;
    }

    public String getInsight() {
        return insight;
    }

    public List<SimilarIncident> getSimilarIncidents() {
        return similarIncidents;
    }

    public static class SimilarIncident {
        public String id;
        public String title;
        public String resolution;
        public double similarityScore; // 0.0 - 1.0

        public SimilarIncident(String id, String title, String resolution, double similarityScore) {
            this.id = id;
            this.title = title;
            this.resolution = resolution;
            this.similarityScore = similarityScore;
        }
    }
}
