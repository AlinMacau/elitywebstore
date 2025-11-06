package com.elitywebstore.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class SignUpRequestDto {
    @NotBlank(message = "Password should not be blank")
    @Size(min = 8)
    private String password;

    @NotBlank(message = "Email should not be blank")
    @Email
    private String email;

    @NotBlank(message = "First name should not be blank")
    @Size(min = 2, message = "First name should contain more than 2 characters")
    private String firstName;

    @NotBlank(message = "Last name should not be blank")
    @Size(min = 2, message = "Last name should contain more than 2 characters")
    private String lastName;

    @NotBlank(message = "Phone number should not be blank")
    @Size(min = 10, max = 10, message = "Phone number must be exactly 10 digits")
    @Pattern(regexp = "\\d+", message = "Phone number must contain only digit")
    private String phoneNumber;
}
