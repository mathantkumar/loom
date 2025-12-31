package com.loom.incident_intelligence.model;

import java.util.List;
import java.util.Map;

public class QueryResponse {
    private String answer;
    private List<String> citations;
    private List<ChunkMetadata> sources;
    private double confidenceScore;
    private Map<String, Integer> dataSources;

    public QueryResponse() {
    }

    public QueryResponse(String answer, List<String> citations, List<ChunkMetadata> sources, double confidenceScore,
            Map<String, Integer> dataSources) {
        this.answer = answer;
        this.citations = citations;
        this.sources = sources;
        this.confidenceScore = confidenceScore;
        this.dataSources = dataSources;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<String> getCitations() {
        return citations;
    }

    public void setCitations(List<String> citations) {
        this.citations = citations;
    }

    public List<ChunkMetadata> getSources() {
        return sources;
    }

    public void setSources(List<ChunkMetadata> sources) {
        this.sources = sources;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public Map<String, Integer> getDataSources() {
        return dataSources;
    }

    public void setDataSources(Map<String, Integer> dataSources) {
        this.dataSources = dataSources;
    }

    public static class Builder {
        private String answer;
        private List<String> citations;
        private List<ChunkMetadata> sources;
        private double confidenceScore;
        private Map<String, Integer> dataSources;

        public Builder answer(String answer) {
            this.answer = answer;
            return this;
        }

        public Builder citations(List<String> citations) {
            this.citations = citations;
            return this;
        }

        public Builder sources(List<ChunkMetadata> sources) {
            this.sources = sources;
            return this;
        }

        public Builder confidenceScore(double confidenceScore) {
            this.confidenceScore = confidenceScore;
            return this;
        }

        public Builder dataSources(Map<String, Integer> dataSources) {
            this.dataSources = dataSources;
            return this;
        }

        public QueryResponse build() {
            return new QueryResponse(answer, citations, sources, confidenceScore, dataSources);
        }
    }
}
