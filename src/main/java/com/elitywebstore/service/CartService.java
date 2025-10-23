package com.elitywebstore.service;

import com.elitywebstore.entities.Cart;
import com.elitywebstore.entities.Product;
import com.elitywebstore.entities.User;
import com.elitywebstore.model.request.UpdateCartDto;
import com.elitywebstore.repository.CartRepository;
import com.elitywebstore.repository.ProductRepository;
import com.elitywebstore.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
public class CartService {
        @Autowired
        private CartRepository cartRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private UserService userService;

        @Autowired
        private ProductService productService;

    public void updateCart(UpdateCartDto updateCartDto) {
        User user = userService.getById(updateCartDto.getUserId());

        user.setCart(new Cart());
        Cart cart = user.getCart();

        Product product = productService.getById(updateCartDto.getProductId());

        cart.getProducts().addAll(Collections.nCopies(updateCartDto.getQuantity(), product));

        userRepository.save(user);


    }
}
