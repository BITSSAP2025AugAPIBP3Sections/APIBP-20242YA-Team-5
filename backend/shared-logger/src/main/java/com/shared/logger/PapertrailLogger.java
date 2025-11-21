package com.shared.logging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class PapertrailLogger {

    private final WebClient webClient;

    @Value("${papertrail.endpoint}")
    private String endpoint;

    @Value("${papertrail.token}")
    private String token;

    public void send(String message) {

        webClient.post()
                .uri(endpoint)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/octet-stream")
                .bodyValue(message)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(
                        resp -> log.debug("Papertrail OK"),
                        err -> log.error("Papertrail ERROR → {}", err.getMessage())
                );
    }
}
