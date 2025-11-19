package com.studentcert.auth.controller;

import com.studentcert.auth.dto.ApiResponse;
import com.studentcert.auth.dto.PaginatedResponse;
import com.studentcert.auth.dto.UpdateUserRequest;
import com.studentcert.auth.dto.UserDto;
import com.studentcert.auth.model.User;
import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role) {
        
        Page<UserDto> users = adminUserService.getUsers(page, size, search, role);
        
        PaginatedResponse<UserDto> response = PaginatedResponse.<UserDto>builder()
                .content(users.getContent())
                .page(page)
                .size(size)
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .first(users.isFirst())
                .last(users.isLast())
                .empty(users.isEmpty())
                .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = adminUserService.getUserById(id);
        
        ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .success(true)
                .message("User retrieved successfully")
                .data(user)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id, 
            @RequestBody UpdateUserRequest request) {
        
        UserDto updatedUser = adminUserService.updateUser(id, request);
        
        ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .success(true)
                .message("User updated successfully")
                .data(updatedUser)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("User deleted successfully")
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<UserDto>> verifyUser(@PathVariable Long id) {
        UserDto user = adminUserService.verifyUser(id);
        
        ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .success(true)
                .message("User verified successfully")
                .data(user)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<UserDto>> activateUser(@PathVariable Long id) {
        UserDto user = adminUserService.activateUser(id);
        
        ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .success(true)
                .message("User activated successfully")
                .data(user)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<UserDto>> deactivateUser(@PathVariable Long id) {
        UserDto user = adminUserService.deactivateUser(id);
        
        ApiResponse<UserDto> response = ApiResponse.<UserDto>builder()
                .success(true)
                .message("User deactivated successfully")
                .data(user)
                .build();
        
        return ResponseEntity.ok(response);
    }
}