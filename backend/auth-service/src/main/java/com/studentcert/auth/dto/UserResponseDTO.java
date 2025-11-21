package com.studentcert.auth.dto;

import com.studentcert.auth.model.User;
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
public class UserResponseDTO {
    private String id;
    private String email;
    private String fullName;
    private String role;
    private Boolean isVerified;
    private Boolean isActive;
    private String phone;
    private String universityId;
    private String studentId;
    private String uid;
    private String universityUid;
    private String createdAt;
    private String updatedAt;

    public static UserResponseDTO fromUser(User user) {
        return UserResponseDTO.builder()
            .id(user.getId().toString())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole().toString().toLowerCase())
            .isVerified(user.getIsVerified())
            .isActive(user.getIsActive())
            .phone(user.getPhone())
            .universityId(user.getUniversityId())
            .studentId(user.getStudentId())
            .uid(user.getUid())
            .universityUid(user.getUniversityUid())
            .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
            .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
            .build();
    }
}