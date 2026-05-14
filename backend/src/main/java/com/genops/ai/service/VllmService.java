package com.genops.ai.service;

import com.genops.ai.dto.OpenAiRequest;
import com.genops.ai.dto.OpenAiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VllmService {

    private final WebClient aiWebClient;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Value("${ai.vllm.model}")
    private String model;

    @Value("${ai.vllm.timeout-seconds}")
    private int timeoutSeconds;

    @Value("${ai.vllm.retry-count}")
    private int retryCount;

    public Flux<String> streamChat(List<OpenAiRequest.Message> messages) {
        log.info("Starting AI stream for multi-turn conversation (message count: {})", messages.size());

        OpenAiRequest request = OpenAiRequest.builder()
                .model(model)
                .messages(messages)
                .stream(true)
                .build();

        return aiWebClient.post()
                .uri("/v1/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .accept(MediaType.TEXT_EVENT_STREAM)
                .retrieve()
                .bodyToFlux(String.class)
                .map(String::trim)
                .filter(chunk -> !chunk.isEmpty() && !chunk.equals("data: [DONE]"))
                .map(this::parseToken)
                .filter(token -> !token.isEmpty())
                .timeout(Duration.ofSeconds(timeoutSeconds))
                .retryWhen(Retry.backoff(retryCount, Duration.ofSeconds(2))
                        .doBeforeRetry(retrySignal -> log.warn("Retrying AI stream... Attempt: {}", retrySignal.totalRetries() + 1)))
                .onErrorResume(e -> {
                    log.error("AI Stream failure: {}", e.getMessage());
                    return Flux.just("Error: AI engine is currently unavailable. Please try again later.");
                })
                .doOnComplete(() -> log.info("AI stream completed successfully"));
    }

    private String parseToken(String chunk) {
        try {
            if (chunk.startsWith("data: ")) {
                chunk = chunk.substring(6);
            }
            
            OpenAiResponse response = objectMapper.readValue(chunk, OpenAiResponse.class);
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                String content = response.getChoices().get(0).getDelta().getContent();
                return content != null ? content : "";
            }
        } catch (Exception e) {
            log.trace("Skipping non-JSON chunk: {}", chunk);
        }
        return "";
    }
}
