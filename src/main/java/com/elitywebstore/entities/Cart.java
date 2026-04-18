package com.elitywebstore.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "cart")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==================== NEW: CartItem relationship with quantity ====================
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "cart")
    private User user;
    
    // ==================== DEPRECATED: Old ManyToMany (keep for migration period) ====================
    
    @Deprecated
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "cart_product",
            joinColumns = @JoinColumn(name = "cart_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @Builder.Default
    private List<Product> products = new ArrayList<>();
    
    // ==================== Helper Methods ====================
    
    /**
     * Find a cart item by product ID
     */
    public Optional<CartItem> findItemByProductId(Long productId) {
        return items.stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
    }
    
    /**
     * Add a new item to the cart
     */
    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }
    
    /**
     * Remove an item from the cart
     */
    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }
    
    /**
     * Remove item by product ID
     */
    public boolean removeItemByProductId(Long productId) {
        return items.removeIf(item -> item.getProduct().getId().equals(productId));
    }
    
    /**
     * Calculate total price of all items (with quantities)
     */
    public Double getTotalPrice() {
        return items.stream()
                .mapToDouble(CartItem::getLineTotal)
                .sum();
    }
    
    /**
     * Get total number of items (sum of quantities)
     */
    public Integer getTotalItemCount() {
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
    
    /**
     * Clear all items from cart
     */
    public void clearItems() {
        items.clear();
    }
}
