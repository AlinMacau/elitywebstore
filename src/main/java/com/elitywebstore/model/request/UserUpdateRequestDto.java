package com.elitywebstore.model.request;

import com.elitywebstore.entities.AddressType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateRequestDto {

    private Long id;

    @Size(min = 8)
    private String password;
    @Email
    private String email;

    @NotBlank(message = "First name should not be blank")
    @Size(min = 2, message = "First name should contain more than 2 characters")
    private String firstName;

    @NotBlank(message = "Last name should not be blank")
    @Size(min = 2, message = "Last name should contain more than 2 characters")
    private String lastName;

    @Pattern(regexp = "\\d+", message = "Must contain only digit")
    private String phoneNumber;

    private AddressType addressType;

    private String county;
    private String city;
    private String street;

    private Integer postalCode;


}
