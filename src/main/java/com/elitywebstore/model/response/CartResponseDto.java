package com.elitywebstore.model.response;

import com.elitywebstore.controller.CartController;
import com.elitywebstore.entities.Product;
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

    @Builder.Default
    private List<ProductResponseDto> products = new ArrayList<>();

    private Double productsPrice;

    private Double deliveryPrice;

    private Double total;

}
