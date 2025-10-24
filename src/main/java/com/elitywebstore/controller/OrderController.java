package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiEndpointConstants.BASE_ORDERS_API)
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/{cartId}")
    public void createOrder(@Valid @PathVariable Long cartId){
        orderService.createOrder(cartId);
    }

}
