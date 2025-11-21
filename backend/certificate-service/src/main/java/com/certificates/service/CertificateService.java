package com.certificates.service;

import com.certificates.dto.*;
import com.certificates.model.Certificate;
import java.util.List;

public interface CertificateService {
    Certificate issueCertificate(CertificateIssueRequest request);
    List<Certificate> listCertificates(String status);
    Certificate getCertificateByCertificateNumber(String certificateNumber);
    Certificate updateCertificate(CertificateUpdateRequest request);
    void revokeCertificate(CertificateRevocationRequest request);
}
