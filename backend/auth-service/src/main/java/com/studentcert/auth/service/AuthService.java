package com.studentcert.auth.service;

import com.studentcert.auth.model.User;
import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User authenticate(String email, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            throw new Exception("Invalid email or password");
        }
        
        User user = userOptional.get();
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid email or password");
        }
        
        if (!user.getIsActive()) {
            throw new Exception("Account is disabled");
        }
        
        if (!user.getIsVerified()) {
            throw new Exception("Account is not verified");
        }
        
        return user;
    }

    public boolean hasAdminRole(User user) {
        return user.getRole() == UserRole.ADMIN;
    }

    public boolean hasUniversityRole(User user) {
        return user.getRole() == UserRole.UNIVERSITY;
    }
}