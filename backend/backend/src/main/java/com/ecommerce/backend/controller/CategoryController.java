package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.SubCategory;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.SubCategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    /*
     * ==========================
     * CATEGORY APIs
     * ==========================
     */

    @PostMapping
    public Category addCategory(
            @RequestBody Category category) {

        category.setActive(true);
        Category existing = categoryRepository
                .findByNameIgnoreCase(
                        category.getName());

        if (existing != null) {
            throw new RuntimeException(
                    "Category already exists");
        }

        return categoryRepository.save(
                category);
    }

    @GetMapping
    public List<Category> getCategories() {

        return categoryRepository.findByActiveTrue();
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(
            @PathVariable Long id) {

        Category category = categoryRepository
                .findById(id)
                .orElse(null);

        if (category == null) {

            return "Category not found";
        }

        category.setActive(false);

        categoryRepository.save(category);

        return "Category deactivated successfully";
    }

    /*
     * ==========================
     * SUBCATEGORY APIs
     * ==========================
     */

    @PostMapping("/subcategories")
    public SubCategory addSubCategory(
            @RequestBody SubCategory subCategory) {

        subCategory.setActive(true);

        return subCategoryRepository.save(
                subCategory);
    }

    @GetMapping("/subcategories/{categoryId}")
    public List<SubCategory> getSubCategories(
            @PathVariable Long categoryId) {

        return subCategoryRepository
                .findByCategoryIdAndActiveTrue(
                        categoryId);
    }

    @DeleteMapping("/subcategories/{id}")
    public String deleteSubCategory(
            @PathVariable Long id) {

        SubCategory subCategory = subCategoryRepository
                .findById(id)
                .orElse(null);

        if (subCategory == null) {

            return "Subcategory not found";
        }

        subCategory.setActive(false);

        subCategoryRepository.save(
                subCategory);

        return "Subcategory deactivated successfully";
    }

    @GetMapping("/rules")
    public List<Map<String, Object>> getCategoryRules() {

        List<Map<String, Object>> response =
                new ArrayList<>();

        response.add(
                createCategoryRule(
                        "Fashion",
                        true
                )
        );

        response.add(
                createCategoryRule(
                        "Accessories",
                        true
                )
        );

        response.add(
                createCategoryRule(
                        "Electronics",
                        false
                )
        );

        response.add(
                createCategoryRule(
                        "Books",
                        false
                )
        );

        response.add(
                createCategoryRule(
                        "Beauty",
                        false
                )
        );

        response.add(
                createCategoryRule(
                        "Home & Kitchen",
                        false
                )
        );

        response.add(
                createCategoryRule(
                        "Sports",
                        false
                )
        );

        return response;
    }

    private Map<String,Object>
    createCategoryRule(
            String category,
            boolean requiresColor
    ) {

        Map<String,Object> row =
                new HashMap<>();

        row.put(
                "category",
                category
        );

        row.put(
                "requiresColor",
                requiresColor
        );

        return row;
    }
}