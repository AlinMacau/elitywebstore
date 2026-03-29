package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.LoginRequestDto;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.model.response.LoginResponseDto;
import com.elitywebstore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_API_V1)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/users/signup")
    public void signUp(@Valid @RequestBody SignUpRequestDto signUpRequestDto) {
        log.info("Signup request for email: {}", signUpRequestDto.getEmail());
        authService.createUser(signUpRequestDto);
        log.info("User signed up successfully");
    }

    @PostMapping("/users/login")
    public LoginResponseDto login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        log.info("Login request for email: {}", loginRequestDto.getEmail());
        LoginResponseDto response = authService.loginUser(loginRequestDto);
        log.info("User logged in successfully with userId: {}", response.getUserId());
        return response;
    }

    @PutMapping("/users/tokens/invalidate")
    public void invalidateTokens(@RequestParam(required = false) Long userId) {
        log.info("Token invalidation request for userId: {}", userId);
        if(userId != null){
            authService.invalidateUserToken(userId);
        } else {
            authService.invalidateAllTokens();
        }
        log.info("Token invalidated successfully");
    }

}
