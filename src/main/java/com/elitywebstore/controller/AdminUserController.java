package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.entities.ROLE;
import com.elitywebstore.model.response.AdminUserResponseDto;
import com.elitywebstore.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.ADMIN_USERS)
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<AdminUserResponseDto> getAllUsers() {
        log.info("Admin: Getting all users");
        return adminUserService.getAllUsers();
    }

    @GetMapping("/{id}")
    public AdminUserResponseDto getUserById(@PathVariable Long id) {
        log.info("Admin: Getting user by id: {}", id);
        return adminUserService.getUserById(id);
    }

    @PutMapping("/{id}/role")
    public AdminUserResponseDto updateUserRole(@PathVariable Long id, @RequestParam ROLE role) {
        log.info("Admin: Updating user {} role to {}", id, role);
        return adminUserService.updateUserRole(id, role);
    }
}