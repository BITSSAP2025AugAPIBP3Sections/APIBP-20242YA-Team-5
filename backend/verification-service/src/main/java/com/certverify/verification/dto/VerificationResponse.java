package com.certverify.verification.dto;

import com.certverify.verification.model.VerificationResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {
    private Boolean success;
    private VerificationResult data;
    private String message;
}