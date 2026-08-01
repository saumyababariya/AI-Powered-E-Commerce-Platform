package com.ecommerce.backend.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    private String code;

    private String discountType;

    private Double discountValue;

    private Double minimumOrderValue;

    private String expiryDate;

    private Boolean active = true;
}