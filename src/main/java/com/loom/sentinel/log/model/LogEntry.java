package com.loom.sentinel.log.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;
import java.util.List;

@Document(indexName = "sentinel_logs")
public class LogEntry {

    @Id
    private String id;

    @Field(type = FieldType.Date)
    private Instant timestamp;

    @Field(type = FieldType.Keyword)
    private String service;

    @Field(type = FieldType.Keyword)
    private String level; // INFO, WARN, ERROR

    @Field(type = FieldType.Text)
    private String message;

    @Field(type = FieldType.Keyword)
    private String deploymentVersion;

    @Field(type = FieldType.Keyword)
    private String traceId;

    @Field(type = FieldType.Text)
    private String stackTrace;

    // For Vector Search (mocked or real)
    @Field(type = FieldType.Dense_Vector, dims = 384)
    private List<Double> embedding;

    public LogEntry() {
    }

    public LogEntry(String id, Instant timestamp, String service, String level, String message,
            String deploymentVersion, String traceId, String stackTrace) {
        this.id = id;
        this.timestamp = timestamp;
        this.service = service;
        this.level = level;
        this.message = message;
        this.deploymentVersion = deploymentVersion;
        this.traceId = traceId;
        this.stackTrace = stackTrace;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDeploymentVersion() {
        return deploymentVersion;
    }

    public void setDeploymentVersion(String deploymentVersion) {
        this.deploymentVersion = deploymentVersion;
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public String getStackTrace() {
        return stackTrace;
    }

    public void setStackTrace(String stackTrace) {
        this.stackTrace = stackTrace;
    }

    public List<Double> getEmbedding() {
        return embedding;
    }

    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
    }
}
