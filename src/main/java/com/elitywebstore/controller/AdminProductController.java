package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.ProductRequestDto;
import com.elitywebstore.model.request.ProductUpdateRequestDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.ADMIN_PRODUCTS)
public class AdminProductController {

    private final ProductService productService;
      @GetMapping
      public List<ProductResponseDto> getAllProducts() {
          log.info("Admin: Getting all products (including inactive)");
          return productService.getAllProductsForAdmin();
      }

      @GetMapping("/{id}")
      public ProductResponseDto getProductById(@PathVariable Long id) {
          log.info("Admin: Getting product by id: {}", id);
          return productService.getProductByIdForAdmin(id);
      }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponseDto createProduct(@Valid @RequestBody ProductRequestDto request) {
        log.info("Admin: Creating new product: {}", request.getName());
        return productService.createProduct(request);
    }

    @PutMapping
    public ProductResponseDto updateProduct(@Valid @RequestBody ProductUpdateRequestDto request) {
        log.info("Admin: Updating product: {}", request.getId());
        return productService.updateProduct(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        log.info("Admin: Deleting product: {}", id);
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}/reactivate")
    public ProductResponseDto reactivateProduct(@PathVariable Long id) {
        log.info("Admin: Reactivating product: {}", id);
        return productService.reactivateProduct(id);
    }
}