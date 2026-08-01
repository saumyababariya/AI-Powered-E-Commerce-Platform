package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.UserReward;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRewardRepository
        extends JpaRepository<UserReward, Long> {

    List<UserReward> findByUserId(Long userId);

    Optional<UserReward> findByCouponCode(String couponCode);

    List<UserReward> findByUserIdAndUsedFalse(Long userId);

    boolean existsByUserIdAndGradeUnlocked(
            Long userId,
            String gradeUnlocked
    );
}