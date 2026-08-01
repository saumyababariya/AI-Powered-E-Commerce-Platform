package com.ecommerce.backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    private String name;

    private String images;

    private String size;

    private String color;

    private Integer quantity;

    private Double price;

    private Double discount;

    @Column(name = "final_price")
    private Double finalPrice;

    // NEW FIELDS
    private String status =
            "Ordered";

    private Boolean cancelled =
            false;

    private Boolean exchangeRequested =
            false;

    private String exchangeReason;

    private String deliveredDate;

    private String packedDate;

    private String pickedUpDate;

    private String inTransitDate;

    private String outForDeliveryDate;
}