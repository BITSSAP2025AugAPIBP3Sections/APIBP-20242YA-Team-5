package com.certificates.repository;

import com.certificates.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    List<Certificate> findByStudentEmail(String studentEmail);
}
