package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.response.DashboardStatsResponseDto;
import com.elitywebstore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.ADMIN_DASHBOARD)
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardStatsResponseDto getDashboardStats() {
        log.info("Admin: Getting dashboard statistics");
        return dashboardService.getDashboardStats();
    }
}