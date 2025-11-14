package com.certificates;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Certificate Service - Spring Boot entry point.
 *
 * Remarks:
 * - The service expects Auth Service to validate / verify bearer tokens.
 * - Configuration (DB URL, Auth service URL, secrets) should be provided.
 */
@SpringBootApplication
public class CertificateServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CertificateServiceApplication.class, args);
    }
}
