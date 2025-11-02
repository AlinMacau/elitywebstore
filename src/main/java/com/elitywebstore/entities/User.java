package com.elitywebstore.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @GeneratedValue
    @Id
    private Long id;

    private String password;

    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "details_id", referencedColumnName = "id")
    private UserDetails details;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "cart_id", referencedColumnName = "id")
    private Cart cart;
}
