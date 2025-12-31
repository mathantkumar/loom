package com.loom.sentinel.diagnosis.model;

public class DiagnosisEvent {
    private String type; // STEP, INSIGHT, TIMELINE, ERROR, DONE
    private String message;
    private Object payload; // Can be LogAnalysisResult, or specific Insight details

    public DiagnosisEvent(String type, String message, Object payload) {
        this.type = type;
        this.message = message;
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
