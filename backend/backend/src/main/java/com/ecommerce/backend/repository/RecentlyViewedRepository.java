package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.RecentlyViewed;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecentlyViewedRepository
        extends JpaRepository<RecentlyViewed, Long> {

    List<RecentlyViewed> findByUserIdOrderByIdDesc(
            Long userId
    );
}