package com.elitywebstore.service;

import com.elitywebstore.entities.Category;
import com.elitywebstore.entities.Product;
import com.elitywebstore.model.request.ProductRequestDto;
import com.elitywebstore.model.request.ProductUpdateRequestDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    // ==================== PUBLIC METHODS ====================

    public List<ProductResponseDto> getAllProducts(String search, Long categoryId, Double minPrice, Double maxPrice) {
        log.info("Getting all products with filters - search: {}, categoryId: {}, minPrice: {}, maxPrice: {}", 
                search, categoryId, minPrice, maxPrice);
        
        List<Product> products = productRepository.findAll();
        
        return products.stream()
                .filter(p -> p.getActive() == null || p.getActive()) // Only active products
                .filter(p -> search == null || p.getName().toLowerCase().contains(search.toLowerCase()))
                .filter(p -> categoryId == null || (p.getCategory() != null && p.getCategory().getId().equals(categoryId)))
                .filter(p -> minPrice == null || p.getPrice() >= minPrice)
                .filter(p -> maxPrice == null || p.getPrice() <= maxPrice)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductById(Long id) {
        log.info("Getting product by id: {}", id);
        Product product = getById(id);
        
        // Check if product is active for public access
        if (product.getActive() != null && !product.getActive()) {
            log.warn("Attempted to access inactive product: {}", id);
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        
        return convertToDto(product);
    }

    public List<ProductResponseDto> getFeaturedProducts() {
        log.info("Getting featured products");
        return productRepository.findAll().stream()
                .filter(p -> p.getActive() == null || p.getActive()) // Only active products
                .limit(8)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    // ==================== ADMIN METHODS ====================

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto request) {
        log.info("Creating new product: {}", request.getName());
        
        Category category = categoryService.getById(request.getCategoryId());
        
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category)
                .active(true)
                .build();
        
        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with id: {}", savedProduct.getId());
        
        return convertToDtoWithStatus(savedProduct);
    }

    @Transactional
    public ProductResponseDto updateProduct(ProductUpdateRequestDto request) {
        log.info("Updating product with id: {}", request.getId());
        
        Product product = getById(request.getId());
        
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryService.getById(request.getCategoryId());
            product.setCategory(category);
        }
        
        Product updatedProduct = productRepository.save(product);
        log.info("Product updated successfully: {}", updatedProduct.getId());
        
        return convertToDtoWithStatus(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product with id: {}", id);
        
        Product product = getById(id);
        
        // Check if product has been ordered
        if (product.getOrders() != null && !product.getOrders().isEmpty()) {
            // Soft delete - mark as inactive
            log.info("Product {} has {} orders, performing soft delete", id, product.getOrders().size());
            product.setActive(false);
            product.setStock(0);
            productRepository.save(product);
            log.info("Product soft deleted (deactivated) successfully: {}", id);
        } else {
            // Hard delete - no orders reference this product
            log.info("Product {} has no orders, performing hard delete", id);
            productRepository.delete(product);
            log.info("Product hard deleted successfully: {}", id);
        }
    }

    @Transactional
    public ProductResponseDto reactivateProduct(Long id) {
        log.info("Reactivating product with id: {}", id);
        
        Product product = getById(id);
        
        if (product.getActive() == null || product.getActive()) {
            log.warn("Product {} is already active", id);
            throw new RuntimeException("Product is already active");
        }
        
        product.setActive(true);
        Product savedProduct = productRepository.save(product);
        
        log.info("Product reactivated successfully: {}", id);
        return convertToDtoWithStatus(savedProduct);
    }

    public List<ProductResponseDto> getAllProductsForAdmin() {
        log.info("Getting all products for admin (including inactive)");
        return productRepository.findAll().stream()
                .map(this::convertToDtoWithStatus)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductByIdForAdmin(Long id) {
        log.info("Getting product by id for admin: {}", id);
        Product product = getById(id);
        return convertToDtoWithStatus(product);
    }

    // ==================== HELPER METHODS ====================

    private ProductResponseDto convertToDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        return dto;
    }

    private ProductResponseDto convertToDtoWithStatus(Product product) {
        ProductResponseDto dto = convertToDto(product);
        dto.setActive(product.getActive() == null ? true : product.getActive());
        return dto;
    }
}