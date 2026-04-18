package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.CartItemRequestDto;
import com.elitywebstore.model.request.UpdateCartItemQuantityRequestDto;
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

    // ==================== GET CART ====================
    
    @GetMapping("/user/{userId}")
    public CartResponseDto getCartByUserId(@PathVariable Long userId) {
        log.info("Getting cart for user: {}", userId);
        return cartService.getCartByUserId(userId);
    }

    // ==================== ADD TO CART ====================
    
    @PostMapping("/add")
    public CartResponseDto addToCart(@Valid @RequestBody CartItemRequestDto request) {
        log.info("Adding to cart: {}", request);
        CartResponseDto response = cartService.addToCart(request);
        log.info("Product added to cart successfully");
        return response;
    }

    // ==================== UPDATE QUANTITY ====================
    
    @PutMapping("/update-quantity")
    public CartResponseDto updateQuantity(@Valid @RequestBody UpdateCartItemQuantityRequestDto request) {
        log.info("Updating cart item quantity: {}", request);
        return cartService.updateQuantity(request);
    }

    // ==================== INCREASE QUANTITY ====================
    
    @PutMapping("/increase/{userId}/{productId}")
    public CartResponseDto increaseQuantity(
            @PathVariable Long userId, 
            @PathVariable Long productId) {
        log.info("Increasing quantity for product {} for user {}", productId, userId);
        return cartService.increaseQuantity(userId, productId);
    }

    // ==================== DECREASE QUANTITY ====================
    
    @PutMapping("/decrease/{userId}/{productId}")
    public CartResponseDto decreaseQuantity(
            @PathVariable Long userId, 
            @PathVariable Long productId) {
        log.info("Decreasing quantity for product {} for user {}", productId, userId);
        return cartService.decreaseQuantity(userId, productId);
    }

    // ==================== REMOVE FROM CART ====================
    
    @DeleteMapping("/remove/{userId}/{productId}")
    public CartResponseDto removeFromCart(
            @PathVariable Long userId, 
            @PathVariable Long productId) {
        log.info("Removing product {} from cart for user {}", productId, userId);
        return cartService.removeFromCart(userId, productId);
    }

    // ==================== CLEAR CART ====================
    
    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
        log.info("Clearing cart for user: {}", userId);
        cartService.clearCart(userId);
        log.info("Cart cleared successfully");
    }
}
