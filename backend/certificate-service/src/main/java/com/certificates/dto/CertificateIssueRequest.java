package com.certificates.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
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

    @NotNull(message = "Issue date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate completionDate;
}
