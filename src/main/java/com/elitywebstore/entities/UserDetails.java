package com.elitywebstore.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "userDetails")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetails {
    @Id
    @GeneratedValue
    private Long id;

    private String firstName;
    private String lastName;
    private String phoneNumber;

    @OneToOne(mappedBy = "details")
    private User user;

    @OneToMany(mappedBy = "userDetails")
    private List<Address> addresses = new ArrayList<>();

}
