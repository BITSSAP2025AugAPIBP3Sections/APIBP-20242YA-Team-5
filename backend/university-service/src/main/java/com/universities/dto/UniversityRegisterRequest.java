package com.universities.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UniversityRegisterRequest {

    @NotBlank
    private String universityId; // UID from auth service - must be provided during registration

    @NotBlank
    private String universityName;

    @NotBlank
    @Email
    private String email;

    private String address;

    private String phone;
}
