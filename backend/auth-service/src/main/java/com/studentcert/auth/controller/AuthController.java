package com.studentcert.auth.controller;

import com.studentcert.auth.dto.AuthResponse;
import com.studentcert.auth.dto.LoginRequest;
import com.studentcert.auth.dto.RegisterRequest;
import com.studentcert.auth.model.User;
import com.studentcert.auth.service.AuthService;
import com.studentcert.auth.service.JwtService;
import com.studentcert.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            User user = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtService.generateToken(user);
            
            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .data(AuthResponse.UserData.builder()
                    .id(user.getId().toString())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().toString().toLowerCase())
                    .token(token)
                    .build())
                .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message(e.getMessage())
                .build();
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createUser(
                registerRequest.getEmail(), 
                registerRequest.getPassword(), 
                registerRequest.getRole()
            );
            
            // Update additional fields
            user.setFullName(registerRequest.getFullName());
            user.setPhone(registerRequest.getPhone());
            user.setUniversityId(registerRequest.getUniversityId());
            user.setStudentId(registerRequest.getStudentId());
            user.setEmployeeId(registerRequest.getEmployeeId());
            
            // Save updated user
            user = userService.updateUser(user);
            
            String token = jwtService.generateToken(user);
            
            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("Registration successful")
                .data(AuthResponse.UserData.builder()
                    .id(user.getId().toString())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().toString().toLowerCase())
                    .token(token)
                    .build())
                .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message(e.getMessage())
                .build();
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@AuthenticationPrincipal User user) {
        // In a real implementation, you might blacklist the JWT token
        // For now, we'll just return success since the frontend handles token removal
        AuthResponse response = AuthResponse.builder()
            .success(true)
            .message("Logout successful")
            .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        try {
            AuthResponse response = AuthResponse.builder()
                .success(true)
                .message("User retrieved successfully")
                .data(AuthResponse.UserData.builder()
                    .id(user.getId().toString())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().toString().toLowerCase())
                    .build())
                .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = AuthResponse.builder()
                .success(false)
                .message("User not found")
                .build();
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}