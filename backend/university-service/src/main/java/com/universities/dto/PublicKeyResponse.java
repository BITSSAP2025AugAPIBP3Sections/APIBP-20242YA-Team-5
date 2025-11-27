package com.universities.dto;

import lombok.Data;

@Data
public class PublicKeyResponse {

    private String universityId;
    private String universityName;
    private String publicKey;
}
