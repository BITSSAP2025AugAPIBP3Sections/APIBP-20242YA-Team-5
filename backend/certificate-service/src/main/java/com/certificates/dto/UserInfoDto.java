package com.certificates.dto;

import lombok.Data;

@Data
public class UserInfoDto {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String uid;
    private String universityUid;
}
