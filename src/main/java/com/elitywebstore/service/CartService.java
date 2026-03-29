package com.elitywebstore.service;

import com.elitywebstore.entities.Cart;
import com.elitywebstore.entities.Product;
import com.elitywebstore.entities.User;
import com.elitywebstore.model.request.CartItemRequestDto;
import com.elitywebstore.model.response.CartResponseDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserService userService;
    private final ProductService productService;
    private final ModelMapper modelMapper;

    public CartResponseDto getCartByUserId(Long userId) {
        log.info("Getting cart for user: {}", userId);
        User user = userService.getById(userId);
        Cart cart = user.getCart();
        
        // ✅ Create cart if it doesn't exist
        if (cart == null) {
            log.info("Cart not found for user {}, creating new cart", userId);
            cart = Cart.builder()
                    .products(new ArrayList<>())
                    .user(user)
                    .build();
            user.setCart(cart);
            cartRepository.save(cart);
            userService.save(user);
        }
        
        return convertToDto(cart);
    }

    public CartResponseDto addToCart(CartItemRequestDto request) {
        log.info("Adding product {} to cart for user {}", request.getProductId(), request.getUserId());
        User user = userService.getById(request.getUserId());
        Product product = productService.getById(request.getProductId());
        
        Cart cart = user.getCart();
        
        // ✅ Create cart if it doesn't exist
        if (cart == null) {
            log.info("Cart not found, creating new cart for user {}", request.getUserId());
            cart = Cart.builder()
                    .products(new ArrayList<>())
                    .user(user)
                    .build();
            user.setCart(cart);
        }
        
        if (!cart.getProducts().contains(product)) {
            cart.getProducts().add(product);
            cartRepository.save(cart);
            log.info("Product {} added to cart successfully", request.getProductId());
        } else {
            log.info("Product {} already in cart", request.getProductId());
        }
        
        return convertToDto(cart);
    }

    public CartResponseDto removeFromCart(Long userId, Long productId) {
        log.info("Removing product {} from cart for user {}", productId, userId);
        User user = userService.getById(userId);
        Cart cart = user.getCart();
        
        cart.getProducts().removeIf(p -> p.getId().equals(productId));
        cartRepository.save(cart);
        log.info("Product removed from cart successfully");
        
        return convertToDto(cart);
    }

    public void clearCart(Long userId) {
        log.info("Clearing cart for user: {}", userId);
        User user = userService.getById(userId);
        Cart cart = user.getCart();
        cart.getProducts().clear();
        cartRepository.save(cart);
        log.info("Cart cleared successfully");
    }

    private CartResponseDto convertToDto(Cart cart) {
        CartResponseDto dto = new CartResponseDto();
        dto.setId(cart.getId());
        dto.setProducts(cart.getProducts().stream()
                .map(p -> modelMapper.map(p, ProductResponseDto.class))
                .collect(Collectors.toList()));
        dto.setProductsPrice(cart.getProducts().stream()
                .mapToDouble(Product::getPrice)
                .sum());
        return dto;
    }
}
