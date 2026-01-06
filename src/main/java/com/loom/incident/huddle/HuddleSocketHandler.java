package com.loom.incident.huddle;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class HuddleSocketHandler extends TextWebSocketHandler {

    // Map<IncidentId, Set<Session>>
    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    // Map<SessionId, IncidentId> to track which room a session is in for cleanup
    private final Map<String, String> sessionRoomMap = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final com.loom.incident.huddle.ai.HuddleAIService huddleAIService;

    public HuddleSocketHandler(com.loom.incident.huddle.ai.HuddleAIService huddleAIService) {
        this.huddleAIService = huddleAIService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Connection established, waiting for JOIN message to assign room
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
            String type = (String) payload.get("type");
            String incidentId = (String) payload.get("incidentId");

            if ("JOIN".equals(type)) {
                handleJoin(session, incidentId, payload);
            } else if ("TRANSCRIPT".equals(type)) {
                String text = (String) payload.get("text");
                String senderId = (String) payload.get("senderId");
                huddleAIService.processTranscript(incidentId, text, senderId);
            } else if (incidentId != null) {
                // For all other messages, broadcast to the room
                broadcastToRoom(session, incidentId, message);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleJoin(WebSocketSession session, String incidentId, Map<String, Object> payload) {
        rooms.computeIfAbsent(incidentId, k -> Collections.synchronizedSet(ConcurrentHashMap.newKeySet())).add(session);
        sessionRoomMap.put(session.getId(), incidentId);

        // Notify others in the room that a new user joined
        // We can just rebroadcast the JOIN message so others can react (e.g. initiate
        // WebRTC offer)
        broadcastToRoom(session, incidentId, new TextMessage(toJson(payload)));

        // Send a simpler ACK or "EXISTING_PARTICIPANTS" if needed,
        // but for a mesh, the new joiner might wait for offers or send offers.
        // Usually, existing peers see "USER_JOINED" and send OFFERs to the new peer.
    }

    public void broadcastToRoomPublic(String incidentId, TextMessage message) {
        broadcastToRoom(null, incidentId, message);
    }

    private void broadcastToRoom(WebSocketSession sender, String incidentId, TextMessage message) {
        Set<WebSocketSession> roomSessions = rooms.get(incidentId);
        if (roomSessions != null) {
            synchronized (roomSessions) {
                for (WebSocketSession s : roomSessions) {
                    // If sender is null (system message) or s is not the sender, send message
                    if (s.isOpen() && (sender == null || !s.getId().equals(sender.getId()))) {
                        try {
                            s.sendMessage(message);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String incidentId = sessionRoomMap.remove(session.getId());
        if (incidentId != null) {
            Set<WebSocketSession> roomSessions = rooms.get(incidentId);
            if (roomSessions != null) {
                roomSessions.remove(session);
                if (roomSessions.isEmpty()) {
                    rooms.remove(incidentId);
                } else {
                    // Notify others of disconnection
                    Map<String, Object> leaveMessage = Map.of(
                            "type", "LEAVE",
                            "incidentId", incidentId,
                            "sessionId", session.getId());
                    broadcastToRoom(session, incidentId, new TextMessage(toJson(leaveMessage)));
                }
            }
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
