package com.certverify.verification.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "university-service", url = "${services.university.url}")
public interface UniversityServiceClient {

    @GetMapping("/api/universities/{id}")
    Map<String, Object> getUniversityById(@PathVariable("id") String id);

    @GetMapping("/api/universities/{id}/public-key")
    Map<String, Object> getPublicKey(@PathVariable("id") String id);
}