package com.elitywebstore.model.request;

import com.elitywebstore.entities.AddressType;
import com.elitywebstore.entities.UserDetails;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressRequestDto {

    @NotNull(message = "Address type should not be blank")
    private AddressType addressType;//billing/delivery

    @NotBlank(message = "County should not be blank")
    @Size(min = 2, message = "County should contain more than 2 characters")
    private String county;

    @NotBlank(message = "City should not be blank")
    @Size(min = 2, message = "City should contain more than 2 characters")
    private String city;

    @NotBlank(message = "Street should not be blank")
    @Size(min = 2, message = "Street should contain more than 2 characters")
    private String street;

    @NotBlank(message = "PostalCode name should not be blank")
    @Size(min =2, message = "Postal code must be exactly 6 characters")
    @Pattern(regexp = "\\d+", message = "Postal code must contain only digits")
    private String postalCode;

    @NotNull(message = "User id should not be blank")
    private Long userId;

}
