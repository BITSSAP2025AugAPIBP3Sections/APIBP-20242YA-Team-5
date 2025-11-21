package com.certverify.verification.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkVerificationRequest {
    @NotEmpty(message = "Certificates list cannot be empty")
    @Valid
    private List<VerificationRequest> certificates;
}