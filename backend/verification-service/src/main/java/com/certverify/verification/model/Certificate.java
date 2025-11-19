package com.certverify.verification.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    private String id;
    private String certificateNumber;
    private String studentId;
    private String universityId;
    private String studentName;
    private String courseName;
    private String specialization;
    private String grade;
    private Double cgpa;
    private LocalDate issueDate;
    private LocalDate completionDate;
    private String certificateHash;
    private String digitalSignature;
    private String timestampToken;
    private String verificationCode;
    private String pdfPath;
    private String status; // active, revoked, suspended
    private String revocationReason;
}