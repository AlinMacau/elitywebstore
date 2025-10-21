package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.model.response.UserResponseDto;
import com.elitywebstore.model.request.UserUpdateRequestDto;
import com.elitywebstore.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpointConstants.BASE_USERS_API)
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(ApiEndpointConstants.USERS_SIGNUP)
    public void signUp(@Valid @RequestBody SignUpRequestDto signUpRequestDto){
        userService.createUser(signUpRequestDto);
    }

    @GetMapping(ApiEndpointConstants.USERS_LIST_ALL)
    public List<UserResponseDto> listAllUsers(){
        return userService.listAllUsers();
    }

    @PutMapping(ApiEndpointConstants.USERS_UPDATE)
    public void updateUser(@RequestBody UserUpdateRequestDto userUpdateRequestDto){
        userService.updateUser(userUpdateRequestDto);
    }

    //getbyid
    //delete
    //update for address (separat sau nu?)


}
