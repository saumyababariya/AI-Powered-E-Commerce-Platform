package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.CategoryBudget;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryBudgetRepository
        extends JpaRepository<CategoryBudget, Long> {

    List<CategoryBudget>
    findByUserIdAndActiveTrue(Long userId);

    CategoryBudget
    findByUserIdAndCategoryAndActiveTrue(
            Long userId,
            String category
    );

    void deleteByUserIdAndCategory(
            Long userId,
            String category
    );
}