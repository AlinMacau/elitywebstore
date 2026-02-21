package com.elitywebstore.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDto {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Address ID is required")
    private Long addressId;
}