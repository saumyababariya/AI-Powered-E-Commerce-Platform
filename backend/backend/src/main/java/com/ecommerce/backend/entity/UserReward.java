package com.ecommerce.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "user_rewards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String rewardName;

    private String couponCode;

    private Integer discountPercent;

    private boolean claimed;

    private boolean used;

    private String gradeUnlocked;

    private LocalDate expiryDate;
}