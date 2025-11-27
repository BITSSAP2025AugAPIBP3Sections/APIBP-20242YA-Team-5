package com.certificates.service.impl;

import com.certificates.dto.*;
import com.certificates.exception.ResourceNotFoundException;
import com.certificates.model.Certificate;
import com.certificates.repository.CertificateRepository;
import com.certificates.service.AuthServiceClient;
import com.certificates.service.CertificateService;
import com.certificates.dto.Status;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {
    private static final Logger logger = LoggerFactory.getLogger(CertificateServiceImpl.class);
    private final CertificateRepository repository;
    private final AuthServiceClient authServiceClient;

    @Override
    public Certificate issueCertificate(CertificateIssueRequest request, Long universityUserId) {
        logger.info("Issuing certificate for student email: {} by university user ID: {}", 
                    request.getStudentEmail(), universityUserId);
        
        // Fetch student info from auth-service
        UserInfoDto studentInfo = authServiceClient.getUserByEmail(request.getStudentEmail());
        if (studentInfo == null) {
            logger.error("Student not found with email: {}", request.getStudentEmail());
            throw new ResourceNotFoundException("Student not found with email: " + request.getStudentEmail());
        }
        
        // Fetch university info from auth-service
        UserInfoDto universityInfo = authServiceClient.getUserById(universityUserId);
        if (universityInfo == null) {
            logger.error("University not found with ID: {}", universityUserId);
            throw new ResourceNotFoundException("University not found with ID: " + universityUserId);
        }
        
        logger.info("Student found - ID: {}, UID: {}, Name: {}", 
                    studentInfo.getId(), studentInfo.getUid(), studentInfo.getFullName());
        logger.info("University found - ID: {}, UID: {}, Name: {}", 
                    universityInfo.getId(), universityInfo.getUid(), universityInfo.getFullName());
        
        // Use the uid strings directly (e.g., STU-2025-001, UNI-2025-001)
        String studentUid = studentInfo.getUid();
        String universityUid = universityInfo.getUid();
        
        Certificate cert = Certificate.builder()
                .certificateNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .studentId(studentUid)
                .universityId(universityUid)
                .studentName(request.getStudentName())
                .studentEmail(request.getStudentEmail())
                .courseName(request.getCourseName())
                .specialization(request.getSpecialization())
                .grade(request.getGrade())
                .cgpa(request.getCgpa())
                .issueDate(request.getIssueDate())
                .completionDate(request.getCompletionDate())
                .certificateHash(UUID.randomUUID().toString().replace("-", ""))
                .digitalSignature("mock-digital-signature")
                .verificationCode(UUID.randomUUID().toString().substring(0, 6))
                .status(Status.ACTIVE)
                .build();
        
        Certificate savedCert = repository.save(cert);
        logger.info("Certificate issued successfully - Certificate Number: {}, Student ID: {}, University ID: {}", 
                    savedCert.getCertificateNumber(), savedCert.getStudentId(), savedCert.getUniversityId());
        
        return savedCert;
    }

    @Override
    public List<Certificate> listCertificates(String status) {
        return repository.findAll();
    }

    @Override
    public List<Certificate> listCertificatesByStudentEmail(String studentEmail, String status) {
        List<Certificate> certificates = repository.findByStudentEmail(studentEmail);
        if (status != null && !status.isEmpty()) {
            Status statusEnum = Status.valueOf(status.toUpperCase());
            certificates = certificates.stream()
                    .filter(cert -> cert.getStatus() == statusEnum)
                    .toList();
        }
        return certificates;
    }

    @Override
    public Certificate updateCertificate(CertificateUpdateRequest request) {
        Certificate cert = getCertificateByCertificateNumber(request.getCertificateNumber());
        if (request.getGrade() != null) cert.setGrade(request.getGrade());
        if (request.getCgpa() != null) cert.setCgpa(request.getCgpa());
        if (request.getSpecialization() != null) cert.setSpecialization(request.getSpecialization());
        return repository.save(cert);
    }

    @Override
    public Certificate getCertificateByCertificateNumber(String certificateNumber) {
        return repository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }

    @Override
    public void revokeCertificate(CertificateRevocationRequest request) {
        Certificate cert = getCertificateByCertificateNumber(request.getCertificateNumber());
        cert.setStatus(Status.REVOKED);
        cert.setRevocationReason(request.getReason());
        repository.save(cert);
    }
}
