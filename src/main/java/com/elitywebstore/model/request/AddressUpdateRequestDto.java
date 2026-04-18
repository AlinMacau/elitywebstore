package com.elitywebstore.model.request;

import com.elitywebstore.entities.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressUpdateRequestDto {

    @NotNull(message = "Address ID is required")
    private Long id;

    @NotNull(message = "Address type should not be null")
    private AddressType addressType;

    @NotBlank(message = "County should not be blank")
    private String county;

    @NotBlank(message = "City should not be blank")
    private String city;

    @NotBlank(message = "Street should not be blank")
    private String street;

    @NotBlank(message = "Postal code should not be blank")
    private String postalCode;

    private Boolean isDefault;
}
