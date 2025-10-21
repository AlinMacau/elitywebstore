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

    private AddressType addressType;//billing/delivery

    private String county;
    private String city;
    private String street;

    private Integer postalCode;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userdetails_id")
    private UserDetails userDetails;//db
}
