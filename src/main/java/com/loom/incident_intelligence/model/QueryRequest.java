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

    private java.util.UUID sessionId;

    public java.util.UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(java.util.UUID sessionId) {
        this.sessionId = sessionId;
    }
}
