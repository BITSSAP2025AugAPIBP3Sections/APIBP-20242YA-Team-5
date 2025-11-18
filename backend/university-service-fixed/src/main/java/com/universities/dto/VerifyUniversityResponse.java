package com.universities.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class VerifyUniversityResponse {

    private UUID universityId;
    private boolean verified;
    private String message;
}
