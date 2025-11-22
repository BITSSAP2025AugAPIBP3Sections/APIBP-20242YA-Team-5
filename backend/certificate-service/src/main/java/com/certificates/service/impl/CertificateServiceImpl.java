package com.certificates.service.impl;

import com.certificates.dto.*;
import com.certificates.exception.ResourceNotFoundException;
import com.certificates.model.Certificate;
import com.certificates.repository.CertificateRepository;
import com.certificates.service.CertificateService;
import com.certificates.dto.Status;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository repository;

    @Override
    public Certificate issueCertificate(CertificateIssueRequest request) {

        // Trim values
        request.setStudentName(request.getStudentName().trim());
        request.setStudentEmail(request.getStudentEmail().trim());
        request.setCourseName(request.getCourseName().trim());
        request.setGrade(request.getGrade().trim());

        // Email validation
        if (!isValidEmail(request.getStudentEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email address");
        }

        // Date validation
        if (request.getCompletionDate() != null &&
                request.getCompletionDate().isAfter(request.getIssueDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Completion date cannot be after Issue date");
        }


        Certificate cert = Certificate.builder()
                .certificateNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
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

        return repository.save(cert);
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

        if (request.getCertificateNumber() == null ||
                request.getCertificateNumber().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Certificate number is required");
        }

        // Validate at least one field present
        if (request.getCgpa() == null &&
                request.getGrade() == null &&
                request.getSpecialization() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "At least one field (cgpa, grade, specialization) must be provided");
        }

        Certificate cert = getCertificateByCertificateNumber(request.getCertificateNumber());

        if (request.getGrade() != null) cert.setGrade(request.getGrade().trim());
        if (request.getCgpa() != null) cert.setCgpa(request.getCgpa());
        if (request.getSpecialization() != null) cert.setSpecialization(request.getSpecialization().trim());

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

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return Pattern.matches(emailRegex, email);
    }

}
