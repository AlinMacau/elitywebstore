package com.elitywebstore.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="product")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    @GeneratedValue
    @Id
    private Long id;

    private String name;

    private String description;

    private Double price;

    private Integer stock;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(mappedBy = "products", fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

}
