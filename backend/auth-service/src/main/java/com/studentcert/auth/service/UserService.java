package com.studentcert.auth.service;

import com.studentcert.auth.model.User;
import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(@Lazy PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Page<User> getUsers(Pageable pageable, String search, UserRole role) {
        Specification<User> spec = Specification.where(null);
        
        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> 
                criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), "%" + search.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + search.toLowerCase() + "%")
                )
            );
        }
        
        if (role != null) {
            spec = spec.and((root, query, criteriaBuilder) -> 
                criteriaBuilder.equal(root.get("role"), role)
            );
        }
        
        return userRepository.findAll(spec, pageable);
    }

    public User createUser(String email, String rawPassword, UserRole role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with email " + email + " already exists");
        }

        User user = User.builder()
            .email(email)
            .password(passwordEncoder.encode(rawPassword))
            .role(role)
            .isVerified(role == UserRole.ADMIN) // Auto-verify admin users, others need verification
            .isActive(true)
            .fullName("User") // Default name, can be updated later
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User updateUser(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User verifyUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User unverifyUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(false);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }
}