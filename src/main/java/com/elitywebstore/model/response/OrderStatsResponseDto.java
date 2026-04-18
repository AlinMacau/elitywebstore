package com.elitywebstore.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderStatsResponseDto {
    private Long totalOrders;
    private Long pendingOrders;
    private Long processingOrders;
    private Long sentOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Double totalRevenue;
}