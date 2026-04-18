package com.elitywebstore.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponseDto {
    
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    
    // ==================== Stock information ====================
    
    private Integer stock;
    private Boolean inStock;
    
    // ==================== Status (for admin) ====================
    
    private Boolean active;
}
