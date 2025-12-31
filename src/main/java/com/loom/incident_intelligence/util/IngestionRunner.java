package com.loom.incident_intelligence.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loom.incident_intelligence.model.ChunkMetadata;
import com.loom.incident_intelligence.service.EmbeddingService;
import com.loom.incident_intelligence.service.RetrievalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.ComponentScan;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@ComponentScan(basePackages = "com.loom")
@SpringBootApplication
public class IngestionRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(IngestionRunner.class);

    private final RetrievalService retrievalService;
    private final EmbeddingService embeddingService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public IngestionRunner(RetrievalService retrievalService, EmbeddingService embeddingService) {
        this.retrievalService = retrievalService;
        this.embeddingService = embeddingService;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting Ingestion...");

        File incidentDir = new File("src/main/resources/incidents");
        if (!incidentDir.exists() || !incidentDir.isDirectory()) {
            incidentDir.mkdirs();
            log.warn("Created incidents directory at {}. Please drop JSON files there and re-run.",
                    incidentDir.getAbsolutePath());
            return;
        }

        File[] files = incidentDir.listFiles((dir, name) -> name.endsWith(".json"));
        if (files == null || files.length == 0) {
            log.info("No JSON files found in {}.", incidentDir.getAbsolutePath());
            return;
        }

        for (File file : files) {
            log.info("Processing file: {}", file.getName());
            try {
                List<RawIncident> rawIncidents = objectMapper.readValue(file, new TypeReference<List<RawIncident>>() {
                });
                for (RawIncident raw : rawIncidents) {
                    processIncident(raw);
                }
            } catch (IOException e) {
                log.error("Failed to read file {}", file.getName(), e);
            }
        }

        retrievalService.save();
        log.info("Ingestion Complete. Index saved.");
    }

    private void processIncident(RawIncident raw) {
        String text = raw.getText();
        if (text == null)
            return;

        String[] sentences = text.split("(?<=[.!?])\\s+");
        StringBuilder chunk = new StringBuilder();

        for (String sentence : sentences) {
            if (TokenizerUtil.countTokens(chunk.toString() + sentence) > 300) {
                saveChunk(raw, chunk.toString());
                chunk = new StringBuilder();
            }
            chunk.append(sentence).append(" ");
        }
        if (chunk.length() > 0) {
            saveChunk(raw, chunk.toString());
        }
    }

    private void saveChunk(RawIncident raw, String text) {
        float[] embedding = embeddingService.embed(text);
        ChunkMetadata meta = ChunkMetadata.builder()
                .id(UUID.randomUUID().toString())
                .source(raw.getSource())
                .title(raw.getTitle())
                .created(raw.getCreated())
                .tags(raw.getTags())
                .text(text.trim())
                .build();

        retrievalService.addChunk(meta, embedding);
        log.info("Indexed chunk for incident: {}", raw.getTitle());
    }

    // Manual POJO
    public static class RawIncident {
        private String id;
        private String source;
        private String title;
        private String text;
        private String created;
        private List<String> tags;

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
    }
}
