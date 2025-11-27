package com.studentcert.auth.dto;

import com.studentcert.auth.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private UserRole role;
    private Boolean isVerified;
    private Boolean isActive;
    private String uid;
    private String universityUid;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}