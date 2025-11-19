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
public class AuthResponse {
    private boolean success;
    private String message;
    private Object data; // Changed from UserData to Object for flexibility

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserData {
        private String id;
        private String email;
        private String fullName;
        private String role;
        private String token;
        private String refreshToken;
        private String tokenType = "Bearer";
        private LocalDateTime expiresAt;
    }

    // Legacy format for compatibility
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String email;
        private String fullName;
        private UserRole role;
        private Boolean isVerified;
        private String universityId;
        private String studentId;
        private String employeeId;
    }
}