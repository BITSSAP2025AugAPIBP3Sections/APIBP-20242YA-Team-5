package com.certverify.verification.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationRequest {

    @Pattern(regexp = "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
             message = "Invalid UUID format")
    private String certificateId;

    @Pattern(regexp = "^[A-Z0-9]{6,8}$",
             message = "Verification code must be 6-8 alphanumeric characters")
    private String verificationCode;
}