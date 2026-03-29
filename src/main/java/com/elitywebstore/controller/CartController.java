package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.CartItemRequestDto;
import com.elitywebstore.model.response.CartResponseDto;
import com.elitywebstore.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_CARTS_API)
public class CartController {

    private final CartService cartService;

    @GetMapping("/user/{userId}")
    public CartResponseDto getCartByUserId(@PathVariable Long userId) {
        log.info("Getting cart for user: {}", userId);
        return cartService.getCartByUserId(userId);
    }

    @PostMapping("/add")
    public CartResponseDto addToCart(@Valid @RequestBody CartItemRequestDto cartItemRequestDto) {
        log.info("Adding to cart: {}", cartItemRequestDto);
        CartResponseDto response = cartService.addToCart(cartItemRequestDto);
        log.info("Product added to cart successfully");
        return response;
    }

    @DeleteMapping("/remove/{userId}/{productId}")
    public CartResponseDto removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        log.info("Removing product {} from cart for user {}", productId, userId);
        return cartService.removeFromCart(userId, productId);
    }

    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
        log.info("Clearing cart for user: {}", userId);
        cartService.clearCart(userId);
        log.info("Cart cleared successfully");
    }
}
