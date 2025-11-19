package com.certverify.verification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class VerificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VerificationServiceApplication.class, args);
        System.out.println("🚀 Verification Service running on port 3004");
    }
}