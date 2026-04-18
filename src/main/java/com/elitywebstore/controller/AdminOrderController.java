package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.entities.PaymentStatus;
import com.elitywebstore.entities.STATUS;
import com.elitywebstore.model.request.AdminOrderUpdateRequestDto;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.model.response.OrderStatsResponseDto;
import com.elitywebstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.ADMIN_ORDERS)
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponseDto> getAllOrders(@RequestParam(required = false) STATUS status) {
        log.info("Admin: Getting all orders, status filter: {}", status);
        return orderService.getAllOrdersForAdmin(status);
    }

    @GetMapping("/{id}")
    public OrderResponseDto getOrderById(@PathVariable Long id) {
        log.info("Admin: Getting order by id: {}", id);
        return orderService.getOrderByIdForAdmin(id);
    }

    @PutMapping("/{id}")
    public OrderResponseDto updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody AdminOrderUpdateRequestDto request,
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        log.info("Admin: Updating order {} with request: {}", id, request);
        return orderService.updateOrderForAdmin(id, request, adminEmail);
    }

    @PutMapping("/{id}/status")
    public OrderResponseDto updateOrderStatus(@PathVariable Long id, @RequestParam STATUS status) {
        log.info("Admin: Updating order {} status to {}", id, status);
        return orderService.updateOrderStatus(id, status);
    }

    /**
     * Update payment status for an order.
     * Used primarily to mark bank transfer orders as paid.
     */
    @PutMapping("/{id}/payment-status")
    public OrderResponseDto updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus paymentStatus,
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        log.info("Admin: Updating order {} payment status to {}", id, paymentStatus);
        return orderService.updatePaymentStatus(id, paymentStatus, adminEmail);
    }

    @GetMapping("/stats")
    public OrderStatsResponseDto getOrderStats() {
        log.info("Admin: Getting order statistics");
        return orderService.getOrderStats();
    }
}