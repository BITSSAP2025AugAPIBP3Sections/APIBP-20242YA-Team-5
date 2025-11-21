package com.studentcert.auth.controller;

import com.studentcert.auth.dto.PaginatedResponse;
import com.studentcert.auth.dto.UserDto;
import com.studentcert.auth.model.User;
import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.repository.UserRepository;
import com.studentcert.auth.service.AdminUserService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private AdminUserService adminUserService;
    
    @Autowired
    private UserRepository userRepository;

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
    
    /**
     * Get list of all universities (for student registration dropdown)
     * Public endpoint - no authentication required
     */
    @GetMapping("/universities")
    public ResponseEntity<List<UniversityInfo>> getUniversities() {
        List<User> universities = userRepository.findAllByRole(UserRole.UNIVERSITY);
        
        List<UniversityInfo> universityInfoList = universities.stream()
                .filter(u -> u.getUid() != null) // Only universities with UIDs
                .map(u -> UniversityInfo.builder()
                        .uid(u.getUid())
                        .name(u.getFullName())
                        .email(u.getEmail())
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(universityInfoList);
    }
    
    /**
     * DTO for university information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UniversityInfo {
        private String uid;
        private String name;
        private String email;
    }
}
