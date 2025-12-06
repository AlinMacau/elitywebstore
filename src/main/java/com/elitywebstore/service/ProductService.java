package com.elitywebstore.service;

import com.elitywebstore.entities.Product;
import com.elitywebstore.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;


    public Product getById(Long id) {
       return productRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("User not found"));
    }

    public void update(Product product){
        productRepository.save(product);
    }
}
