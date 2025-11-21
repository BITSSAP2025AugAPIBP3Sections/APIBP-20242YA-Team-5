package com.studentcert.auth.controller;

import com.studentcert.auth.dto.PaginatedResponse;
import com.studentcert.auth.dto.UserDto;
import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * Get users by role - accessible by ADMIN and UNIVERSITY roles
     * This allows universities to fetch student lists for certificate issuance
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'UNIVERSITY')")
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
}
