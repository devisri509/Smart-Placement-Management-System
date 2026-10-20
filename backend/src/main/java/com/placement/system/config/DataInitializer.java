package com.placement.system.config;

import com.placement.system.entity.Admin;
import com.placement.system.entity.User;
import com.placement.system.entity.enums.RoleType;
import com.placement.system.repository.AdminRepository;
import com.placement.system.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String adminEmail = "admin@placement.edu";
        Optional<User> adminUserOpt = userRepository.findByEmail(adminEmail);

        User adminUser;
        if (adminUserOpt.isEmpty()) {
            logger.info("Seeding initial admin user: {}", adminEmail);
            adminUser = User.builder()
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode("Password@123"))
                    .role(RoleType.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            adminUser = userRepository.save(adminUser);
        } else {
            adminUser = adminUserOpt.get();
            // Update password hash to ensure valid BCrypt encoding
            adminUser.setPasswordHash(passwordEncoder.encode("Password@123"));
            adminUser = userRepository.save(adminUser);
        }

        if (adminRepository.findByUserId(adminUser.getId()).isEmpty()) {
            Admin adminProfile = Admin.builder()
                    .user(adminUser)
                    .fullName("Dr. Suresh Sharma")
                    .department("Training & Placement Cell")
                    .designation("Head Placement Officer")
                    .build();
            adminRepository.save(adminProfile);
        }

        logger.info("Admin seed account successfully configured: {}", adminEmail);
    }
}
