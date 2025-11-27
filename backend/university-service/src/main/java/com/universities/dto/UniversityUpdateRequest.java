package com.universities.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UniversityUpdateRequest {

    private String universityName;

    @Email
    private String email;

    private String address;

    private String phone;
}
