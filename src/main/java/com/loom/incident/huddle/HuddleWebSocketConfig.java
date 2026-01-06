package com.loom.incident.huddle;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class HuddleWebSocketConfig implements WebSocketConfigurer {

    private final HuddleSocketHandler huddleSocketHandler;

    public HuddleWebSocketConfig(HuddleSocketHandler huddleSocketHandler) {
        this.huddleSocketHandler = huddleSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // We use setAllowedOrigins("*") for MVP simplicity.
        // In production, this should be restricted to the actual frontend domain.
        registry.addHandler(huddleSocketHandler, "/huddle-ws")
                .setAllowedOrigins("*");
    }
}
