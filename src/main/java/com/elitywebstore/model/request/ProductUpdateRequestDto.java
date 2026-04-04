package com.elitywebstore.model.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductUpdateRequestDto {
    
    @NotNull(message = "Product ID is required")
    private Long id;
    
    private String name;
    
    private String description;
    
    @Positive(message = "Price must be greater than 0")
    private Double price;
    
    @PositiveOrZero(message = "Stock cannot be negative")
    private Integer stock;
    
    private Long categoryId;

    @URL(message = "Image URL must be a valid URL")
    private String imageUrl;
}