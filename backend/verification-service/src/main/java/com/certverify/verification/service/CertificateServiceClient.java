package com.certverify.verification.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.certverify.verification.model.Certificate;

import java.util.Map;

@FeignClient(name = "certificate-service", url = "${services.certificate.url}")
public interface CertificateServiceClient {

    @GetMapping("/api/certificates/{certificateNumber}")
    Certificate getCertificateByCertificateNumber(
            @PathVariable("certificateNumber") String certificateNumber
    );
}