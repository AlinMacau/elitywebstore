package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.UserUpdateRequestDto;
import com.elitywebstore.model.response.UserResponseDto;
import com.elitywebstore.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_USERS_API)
public class UserController {

    private final UserService userService;

    @GetMapping()
    public List<UserResponseDto> listAllUsers(){
        return userService.listAllUsers();
    }

    @GetMapping("/details/{id}")
    public UserResponseDto getById(@PathVariable Long id){
        return userService.getDtoById(id);
    }

    @PutMapping()
    public void updateUser(@Valid @RequestBody UserUpdateRequestDto userUpdateRequestDto){
        userService.updateUser(userUpdateRequestDto);
    }

    @DeleteMapping("/details/{id}")
    public void deleteById(@PathVariable Long id){
        userService.deleteById(id);
    }
}