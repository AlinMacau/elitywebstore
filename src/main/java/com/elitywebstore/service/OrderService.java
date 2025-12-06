package com.elitywebstore.service;

import com.elitywebstore.entities.Cart;
import com.elitywebstore.entities.Order;
import com.elitywebstore.entities.Product;
import com.elitywebstore.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;

import static com.elitywebstore.entities.STATUS.PENDING;

@Slf4j
@Service
@RequiredArgsConstructor

public class OrderService {

    private final  OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductService productService;

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

        updateStock(order);

        return order;
    }

    private void updateStock(Order order) {
        HashMap<Product, Integer> map = new HashMap<>();

        for(Product product : order.getProducts()){
            if (map.containsKey(product))
                    map.put(product, map.get(product)+1);
            else
                map.put(product, 1);
        }

        map.forEach(((product, count) -> {
            product.setStock(product.getStock()-count);
            productService.update(product);
        }));
    }
    @Transactional
    public Integer approveNewOrders(){
        return orderRepository.approveNewOrders();
    }

    public Order getOrder(Long orderId){
        return orderRepository.findById(orderId)
                .orElseThrow(()->new EntityNotFoundException());
    }

    public void save(Order order) {
        orderRepository.save(order);

        log.info("Order {} saved", order.getId());

    }
}
