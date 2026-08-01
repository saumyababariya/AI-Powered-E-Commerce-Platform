package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String date;

    private String status =
            "Preparing Your Order";

    private Double totalAmount;

    private String exchangeReason;

    // IMPORTANT FIX
    private Boolean cancelled = false;

    // IMPORTANT FIX
    private Boolean exchangeRequested = false;
    private String deliveryDate;

    private String timelineStatus =
            "Ordered";

    private String packedDate;

    private String pickedUpDate;

    private String inTransitDate;

    private String outForDeliveryDate;

    private String deliveredDate;

    private String couponCode;

    private Double couponDiscount = 0.0;

    private Double shippingFee = 0.0;

    private String estimatedDeliveryDate;


    @OneToMany(
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    @JoinColumn(name = "order_id")
    private List<OrderItem> items =
            new ArrayList<>();
}