package com.elitywebstore.service;

import com.elitywebstore.entities.*;
import com.elitywebstore.model.request.OrderRequestDto;
import com.elitywebstore.model.response.AddressResponseDto;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.model.response.OrderStatsResponseDto;
import com.elitywebstore.model.response.ProductResponseDto;
import com.elitywebstore.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final AddressService addressService;
    private final CartService cartService;
    private final ModelMapper modelMapper;

    // ==================== PUBLIC METHODS ====================

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto request) {
        User user = userService.getById(request.getUserId());
        Address address = addressService.getById(request.getAddressId());
        
        Cart cart = user.getCart();
        if (cart == null || cart.getProducts().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        Double totalPrice = cart.getProducts().stream()
                .mapToDouble(Product::getPrice)
                .sum();
        
        Order order = Order.builder()
                .user(user)
                .date(LocalDate.now())
                .status(STATUS.PENDING)
                .price(totalPrice)
                .products(List.copyOf(cart.getProducts()))
                .build();
        
        orderRepository.save(order);
        cartService.clearCart(user.getId());
        
        return convertToDto(order, address);
    }

    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        userService.getById(userId);
        List<Order> orders = orderRepository.findByUserId(userId);
        
        return orders.stream()
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

    // ==================== ADMIN METHODS ====================

    public List<OrderResponseDto> getAllOrdersForAdmin(STATUS status) {
        log.info("Getting all orders for admin, status filter: {}", status);
        
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByStatus(status);
        } else {
            orders = orderRepository.findAllByOrderByDateDesc();
        }
        
        return orders.stream()
                .map(this::convertToDtoForAdmin)
                .collect(Collectors.toList());
    }

    public OrderResponseDto getOrderByIdForAdmin(Long id) {
        log.info("Getting order {} for admin", id);
        Order order = getOrder(id);
        return convertToDtoForAdmin(order);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long id, STATUS newStatus) {
        log.info("Updating order {} status to {}", id, newStatus);
        
        Order order = getOrder(id);
        STATUS oldStatus = order.getStatus();
        
        order.setStatus(newStatus);
        orderRepository.save(order);
        
        log.info("Order {} status updated from {} to {}", id, oldStatus, newStatus);
        return convertToDtoForAdmin(order);
    }

    public OrderStatsResponseDto getOrderStats() {
        log.info("Calculating order statistics");
        
        List<Order> allOrders = orderRepository.findAll();
        
        long totalOrders = allOrders.size();
        long pendingOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.PENDING).count();
        long acceptedOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.ACCEPTED).count();
        long paidOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.PAID).count();
        long sentOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.SENT).count();
        long cancelledOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.CANCELLED).count();
        
        // Calculate revenue from non-cancelled orders
        double totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != STATUS.CANCELLED)
                .mapToDouble(Order::getPrice)
                .sum();
        
        return OrderStatsResponseDto.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .acceptedOrders(acceptedOrders)
                .paidOrders(paidOrders)
                .sentOrders(sentOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Transactional
    public int approveNewOrders() {
        log.info("Approving all pending orders");
        
        List<Order> pendingOrders = orderRepository.findByStatus(STATUS.PENDING);
        
        for (Order order : pendingOrders) {
            order.setStatus(STATUS.ACCEPTED);
            orderRepository.save(order);
        }
        
        log.info("Approved {} pending orders", pendingOrders.size());
        return pendingOrders.size();
    }

    // ==================== HELPER METHODS ====================

    @Transactional
    public void save(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        orderRepository.save(order);
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
            dto.setDeliveryAddress(modelMapper.map(address, AddressResponseDto.class));
        }
        
        return dto;
    }

    private OrderResponseDto convertToDtoForAdmin(Order order) {
        OrderResponseDto dto = convertToDto(order, null);
        
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserEmail(order.getUser().getEmail());
            
            if (order.getUser().getDetails() != null) {
                String firstName = order.getUser().getDetails().getFirstName();
                String lastName = order.getUser().getDetails().getLastName();
                dto.setUserName((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : ""));
            }
        }
        
        return dto;
    }
}