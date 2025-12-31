package com.loom.integration.git.search;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.WriteTypeHint;

import java.time.Instant;
import java.util.List;

@Document(indexName = "commits", writeTypeHint = WriteTypeHint.FALSE)
public class CommitDocument {

    @Id
    private String sha;

    @Field(type = FieldType.Text)
    private String message;

    @Field(type = FieldType.Keyword)
    private String author;

    @Field(type = FieldType.Date)
    private Instant timestamp;

    @Field(type = FieldType.Text)
    private List<String> filePaths;

    @Field(type = FieldType.Keyword)
    private String repoName;

    // We use dense_vector type in mapping, but here usually List<Double> or
    // double[]
    @Field(type = FieldType.Dense_Vector, dims = 1536)
    private List<Double> embedding;

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

    public List<String> getFilePaths() {
        return filePaths;
    }

    public void setFilePaths(List<String> filePaths) {
        this.filePaths = filePaths;
    }

    public String getRepoName() {
        return repoName;
    }

    public void setRepoName(String repoName) {
        this.repoName = repoName;
    }

    public List<Double> getEmbedding() {
        return embedding;
    }

    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
    }
}
