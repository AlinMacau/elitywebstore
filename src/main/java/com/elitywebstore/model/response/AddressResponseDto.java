package com.elitywebstore.model.response;

import com.elitywebstore.entities.AddressType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressResponseDto {

    private Long id;
    private AddressType addressType;//billing/delivery
    private String county;
    private String city;
    private String street;

    private String postalCode;

}
