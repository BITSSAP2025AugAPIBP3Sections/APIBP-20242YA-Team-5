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
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private UserRole role;
    private Boolean isVerified;
    private Boolean isActive;
    private String phone;
    private String universityId;
    private String studentId;
    private String employeeId;
}