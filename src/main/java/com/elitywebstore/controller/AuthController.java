package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.LoginRequestDto;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(ApiEndpointConstants.USERS_SIGNUP)
    public void signUp(@Valid @RequestBody SignUpRequestDto signUpRequestDto){
        authService.createUser(signUpRequestDto);
    }

    @PostMapping(ApiEndpointConstants.USERS_LOGIN)
    public String login(@Valid @RequestBody LoginRequestDto loginRequestDto){
        return authService.loginUser(loginRequestDto);
    }

    @PutMapping(ApiEndpointConstants.TOKENS_INVALIDATE)
    public void invalidateTokens(@RequestParam(required = false) Long userId){
        if(userId != null){
            authService.invalidateUserToken(userId);
        }else {
            authService.invalidateAllTokens();
        }
    }

}
