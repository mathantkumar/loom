package com.loom.incident_intelligence.controller;

import com.loom.incident_intelligence.model.ChatMessage;
import com.loom.incident_intelligence.model.ChatSession;
import com.loom.incident_intelligence.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
@CrossOrigin(originPatterns = "*")
public class ChatHistoryController {

    private final ChatService chatService;

    public ChatHistoryController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/history")
    public List<ChatSession> getHistory() {
        return chatService.getAllSessions();
    }

    @GetMapping("/{sessionId}")
    public List<ChatMessage> getSessionMessages(@PathVariable UUID sessionId) {
        return chatService.getMessages(sessionId);
    }

    @DeleteMapping("/{sessionId}")
    public void deleteSession(@PathVariable UUID sessionId) {
        chatService.deleteSession(sessionId);
    }
}
