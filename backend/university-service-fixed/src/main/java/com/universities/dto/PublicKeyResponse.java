package com.universities.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PublicKeyResponse {

    private UUID universityId;
    private String universityName;
    private String publicKey;
}
