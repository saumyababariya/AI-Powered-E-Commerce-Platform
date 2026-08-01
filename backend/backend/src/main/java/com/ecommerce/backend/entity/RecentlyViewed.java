package com.ecommerce.backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recently_viewed")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentlyViewed {

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long productId;
}