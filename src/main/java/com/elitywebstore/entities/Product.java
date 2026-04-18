package com.elitywebstore.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="product")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Double price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(mappedBy = "products", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Order> orders = new ArrayList<>();

    // ==================== NEW: Stock field for quantity validation ====================
    
    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;
    
    /**
     * Check if requested quantity is available
     */
    public boolean hasStock(int requestedQuantity) {
        return stock != null && stock >= requestedQuantity;
    }
    
    /**
     * Decrease stock by specified amount
     */
    public void decreaseStock(int amount) {
        if (stock != null && stock >= amount) {
            this.stock -= amount;
        } else {
            throw new IllegalStateException("Insufficient stock");
        }
    }
    
    /**
     * Increase stock by specified amount
     */
    public void increaseStock(int amount) {
        this.stock = (stock != null ? stock : 0) + amount;
    }

}
