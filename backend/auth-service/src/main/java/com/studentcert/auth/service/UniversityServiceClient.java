package com.studentcert.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UniversityServiceClient {

    private final RestTemplate restTemplate;

    @Value("${university.service.url:http://localhost:3002}")
    private String universityServiceUrl;

    public void registerUniversity(String universityId, String universityName, String email, 
                                   String address, String phone) {
        try {
            String url = universityServiceUrl + "/api/universities";
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("universityId", universityId);
            requestBody.put("universityName", universityName);
            requestBody.put("email", email);
            requestBody.put("address", address);
            requestBody.put("phone", phone);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            log.info("University registered successfully in university service: {}", universityId);
        } catch (Exception e) {
            log.error("Failed to register university in university service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to register university in university service: " + e.getMessage());
        }
    }
    
    public void verifyUniversity(String universityId) {
        try {
            String url = universityServiceUrl + "/api/universities/" + universityId + "/verify";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            restTemplate.postForEntity(url, request, String.class);
            
            log.info("University verified successfully in university service: {}", universityId);
        } catch (Exception e) {
            log.error("Failed to verify university in university service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to verify university in university service: " + e.getMessage());
        }
    }

    public void unverifyUniversity(String universityId) {
        try {
            String url = universityServiceUrl + "/api/universities/" + universityId + "/unverify";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Void> request = new HttpEntity<>(headers);
            
            restTemplate.postForEntity(url, request, String.class);
            
            log.info("University unverified successfully in university service: {}", universityId);
        } catch (Exception e) {
            log.error("Failed to unverify university in university service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to unverify university in university service: " + e.getMessage());
        }
    }

    public void updateUniversity(String universityId, String universityName, String email, 
                                 String address, String phone) {
        try {
            String url = universityServiceUrl + "/api/universities/" + universityId;
            
            Map<String, String> requestBody = new HashMap<>();
            // Only add non-null values to avoid overwriting existing data
            if (universityName != null) {
                requestBody.put("universityName", universityName);
            }
            if (email != null) {
                requestBody.put("email", email);
            }
            if (address != null) {
                requestBody.put("address", address);
            }
            if (phone != null) {
                requestBody.put("phone", phone);
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            restTemplate.put(url, request);
            
            log.info("University updated successfully in university service: {}", universityId);
        } catch (Exception e) {
            log.error("Failed to update university in university service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update university in university service: " + e.getMessage());
        }
    }

    public void deleteUniversity(String universityId) {
        try {
            String url = universityServiceUrl + "/api/universities/" + universityId;
            
            restTemplate.delete(url);
            
            log.info("University deleted successfully from university service: {}", universityId);
        } catch (Exception e) {
            log.error("Failed to delete university from university service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete university from university service: " + e.getMessage());
        }
    }
}
