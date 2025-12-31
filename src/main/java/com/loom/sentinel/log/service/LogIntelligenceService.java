package com.loom.sentinel.log.service;

import com.loom.sentinel.log.model.LogAnalysisResult;
import com.loom.sentinel.log.model.LogAnalysisResult.LogAnomaly;
import com.loom.sentinel.log.model.LogAnalysisResult.LogPattern;
import com.loom.sentinel.log.model.LogEntry;
import com.loom.sentinel.log.repository.LogRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LogIntelligenceService {

    private final LogRepository logRepository;

    public LogIntelligenceService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public LogAnalysisResult analyzeLogs(String service, Instant start, Instant end) {
        List<LogEntry> logs = logRepository.findByServiceAndTimestampBetween(service, start, end);
        LogAnalysisResult result = new LogAnalysisResult();

        if (logs.isEmpty()) {
            result.setOverallRiskScore(0.0);
            result.setPatterns(Collections.emptyList());
            result.setAnomalies(Collections.emptyList());
            return result;
        }

        // 1. Cluster Patterns
        Map<String, List<LogEntry>> clusters = clusterLogs(logs);
        List<LogPattern> patterns = new ArrayList<>();

        for (Map.Entry<String, List<LogEntry>> entry : clusters.entrySet()) {
            String signature = entry.getKey();
            List<LogEntry> clusterLogs = entry.getValue();
            boolean isError = clusterLogs.stream().anyMatch(l -> "ERROR".equals(l.getLevel()));

            patterns.add(new LogPattern(
                    signature,
                    clusterLogs.size(),
                    clusterLogs.get(0).getMessage(),
                    clusterLogs.stream().limit(5).map(LogEntry::getId).collect(Collectors.toList()),
                    isError));
        }

        // Sort patterns by count (desc) but prioritize errors
        patterns.sort((p1, p2) -> {
            if (p1.isError() && !p2.isError())
                return -1;
            if (!p1.isError() && p2.isError())
                return 1;
            return Integer.compare(p2.getCount(), p1.getCount());
        });

        result.setPatterns(patterns);

        // 2. Detect Anomalies
        List<LogAnomaly> anomalies = detectAnomalies(logs, patterns);
        result.setAnomalies(anomalies);

        // 3. Calculate Risk Score
        double risk = anomalies.stream().mapToDouble(LogAnomaly::getConfidence).max().orElse(0.0);
        if (patterns.stream().anyMatch(LogPattern::isError)) {
            risk = Math.max(risk, 0.7);
        }
        result.setOverallRiskScore(risk);

        return result;
    }

    private Map<String, List<LogEntry>> clusterLogs(List<LogEntry> logs) {
        Map<String, List<LogEntry>> clusters = new HashMap<>();

        for (LogEntry log : logs) {
            String signature = generateSignature(log);
            clusters.computeIfAbsent(signature, k -> new ArrayList<>()).add(log);
        }
        return clusters;
    }

    private String generateSignature(LogEntry log) {
        // Simple heuristic: remove UUIDs, timestamps, numbers to find static template
        String msg = log.getMessage();

        // Remove UUIDs
        msg = msg.replaceAll("[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}", "{UUID}");

        // Remove typical ID patterns (simple digit sequences > 3 chars)
        msg = msg.replaceAll("\\b\\d{4,}\\b", "{ID}");

        // If stack trace exists, use the exception class as signature
        if (log.getStackTrace() != null && !log.getStackTrace().isEmpty()) {
            String firstLine = log.getStackTrace().split("\n")[0];
            // dynamic part removal
            return firstLine.replaceAll(":[^\\n]*", ""); // Just the Exception Class
        }

        // Truncate if too long to aggregate
        if (msg.length() > 50) {
            msg = msg.substring(0, 50) + "...";
        }

        return log.getLevel() + ": " + msg;
    }

    private List<LogAnomaly> detectAnomalies(List<LogEntry> logs, List<LogPattern> patterns) {
        List<LogAnomaly> anomalies = new ArrayList<>();

        // Rule 1: High Error Rate
        long errorCount = logs.stream().filter(l -> "ERROR".equals(l.getLevel())).count();
        if (errorCount > 0) {
            double errorRate = (double) errorCount / logs.size();
            if (errorRate > 0.05) { // > 5% errors
                anomalies.add(new LogAnomaly(
                        "ERROR_SPIKE",
                        "Abnormal error rate detected: " + String.format("%.1f", errorRate * 100) + "%",
                        0.9));
            }
        }

        // Rule 2: Memory Issues
        boolean oomDetected = patterns.stream()
                .anyMatch(p -> p.getSignature().contains("OutOfMemoryError"));
        if (oomDetected) {
            anomalies.add(new LogAnomaly(
                    "MEMORY_LEAK",
                    "Pattern consistency with Memory Leak (OOM Detected)",
                    0.95));
        }

        // Rule 3: DB Issues
        boolean dbDetected = patterns.stream()
                .anyMatch(p -> p.getSignature().contains("ConnectionTimeoutException")
                        || p.getSignature().contains("HikariPool"));
        if (dbDetected) {
            anomalies.add(new LogAnomaly(
                    "DATABASE_SATURATION",
                    "Database connection pool exhaustion detected",
                    0.95));
        }

        return anomalies;
    }
}
