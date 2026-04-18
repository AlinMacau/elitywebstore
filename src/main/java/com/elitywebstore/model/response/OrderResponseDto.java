package com.elitywebstore.model.response;

import com.elitywebstore.entities.DeliveryMethod;
import com.elitywebstore.entities.PaymentMethod;
import com.elitywebstore.entities.PaymentStatus;
import com.elitywebstore.entities.STATUS;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDto {

    private Long id;
    private LocalDate date;
    private STATUS status;
    
    // ==================== Price Breakdown ====================
    
    private Double productsTotal;
    private DeliveryMethod deliveryMethod;
    private String deliveryMethodDisplayName;
    private String deliveryMethodDescription;
    private Double deliveryCost;
    private Double price; // Grand total (products + delivery)
    
    // ==================== Payment Info (NEW) ====================
    
    private PaymentMethod paymentMethod;
    private String paymentMethodDisplayName;
    private String paymentMethodDescription;
    private PaymentStatus paymentStatus;
    private String paymentStatusDisplayName;
    
    // Bank details (only populated for BANK_TRANSFER)
    private String bankIban;
    private String bankName;
    private String bankAccountHolder;
    private String bankTransferInstructions;
    
    // ==================== Order Items ====================
    
    private List<OrderItemResponseDto> orderItems;
    
    // Keep for backwards compatibility
    @Deprecated
    private List<ProductResponseDto> products;
    
    // ==================== Addresses ====================
    
    private AddressResponseDto shippingAddress;
    private AddressResponseDto billingAddress;
    
    // ==================== Timeline Fields ====================
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // ==================== Customer Info (Admin View) ====================
    
    private Long userId;
    private String userEmail;
    private String userName;
    private String customerName;
    private String customerEmail;

    // ==================== Editability Flags ====================

    private Boolean canEditShippingAddress;
    private Boolean canEditBillingAddress;
    private Boolean canEditCustomerInfo;
    private Boolean canEditPaymentStatus; // NEW: For admin to mark as paid
}
