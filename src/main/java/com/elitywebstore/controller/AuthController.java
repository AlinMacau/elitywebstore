package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.service.AuthService;
import com.elitywebstore.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping(ApiEndpointConstants.USERS_SIGNUP)
    public void signUp(@Valid @RequestBody SignUpRequestDto signUpRequestDto){
        authService.createUser(signUpRequestDto);
    }

    @PostMapping(ApiEndpointConstants.USERS_LOGIN)
    public String login(@Valid @RequestBody SignUpRequestDto signUpRequestDto){
        return authService.loginUser(signUpRequestDto);
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
