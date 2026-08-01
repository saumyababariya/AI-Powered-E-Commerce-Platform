package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.RecentlyViewed;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.RecentlyViewedRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/recently-viewed")
@CrossOrigin(origins = "http://localhost:3000")
public class RecentlyViewedController {

    @Autowired
    private RecentlyViewedRepository repo;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public RecentlyViewed saveViewedProduct(
            @RequestBody RecentlyViewed viewed
    ) {

        return repo.save(viewed);
    }

    @GetMapping("/{userId}")
    public List<Product> getRecentlyViewed(
            @PathVariable Long userId
    ) {

        List<RecentlyViewed> viewed =
                repo.findByUserIdOrderByIdDesc(
                        userId
                );

        return viewed.stream()

                .map(item ->
                        productRepository.findById(
                                item.getProductId()
                        ).orElse(null)
                )

                .filter(product ->
                        product != null
                )

                .distinct()

                .limit(10)

                .collect(Collectors.toList());
    }
}