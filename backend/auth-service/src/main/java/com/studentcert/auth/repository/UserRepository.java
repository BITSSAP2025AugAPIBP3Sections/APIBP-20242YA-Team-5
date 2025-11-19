package com.studentcert.auth.repository;

import com.studentcert.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.verificationToken = :token")
    Optional<User> findByVerificationToken(@Param("token") String token);
    
    @Query("SELECT u FROM User u WHERE u.passwordResetToken = :token")
    Optional<User> findByPasswordResetToken(@Param("token") String token);
}