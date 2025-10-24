package com.elitywebstore.service;

import com.elitywebstore.entities.Cart;
import com.elitywebstore.entities.Order;
import com.elitywebstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

import static com.elitywebstore.entities.STATUS.PENDING;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    public Order createOrder(Long cartId) {
        Cart cart = cartService.getById(cartId);

        double price = cart.getProducts().stream()
                .mapToDouble(product -> product.getPrice())
                .sum();


        Order order = Order.builder()
                .date(LocalDate.now())
                .status(PENDING)
                .user(cart.getUser())
                .products(new ArrayList<>(cart.getProducts()))
                .price(price)
                .build();

        cart.getProducts().clear();

        orderRepository.save(order);
        cartService.save(cart);

        return order;
    }
}
