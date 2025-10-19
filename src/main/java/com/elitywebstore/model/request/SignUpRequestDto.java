package com.elitywebstore.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
    @Size(min = 8)
    private String password;
    @Email
    private String email;

    @NotBlank(message = "First name should not be blank")
    @Size(min = 2, message = "First name should contain more than 2 characters")
    private String firstName;

    private String lastName;
    private String phoneNumber;
}
