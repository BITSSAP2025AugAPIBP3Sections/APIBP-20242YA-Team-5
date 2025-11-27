package com.certificates.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
import com.certificates.dto.Status;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID certificateId;
    private String certificateNumber;
    private String studentId;  // Stores the user's uid (e.g., STU-2025-001)
    private String universityId;  // Stores the university's uid (e.g., UNI-2025-001)
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
    private Status status;

    private String revocationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
