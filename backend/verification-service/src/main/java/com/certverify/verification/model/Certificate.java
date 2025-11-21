package com.certverify.verification.model;

import lombok.Data;

@Data
public class Certificate {
    private String certificateId;
    private String certificateNumber;
    private String studentId;
    private String universityId;
    private String studentName;
    private String studentEmail;
    private String courseName;
    private String specialization;
    private String grade;
    private Double cgpa;
    private String issueDate;
    private String completionDate;
    private String certificateHash;
    private String digitalSignature;
    private String verificationCode;
    private String pdfPath;
    private String status;
    private String revocationReason;
    private String createdAt;
    private String updatedAt;
}