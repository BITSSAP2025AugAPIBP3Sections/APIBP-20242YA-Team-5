package com.certverify.verification.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResult {
    private Boolean valid;
    private Certificate certificate;
    private University university;
    private String verificationMethod;
    private LocalDateTime timestamp;
    private String reason;
}