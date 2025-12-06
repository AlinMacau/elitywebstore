package com.elitywebstore.controller;

import com.elitywebstore.client.PaymentClient;
import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_ORDERS_API)
public class OrderController {

    private final OrderService orderService;
    private final PaymentClient paymentClient;

    @PostMapping("/{cartId}")
    public void createOrder(@Valid @PathVariable Long cartId){
        orderService.createOrder(cartId);
    }

    @PostMapping("/{orderId}/pay")
    public OrderResponseDto payOrder(@PathVariable Long orderId){
        return paymentClient.pay(orderId);
    }

}
