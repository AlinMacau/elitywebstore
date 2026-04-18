package com.elitywebstore.client;

import com.elitywebstore.entities.Order;
import com.elitywebstore.entities.PaymentStatus;
import com.elitywebstore.entities.STATUS;
import com.elitywebstore.model.request.PaymentRequestDto;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class PaymentClient {

    private final RestTemplate restTemplate;
    private final OrderService orderService;
    private final ModelMapper modelMapper;

    /**
     * Process payment for an order.
     * Only orders in PROCESSING status can be paid.
     * This is typically used for online payment processing (future implementation).
     */
    public OrderResponseDto pay(Long orderId) {
        Order order = orderService.getOrder(orderId);

        // Only PROCESSING orders can be paid (order has been accepted and is being prepared)
        if (order.getStatus() == STATUS.PROCESSING) {
            PaymentRequestDto paymentRequest = PaymentRequestDto.builder()
                    .orderId(order.getId())
                    .amount(order.getPrice())
                    .build();

            String url = "http://localhost:8081/api/v1/payments/process";
            Boolean response = restTemplate.postForObject(url, paymentRequest, Boolean.class);

            if (Boolean.TRUE.equals(response)) {
                // Update payment status to PAID (not order status)
                order.setPaymentStatus(PaymentStatus.PAID);
                orderService.save(order);
                return modelMapper.map(order, OrderResponseDto.class);
            }

            throw new RuntimeException("Something went wrong with payment processor");
        }

        throw new RuntimeException("Order must be in PROCESSING status to process payment. Current status: " + order.getStatus());
    }
}
