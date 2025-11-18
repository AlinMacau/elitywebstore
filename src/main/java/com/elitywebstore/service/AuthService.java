package com.elitywebstore.service;

import com.elitywebstore.config.SecretConfig;
import com.elitywebstore.entities.User;
import com.elitywebstore.entities.UserDetails;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecretConfig secretConfig;

    @Autowired
    private UserService userService;

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

        log.info("User created: {}", user );
    }

    public String loginUser(@Valid SignUpRequestDto signUpRequestDto) {
        User user = userRepository.getByEmail(signUpRequestDto.getEmail())
                .orElseThrow(() -> new EntityNotFoundException());

        if(passwordEncoder.matches(signUpRequestDto.getPassword(), user.getPassword())){
            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(Date.from(LocalDateTime.now().plusHours(1).atZone(ZoneId.systemDefault()).toInstant()))
                    .signWith(SignatureAlgorithm.HS256, secretConfig.getSecretKey().getBytes())
                    .compact();

            user.setActiveToken(token);
            userService.save(user);

            return token;
        }

        return "Invalid Credentials";
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
