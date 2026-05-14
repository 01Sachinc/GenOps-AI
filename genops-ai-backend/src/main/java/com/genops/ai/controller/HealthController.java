package com.genops.ai.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Data
    @AllArgsConstructor
    static class HealthStatus {
        private String status;
        private String timestamp;
    }

    @GetMapping
    public HealthStatus health() {
        return new HealthStatus("UP", LocalDateTime.now().toString());
    }
}
