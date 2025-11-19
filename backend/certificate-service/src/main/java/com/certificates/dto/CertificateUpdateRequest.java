package com.certificates.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CertificateUpdateRequest {
    @NotBlank
    private String grade;
    private Double cgpa;
    private String specialization;
}
