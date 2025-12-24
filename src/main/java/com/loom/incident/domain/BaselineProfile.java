package com.loom.incident.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "baseline_profiles", uniqueConstraints = @UniqueConstraint(columnNames = { "service_name", "severity" }))
public class BaselineProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    // e.g., "30d"
    @Column(name = "time_window")
    private String timeWindow;

    @Column(name = "median_resolution_seconds")
    private double medianResolutionTimeSeconds;

    @Column(name = "p90_resolution_seconds")
    private double p90ResolutionTimeSeconds;

    @Column(name = "escalation_rate")
    private double escalationRate;

    @Column(name = "recurrence_frequency")
    private double recurrenceFrequency;

    @Column(name = "embedding_centroid")
    private float[] embeddingCentroid;

    @Column(name = "last_updated", nullable = false)
    private Instant lastUpdated;

    @ElementCollection
    @CollectionTable(name = "baseline_common_issues", joinColumns = @JoinColumn(name = "baseline_id"))
    @Column(name = "issue_type")
    @Enumerated(EnumType.STRING)
    private List<IssueType> commonIssueTypes;

    public BaselineProfile() {
    }

    public BaselineProfile(String serviceName, Severity severity) {
        this.serviceName = serviceName;
        this.severity = severity;
        this.lastUpdated = Instant.now();
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public String getTimeWindow() {
        return timeWindow;
    }

    public void setTimeWindow(String timeWindow) {
        this.timeWindow = timeWindow;
    }

    public double getMedianResolutionTimeSeconds() {
        return medianResolutionTimeSeconds;
    }

    public void setMedianResolutionTimeSeconds(double medianResolutionTimeSeconds) {
        this.medianResolutionTimeSeconds = medianResolutionTimeSeconds;
    }

    public double getP90ResolutionTimeSeconds() {
        return p90ResolutionTimeSeconds;
    }

    public void setP90ResolutionTimeSeconds(double p90ResolutionTimeSeconds) {
        this.p90ResolutionTimeSeconds = p90ResolutionTimeSeconds;
    }

    public double getEscalationRate() {
        return escalationRate;
    }

    public void setEscalationRate(double escalationRate) {
        this.escalationRate = escalationRate;
    }

    public double getRecurrenceFrequency() {
        return recurrenceFrequency;
    }

    public void setRecurrenceFrequency(double recurrenceFrequency) {
        this.recurrenceFrequency = recurrenceFrequency;
    }

    public float[] getEmbeddingCentroid() {
        return embeddingCentroid;
    }

    public void setEmbeddingCentroid(float[] embeddingCentroid) {
        this.embeddingCentroid = embeddingCentroid;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public List<IssueType> getCommonIssueTypes() {
        return commonIssueTypes;
    }

    public void setCommonIssueTypes(List<IssueType> commonIssueTypes) {
        this.commonIssueTypes = commonIssueTypes;
    }

    @Override
    public String toString() {
        return "BaselineProfile{" +
                "id=" + id +
                ", serviceName='" + serviceName + '\'' +
                ", severity=" + severity +
                ", medianResolutionTimeSeconds=" + medianResolutionTimeSeconds +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
}
