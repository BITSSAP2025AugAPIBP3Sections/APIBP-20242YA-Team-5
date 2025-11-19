package com.studentcert.auth.config;

import com.studentcert.auth.model.UserRole;
import com.studentcert.auth.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        createAdminUser();
    }

    private void createAdminUser() {
        String adminEmail = "admin@studentcert.com";
        String adminPassword = "admin123";

        if (!userService.existsByEmail(adminEmail)) {
            try {
                userService.createUser(adminEmail, adminPassword, UserRole.ADMIN);
                logger.info("Admin user created successfully with email: {}", adminEmail);
            } catch (Exception e) {
                logger.error("Failed to create admin user: {}", e.getMessage());
            }
        } else {
            logger.info("Admin user already exists with email: {}", adminEmail);
        }
    }
}