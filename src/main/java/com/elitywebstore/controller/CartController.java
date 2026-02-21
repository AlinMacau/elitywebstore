package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.CartItemRequestDto;
import com.elitywebstore.model.response.CartResponseDto;
import com.elitywebstore.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_CARTS_API)
public class CartController {

    private final CartService cartService;

    @GetMapping("/user/{userId}")
    public CartResponseDto getCartByUserId(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId);
    }

    @PostMapping("/add")
    public CartResponseDto addToCart(@Valid @RequestBody CartItemRequestDto cartItemRequestDto) {
        return cartService.addToCart(cartItemRequestDto);
    }

    @DeleteMapping("/remove/{userId}/{productId}")
    public CartResponseDto removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        return cartService.removeFromCart(userId, productId);
    }

    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
}
