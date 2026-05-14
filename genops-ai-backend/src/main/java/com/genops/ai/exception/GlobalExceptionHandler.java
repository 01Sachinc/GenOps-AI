package com.genops.ai.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @Data
    @AllArgsConstructor
    public static class ErrorResponse {
        private String error;
        private int status;
        private String timestamp;
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex) {
        log.error("API Exception caught: {}", ex.getMessage(), ex);
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                ex.getStatus().value(),
                LocalDateTime.now().toString()
        );
        return new ResponseEntity<>(response, ex.getStatus());
    }

    @ExceptionHandler(WebClientResponseException.class)
    public ResponseEntity<ErrorResponse> handleWebClientException(WebClientResponseException ex) {
        log.error("Downstream WebClient error: {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
        ErrorResponse response = new ErrorResponse(
                "AI engine downstream failure: " + ex.getStatusText(),
                ex.getStatusCode().value(),
                LocalDateTime.now().toString()
        );
        return new ResponseEntity<>(response, ex.getStatusCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unhandled server exception: {}", ex.getMessage(), ex);
        ErrorResponse response = new ErrorResponse(
                "Internal server error occurred processing generative pipeline",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now().toString()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
