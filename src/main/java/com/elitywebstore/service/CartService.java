package com.elitywebstore.service;

import com.elitywebstore.entities.Cart;
import com.elitywebstore.entities.Product;
import com.elitywebstore.entities.User;
import com.elitywebstore.model.request.CartItemRequestDto;
import com.elitywebstore.model.response.CartResponseDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserService userService;
    private final ProductService productService;
    private final ModelMapper modelMapper;

    public CartResponseDto getCartByUserId(Long userId) {
        User user = userService.getById(userId);
        Cart cart = user.getCart();
        return convertToDto(cart);
    }

    public CartResponseDto addToCart(CartItemRequestDto request) {
        User user = userService.getById(request.getUserId());
        Product product = productService.getById(request.getProductId());
        
        Cart cart = user.getCart();
        if (!cart.getProducts().contains(product)) {
            cart.getProducts().add(product);
            cartRepository.save(cart);
        }
        
        return convertToDto(cart);
    }

    public CartResponseDto removeFromCart(Long userId, Long productId) {
        User user = userService.getById(userId);
        Cart cart = user.getCart();
        
        cart.getProducts().removeIf(p -> p.getId().equals(productId));
        cartRepository.save(cart);
        
        return convertToDto(cart);
    }

    public void clearCart(Long userId) {
        User user = userService.getById(userId);
        Cart cart = user.getCart();
        cart.getProducts().clear();
        cartRepository.save(cart);
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
