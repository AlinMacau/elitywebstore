package com.elitywebstore.service;

import com.elitywebstore.entities.*;
import com.elitywebstore.model.request.OrderRequestDto;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final AddressService addressService;
    private final CartService cartService;
    private final ModelMapper modelMapper;

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto request) {
        User user = userService.getById(request.getUserId());
        Address address = addressService.getById(request.getAddressId());
        
        // Get products from cart
        Cart cart = user.getCart();
        if (cart == null || cart.getProducts().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total price
        Double totalPrice = cart.getProducts().stream()
                .mapToDouble(Product::getPrice)
                .sum();
        
        // Create order
        Order order = Order.builder()
                .user(user)
                .date(LocalDate.now())
                .status(STATUS.PENDING)
                .price(totalPrice)
                .products(List.copyOf(cart.getProducts()))
                .build();
        
        orderRepository.save(order);
        
        // Clear cart
        cartService.clearCart(user.getId());
        
        return convertToDto(order, address);
    }

    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        User user = userService.getById(userId);
        if (user.getOrders() == null) {
            return List.of();
        }
        return user.getOrders().stream()
                .map(order -> convertToDto(order, null))
                .collect(Collectors.toList());
    }

    public OrderResponseDto getOrderById(Long id) {
        Order order = getOrder(id);
        return convertToDto(order, null);
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    @Transactional
    public void save(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        orderRepository.save(order);
    }

    @Transactional
    public int approveNewOrders() {
        List<Order> pendingOrders = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == STATUS.PENDING)
                .collect(Collectors.toList());
        
        for (Order order : pendingOrders) {
            order.setStatus(STATUS.ACCEPTED);
            orderRepository.save(order);
        }
        
        return pendingOrders.size();
    }

    private OrderResponseDto convertToDto(Order order, Address address) {
        if (order == null) {
            return null;
        }
        
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setDate(order.getDate());
        dto.setStatus(order.getStatus());
        dto.setPrice(order.getPrice());
        
        if (order.getProducts() != null) {
            dto.setProducts(order.getProducts().stream()
                    .map(p -> modelMapper.map(p, ProductResponseDto.class))
                    .collect(Collectors.toList()));
        }
        
        if (address != null) {
            dto.setDeliveryAddress(modelMapper.map(address, com.elitywebstore.model.response.AddressResponseDto.class));
        }
        
        return dto;
    }
}