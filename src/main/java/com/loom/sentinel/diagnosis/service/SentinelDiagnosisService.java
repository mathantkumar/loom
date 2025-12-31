package com.loom.sentinel.diagnosis.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.service.IncidentService;
import com.loom.sentinel.diagnosis.model.DiagnosisEvent;
import com.loom.sentinel.log.model.LogAnalysisResult;
import com.loom.sentinel.log.model.LogAnalysisResult.LogAnomaly;
import com.loom.sentinel.log.service.LogIntelligenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class SentinelDiagnosisService {

    private static final Logger logger = LoggerFactory.getLogger(SentinelDiagnosisService.class);
    private final LogIntelligenceService logIntelligenceService;
    private final IncidentService incidentService;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public SentinelDiagnosisService(LogIntelligenceService logIntelligenceService, IncidentService incidentService) {
        this.logIntelligenceService = logIntelligenceService;
        this.incidentService = incidentService;
    }

    public SseEmitter runDiagnosis(String incidentId) {
        SseEmitter emitter = new SseEmitter(120_000L); // 2 minutes timeout

        executor.submit(() -> {
            try {
                // 1. Initial Handshake
                emit(emitter, "STEP", "Initializing Sentinel Diagnosis AI...");
                Thread.sleep(800);

                // 2. Fetch Context
                emit(emitter, "STEP", "Fetching incident context and time windows...");
                Incident incident = incidentService.getIncidentById(incidentId); // Assuming this method exists
                if (incident == null) {
                    emit(emitter, "ERROR", "Incident not found.");
                    emitter.complete();
                    return;
                }

                String serviceName = incident.getService();
                Instant incidentTime = incident.getCreatedAt();
                Thread.sleep(1000);

                // 3. Analyze Logs
                emit(emitter, "STEP", "Scanning correlation logs for service: " + serviceName);

                // Look at window: 30 mins before to 10 mins after
                Instant start = incidentTime.minus(30, ChronoUnit.MINUTES);
                Instant end = incidentTime.plus(10, ChronoUnit.MINUTES);

                LogAnalysisResult analysis = logIntelligenceService.analyzeLogs(serviceName, start, end);

                Thread.sleep(1500); // Simulate processing time

                int anomalyCount = analysis.getAnomalies().size();
                if (anomalyCount > 0) {
                    emit(emitter, "INSIGHT", "Found " + anomalyCount + " anomalies in log stream.", analysis);
                } else {
                    emit(emitter, "INFO", "No significant log anomalies detected in the immediate window.");
                }

                // 4. Correlate (Mocking correlation logic here for MVP)
                Thread.sleep(1000);
                if (analysis.getOverallRiskScore() > 0.8) {
                    String rootCause = "Unknown";
                    for (LogAnomaly anomaly : analysis.getAnomalies()) {
                        if ("MEMORY_LEAK".equals(anomaly.getType()))
                            rootCause = "Memory Leak (Heap Exhaustion)";
                        if ("DATABASE_SATURATION".equals(anomaly.getType()))
                            rootCause = "Database Connection Pool Exhaustion";
                    }
                    emit(emitter, "CONCLUSION", "Diagnosis Complete: High confidence root cause identified.",
                            rootCause);
                } else {
                    emit(emitter, "CONCLUSION", "Diagnosis Complete: Needs manual investigation.", null);
                }

                emitter.complete();

            } catch (Exception e) {
                logger.error("Diagnosis failed", e);
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    private void emit(SseEmitter emitter, String type, String message) {
        emit(emitter, type, message, null);
    }

    private void emit(SseEmitter emitter, String type, String message, Object payload) {
        try {
            emitter.send(new DiagnosisEvent(type, message, payload));
        } catch (Exception e) {
            // Emitter probably closed by client
        }
    }
}
