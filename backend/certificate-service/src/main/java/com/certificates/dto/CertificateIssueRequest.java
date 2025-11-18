package com.certificates.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CertificateIssueRequest {
    @NotBlank
    private String studentName;
    @Email
    @NotBlank
    private String studentEmail;
    @NotBlank
    private String courseName;
    private String specialization;
    @NotBlank
    private String grade;
    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double cgpa;
    @NotBlank
    private String issueDate;
    private String completionDate;
}
