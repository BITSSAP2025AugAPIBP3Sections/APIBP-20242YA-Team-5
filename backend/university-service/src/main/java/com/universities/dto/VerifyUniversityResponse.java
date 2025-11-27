package com.universities.dto;

import lombok.Data;

@Data
public class VerifyUniversityResponse {

    private String universityId;
    private boolean verified;
    private String message;
}
