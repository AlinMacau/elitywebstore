package com.elitywebstore.service;

import com.elitywebstore.entities.Cart;
import com.elitywebstore.entities.CartItem;
import com.elitywebstore.entities.Product;
import com.elitywebstore.entities.User;
import com.elitywebstore.model.request.CartItemRequestDto;
import com.elitywebstore.model.request.UpdateCartItemQuantityRequestDto;
import com.elitywebstore.model.response.CartItemResponseDto;
import com.elitywebstore.model.response.CartResponseDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.CartItemRepository;
import com.elitywebstore.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final ProductService productService;
    private final ModelMapper modelMapper;

    // ==================== GET CART ====================
    
    @Transactional(readOnly = true)
    public CartResponseDto getCartByUserId(Long userId) {
        log.info("Getting cart for user: {}", userId);
        User user = userService.getById(userId);
        Cart cart = getOrCreateCart(user);
        return convertToDto(cart);
    }

    // ==================== ADD TO CART ====================
    
    @Transactional
    public CartResponseDto addToCart(CartItemRequestDto request) {
        log.info("Adding product {} to cart for user {} with quantity {}", 
                request.getProductId(), request.getUserId(), request.getQuantity());
        
        User user = userService.getById(request.getUserId());
        Product product = productService.getById(request.getProductId());
        Cart cart = getOrCreateCart(user);
        
        int requestedQuantity = request.getQuantity() != null ? request.getQuantity() : 1;
        
        // Check if product already exists in cart
        Optional<CartItem> existingItem = cart.findItemByProductId(product.getId());
        
        if (existingItem.isPresent()) {
            // Update existing item quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + requestedQuantity;
            
            // Validate stock
            validateStock(product, newQuantity);
            
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
            log.info("Updated quantity for product {} to {}", product.getId(), newQuantity);
        } else {
            // Validate stock for new item
            validateStock(product, requestedQuantity);
            
            // Create new cart item
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(requestedQuantity)
                    .build();
            
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
            log.info("Added new product {} to cart with quantity {}", product.getId(), requestedQuantity);
        }
        
        return convertToDto(cart);
    }

    // ==================== UPDATE QUANTITY ====================
    
    @Transactional
    public CartResponseDto updateQuantity(UpdateCartItemQuantityRequestDto request) {
        log.info("Updating quantity for product {} to {} for user {}", 
                request.getProductId(), request.getQuantity(), request.getUserId());
        
        User user = userService.getById(request.getUserId());
        Product product = productService.getById(request.getProductId());
        Cart cart = getOrCreateCart(user);
        
        CartItem item = cart.findItemByProductId(product.getId())
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));
        
        // Validate stock
        validateStock(product, request.getQuantity());
        
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        
        log.info("Quantity updated successfully");
        return convertToDto(cart);
    }

    // ==================== INCREASE QUANTITY ====================
    
    @Transactional
    public CartResponseDto increaseQuantity(Long userId, Long productId) {
        log.info("Increasing quantity for product {} for user {}", productId, userId);
        
        User user = userService.getById(userId);
        Product product = productService.getById(productId);
        Cart cart = getOrCreateCart(user);
        
        CartItem item = cart.findItemByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));
        
        int newQuantity = item.getQuantity() + 1;
        
        // Validate stock
        validateStock(product, newQuantity);
        
        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
        
        log.info("Quantity increased to {}", newQuantity);
        return convertToDto(cart);
    }

    // ==================== DECREASE QUANTITY ====================
    
    @Transactional
    public CartResponseDto decreaseQuantity(Long userId, Long productId) {
        log.info("Decreasing quantity for product {} for user {}", productId, userId);
        
        User user = userService.getById(userId);
        Cart cart = getOrCreateCart(user);
        
        CartItem item = cart.findItemByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));
        
        if (item.getQuantity() <= 1) {
            // Remove item if quantity would become 0
            cart.removeItem(item);
            cartItemRepository.delete(item);
            log.info("Removed product {} from cart (quantity was 1)", productId);
        } else {
            item.setQuantity(item.getQuantity() - 1);
            cartItemRepository.save(item);
            log.info("Quantity decreased to {}", item.getQuantity());
        }
        
        return convertToDto(cart);
    }

    // ==================== REMOVE FROM CART ====================
    
    @Transactional
    public CartResponseDto removeFromCart(Long userId, Long productId) {
        log.info("Removing product {} from cart for user {}", productId, userId);
        
        User user = userService.getById(userId);
        Cart cart = getOrCreateCart(user);
        
        Optional<CartItem> item = cart.findItemByProductId(productId);
        
        if (item.isPresent()) {
            cart.removeItem(item.get());
            cartItemRepository.delete(item.get());
            log.info("Product removed from cart successfully");
        } else {
            log.warn("Product {} not found in cart for user {}", productId, userId);
        }
        
        return convertToDto(cart);
    }

    // ==================== CLEAR CART ====================
    
    @Transactional
    public void clearCart(Long userId) {
        log.info("Clearing cart for user: {}", userId);
        
        User user = userService.getById(userId);
        Cart cart = getOrCreateCart(user);
        
        cartItemRepository.deleteAllByCartId(cart.getId());
        cart.clearItems();
        
        log.info("Cart cleared successfully");
    }

    // ==================== HELPER METHODS ====================
    
    /**
     * Get existing cart or create new one for user
     */
    private Cart getOrCreateCart(User user) {
        Cart cart = user.getCart();
        
        if (cart == null) {
            log.info("Cart not found for user {}, creating new cart", user.getId());
            cart = Cart.builder()
                    .items(new ArrayList<>())
                    .user(user)
                    .build();
            user.setCart(cart);
            cartRepository.save(cart);
            userService.save(user);
        }
        
        return cart;
    }
    
    /**
     * Validate that requested quantity doesn't exceed available stock
     */
    private void validateStock(Product product, int requestedQuantity) {
        if (product.getStock() == null || product.getStock() < requestedQuantity) {
            int available = product.getStock() != null ? product.getStock() : 0;
            throw new RuntimeException(
                    String.format("Insufficient stock for product '%s'. Requested: %d, Available: %d",
                            product.getName(), requestedQuantity, available));
        }
    }
    
    /**
     * Convert Cart entity to DTO
     */
    private CartResponseDto convertToDto(Cart cart) {
        CartResponseDto dto = new CartResponseDto();
        dto.setId(cart.getId());
        
        // Convert cart items
        dto.setItems(cart.getItems().stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList()));
        
        // Calculate totals
        dto.setProductsPrice(cart.getTotalPrice());
        dto.setTotalItemCount(cart.getTotalItemCount());
        dto.setUniqueProductCount(cart.getItems().size());
        
        // Backwards compatibility: also populate products list
        dto.setProducts(cart.getItems().stream()
                .map(item -> modelMapper.map(item.getProduct(), ProductResponseDto.class))
                .collect(Collectors.toList()));
        
        return dto;
    }
    
    /**
     * Convert CartItem entity to DTO
     */
    private CartItemResponseDto convertItemToDto(CartItem item) {
        Product product = item.getProduct();
        int availableStock = product.getStock() != null ? product.getStock() : 0;
        
        return CartItemResponseDto.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productDescription(product.getDescription())
                .productImageUrl(product.getImageUrl())
                .unitPrice(product.getPrice())
                .quantity(item.getQuantity())
                .lineTotal(item.getLineTotal())
                .availableStock(availableStock)
                .canIncreaseQuantity(item.getQuantity() < availableStock)
                .build();
    }
}
