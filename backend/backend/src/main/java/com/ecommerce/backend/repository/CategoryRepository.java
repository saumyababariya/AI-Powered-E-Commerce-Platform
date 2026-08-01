package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    List<Category>
    findByActiveTrue();
    Category findByNameIgnoreCase(
            String name
    );
}