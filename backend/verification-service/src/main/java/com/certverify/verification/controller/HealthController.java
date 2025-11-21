package com.certverify.verification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Health", description = "Health check endpoints")
public class HealthController {

    @Value("${spring.application.name}")
    private String serviceName;

    private final long startTime = System.currentTimeMillis();

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the service is running")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "healthy");
        health.put("service", serviceName);
        health.put("timestamp", LocalDateTime.now());
        health.put("uptime", (System.currentTimeMillis() - startTime) / 1000.0);
        health.put("environment", "development");

        return ResponseEntity.ok(health);
    }

    @GetMapping("/")
    @Operation(summary = "Root endpoint", description = "Service information")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> info = new HashMap<>();
        info.put("service", serviceName);
        info.put("version", "1.0.0");
        info.put("status", "running");
        info.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(info);
    }
}