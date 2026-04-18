package com.elitywebstore.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "address")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private AddressType addressType; // BILLING / SHIPPING

    private String county;
    private String city;
    private String street;
    private String postalCode;

    @Builder.Default
    private Boolean isDefault = false;

    @Builder.Default
    private Boolean active = true;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userdetails_id")
    private UserDetails userDetails;

}
