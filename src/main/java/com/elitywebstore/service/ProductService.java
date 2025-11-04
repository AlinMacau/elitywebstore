package com.elitywebstore.service;

import com.elitywebstore.entities.Product;
import com.elitywebstore.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;


    public Product getById(Long id) {
       return productRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("User not found"));
    }

    public void update(Product product){
        productRepository.save(product);
    }
}
