package com.loom.incident.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.loom.integration.cicd.Deployment;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @com.fasterxml.jackson.annotation.JsonProperty("uuid") // Expose internal UUID as "uuid"
    private UUID id;

    @Column(name = "public_id", unique = true, nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("id") // Expose public ID as "id"
    private String publicId;

    @Column(name = "sequence_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    // We add this annotation just to trigger Hibernate schema generation for the
    // sequence
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "incident_id_seq_gen")
    @SequenceGenerator(name = "incident_id_seq_gen", sequenceName = "incident_id_seq", allocationSize = 1)
    private Long sequenceId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status;

    @Column(nullable = false)
    private String service;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "root_cause", columnDefinition = "TEXT")
    private String rootCause;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type")
    private IssueType issueType;

    @Column(name = "assignee_name")
    private String assigneeName;

    @Column(name = "assignee_avatar")
    private String assigneeAvatar;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Evidence> evidence = new ArrayList<>();

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "incident_deployments", joinColumns = @JoinColumn(name = "incident_id"), inverseJoinColumns = @JoinColumn(name = "deployment_id"))
    private List<Deployment> correlatedDeployments = new ArrayList<>();

    @Column(name = "deployment_insight", columnDefinition = "TEXT")
    private String deploymentInsight;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore // Ignore to avoid deep nesting or cycles if redundant
    private List<com.loom.sentinel.code.IncidentCodeCorrelation> codeCorrelations = new ArrayList<>();

    // Default constructor
    public Incident() {
    }

    // Pre-persist to set createdAt
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    // Getters and Setters

    @Transient
    public java.util.Map<String, String> getAssignee() {
        if (assigneeName == null) {
            return null;
        }
        java.util.Map<String, String> map = new java.util.HashMap<>();
        map.put("name", assigneeName);
        if (assigneeAvatar != null) {
            map.put("avatarUrl", assigneeAvatar);
        }
        return map;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    public String getAssigneeAvatar() {
        return assigneeAvatar;
    }

    public void setAssigneeAvatar(String assigneeAvatar) {
        this.assigneeAvatar = assigneeAvatar;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getRootCause() {
        return rootCause;
    }

    public void setRootCause(String rootCause) {
        this.rootCause = rootCause;
    }

    public IssueType getIssueType() {
        return issueType;
    }

    public void setIssueType(IssueType issueType) {
        this.issueType = issueType;
    }

    public List<Evidence> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<Evidence> evidence) {
        this.evidence = evidence;
    }

    public String getPublicId() {
        if (publicId == null && id != null) {
            return id.toString();
        }
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public Long getSequenceId() {
        return sequenceId;
    }

    public void setSequenceId(Long sequenceId) {
        this.sequenceId = sequenceId;
    }

    public List<Deployment> getCorrelatedDeployments() {
        return correlatedDeployments;
    }

    public void setCorrelatedDeployments(List<Deployment> correlatedDeployments) {
        this.correlatedDeployments = correlatedDeployments;
    }

    public String getDeploymentInsight() {
        return deploymentInsight;
    }

    public void setDeploymentInsight(String deploymentInsight) {
        this.deploymentInsight = deploymentInsight;
    }

    public List<com.loom.sentinel.code.IncidentCodeCorrelation> getCodeCorrelations() {
        return codeCorrelations;
    }

    public void setCodeCorrelations(List<com.loom.sentinel.code.IncidentCodeCorrelation> codeCorrelations) {
        this.codeCorrelations = codeCorrelations;
    }

    @Column(name = "recurring")
    private Boolean recurring = false;

    @Column(name = "recurring_count")
    private Integer recurringCount = 0;

    @Column(name = "first_seen")
    private Instant firstSeen;

    public Boolean isRecurring() {
        return recurring;
    }

    public void setRecurring(Boolean recurring) {
        this.recurring = recurring;
    }

    public Integer getRecurringCount() {
        return recurringCount;
    }

    public void setRecurringCount(Integer recurringCount) {
        this.recurringCount = recurringCount;
    }

    public Instant getFirstSeen() {
        return firstSeen;
    }

    public void setFirstSeen(Instant firstSeen) {
        this.firstSeen = firstSeen;
    }
}
