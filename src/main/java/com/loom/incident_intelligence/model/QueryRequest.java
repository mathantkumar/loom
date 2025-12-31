package com.loom.incident_intelligence.model;

public class QueryRequest {
    private String question;
    private boolean stream;

    public QueryRequest() {
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public boolean isStream() {
        return stream;
    }

    public void setStream(boolean stream) {
        this.stream = stream;
    }
}
