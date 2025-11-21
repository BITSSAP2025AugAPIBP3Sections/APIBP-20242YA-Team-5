package com.studentcert.auth.service;

import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UidGenerationService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Generate elegant UID based on user role
     * Format: PREFIX-YEAR-SEQUENCE
     * Examples: UNI-2024-001, STU-2024-001, EMP-2024-001, ADM-2024-001
     */
    public synchronized String generateUid(UserRole role) {
        String prefix = getRolePrefix(role);
        int year = LocalDateTime.now().getYear();
        
        // Get the next sequence number for this role and year
        int sequence = getNextSequence(prefix, year);
        
        // Format: PREFIX-YEAR-SEQUENCE (e.g., STU-2024-001)
        return String.format("%s-%d-%03d", prefix, year, sequence);
    }

    /**
     * Get prefix based on user role
     */
    private String getRolePrefix(UserRole role) {
        return switch (role) {
            case UNIVERSITY -> "UNI";
            case STUDENT -> "STU";
            case EMPLOYER -> "EMP";
            case ADMIN -> "ADM";
        };
    }

    /**
     * Get next sequence number for a given prefix and year
     * Finds the highest existing sequence and increments it
     */
    private int getNextSequence(String prefix, int year) {
        String pattern = prefix + "-" + year + "-%";
        
        // Count existing UIDs with this pattern
        long count = userRepository.countByUidStartingWith(pattern);
        
        return (int) count + 1;
    }

    /**
     * Validate if UID is unique
     */
    public boolean isUidUnique(String uid) {
        return !userRepository.existsByUid(uid);
    }

    /**
     * Regenerate UID if conflict occurs (should be rare)
     */
    public String regenerateUidIfConflict(UserRole role) {
        String uid;
        int attempts = 0;
        int maxAttempts = 10;
        
        do {
            uid = generateUid(role);
            attempts++;
            
            if (attempts >= maxAttempts) {
                // Fallback: add timestamp suffix
                uid = uid + "-" + System.currentTimeMillis();
                break;
            }
        } while (!isUidUnique(uid));
        
        return uid;
    }
}
