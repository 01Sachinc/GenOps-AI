package com.genops.ai.controller;

import com.genops.ai.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/rag")
@RequiredArgsConstructor
@Slf4j
public class RagController {

    private final DocumentService documentService;
    private final VectorStore vectorStore;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile file) {
        try {
            String result = documentService.processPdf(file);
            return ResponseEntity.ok(result);
        } catch (IOException | org.apache.tika.exception.TikaException e) {
            log.error("Failed to process PDF", e);
            return ResponseEntity.internalServerError().body("Error processing PDF: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Document>> search(@RequestParam("query") String query) {
        log.info("Searching for: {}", query);
        List<Document> results = vectorStore.similaritySearch(
            SearchRequest.query(query).withTopK(5)
        );
        return ResponseEntity.ok(results);
    }
}
