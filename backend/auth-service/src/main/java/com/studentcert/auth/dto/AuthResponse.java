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
    private UserData data;

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
        private String uid;  // User's unique identifier
        private String universityUid;  // For students - their university's UID
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
        private String uid;
        private String universityUid;
    }
}