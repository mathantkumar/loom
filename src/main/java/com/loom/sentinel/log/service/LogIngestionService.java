package com.loom.sentinel.log.service;

import com.loom.sentinel.log.model.LogEntry;
import com.loom.sentinel.log.repository.LogRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class LogIngestionService {

    private final LogRepository logRepository;
    private final SampleLogGeneratorService sampleLogGeneratorService;

    public LogIngestionService(LogRepository logRepository, SampleLogGeneratorService sampleLogGeneratorService) {
        this.logRepository = logRepository;
        this.sampleLogGeneratorService = sampleLogGeneratorService;
    }

    public void ingest(LogEntry entry) {
        if (entry.getId() == null) {
            entry.setId(UUID.randomUUID().toString());
        }
        if (entry.getTimestamp() == null) {
            entry.setTimestamp(Instant.now());
        }
        logRepository.save(entry);
    }

    @Async
    public void ingestBatch(List<LogEntry> entries) {
        entries.forEach(e -> {
            if (e.getId() == null)
                e.setId(UUID.randomUUID().toString());
            if (e.getTimestamp() == null)
                e.setTimestamp(Instant.now());
        });
        logRepository.saveAll(entries);
    }

    public void triggerSampleGeneration() {
        sampleLogGeneratorService.generateLogs(48);
    }
}
