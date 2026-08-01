package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.SubCategory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubCategoryRepository
                extends JpaRepository<SubCategory, Long> {

        List<SubCategory> findByCategoryIdAndActiveTrue(
                        Long categoryId);
}