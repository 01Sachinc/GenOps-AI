package com.genops.ai.service;

import com.genops.ai.dto.ChatRequest;
import com.genops.ai.dto.OpenAiRequest;
import com.genops.ai.repository.ChatMemoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final VllmService vllmService;
    private final ChatMemoryRepository memoryRepository;
    private final org.springframework.ai.vectorstore.VectorStore vectorStore;

    public Flux<String> streamChat(String conversationId, ChatRequest request) {
        log.info("Processing chat session: {}", conversationId);

        // Perform RAG search
        List<org.springframework.ai.document.Document> contextDocs = vectorStore.similaritySearch(
                org.springframework.ai.vectorstore.SearchRequest.query(request.getMessage()).withTopK(3)
        );

        String context = contextDocs.stream()
                .map(org.springframework.ai.document.Document::getContent)
                .collect(java.util.stream.Collectors.joining("\n---\n"));

        String enhancedMessage = request.getMessage();
        if (!context.isEmpty()) {
            enhancedMessage = "Context information is below.\n---------------------\n" +
                    context + "\n---------------------\n" +
                    "Given the context information and not prior knowledge, " +
                    "answer the query: " + request.getMessage();
        }

        OpenAiRequest.Message userMessage = OpenAiRequest.Message.builder()
                .role("user")
                .content(enhancedMessage)
                .build();

        return memoryRepository.getHistory(conversationId)
                .flatMapMany(history -> {
                    history.add(userMessage);
                    
                    StringBuilder aiResponseBuilder = new StringBuilder();
                    
                    return memoryRepository.saveMessage(conversationId, userMessage)
                            .thenMany(vllmService.streamChat(history))
                            .doOnNext(aiResponseBuilder::append)
                            .doOnComplete(() -> {
                                OpenAiRequest.Message assistantMessage = OpenAiRequest.Message.builder()
                                        .role("assistant")
                                        .content(aiResponseBuilder.toString())
                                        .build();
                                memoryRepository.saveMessage(conversationId, assistantMessage).subscribe();
                            });
                });
    }

    public Mono<Void> clearSession(String conversationId) {
        return memoryRepository.clearHistory(conversationId).then();
    }
}
