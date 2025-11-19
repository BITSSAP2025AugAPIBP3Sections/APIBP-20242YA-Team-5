package com.certverify.verification.service;

import com.certverify.verification.model.Certificate;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "certificate-service", url = "${services.certificate.url}")
public interface CertificateServiceClient {

    @GetMapping("/api/certificates/{id}")
    Map<String, Object> getCertificateById(@PathVariable("id") String id);

    @GetMapping("/api/certificates/code/{code}")
    Map<String, Object> getCertificateByCode(@PathVariable("code") String code);
}