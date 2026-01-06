package com.loom.incident_intelligence.service;

import com.loom.incident_intelligence.model.ChatMessage;
import com.loom.incident_intelligence.model.ChatSession;
import com.loom.incident_intelligence.repository.ChatMessageRepository;
import com.loom.incident_intelligence.repository.ChatSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatService(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatSession createSession(String title) {
        return chatSessionRepository.save(new ChatSession(title));
    }

    public ChatSession getSession(UUID sessionId) {
        return chatSessionRepository.findById(sessionId).orElse(null);
    }

    public List<ChatSession> getAllSessions() {
        return chatSessionRepository.findAllByOrderByCreatedAtDesc();
    }

    public ChatMessage saveMessage(UUID sessionId, String role, String content) {
        return chatMessageRepository.save(new ChatMessage(sessionId, role, content));
    }

    public List<ChatMessage> getMessages(UUID sessionId) {
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    @Transactional
    public void deleteSession(UUID sessionId) {
        // Cascade delete should handle messages if configured, but let's be safe or
        // rely on DB constraints
        // For simple MVP we just delete the session. Ideally we delete messages first.
        List<ChatMessage> messages = chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        chatMessageRepository.deleteAll(messages);
        chatSessionRepository.deleteById(sessionId);
    }
}
