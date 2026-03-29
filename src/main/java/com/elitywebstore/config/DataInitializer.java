package com.elitywebstore.config;

import com.elitywebstore.repository.UserRepository;
import com.elitywebstore.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        try {
            String adminEmail = "admin@elitywebstore.com";
            
            // Check if admin user already exists
            if (userRepository.existsByEmail(adminEmail)) {
                log.info("Admin user already exists, skipping creation");
                return;
            }
            
            // Create default admin user
            // WARNING: Change these credentials in production!
            authService.createAdminUser(
                adminEmail,
                "admin123",
                "Admin",
                "User"
            );
            log.info("Default admin user created successfully");
        } catch (Exception e) {
            log.error("Error creating admin user: {}", e.getMessage());
        }
    }
}