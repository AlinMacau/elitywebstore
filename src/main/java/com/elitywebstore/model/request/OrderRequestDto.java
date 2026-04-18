package com.elitywebstore.model.request;

import com.elitywebstore.entities.DeliveryMethod;
import com.elitywebstore.entities.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Shipping address ID is required")
    private Long shippingAddressId;

    private Long billingAddressId;

    @Builder.Default
    private Boolean billingSameAsShipping = true;
    
    // ==================== NEW: Delivery method ====================
    
    @NotNull(message = "Delivery method is required")
    private DeliveryMethod deliveryMethod;
    
    // ==================== NEW: Payment method ====================
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}