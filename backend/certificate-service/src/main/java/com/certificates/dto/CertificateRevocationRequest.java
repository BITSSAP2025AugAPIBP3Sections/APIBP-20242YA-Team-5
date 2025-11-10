package com.certificates.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CertificateRevocationRequest {
    @NotBlank
    private String certificateNumber;
    @Size(min = 10)
    private String reason;
}
