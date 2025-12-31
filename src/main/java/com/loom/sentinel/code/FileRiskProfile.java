package com.loom.sentinel.code;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "file_risk_profiles")
public class FileRiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String repositoryName;

    @Column(nullable = false)
    private String filePath;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private Integer incidentCount;

    private Instant lastUpdated;

    public enum RiskLevel {
        HIGH, MEDIUM, LOW
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRepositoryName() {
        return repositoryName;
    }

    public void setRepositoryName(String repositoryName) {
        this.repositoryName = repositoryName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Integer getIncidentCount() {
        return incidentCount;
    }

    public void setIncidentCount(Integer incidentCount) {
        this.incidentCount = incidentCount;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
