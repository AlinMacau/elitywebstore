package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_PRODUCTS_API)
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponseDto> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return productService.getAllProducts(search, categoryId, minPrice, maxPrice);
    }

    @GetMapping(ApiEndpointConstants.BY_ID)
    public ProductResponseDto getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/featured")
    public List<ProductResponseDto> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }
}