package com.certificates.service;

import com.certificates.dto.*;
import com.certificates.model.Certificate;
import java.util.List;
import java.util.UUID;

public interface CertificateService {
    Certificate issueCertificate(CertificateIssueRequest request);
    List<Certificate> listCertificates(String status);
    Certificate getCertificate(UUID id);
    Certificate updateCertificate(UUID id, CertificateUpdateRequest request);
    void revokeCertificate(CertificateRevocationRequest request);
}
