package com.elitywebstore.service;

import com.elitywebstore.entities.Order;
import com.elitywebstore.entities.Product;
import com.elitywebstore.entities.STATUS;
import com.elitywebstore.entities.User;
import com.elitywebstore.model.response.DashboardStatsResponseDto;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.OrderRepository;
import com.elitywebstore.repository.ProductRepository;
import com.elitywebstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;

    public DashboardStatsResponseDto getDashboardStats() {
        log.info("Calculating dashboard statistics");

        // User stats
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.size();

        // Product stats
        List<Product> allProducts = productRepository.findAll();
        long totalProducts = allProducts.size();
        long activeProducts = allProducts.stream()
                .filter(p -> p.getActive() == null || p.getActive())
                .count();
        long outOfStockProducts = allProducts.stream()
                .filter(p -> p.getActive() == null || p.getActive())
                .filter(p -> p.getStock() == null || p.getStock() == 0)
                .count();

        // Order stats
        List<Order> allOrders = orderRepository.findAll();
        long totalOrders = allOrders.size();
        long pendingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == STATUS.PENDING)
                .count();

        // Revenue (from non-cancelled orders)
        double totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != STATUS.CANCELLED)
                .mapToDouble(Order::getPrice)
                .sum();

        // Recent orders (last 5)
        List<OrderResponseDto> recentOrders = orderRepository.findAllByOrderByDateDesc().stream()
                .limit(5)
                .map(this::convertOrderToDto)
                .collect(Collectors.toList());

        return DashboardStatsResponseDto.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .totalRevenue(totalRevenue)
                .activeProducts(activeProducts)
                .outOfStockProducts(outOfStockProducts)
                .recentOrders(recentOrders)
                .build();
    }

    private OrderResponseDto convertOrderToDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setDate(order.getDate());
        dto.setStatus(order.getStatus());
        dto.setPrice(order.getPrice());

        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserEmail(order.getUser().getEmail());

            if (order.getUser().getDetails() != null) {
                String firstName = order.getUser().getDetails().getFirstName();
                String lastName = order.getUser().getDetails().getLastName();
                dto.setUserName((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : ""));
            }
        }

        if (order.getProducts() != null) {
            dto.setProducts(order.getProducts().stream()
                    .map(p -> modelMapper.map(p, ProductResponseDto.class))
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}