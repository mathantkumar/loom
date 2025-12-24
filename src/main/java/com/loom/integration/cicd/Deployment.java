package com.loom.integration.cicd;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "deployments")
public class Deployment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String repoName;

    @Column(nullable = false)
    private String serviceName;

    private String branch;

    @Column(name = "commit_hash")
    private String commitHash;

    @Column(name = "commit_message", columnDefinition = "TEXT")
    private String commitMessage;

    private String author;

    @Column(nullable = false)
    private String environment; // prod, staging

    @Column(name = "deployment_time", nullable = false)
    private Instant deploymentTime;

    @Column(nullable = false)
    private String status; // success, failure, rollback

    public Deployment() {
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRepoName() {
        return repoName;
    }

    public void setRepoName(String repoName) {
        this.repoName = repoName;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
    }

    public String getCommitMessage() {
        return commitMessage;
    }

    public void setCommitMessage(String commitMessage) {
        this.commitMessage = commitMessage;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public Instant getDeploymentTime() {
        return deploymentTime;
    }

    public void setDeploymentTime(Instant deploymentTime) {
        this.deploymentTime = deploymentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
