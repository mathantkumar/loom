package com.loom.integration.git;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "git_commits")
public class Commit {

    @Id
    private String sha; // SHA is unique enough per repo, but globally? Maybe Composite Key or ID. Using
                        // SHA as ID for simplicity assuming one repo context or unique SHA. Ensuring
                        // uniqueness via composite if needed, but SHA collisions are rare. Let's stick
                        // to SHA but maybe add repo dependency if we want to be strict. Actually, SHA
                        // is unique.

    @Column(columnDefinition = "TEXT")
    private String message;

    private String author;

    private Instant timestamp;

    @ElementCollection
    @CollectionTable(name = "commit_files", joinColumns = @JoinColumn(name = "commit_sha"))
    @Column(name = "file_path")
    private List<String> filesChanged = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    // Getters and Setters

    public String getSha() {
        return sha;
    }

    public void setSha(String sha) {
        this.sha = sha;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public List<String> getFilesChanged() {
        return filesChanged;
    }

    public void setFilesChanged(List<String> filesChanged) {
        this.filesChanged = filesChanged;
    }

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }
}
