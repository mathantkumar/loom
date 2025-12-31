package com.loom.incident_intelligence.model;

import java.util.List;

public class ChunkMetadata {
    private String id;
    private String source; // ticket, log, cve, runbook
    private String title;
    private String text;
    private String created;
    private List<String> tags;

    public ChunkMetadata() {
    }

    public ChunkMetadata(String id, String source, String title, String text, String created, List<String> tags) {
        this.id = id;
        this.source = source;
        this.title = title;
        this.text = text;
        this.created = created;
        this.tags = tags;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public static class Builder {
        private String id;
        private String source;
        private String title;
        private String text;
        private String created;
        private List<String> tags;

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder source(String source) {
            this.source = source;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder text(String text) {
            this.text = text;
            return this;
        }

        public Builder created(String created) {
            this.created = created;
            return this;
        }

        public Builder tags(List<String> tags) {
            this.tags = tags;
            return this;
        }

        public ChunkMetadata build() {
            return new ChunkMetadata(id, source, title, text, created, tags);
        }
    }
}
