package com.elitywebstore.service;

import com.elitywebstore.entities.*;
import com.elitywebstore.model.request.AdminOrderUpdateRequestDto;
import com.elitywebstore.model.request.OrderRequestDto;
import com.elitywebstore.model.response.*;
import com.elitywebstore.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

        private final OrderRepository orderRepository;
        private final UserService userService;
        private final AddressService addressService;

        // ==================== STATUS TRANSITION MAPS ====================

        /**
         * Valid order status transitions.
         * Key: Current status
         * Value: Set of allowed next statuses
         */
        private static final Map<STATUS, Set<STATUS>> VALID_ORDER_STATUS_TRANSITIONS;

        static {
            VALID_ORDER_STATUS_TRANSITIONS = new EnumMap<>(STATUS.class);
            
            // PENDING -> PROCESSING, CANCELLED
            VALID_ORDER_STATUS_TRANSITIONS.put(STATUS.PENDING, 
                Set.of(STATUS.PROCESSING, STATUS.CANCELLED));
            
            // PROCESSING -> SENT, CANCELLED
            VALID_ORDER_STATUS_TRANSITIONS.put(STATUS.PROCESSING, 
                Set.of(STATUS.SENT, STATUS.CANCELLED));
            
            // SENT -> DELIVERED, CANCELLED
            VALID_ORDER_STATUS_TRANSITIONS.put(STATUS.SENT, 
                Set.of(STATUS.DELIVERED, STATUS.CANCELLED));
            
            // DELIVERED -> (terminal state, no transitions allowed)
            VALID_ORDER_STATUS_TRANSITIONS.put(STATUS.DELIVERED, 
                Set.of());
            
            // CANCELLED -> (terminal state, no transitions allowed)
            VALID_ORDER_STATUS_TRANSITIONS.put(STATUS.CANCELLED, 
                Set.of());
        }

        /**
         * Valid payment status transitions.
         * Key: Current status
         * Value: Set of allowed next statuses
         */
        private static final Map<PaymentStatus, Set<PaymentStatus>> VALID_PAYMENT_STATUS_TRANSITIONS;

        static {
            VALID_PAYMENT_STATUS_TRANSITIONS = new EnumMap<>(PaymentStatus.class);
            
            // PENDING -> PAID (bank transfer confirmed)
            VALID_PAYMENT_STATUS_TRANSITIONS.put(PaymentStatus.PENDING, 
                Set.of(PaymentStatus.PAID));
            
            // PAID -> (terminal state for now, could add REFUNDED later)
            VALID_PAYMENT_STATUS_TRANSITIONS.put(PaymentStatus.PAID, 
                Set.of());
            
            // NOT_APPLICABLE -> (no transitions allowed, COD orders)
            VALID_PAYMENT_STATUS_TRANSITIONS.put(PaymentStatus.NOT_APPLICABLE, 
                Set.of());
        }

        // ==================== PUBLIC METHODS ====================

        @Transactional
        public OrderResponseDto createOrder(OrderRequestDto request) {
            log.info("Creating order for user: {} with delivery method: {} and payment method: {}",
                    request.getUserId(), request.getDeliveryMethod(), request.getPaymentMethod());

            User user = userService.getById(request.getUserId());

            // Get addresses
            Address shippingAddress = addressService.getById(request.getShippingAddressId());
            Address billingAddress;
            if (Boolean.TRUE.equals(request.getBillingSameAsShipping())) {
                billingAddress = shippingAddress;
            } else {
                if (request.getBillingAddressId() == null) {
                    throw new RuntimeException("Billing address ID is required when not same as shipping");
                }
                billingAddress = addressService.getById(request.getBillingAddressId());
            }

            // Validate cart
            Cart cart = user.getCart();
            if (cart == null || cart.getItems().isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            // Validate delivery method
            DeliveryMethod deliveryMethod = request.getDeliveryMethod();
            if (deliveryMethod == null) {
                throw new RuntimeException("Delivery method is required");
            }

            // Validate payment method
            PaymentMethod paymentMethod = request.getPaymentMethod();
            if (paymentMethod == null) {
                throw new RuntimeException("Payment method is required");
            }

            // Get delivery cost from enum (prevents frontend manipulation)
            Double deliveryCost = deliveryMethod.getCost();

            // Determine initial payment status based on payment method
            PaymentStatus initialPaymentStatus = determineInitialPaymentStatus(paymentMethod);

            // Create order
            Order order = Order.builder()
                    .user(user)
                    .date(LocalDate.now())
                    .status(STATUS.PENDING)
                    .shippingAddress(shippingAddress)
                    .billingAddress(billingAddress)
                    .deliveryMethod(deliveryMethod)
                    .deliveryCost(deliveryCost)
                    .paymentMethod(paymentMethod)
                    .paymentStatus(initialPaymentStatus)
                    .createdAt(LocalDateTime.now())
                    .customerName(user.getDetails() != null ?
                            (user.getDetails().getFirstName() + " " + user.getDetails().getLastName()).trim() : null)
                    .customerEmail(user.getEmail())
                    .build();

            // ==================== Create OrderItems from CartItems ====================

            double productsTotal = 0.0;

            // Create a copy of cart items to avoid concurrent modification
            List<CartItem> cartItemsCopy = new ArrayList<>(cart.getItems());

            for (CartItem cartItem : cartItemsCopy) {
                Product product = cartItem.getProduct();
                int quantity = cartItem.getQuantity();

                // Validate stock one more time before order
                if (!product.hasStock(quantity)) {
                    throw new RuntimeException(
                            String.format("Insufficient stock for product '%s'. Requested: %d, Available: %d",
                                    product.getName(), quantity, product.getStock()));
                }

                // Create order item with snapshot of current price
                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .productName(product.getName())
                        .unitPrice(product.getPrice())
                        .quantity(quantity)
                        .build();

                order.addOrderItem(orderItem);
                productsTotal += product.getPrice() * quantity;

                // Decrease stock
                product.decreaseStock(quantity);
                log.info("Decreased stock for product {} by {}", product.getId(), quantity);
            }

            // Set price fields
            order.setProductsTotal(productsTotal);
            order.setPrice(productsTotal + deliveryCost); // Grand total

            // Save order first
            orderRepository.save(order);
            log.info("Order created with id: {}, productsTotal: {}, deliveryCost: {}, grandTotal: {}, paymentMethod: {}, paymentStatus: {}",
                    order.getId(), productsTotal, deliveryCost, order.getPrice(), paymentMethod, initialPaymentStatus);

            // Clear cart items directly - orphanRemoval will handle deletion
            cart.getItems().clear();
            log.info("Cart cleared for user {}", user.getId());

            return convertToDto(order);
        }

        /**
         * Determine initial payment status based on payment method
         */
        private PaymentStatus determineInitialPaymentStatus(PaymentMethod paymentMethod) {
            if (paymentMethod == null) {
                return PaymentStatus.PENDING;
            }

            switch (paymentMethod) {
                case CASH_ON_DELIVERY:
                    // Payment will be collected on delivery
                    return PaymentStatus.NOT_APPLICABLE;
                case BANK_TRANSFER:
                    // Awaiting bank transfer
                    return PaymentStatus.PENDING;
                default:
                    return PaymentStatus.PENDING;
            }
        }

        @Transactional(readOnly = true)
        public List<OrderResponseDto> getOrdersByUserId(Long userId) {
            log.info("Getting orders for user: {}", userId);
            userService.getById(userId); // Validate user exists
            List<Order> orders = orderRepository.findByUserIdWithDetails(userId);

            return orders.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public OrderResponseDto getOrderById(Long id) {
            log.info("Getting order by id: {}", id);
            Order order = orderRepository.findByIdWithDetails(id)
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
            return convertToDto(order);
        }

        /**
         * Get order by ID with user ownership validation.
         * Users can only view their own orders.
         */
        @Transactional(readOnly = true)
        public OrderResponseDto getOrderByIdForUser(Long orderId, Long userId) {
            log.info("Getting order {} for user {}", orderId, userId);
            
            Order order = orderRepository.findByIdWithDetails(orderId)
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));
            
            // Validate user ownership
            if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
                log.warn("User {} attempted to access order {} belonging to another user", userId, orderId);
                throw new AccessDeniedException("You can only view your own orders");
            }
            
            return convertToDto(order);
        }

        /**
         * Get all orders for a user with ownership validation.
         */
        @Transactional(readOnly = true)
        public List<OrderResponseDto> getOrdersByUserIdValidated(Long userId, Long requestingUserId) {
            log.info("Getting orders for user {} requested by user {}", userId, requestingUserId);
            
            // Validate that the requesting user is accessing their own orders
            if (!userId.equals(requestingUserId)) {
                log.warn("User {} attempted to access orders of user {}", requestingUserId, userId);
                throw new AccessDeniedException("You can only view your own orders");
            }
            
            userService.getById(userId); // Validate user exists
            List<Order> orders = orderRepository.findByUserIdWithDetails(userId);

            return orders.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }

        public Order getOrder(Long id) {
            return orderRepository.findByIdWithDetails(id)
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
        }

        // ==================== ADMIN METHODS ====================

        @Transactional(readOnly = true)
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

        @Transactional(readOnly = true)
        public OrderResponseDto getOrderByIdForAdmin(Long id) {
            log.info("Getting order {} for admin", id);
            Order order = orderRepository.findByIdWithDetails(id)
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
            return convertToDtoForAdmin(order);
        }

        /**
         * Update order status with transition validation.
         * Only valid transitions are allowed based on VALID_ORDER_STATUS_TRANSITIONS map.
         */
        @Transactional
        public OrderResponseDto updateOrderStatus(Long id, STATUS newStatus) {
            log.info("Updating order {} status to {}", id, newStatus);

            Order order = getOrder(id);
            STATUS currentStatus = order.getStatus();

            // Validate transition
            validateOrderStatusTransition(currentStatus, newStatus);

            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            log.info("Order {} status updated from {} to {}", id, currentStatus, newStatus);
            return convertToDtoForAdmin(order);
        }

        /**
         * Validate that the order status transition is allowed.
         * 
         * @param currentStatus The current order status
         * @param newStatus The desired new status
         * @throws IllegalStateException if the transition is not allowed
         */
        private void validateOrderStatusTransition(STATUS currentStatus, STATUS newStatus) {
            // Same status is always allowed (no-op)
            if (currentStatus == newStatus) {
                return;
            }

            Set<STATUS> allowedTransitions = VALID_ORDER_STATUS_TRANSITIONS.get(currentStatus);
            
            if (allowedTransitions == null || !allowedTransitions.contains(newStatus)) {
                String allowedStr = allowedTransitions != null && !allowedTransitions.isEmpty() 
                    ? allowedTransitions.toString() 
                    : "none (terminal state)";
                throw new IllegalStateException(
                    String.format("Invalid order status transition from %s to %s. Allowed transitions: %s",
                        currentStatus, newStatus, allowedStr));
            }
        }

        /**
         * Get allowed order status transitions for a given status.
         * Used by frontend to show only valid options.
         */
        public Set<STATUS> getAllowedOrderStatusTransitions(STATUS currentStatus) {
            Set<STATUS> transitions = VALID_ORDER_STATUS_TRANSITIONS.get(currentStatus);
            return transitions != null ? transitions : Set.of();
        }

        /**
         * Update payment status for an order (Admin only).
         * Validates that the transition is allowed.
         */
        @Transactional
        public OrderResponseDto updatePaymentStatus(Long id, PaymentStatus newPaymentStatus, String adminEmail) {
            log.info("Admin {} updating payment status for order {} to {}", adminEmail, id, newPaymentStatus);

            Order order = getOrder(id);
            PaymentStatus currentPaymentStatus = order.getPaymentStatus();

            // Validate: Only bank transfer orders can have payment status changed
            if (order.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
                throw new IllegalStateException(
                    "Cannot change payment status for Cash on Delivery orders. Payment is collected on delivery.");
            }

            // Validate transition
            validatePaymentStatusTransition(currentPaymentStatus, newPaymentStatus);

            order.setPaymentStatus(newPaymentStatus);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            log.info("Order {} payment status updated from {} to {} by admin {}",
                    id, currentPaymentStatus, newPaymentStatus, adminEmail);
            return convertToDtoForAdmin(order);
        }

        /**
         * Validate that the payment status transition is allowed.
         * 
         * @param currentStatus The current payment status
         * @param newStatus The desired new status
         * @throws IllegalStateException if the transition is not allowed
         */
        private void validatePaymentStatusTransition(PaymentStatus currentStatus, PaymentStatus newStatus) {
            // Same status is always allowed (no-op)
            if (currentStatus == newStatus) {
                return;
            }

            Set<PaymentStatus> allowedTransitions = VALID_PAYMENT_STATUS_TRANSITIONS.get(currentStatus);
            
            if (allowedTransitions == null || !allowedTransitions.contains(newStatus)) {
                String allowedStr = allowedTransitions != null && !allowedTransitions.isEmpty() 
                    ? allowedTransitions.toString() 
                    : "none (terminal state)";
                throw new IllegalStateException(
                    String.format("Invalid payment status transition from %s to %s. Allowed transitions: %s",
                        currentStatus, newStatus, allowedStr));
            }
        }

        /**
         * Get allowed payment status transitions for a given status.
         * Used by frontend to show only valid options.
         */
        public Set<PaymentStatus> getAllowedPaymentStatusTransitions(PaymentStatus currentStatus) {
            Set<PaymentStatus> transitions = VALID_PAYMENT_STATUS_TRANSITIONS.get(currentStatus);
            return transitions != null ? transitions : Set.of();
        }

        @Transactional
        public OrderResponseDto updateOrderForAdmin(Long id, AdminOrderUpdateRequestDto request, String adminEmail) {
            log.info("Admin {} updating order {}: {}", adminEmail, id, request);

            Order order = getOrder(id);
            STATUS currentStatus = order.getStatus();

            // Validate and apply customer info changes
            if (request.getCustomerName() != null) {
                validateCanEditCustomerInfo(currentStatus);
                order.setCustomerName(request.getCustomerName());
                log.info("Updated customer name to: {}", request.getCustomerName());
            }

            if (request.getCustomerEmail() != null) {
                validateCanEditCustomerInfo(currentStatus);
                order.setCustomerEmail(request.getCustomerEmail());
                log.info("Updated customer email to: {}", request.getCustomerEmail());
            }

            // Validate and apply shipping address changes
            if (request.getShippingAddressId() != null) {
                validateCanEditShippingAddress(currentStatus);
                Address newShippingAddress = addressService.getById(request.getShippingAddressId());
                order.setShippingAddress(newShippingAddress);
                log.info("Updated shipping address to: {}", newShippingAddress.getId());
            } else if (request.getNewShippingAddress() != null) {
                validateCanEditShippingAddress(currentStatus);
                Address newShippingAddress = addressService.createAddressEntity(request.getNewShippingAddress());
                order.setShippingAddress(newShippingAddress);
                log.info("Created and set new shipping address: {}", newShippingAddress.getId());
            }

            // Validate and apply billing address changes
            if (request.getBillingAddressId() != null) {
                validateCanEditBillingAddress(currentStatus);
                Address newBillingAddress = addressService.getById(request.getBillingAddressId());
                order.setBillingAddress(newBillingAddress);
                log.info("Updated billing address to: {}", newBillingAddress.getId());
            } else if (request.getNewBillingAddress() != null) {
                validateCanEditBillingAddress(currentStatus);
                Address newBillingAddress = addressService.createAddressEntity(request.getNewBillingAddress());
                order.setBillingAddress(newBillingAddress);
                log.info("Created and set new billing address: {}", newBillingAddress.getId());
            }

            // Apply status change with validation
            if (request.getStatus() != null && request.getStatus() != currentStatus) {
                validateOrderStatusTransition(currentStatus, request.getStatus());
                order.setStatus(request.getStatus());
                log.info("Updated status from {} to {}", currentStatus, request.getStatus());
            }

            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);
            log.info("Order {} updated successfully", id);

            return convertToDtoForAdmin(order);
        }

        @Transactional(readOnly = true)
        public OrderStatsResponseDto getOrderStats() {
            log.info("Calculating order statistics");

            List<Order> allOrders = orderRepository.findAll();

            long totalOrders = allOrders.size();
            long pendingOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.PENDING).count();
            long processingOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.PROCESSING).count();
            long sentOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.SENT).count();
            long deliveredOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.DELIVERED).count();
            long cancelledOrders = allOrders.stream().filter(o -> o.getStatus() == STATUS.CANCELLED).count();

            // Calculate revenue from non-cancelled orders
            double totalRevenue = allOrders.stream()
                    .filter(o -> o.getStatus() != STATUS.CANCELLED)
                    .mapToDouble(o -> o.getPrice() != null ? o.getPrice() : 0.0)
                    .sum();

            return OrderStatsResponseDto.builder()
                    .totalOrders(totalOrders)
                    .pendingOrders(pendingOrders)
                    .processingOrders(processingOrders)
                    .sentOrders(sentOrders)
                    .deliveredOrders(deliveredOrders)
                    .cancelledOrders(cancelledOrders)
                    .totalRevenue(totalRevenue)
                    .build();
        }

        @Transactional
        public int approveNewOrders() {
            log.info("Approving all pending orders");

            List<Order> pendingOrders = orderRepository.findByStatus(STATUS.PENDING);
            LocalDateTime now = LocalDateTime.now();

            for (Order order : pendingOrders) {
                order.setStatus(STATUS.PROCESSING);
                order.setUpdatedAt(now);
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

        private OrderResponseDto convertToDto(Order order) {
            if (order == null) {
                return null;
            }

            OrderResponseDto dto = new OrderResponseDto();
            dto.setId(order.getId());
            dto.setDate(order.getDate());
            dto.setStatus(order.getStatus());

            // Price breakdown
            dto.setProductsTotal(order.getProductsTotal());
            dto.setDeliveryMethod(order.getDeliveryMethod());
            if (order.getDeliveryMethod() != null) {
                dto.setDeliveryMethodDisplayName(order.getDeliveryMethod().getDisplayName());
                dto.setDeliveryMethodDescription(order.getDeliveryMethod().getDescription());
            }
            dto.setDeliveryCost(order.getDeliveryCost());
            dto.setPrice(order.getPrice());

            // Payment info
            dto.setPaymentMethod(order.getPaymentMethod());
            if (order.getPaymentMethod() != null) {
                dto.setPaymentMethodDisplayName(order.getPaymentMethod().getDisplayName());
                dto.setPaymentMethodDescription(order.getPaymentMethod().getDescription());

                // Include bank details for bank transfer orders
                if (order.getPaymentMethod().requiresBankDetails()) {
                    dto.setBankIban(order.getPaymentMethod().getIban());
                    dto.setBankName(order.getPaymentMethod().getBankName());
                    dto.setBankAccountHolder(order.getPaymentMethod().getAccountHolder());
                    dto.setBankTransferInstructions(
                            String.format("Please transfer the total amount of $%.2f to the account below. " +
                                            "Include your order number #%d in the transfer description.",
                                    order.getPrice(), order.getId())
                    );
                }
            }
            dto.setPaymentStatus(order.getPaymentStatus());
            if (order.getPaymentStatus() != null) {
                dto.setPaymentStatusDisplayName(order.getPaymentStatus().getDisplayName());
            }

            // Timestamps
            dto.setCreatedAt(order.getCreatedAt());
            dto.setUpdatedAt(order.getUpdatedAt());

            // Order items - now properly loaded via fetch join
            if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                List<OrderItemResponseDto> itemDtos = order.getOrderItems().stream()
                        .map(this::convertOrderItemToDto)
                        .collect(Collectors.toList());
                dto.setOrderItems(itemDtos);
                log.debug("Converted {} order items for order {}", itemDtos.size(), order.getId());
            } else {
                dto.setOrderItems(new ArrayList<>());
                log.debug("No order items found for order {}", order.getId());
            }

            // Addresses - now properly loaded via fetch join
            if (order.getShippingAddress() != null) {
                dto.setShippingAddress(convertAddressToDto(order.getShippingAddress()));
            }
            if (order.getBillingAddress() != null) {
                dto.setBillingAddress(convertAddressToDto(order.getBillingAddress()));
            }

            return dto;
        }

        private OrderItemResponseDto convertOrderItemToDto(OrderItem item) {
            if (item == null) {
                return null;
            }
            
            return OrderItemResponseDto.builder()
                    .id(item.getId())
                    .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                    .productName(item.getProductName())
                    .productImageUrl(item.getProduct() != null ? item.getProduct().getImageUrl() : null)
                    .unitPrice(item.getUnitPrice())
                    .quantity(item.getQuantity())
                    .lineTotal(item.getLineTotal())
                    .build();
        }

        private OrderResponseDto convertToDtoForAdmin(Order order) {
            OrderResponseDto dto = convertToDto(order);

            if (order.getUser() != null) {
                dto.setUserId(order.getUser().getId());
                dto.setUserEmail(order.getUser().getEmail());

                if (order.getUser().getDetails() != null) {
                    String firstName = order.getUser().getDetails().getFirstName();
                    String lastName = order.getUser().getDetails().getLastName();
                    dto.setUserName(((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim());
                }
            }

            // Set customer snapshot (use snapshot if exists, otherwise use live user data)
            dto.setCustomerName(order.getCustomerName() != null ?
                    order.getCustomerName() : dto.getUserName());
            dto.setCustomerEmail(order.getCustomerEmail() != null ?
                    order.getCustomerEmail() : dto.getUserEmail());

            // Set editability flags based on status
            STATUS status = order.getStatus();
            dto.setCanEditShippingAddress(status != STATUS.SENT && status != STATUS.DELIVERED && status != STATUS.CANCELLED);
            dto.setCanEditBillingAddress(status != STATUS.SENT && status != STATUS.DELIVERED && status != STATUS.CANCELLED);
            dto.setCanEditCustomerInfo(status != STATUS.CANCELLED);

            // Payment status can be edited for BANK_TRANSFER orders that are not cancelled/delivered
            dto.setCanEditPaymentStatus(
                    order.getPaymentMethod() == PaymentMethod.BANK_TRANSFER &&
                    status != STATUS.CANCELLED &&
                    status != STATUS.DELIVERED
            );

            return dto;
        }

        private AddressResponseDto convertAddressToDto(Address address) {
            if (address == null) {
                return null;
            }
            return AddressResponseDto.builder()
                    .id(address.getId())
                    .addressType(address.getAddressType())
                    .county(address.getCounty())
                    .city(address.getCity())
                    .street(address.getStreet())
                    .postalCode(address.getPostalCode())
                    .isDefault(address.getIsDefault())
                    .active(address.getActive())
                    .build();
        }

        // ==================== Validation Helper Methods ====================

        private void validateCanEditShippingAddress(STATUS status) {
            if (status == STATUS.SENT || status == STATUS.DELIVERED || status == STATUS.CANCELLED) {
                throw new IllegalStateException(
                        "Cannot edit shipping address for orders with status: " + status);
            }
        }

        private void validateCanEditBillingAddress(STATUS status) {
            if (status == STATUS.SENT || status == STATUS.DELIVERED || status == STATUS.CANCELLED) {
                throw new IllegalStateException(
                        "Cannot edit billing address for orders with status: " + status);
            }
        }

        private void validateCanEditCustomerInfo(STATUS status) {
            if (status == STATUS.CANCELLED) {
                throw new IllegalStateException(
                        "Cannot edit customer info for cancelled orders");
            }
        }
}