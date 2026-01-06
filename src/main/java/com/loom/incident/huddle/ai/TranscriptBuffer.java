package com.loom.incident.huddle.ai;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TranscriptBuffer {

    // Map<IncidentId, StringBuilder>
    private final Map<String, StringBuilder> buffers = new ConcurrentHashMap<>();

    // Max buffer size before we might want to truncate (approx 10k chars for now)
    private static final int MAX_BUFFER_SIZE = 10000;

    public void append(String incidentId, String text) {
        buffers.compute(incidentId, (k, v) -> {
            if (v == null) {
                v = new StringBuilder();
            }
            // Add space if needed
            if (v.length() > 0 && v.charAt(v.length() - 1) != ' ') {
                v.append(" ");
            }
            v.append(text);

            // Simple truncation strategy for MVP: Keep last MAX_BUFFER_SIZE
            if (v.length() > MAX_BUFFER_SIZE) {
                return new StringBuilder(v.substring(v.length() - MAX_BUFFER_SIZE));
            }
            return v;
        });
    }

    public String getTranscript(String incidentId) {
        StringBuilder sb = buffers.get(incidentId);
        return sb != null ? sb.toString() : "";
    }

    public void clear(String incidentId) {
        buffers.remove(incidentId);
    }
}
