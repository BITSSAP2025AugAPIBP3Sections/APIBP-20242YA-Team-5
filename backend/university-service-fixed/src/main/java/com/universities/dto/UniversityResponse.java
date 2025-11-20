package com.universities.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UniversityResponse {

    private UUID universityId;
    private String universityName;
    private String email;
    private String address;
    private String phone;
    private boolean verified;
    private String publicKey;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
