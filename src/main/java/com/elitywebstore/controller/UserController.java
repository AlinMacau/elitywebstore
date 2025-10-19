package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.service.UserService;
import jakarta.validation.Valid;
import org.apache.catalina.UserDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiEndpointConstants.BASE_USERS_API)
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(ApiEndpointConstants.USERS_SIGNUP)
    public void signUp(@Valid @RequestBody SignUpRequestDto signUpRequestDto){
        userService.createUser(signUpRequestDto);
    }

}
