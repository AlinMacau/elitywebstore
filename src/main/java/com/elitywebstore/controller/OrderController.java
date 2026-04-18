package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.OrderRequestDto;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_ORDERS_API)
@Slf4j
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponseDto createOrder(@Valid @RequestBody OrderRequestDto orderRequestDto) {
        log.info("Creating order for user: {}", orderRequestDto.getUserId());
        return orderService.createOrder(orderRequestDto);
    }

    @GetMapping("/user/{userId}")
    public List<OrderResponseDto> getOrdersByUserId(@PathVariable Long userId) {
        log.info("Getting orders for user: {}", userId);
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping(ApiEndpointConstants.BY_ID)
    public OrderResponseDto getOrderById(@PathVariable Long id) {
        log.info("Getting order by id: {}", id);
        return orderService.getOrderById(id);
    }

    /**
     * Get order by ID with user ownership validation.
     * This endpoint ensures users can only view their own orders.
     */
    @GetMapping("/{orderId}/user/{userId}")
    public OrderResponseDto getOrderByIdForUser(
            @PathVariable Long orderId,
            @PathVariable Long userId) {
        log.info("Getting order {} for user {}", orderId, userId);
        return orderService.getOrderByIdForUser(orderId, userId);
    }
}
