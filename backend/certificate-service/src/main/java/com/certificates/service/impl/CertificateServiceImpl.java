package com.certificates.service.impl;

import com.certificates.dto.*;
import com.certificates.exception.ResourceNotFoundException;
import com.certificates.model.Certificate;
import com.certificates.repository.CertificateRepository;
import com.certificates.service.CertificateService;
import com.certificates.dto.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository repository;

    @Override
    public Certificate issueCertificate(CertificateIssueRequest request) {
        Certificate cert = Certificate.builder()
                .certificateNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .studentName(request.getStudentName())
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
        return repository.save(cert);
    }

    @Override
    public List<Certificate> listCertificates(String status) {
        return repository.findAll();
    }

    @Override
    public Certificate getCertificate(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }

    @Override
    public Certificate updateCertificate(UUID id, CertificateUpdateRequest request) {
        Certificate cert = getCertificate(id);
        if (request.getGrade() != null) cert.setGrade(request.getGrade());
        if (request.getCgpa() != null) cert.setCgpa(request.getCgpa());
        if (request.getSpecialization() != null) cert.setSpecialization(request.getSpecialization());
        return repository.save(cert);
    }

    @Override
    public void revokeCertificate(CertificateRevocationRequest request) {
        Certificate cert = repository.findByCertificateNumber(request.getCertificateNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        cert.setStatus(Status.REVOKED);
        cert.setRevocationReason(request.getReason());
        repository.save(cert);
    }
}
