package com.genops.ai.repository;

import com.genops.ai.dto.OpenAiRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ChatMemoryRepository {

    private final ReactiveRedisTemplate<String, Object> redisTemplate;

    @Value("${ai.memory.max-messages}")
    private int maxMessages;

    @Value("${ai.memory.ttl-hours}")
    private int ttlHours;

    private static final String KEY_PREFIX = "chat:memory:";

    public Mono<List<OpenAiRequest.Message>> getHistory(String conversationId) {
        String key = KEY_PREFIX + conversationId;
        return redisTemplate.opsForList().range(key, 0, -1)
                .map(obj -> (OpenAiRequest.Message) obj)
                .collectList()
                .defaultIfEmpty(new ArrayList<>());
    }

    public Mono<Void> saveMessage(String conversationId, OpenAiRequest.Message message) {
        String key = KEY_PREFIX + conversationId;
        return redisTemplate.opsForList().rightPush(key, message)
                .flatMap(size -> {
                    if (size > maxMessages) {
                        return redisTemplate.opsForList().leftPop(key).then();
                    }
                    return Mono.empty();
                })
                .then(redisTemplate.expire(key, Duration.ofHours(ttlHours)))
                .then();
    }

    public Mono<Boolean> clearHistory(String conversationId) {
        return redisTemplate.delete(KEY_PREFIX + conversationId).map(count -> count > 0);
    }
}
