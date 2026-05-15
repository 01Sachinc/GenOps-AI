package com.genops.ai.repository;

import com.genops.ai.dto.OpenAiRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Repository
public class ChatMemoryRepository {

    private final Map<String, List<OpenAiRequest.Message>> memory = new ConcurrentHashMap<>();

    @Value("${ai.memory.max-messages}")
    private int maxMessages;

    public Mono<List<OpenAiRequest.Message>> getHistory(String conversationId) {
        return Mono.just(memory.getOrDefault(conversationId, new ArrayList<>()));
    }

    public Mono<Void> saveMessage(String conversationId, OpenAiRequest.Message message) {
        return Mono.fromRunnable(() -> {
            List<OpenAiRequest.Message> history = memory.computeIfAbsent(conversationId, k -> new ArrayList<>());
            history.add(message);
            if (history.size() > maxMessages) {
                history.remove(0);
            }
        });
    }

    public Mono<Boolean> clearHistory(String conversationId) {
        return Mono.fromCallable(() -> memory.remove(conversationId) != null);
    }
}
