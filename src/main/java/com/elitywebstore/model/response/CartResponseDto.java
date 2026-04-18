package com.elitywebstore.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponseDto {

    private Long id;

    // ==================== NEW: Cart items with quantity ====================
    
    @Builder.Default
    private List<CartItemResponseDto> items = new ArrayList<>();
    
    // Total price of all products (sum of line totals)
    private Double productsPrice;
    
    // Total number of items (sum of quantities)
    private Integer totalItemCount;
    
    // Number of unique products
    private Integer uniqueProductCount;

    private Double deliveryPrice;

    private Double total;
    
    // ==================== DEPRECATED: Keep for backwards compatibility ====================
    
    @Deprecated
    @Builder.Default
    private List<ProductResponseDto> products = new ArrayList<>();
}
