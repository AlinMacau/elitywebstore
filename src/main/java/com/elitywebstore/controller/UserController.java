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

    @GetMapping()
    public List<UserResponseDto> listAllUsers(){
        return userService.listAllUsers();
    }

    @GetMapping(ApiEndpointConstants.USERS_GET_BY_ID)
    public UserResponseDto getById(@PathVariable Long id){
        return userService.getDtoById(id);
    }

    @PutMapping()
    public void updateUser(@Valid @RequestBody UserUpdateRequestDto userUpdateRequestDto){
        userService.updateUser(userUpdateRequestDto);
    }

    @DeleteMapping(ApiEndpointConstants.USERS_DELETE_BY_ID)
    public void deleteById(@PathVariable Long id){
        userService.deleteById(id);
    }

    //update for address (separat sau nu?)

}
