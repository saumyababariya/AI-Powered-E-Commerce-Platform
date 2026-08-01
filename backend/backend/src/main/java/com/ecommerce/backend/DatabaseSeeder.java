package com.ecommerce.backend;

import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.SubCategory;
import com.ecommerce.backend.entity.Coupon;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.SubCategoryRepository;
import com.ecommerce.backend.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            System.out.println("SEEDING DATABASE CATEGORIES AND SUBCATEGORIES...");

            // Seed categories
            Category fashion = createCategory("Fashion");
            Category electronics = createCategory("Electronics");
            Category books = createCategory("Books");
            Category beauty = createCategory("Beauty");
            Category homeKitchen = createCategory("Home & Kitchen");
            Category sports = createCategory("Sports");
            Category accessories = createCategory("Accessories");

            // Seed subcategories
            // Fashion
            createSubCategory(fashion.getId(), "Shirts");
            createSubCategory(fashion.getId(), "Tops");
            createSubCategory(fashion.getId(), "Jeans");
            createSubCategory(fashion.getId(), "Dresses");
            createSubCategory(fashion.getId(), "Kurti");
            createSubCategory(fashion.getId(), "Skirts");
            createSubCategory(fashion.getId(), "Jacket");

            // Electronics
            createSubCategory(electronics.getId(), "Mobiles");
            createSubCategory(electronics.getId(), "Laptops");
            createSubCategory(electronics.getId(), "Tablets");
            createSubCategory(electronics.getId(), "Earbuds");
            createSubCategory(electronics.getId(), "Speaker");
            createSubCategory(electronics.getId(), "Smart Watches");
            createSubCategory(electronics.getId(), "Charger");

            // Books
            createSubCategory(books.getId(), "Fiction");
            createSubCategory(books.getId(), "Non Fiction");
            createSubCategory(books.getId(), "Academic");
            createSubCategory(books.getId(), "Self Help");

            // Beauty
            createSubCategory(beauty.getId(), "Makeup");
            createSubCategory(beauty.getId(), "Skincare");
            createSubCategory(beauty.getId(), "Haircare");

            // Home & Kitchen
            createSubCategory(homeKitchen.getId(), "Cookware");
            createSubCategory(homeKitchen.getId(), "Decor");

            // Sports
            createSubCategory(sports.getId(), "Fitness");
            createSubCategory(sports.getId(), "Outdoors");

            // Accessories
            createSubCategory(accessories.getId(), "Watches");
            createSubCategory(accessories.getId(), "Bags");

            System.out.println("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
        }

        // Seed default coupons if empty
        if (couponRepository.count() == 0) {
            System.out.println("SEEDING DATABASE COUPONS...");
            createCoupon("WELCOME10", "PERCENT", 10.0, 1000.0, "2027-12-31");
            createCoupon("SAVE500", "FLAT", 500.0, 3000.0, "2027-12-31");
            createCoupon("FASHION20", "PERCENT", 20.0, 1500.0, "2027-12-31");
            createCoupon("MEGA1000", "FLAT", 1000.0, 5000.0, "2027-12-31");
            System.out.println("DATABASE COUPONS SEEDED.");
        } else {
            if (couponRepository.findByCode("FASHION20") == null) {
                createCoupon("FASHION20", "PERCENT", 20.0, 1500.0, "2027-12-31");
            }
            if (couponRepository.findByCode("MEGA1000") == null) {
                createCoupon("MEGA1000", "FLAT", 1000.0, 5000.0, "2027-12-31");
            }
        }
    }

    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        category.setActive(true);
        return categoryRepository.save(category);
    }

    private void createSubCategory(Long categoryId, String name) {
        SubCategory subCategory = new SubCategory();
        subCategory.setCategoryId(categoryId);
        subCategory.setName(name);
        subCategory.setActive(true);
        subCategoryRepository.save(subCategory);
    }

    private void createCoupon(String code, String type, Double value, Double minOrder, String expiry) {
        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setDiscountType(type);
        coupon.setDiscountValue(value);
        coupon.setMinimumOrderValue(minOrder);
        coupon.setExpiryDate(expiry);
        coupon.setActive(true);
        couponRepository.save(coupon);
    }
}
