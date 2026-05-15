package com.genops.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class DocumentService {

    private final VectorStore vectorStore;
    private final Tika tika = new Tika();

    public String processPdf(MultipartFile file) throws IOException, org.apache.tika.exception.TikaException {
        log.info("Processing PDF: {}", file.getOriginalFilename());
        
        String content = tika.parseToString(file.getInputStream());
        
        // Split content into chunks (simplified for now)
        // In production, use TokenTextSplitter
        List<Document> documents = List.of(new Document(
            content,
            Map.of("filename", file.getOriginalFilename(), "id", UUID.randomUUID().toString())
        ));

        log.info("Adding documents to vector store...");
        vectorStore.add(documents);
        
        return "Processed " + documents.size() + " chunks from " + file.getOriginalFilename();
    }
}
