package com.elitywebstore.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="category")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {
    @GeneratedValue
    @Id
    private Long id;

    private String name;

    private String description;

    @OneToMany(mappedBy = "category")
    private List <Product> products;//db

}
