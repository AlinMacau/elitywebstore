package com.elitywebstore.service;

import com.elitywebstore.config.SecretConfig;
import com.elitywebstore.entities.User;
import com.elitywebstore.entities.UserDetails;
import com.elitywebstore.model.request.LoginRequestDto;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final PasswordEncoder passwordEncoder;
        private final UserRepository userRepository;
        private final SecretConfig secretConfig;
        private final UserService userService;

        public void createUser(@Valid SignUpRequestDto signUpRequestDto) {

            UserDetails userDetails = UserDetails.builder()
                    .firstName(signUpRequestDto.getFirstName())
                    .lastName(signUpRequestDto.getLastName())
                    .phoneNumber(signUpRequestDto.getPhoneNumber())
                    .build();

            User user = User.builder()
                    .email(signUpRequestDto.getEmail())
                    .password(passwordEncoder.encode(signUpRequestDto.getPassword()))
                    .details(userDetails)
                    .build();

            userService.save(user);

            log.info("User created: {}", user);
        }

        public String loginUser(@Valid LoginRequestDto loginRequestDto) {
            User user = userService.getByEmail(loginRequestDto.getEmail());

            if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                    .signWith(SignatureAlgorithm.HS512, secretConfig.getSecretKey())
                    .compact();

            user.setActiveToken(token);
            userService.save(user);

            log.info("User logged in: {}", user.getEmail());
            return token;
        }

        public void invalidateUserToken(Long userId) {
            User user = userService.getById(userId);
            user.setActiveToken(null);
            userService.save(user);
        }

        public void invalidateAllTokens() {
            userRepository.invalidateAllTokens();
        }
}
