package com.elitywebstore.entities;

public enum STATUS {

    PENDING,     // Order received, awaiting review
    PROCESSING,  // Order accepted and being prepared for shipment
    SENT,        // Order shipped
    DELIVERED,   // Order delivered (courier confirmation received)
    CANCELLED    // Order cancelled
}
