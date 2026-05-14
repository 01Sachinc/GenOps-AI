package com.smartops.controller;

import org.springframework.web.bind.GetMapping;
import org.springframework.web.bind.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiController {

    @GetMapping("/")
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "SmartOps Application is running successfully!");
        response.put("version", "1.0.0");
        return response;
    }
}
