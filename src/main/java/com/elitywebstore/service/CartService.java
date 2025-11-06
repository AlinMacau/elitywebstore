package com.elitywebstore.service;

import com.elitywebstore.entities.Cart;
import com.elitywebstore.entities.Product;
import com.elitywebstore.entities.User;
import com.elitywebstore.exceptions.StockException;
import com.elitywebstore.model.request.UpdateCartDto;
import com.elitywebstore.model.response.CartResponseDto;
import com.elitywebstore.repository.CartRepository;
import com.elitywebstore.repository.ProductRepository;
import com.elitywebstore.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
    @Autowired
    private ModelMapper modelMapper;

    public void updateCart(UpdateCartDto updateCartDto) {
        User user = userService.getById(updateCartDto.getUserId());

        if(user.getCart() == null){
            user.setCart(new Cart());
        }

        Cart cart = user.getCart();

        Product product = productService.getById(updateCartDto.getProductId());
        //stock check
        if(updateCartDto.getQuantity() > product.getStock())
            throw new StockException(product);
        //add to cart
        if(updateCartDto.getQuantity()>0)
            cart.getProducts().addAll(Collections.nCopies(updateCartDto.getQuantity(), product));
        else
            cart.getProducts().removeAll(Collections.nCopies(updateCartDto.getQuantity()*-1, product));

        userRepository.save(user);

    }

    public Cart getById(Long id){
       return cartRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Cart not found with id: " + id));
    }


    public CartResponseDto getDtoById(Long id){
        Cart cart = getById(id);


        CartResponseDto cartResponseDto = modelMapper.map(cart, CartResponseDto.class);
        Double productsPrice = cart.getProducts().stream()
                        .mapToDouble(Product::getPrice)
                                .sum();
        Double deliveryPrice = 20.0;
        Double total = productsPrice + deliveryPrice;

        cartResponseDto.setProductsPrice(productsPrice);
        cartResponseDto.setDeliveryPrice(deliveryPrice);
        cartResponseDto.setTotal(total);

        return cartResponseDto;

    }


    public Cart save(Cart cart){
        return cartRepository.save(cart);
    }
}
