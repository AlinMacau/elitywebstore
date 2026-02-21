package com.elitywebstore.service;

import com.elitywebstore.entities.Product;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public List<ProductResponseDto> getAllProducts(String search, Long categoryId, Double minPrice, Double maxPrice) {
        List<Product> products = productRepository.findAll();
        
        // Apply filters (you can implement custom repository methods for better performance)
        return products.stream()
                .filter(p -> search == null || p.getName().toLowerCase().contains(search.toLowerCase()))
                .filter(p -> categoryId == null || p.getCategory().getId().equals(categoryId))
                .filter(p -> minPrice == null || p.getPrice() >= minPrice)
                .filter(p -> maxPrice == null || p.getPrice() <= maxPrice)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = getById(id);
        return convertToDto(product);
    }

    public List<ProductResponseDto> getFeaturedProducts() {
        // Get first 8 products as featured (you can add a featured flag to Product entity)
        return productRepository.findAll().stream()
                .limit(8)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    public void update(Product product) {
        productRepository.save(product);
    }

    private ProductResponseDto convertToDto(Product product) {
        ProductResponseDto dto = modelMapper.map(product, ProductResponseDto.class);
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
        }
        return dto;
    }
}
