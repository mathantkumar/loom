package com.loom.incident.huddle.ai;

import com.loom.incident.huddle.HuddleSocketHandler;
import com.loom.incident_intelligence.service.OllamaClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class HuddleAIService {

    private static final Logger log = LoggerFactory.getLogger(HuddleAIService.class);

    private final TranscriptBuffer transcriptBuffer;
    private final OllamaClient ollamaClient;
    private final HuddleSocketHandler socketHandler;
    private final ObjectMapper objectMapper;

    // We inject SocketHandler lazily to avoid circular dependency if SocketHandler
    // uses this service
    public HuddleAIService(TranscriptBuffer transcriptBuffer,
            OllamaClient ollamaClient,
            @Lazy HuddleSocketHandler socketHandler,
            ObjectMapper objectMapper) {
        this.transcriptBuffer = transcriptBuffer;
        this.ollamaClient = ollamaClient;
        this.socketHandler = socketHandler;
        this.objectMapper = objectMapper;
    }

    @Async
    public void processTranscript(String incidentId, String text, String senderId) {
        transcriptBuffer.append(incidentId, text);

        // For MVP: Log it. In Phase 2, we will buffer and trigger analysis.
        log.info("Received transcript for incident {}: {}", incidentId, text);

        // check for keywords for "Guardrails" (Phase 3 prototype)
        if (text.toLowerCase().contains("restart") || text.toLowerCase().contains("drop")) {
            broadcastRiskWarning(incidentId, "Detected risky command usage: " + text);
        }
    }

    private void broadcastRiskWarning(String incidentId, String warning) {
        try {
            Map<String, Object> payload = Map.of(
                    "type", "AI_INSIGHT",
                    "incidentId", incidentId,
                    "insightType", "RISK",
                    "message", warning,
                    "confidence", 0.95);
            String json = objectMapper.writeValueAsString(payload);
            // We need a public method in socketHandler to broadcast.
            // Since broadcastToRoom is private, we'll need to update SocketHandler or use
            // reflection/public wrapper.
            // For now, let's assume we'll add a public broadcast method to SocketHandler.
            socketHandler.broadcastToRoomPublic(incidentId, new TextMessage(json));
        } catch (Exception e) {
            log.error("Failed to broadcast AI warning", e);
        }
    }
}
