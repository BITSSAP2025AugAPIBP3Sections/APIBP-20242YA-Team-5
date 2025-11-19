package com.certverify.verification.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkVerificationRequest {

    @NotEmpty(message = "Certificates list cannot be empty")
    @Size(max = 100, message = "Maximum 100 certificates can be verified at once")
    @Valid
    private List<VerificationRequest> certificates;
}