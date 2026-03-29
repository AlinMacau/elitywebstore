package com.elitywebstore.service;

import com.elitywebstore.entities.ROLE;
import com.elitywebstore.entities.User;
import com.elitywebstore.entities.UserDetails;
import com.elitywebstore.model.request.LoginRequestDto;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.model.response.LoginResponseDto;
import com.elitywebstore.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public void createUser(@Valid SignUpRequestDto signUpRequestDto) {
        log.info("Creating new user with email: {}", signUpRequestDto.getEmail());

        UserDetails userDetails = UserDetails.builder()
                .firstName(signUpRequestDto.getFirstName())
                .lastName(signUpRequestDto.getLastName())
                .phoneNumber(signUpRequestDto.getPhoneNumber())
                .build();

        User user = User.builder()
                .email(signUpRequestDto.getEmail())
                .password(passwordEncoder.encode(signUpRequestDto.getPassword()))
                .details(userDetails)
                .role(ROLE.CUSTOMER)
                .build();

        userService.save(user);
        log.info("User created successfully with id: {} and role: {}", user.getId(), user.getRole());
    }

    public LoginResponseDto loginUser(@Valid LoginRequestDto loginRequestDto) {
        log.info("Login attempt for user: {}", loginRequestDto.getEmail());
        User user = userService.getByEmail(loginRequestDto.getEmail());

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            log.error("Invalid credentials for user: {}", loginRequestDto.getEmail());
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());

        user.setActiveToken(token);
        userService.save(user);

        log.info("User logged in successfully: {} with userId: {} and role: {}", 
                user.getEmail(), user.getId(), user.getRole());
        
        return LoginResponseDto.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public void invalidateUserToken(Long userId) {
        log.info("Invalidating token for user: {}", userId);
        User user = userService.getById(userId);
        user.setActiveToken(null);
        userService.save(user);
        log.info("Token invalidated successfully for user: {}", userId);
    }

    public void createAdminUser(String email, String password, String firstName, String lastName) {
        log.info("Creating admin user with email: {}", email);

        UserDetails userDetails = UserDetails.builder()
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber("N/A")
                .build();

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .details(userDetails)
                .role(ROLE.ADMIN)
                .build();

        userService.save(user);
        log.info("Admin user created successfully with id: {}", user.getId());
    }

    public void invalidateAllTokens() {
        log.info("Invalidating all user tokens");
        userRepository.findAll().forEach(user -> {
            user.setActiveToken(null);
            userRepository.save(user);
        });
        log.info("All tokens invalidated successfully");
    }
}
