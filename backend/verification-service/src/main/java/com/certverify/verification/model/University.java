package com.certverify.verification.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class University {
    private String id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String publicKey;
    private Boolean verified;
}