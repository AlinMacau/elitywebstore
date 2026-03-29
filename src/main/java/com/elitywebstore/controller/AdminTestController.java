package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_ADMIN_API)
public class AdminTestController {

    @GetMapping("/test")
    public Map<String, String> testAdminAccess() {
        log.info("Admin test endpoint accessed successfully");
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin access granted");
        response.put("status", "success");
        return response;
    }
}