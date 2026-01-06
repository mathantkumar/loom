package com.loom.sentinel.diagnosis.service;

import com.loom.incident.domain.Incident;
import com.loom.incident.service.IncidentService;
import com.loom.sentinel.diagnosis.model.DiagnosisEvent;
import com.loom.sentinel.log.model.LogAnalysisResult;
import com.loom.sentinel.log.model.LogAnalysisResult;
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
    private final com.loom.incident_intelligence.service.OllamaClient ollamaClient;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public SentinelDiagnosisService(LogIntelligenceService logIntelligenceService,
            IncidentService incidentService,
            com.loom.incident_intelligence.service.OllamaClient ollamaClient) {
        this.logIntelligenceService = logIntelligenceService;
        this.incidentService = incidentService;
        this.ollamaClient = ollamaClient;
    }

    public SseEmitter runDiagnosis(String incidentId) {
        SseEmitter emitter = new SseEmitter(300_000L); // 5 minutes timeout

        executor.submit(() -> {
            try {
                // 1. Initial Handshake
                emit(emitter, "STEP", "Initializing Sentinel Diagnosis AI...");
                Thread.sleep(800); // Pacing

                // 2. Fetch Context
                emit(emitter, "STEP", "Fetching incident context and time windows...");
                Incident incident = incidentService.getIncidentById(incidentId);
                if (incident == null) {
                    emit(emitter, "ERROR", "Incident not found.");
                    emitter.complete();
                    return;
                }

                String serviceName = incident.getService();
                Instant incidentTime = incident.getCreatedAt();
                Thread.sleep(1000); // Pacing

                // 3. Analyze Logs (Pre-processing)
                emit(emitter, "STEP", "Scanning correlation logs for service: " + serviceName);

                // Window: 30 mins before to 10 mins after
                Instant start = incidentTime.minus(30, ChronoUnit.MINUTES);
                Instant end = incidentTime.plus(10, ChronoUnit.MINUTES);

                LogAnalysisResult analysis = logIntelligenceService.analyzeLogs(serviceName, start, end);
                Thread.sleep(1500); // Simulate scanning complexity
                int patternCount = analysis.getPatterns().size();

                if (patternCount == 0) {
                    String debugMsg = String.format("No logs found in window %s to %s for service %s.", start, end,
                            serviceName);
                    emit(emitter, "INFO", debugMsg);
                    emit(emitter, "CONCLUSION", "Diagnosis Complete: Insufficient data.");
                    emitter.complete();
                    return;
                }

                emit(emitter, "INSIGHT", "Identified " + patternCount + " distinct log patterns. Analyzing with AI...",
                        analysis);

                // 4. LLM Diagnosis
                emit(emitter, "STEP", "Streaming AI Analysis...");

                // Build Prompt
                StringBuilder prompt = new StringBuilder();
                prompt.append("You are Sentinel, an advanced SRE AI. Analyze these log patterns for service '")
                        .append(serviceName).append("' around the time of an incident.\n\n");

                prompt.append("Log Patterns:\n");
                for (com.loom.sentinel.log.model.LogAnalysisResult.LogPattern p : analysis.getPatterns()) {
                    prompt.append(String.format("- [%s] Count: %d | Signature: %s\n",
                            p.isError() ? "ERROR" : "INFO", p.getCount(), p.getSignature()));
                }

                prompt.append(
                        "\nTask: Identify the root cause. Be concise, technical, and cite specific patterns. Start your response immediately.");

                // Call LLM
                emit(emitter, "STREAM", ""); // Initialize stream UI

                ollamaClient.streamChat(java.util.List.of(
                        new com.loom.incident_intelligence.service.OllamaClient.Message("user", prompt.toString())))
                        .subscribe(
                                token -> emit(emitter, "STREAM", token),
                                error -> {
                                    logger.error("LLM Stream error", error);
                                    emit(emitter, "ERROR", "AI Analysis failed: " + error.getMessage());
                                    emitter.completeWithError(error);
                                },
                                () -> {
                                    emit(emitter, "CONCLUSION", "Diagnosis Complete.");
                                    emitter.complete();
                                });

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
