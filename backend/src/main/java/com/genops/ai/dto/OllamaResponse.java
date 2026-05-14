package com.genops.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OllamaResponse {
    private String model;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    private String response;
    private boolean done;
}
