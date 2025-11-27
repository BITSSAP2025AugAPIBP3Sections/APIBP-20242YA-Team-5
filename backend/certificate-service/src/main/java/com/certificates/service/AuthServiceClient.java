package com.certificates.service;

import com.certificates.dto.UserInfoDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AuthServiceClient {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceClient.class);
    
    @Value("${auth.service.url:http://localhost:8081}")
    private String authServiceUrl;
    
    private final RestTemplate restTemplate;
    
    public UserInfoDto getUserByEmail(String email) {
        try {
            String url = authServiceUrl + "/api/users/email/" + email;
            logger.info("Fetching user info from: {}", url);
            return restTemplate.getForObject(url, UserInfoDto.class);
        } catch (Exception e) {
            logger.error("Failed to fetch user info for email: {}", email, e);
            return null;
        }
    }
    
    public UserInfoDto getUserById(Long userId) {
        try {
            String url = authServiceUrl + "/api/users/" + userId;
            logger.info("Fetching user info from: {}", url);
            return restTemplate.getForObject(url, UserInfoDto.class);
        } catch (Exception e) {
            logger.error("Failed to fetch user info for userId: {}", userId, e);
            return null;
        }
    }
}
