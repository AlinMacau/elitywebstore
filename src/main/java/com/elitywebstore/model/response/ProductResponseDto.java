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

    private Integer stock;

    private String categoryName;
}
