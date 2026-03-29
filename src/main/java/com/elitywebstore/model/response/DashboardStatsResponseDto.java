package com.elitywebstore.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStatsResponseDto {
    private Long totalUsers;
    private Long totalProducts;
    private Long totalOrders;
    private Long pendingOrders;
    private Double totalRevenue;
    private Long activeProducts;
    private Long outOfStockProducts;
    private List<OrderResponseDto> recentOrders;
}