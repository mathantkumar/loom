package com.loom.integration.git;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "git_pull_requests")
public class PullRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long internalId;

    private String providerId; // e.g. "123" from GitHub

    private String title;

    private String author;

    private Instant mergedAt;

    @ManyToOne
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    @ManyToMany
    @JoinTable(name = "pr_commits", joinColumns = @JoinColumn(name = "pr_id"), inverseJoinColumns = @JoinColumn(name = "commit_sha"))
    private List<Commit> commits = new ArrayList<>();

    // Getters and Setters

    public Long getInternalId() {
        return internalId;
    }

    public void setInternalId(Long internalId) {
        this.internalId = internalId;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Instant getMergedAt() {
        return mergedAt;
    }

    public void setMergedAt(Instant mergedAt) {
        this.mergedAt = mergedAt;
    }

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public List<Commit> getCommits() {
        return commits;
    }

    public void setCommits(List<Commit> commits) {
        this.commits = commits;
    }
}
