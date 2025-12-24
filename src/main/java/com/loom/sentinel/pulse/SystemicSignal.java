package com.loom.sentinel.pulse;

public class SystemicSignal {
    private String id;
    private String title;
    private String description;
    private String type; // e.g., "CORRELATION", "PREDICTION", "WARNING"
    private String confidence; // "HIGH", "MEDIUM", "LOW"

    public SystemicSignal(String id, String title, String description, String type, String confidence) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.confidence = confidence;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

    public String getConfidence() {
        return confidence;
    }
}
