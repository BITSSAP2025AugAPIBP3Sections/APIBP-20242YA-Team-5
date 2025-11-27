package com.certificates.service;

import com.certificates.dto.*;
import com.certificates.model.Certificate;
import java.util.List;

public interface CertificateService {
    Certificate issueCertificate(CertificateIssueRequest request, Long universityUserId);
    List<Certificate> listCertificates(String status);
    List<Certificate> listCertificatesByStudentEmail(String studentEmail, String status);
    Certificate getCertificateByCertificateNumber(String certificateNumber);
    Certificate updateCertificate(CertificateUpdateRequest request);
    void revokeCertificate(CertificateRevocationRequest request);
}
