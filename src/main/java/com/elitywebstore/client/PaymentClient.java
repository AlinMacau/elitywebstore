package com.elitywebstore.client;

import com.elitywebstore.entities.Order;
import com.elitywebstore.entities.STATUS;
import com.elitywebstore.model.request.PaymentRequestDto;
import com.elitywebstore.model.response.OrderResponseDto;
import com.elitywebstore.service.OrderService;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class PaymentClient {

    private final RestTemplate restTemplate;
    private final OrderService orderService;
    private final ModelMapper modelMapper;

    public OrderResponseDto pay(Long orderId) {
        Order order = orderService.getOrder(orderId);

        if(order.getStatus() == STATUS.ACCEPTED){
            PaymentRequestDto paymentRequest = PaymentRequestDto.builder()
                    .orderId(order.getId())
                    .amount(order.getPrice())
                    .build();

            String url = "http://localhost:8081/api/v1/payments/process";
            Boolean response = restTemplate.postForObject(url, paymentRequest, Boolean.class);

            if(response ==true){
                order.setStatus(STATUS.PAID);
                orderService.save(order);
                return modelMapper.map(order, OrderResponseDto.class);
            }

            throw new RuntimeException("Something went wrong with payment processor");
        }

        throw new RuntimeException("Wrong order status");

    }
}
