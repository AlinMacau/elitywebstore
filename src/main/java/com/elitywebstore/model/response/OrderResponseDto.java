package com.elitywebstore.model.response;

import com.elitywebstore.entities.STATUS;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDto {

    private Long id;

    private LocalDate date;

    private STATUS status;

    private Double price;

    private List<ProductResponseDto> products;

    private AddressResponseDto deliveryAddress;

}
