package com.studentcert.auth.repository;

import com.studentcert.auth.model.User;
import com.studentcert.auth.model.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.verificationToken = :token")
    Optional<User> findByVerificationToken(@Param("token") String token);
    
    @Query("SELECT u FROM User u WHERE u.passwordResetToken = :token")
    Optional<User> findByPasswordResetToken(@Param("token") String token);
    
    // Pagination methods for admin
    Page<User> findByEmailContainingIgnoreCaseAndRole(String email, UserRole role, Pageable pageable);
    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);
    Page<User> findByRole(UserRole role, Pageable pageable);
    
    // Non-paginated method for fetching all users of a specific role
    @Query("SELECT u FROM User u WHERE u.role = :role")
    java.util.List<User> findAllByRole(@Param("role") UserRole role);
    
    // UID-related methods
    boolean existsByUid(String uid);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.uid LIKE :pattern")
    long countByUidStartingWith(@Param("pattern") String pattern);
    
    Optional<User> findByUid(String uid);
}