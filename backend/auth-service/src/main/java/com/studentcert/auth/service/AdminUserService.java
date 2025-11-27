package com.studentcert.auth.service;

import com.studentcert.auth.dto.UpdateUserRequest;
import com.studentcert.auth.dto.UserDto;
import com.studentcert.auth.model.User;
import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UniversityServiceClient universityServiceClient;

    public Page<UserDto> getUsers(int page, int size, String search, UserRole role) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<User> userPage;
        if (search != null && !search.trim().isEmpty()) {
            if (role != null) {
                userPage = userRepository.findByEmailContainingIgnoreCaseAndRole(search, role, pageable);
            } else {
                userPage = userRepository.findByEmailContainingIgnoreCase(search, pageable);
            }
        } else if (role != null) {
            userPage = userRepository.findByRole(role, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        
        return userPage.map(this::convertToDto);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDto(user);
    }

    public UserDto updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        boolean wasVerified = user.getIsVerified();
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getIsVerified() != null) {
            user.setIsVerified(request.getIsVerified());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }
        if (request.getUniversityUid() != null) {
            user.setUniversityUid(request.getUniversityUid());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        // Sync changes to university service for university users
        if (user.getRole() == UserRole.UNIVERSITY && user.getUid() != null) {
            try {
                // Sync verification status changes
                if (!wasVerified && user.getIsVerified()) {
                    // Changed from unverified to verified
                    universityServiceClient.verifyUniversity(user.getUid());
                } else if (wasVerified && !user.getIsVerified()) {
                    // Changed from verified to unverified
                    universityServiceClient.unverifyUniversity(user.getUid());
                }
                
                // Sync name updates to university service
                if (request.getFullName() != null) {
                    universityServiceClient.updateUniversity(
                        user.getUid(), 
                        user.getFullName(), 
                        user.getEmail(),
                        null, // address not in User table
                        null  // phone not in User table
                    );
                }
            } catch (Exception e) {
                System.err.println("Failed to sync changes to university service: " + e.getMessage());
            }
        }
        
        return convertToDto(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // If this is a university user, also delete from university service
        if (user.getRole() == UserRole.UNIVERSITY && user.getUid() != null) {
            try {
                universityServiceClient.deleteUniversity(user.getUid());
            } catch (Exception e) {
                System.err.println("Failed to delete university from university service: " + e.getMessage());
            }
        }
        
        userRepository.delete(user);
    }

    public UserDto verifyUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setIsVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        // If this is a university user, also verify in university service
        if (user.getRole() == UserRole.UNIVERSITY && user.getUid() != null) {
            try {
                universityServiceClient.verifyUniversity(user.getUid());
            } catch (Exception e) {
                // Log error but don't fail the verification in auth service
                System.err.println("Failed to sync verification to university service: " + e.getMessage());
            }
        }
        
        return convertToDto(user);
    }

    public UserDto activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        return convertToDto(user);
    }

    public UserDto deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .isActive(user.getIsActive())
                .uid(user.getUid())
                .universityUid(user.getUniversityUid())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}