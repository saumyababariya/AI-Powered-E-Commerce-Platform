package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Coupon;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository
        extends JpaRepository<Coupon, Long> {

    Coupon findByCode(String code);
}