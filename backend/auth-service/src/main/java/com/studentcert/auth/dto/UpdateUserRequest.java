package com.studentcert.auth.dto;

import com.studentcert.auth.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    private UserRole role;
    private Boolean isVerified;
    private Boolean isActive;
    private String universityUid;
}