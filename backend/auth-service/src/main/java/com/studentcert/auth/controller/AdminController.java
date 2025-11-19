package com.studentcert.auth.controller;

import com.studentcert.auth.dto.AuthResponse;
import com.studentcert.auth.dto.PaginatedResponse;
import com.studentcert.auth.dto.UserUpdateRequest;
import com.studentcert.auth.dto.UserResponseDTO;
import com.studentcert.auth.model.User;
import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.service.AuthService;
import com.studentcert.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/users")
    public ResponseEntity<AuthResponse> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role,
            @AuthenticationPrincipal User currentUser) {
        
        try {
            // Verify admin role
            if (!authService.hasAdminRole(currentUser)) {
                AuthResponse errorResponse = AuthResponse.builder()
                    .success(false)
                    .message("Access denied. Admin privileges required.")
                    .build();
                return ResponseEntity.status(403).body(errorResponse);
            }

            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
            Page<User> usersPage = userService.getUsers(pageable, search, role);

            // Convert users to DTOs
            List<UserResponseDTO> userDTOs = usersPage.getContent().stream()
                .map(UserResponseDTO::fromUser)
                .collect(java.util.stream.Collectors.toList());

            PaginatedResponse<UserResponseDTO> paginatedResponse = PaginatedResponse.<UserResponseDTO>builder()
                .data(userDTOs)
                .pagination(PaginatedResponse.Pagination.builder()
                    .page(page)
                    .limit(limit)
                    .total((int) usersPage.getTotalElements())
                    .totalPages(usersPage.getTotalPages())
                    .build())
                .build();

            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("Users retrieved successfully")
                .data(paginatedResponse)
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message("Failed to retrieve users: " + e.getMessage())
                .build();
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<AuthResponse> getUserById(
            @PathVariable String userId,
            @AuthenticationPrincipal User currentUser) {
        
        try {
            // Verify admin role
            if (!authService.hasAdminRole(currentUser)) {
                AuthResponse errorResponse = AuthResponse.builder()
                    .success(false)
                    .message("Access denied. Admin privileges required.")
                    .build();
                return ResponseEntity.status(403).body(errorResponse);
            }

            User user = userService.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("User retrieved successfully")
                .data(UserResponseDTO.fromUser(user))
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message("Failed to retrieve user: " + e.getMessage())
                .build();
            return ResponseEntity.status(404).body(errorResponse);
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<AuthResponse> updateUser(
            @PathVariable String userId,
            @RequestBody UserUpdateRequest updateRequest,
            @AuthenticationPrincipal User currentUser) {
        
        try {
            // Verify admin role
            if (!authService.hasAdminRole(currentUser)) {
                AuthResponse errorResponse = AuthResponse.builder()
                    .success(false)
                    .message("Access denied. Admin privileges required.")
                    .build();
                return ResponseEntity.status(403).body(errorResponse);
            }

            User user = userService.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Update user fields
            if (updateRequest.getFullName() != null) {
                user.setFullName(updateRequest.getFullName());
            }
            if (updateRequest.getEmail() != null) {
                user.setEmail(updateRequest.getEmail());
            }
            if (updateRequest.getRole() != null) {
                user.setRole(updateRequest.getRole());
            }
            if (updateRequest.getIsVerified() != null) {
                user.setIsVerified(updateRequest.getIsVerified());
            }
            if (updateRequest.getIsActive() != null) {
                user.setIsActive(updateRequest.getIsActive());
            }

            User updatedUser = userService.updateUser(user);

            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("User updated successfully")
                .data(UserResponseDTO.fromUser(updatedUser))
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message("Failed to update user: " + e.getMessage())
                .build();
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @PostMapping("/users/{userId}/verify")
    public ResponseEntity<AuthResponse> verifyUser(
            @PathVariable String userId,
            @AuthenticationPrincipal User currentUser) {
        
        try {
            // Verify admin role
            if (!authService.hasAdminRole(currentUser)) {
                AuthResponse errorResponse = AuthResponse.builder()
                    .success(false)
                    .message("Access denied. Admin privileges required.")
                    .build();
                return ResponseEntity.status(403).body(errorResponse);
            }

            User user = userService.verifyUser(Long.parseLong(userId));

            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("User verified successfully")
                .data(UserResponseDTO.fromUser(user))
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message("Failed to verify user: " + e.getMessage())
                .build();
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @DeleteMapping("/users/{userId}/verify")
    public ResponseEntity<AuthResponse> unverifyUser(
            @PathVariable String userId,
            @AuthenticationPrincipal User currentUser) {
        
        try {
            // Verify admin role
            if (!authService.hasAdminRole(currentUser)) {
                AuthResponse errorResponse = AuthResponse.builder()
                    .success(false)
                    .message("Access denied. Admin privileges required.")
                    .build();
                return ResponseEntity.status(403).body(errorResponse);
            }

            User user = userService.unverifyUser(Long.parseLong(userId));

            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("User verification revoked successfully")
                .data(user)
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message("Failed to revoke user verification: " + e.getMessage())
                .build();
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<AuthResponse> deleteUser(
            @PathVariable String userId,
            @AuthenticationPrincipal User currentUser) {
        
        try {
            // Verify admin role
            if (!authService.hasAdminRole(currentUser)) {
                AuthResponse errorResponse = AuthResponse.builder()
                    .success(false)
                    .message("Access denied. Admin privileges required.")
                    .build();
                return ResponseEntity.status(403).body(errorResponse);
            }

            // Prevent admin from deleting themselves
            if (currentUser.getId().equals(Long.parseLong(userId))) {
                AuthResponse errorResponse = AuthResponse.builder()
                    .success(false)
                    .message("Cannot delete your own account")
                    .build();
                return ResponseEntity.status(400).body(errorResponse);
            }

            userService.deleteUser(Long.parseLong(userId));

            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("User deleted successfully")
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message("Failed to delete user: " + e.getMessage())
                .build();
            return ResponseEntity.status(400).body(errorResponse);
        }
    }
}