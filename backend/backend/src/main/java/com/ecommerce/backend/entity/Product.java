package com.ecommerce.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private Long id;

    private String name;

    @Lob
    private String description;

    private String category;

    @Column(name = "sub_category")
    private String subCategory;

    private double price;

    private Double discount = 0.0;

    @Lob
    private String images;

    @Lob
    private String sizes;

    @Lob
    private String colours;

    private String discountType = "PERCENT";

    private String brand;

    private Integer stockQuantity = 100;

    private Double rating;

    private Integer totalReviews;

    private String sku;

    @Lob
    private String specifications;

    private String warranty;

    private String seller;

    private Integer salesCount = 0;
}