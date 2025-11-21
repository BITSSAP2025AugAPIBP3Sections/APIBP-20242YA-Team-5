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
    private String phone;
    private UserRole role;
    private Boolean isVerified;
    private Boolean isActive;
    private String universityId;
    private String studentId;
    private String employeeId;
}