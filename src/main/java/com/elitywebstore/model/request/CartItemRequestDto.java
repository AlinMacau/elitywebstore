package com.elitywebstore.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequestDto {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Product ID is required")
    private Long productId;
}