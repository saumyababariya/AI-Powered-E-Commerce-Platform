package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.UserBudget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBudgetRepository
        extends JpaRepository<UserBudget, Long> {

    UserBudget findByUserIdAndActiveTrue(
            Long userId
    );
}