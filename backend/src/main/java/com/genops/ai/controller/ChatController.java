package com.genops.ai.controller;

import com.genops.ai.dto.ChatRequest;
import com.genops.ai.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping(value = "/{conversationId}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@PathVariable String conversationId, @RequestBody ChatRequest request) {
        log.info("Received streaming chat request for session: {}", conversationId);
        return chatService.streamChat(conversationId, request);
    }

    @DeleteMapping("/{conversationId}")
    public Mono<Void> clearSession(@PathVariable String conversationId) {
        log.info("Clearing chat session: {}", conversationId);
        return chatService.clearSession(conversationId);
    }
}
