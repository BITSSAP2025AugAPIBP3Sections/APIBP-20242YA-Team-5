package com.universities.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UniversityResponse {

    private String universityId; // UID from auth service
    private String universityName;
    private String email;
    private String address;
    private String phone;
    private boolean verified;
    private String publicKey;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
