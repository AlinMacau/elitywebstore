package com.elitywebstore.model.response;

import com.elitywebstore.entities.AddressType;
import com.elitywebstore.entities.UserDetails;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressResponseDto {

    private AddressType addressType;//billing/delivery
    private String county;
    private String city;
    private String street;

    private String postalCode;

}
