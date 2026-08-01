package com.ecommerce.backend.controller;

import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.Review;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;



@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/{productId}")
    public List<Review> getReviews(
            @PathVariable Long productId
    ) {
        return reviewRepository
                .findByProductId(productId);
    }

    @PostMapping
    public Review addReview(
            @RequestBody Review review
    ) {

        if(review.getReview() == null) {
            review.setReview("");
        }
        boolean purchased =
                orderRepository
                        .findByUserId(
                                review.getUserId()
                        )
                        .stream()
                        .flatMap(order ->
                                order.getItems().stream()
                        )
                        .anyMatch(item ->
                                item.getProductId()
                                        .equals(
                                                review.getProductId()
                                        )
                        );

        if(!purchased) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You must purchase this product before writing a review."
            );
        }

        Review existingReview =
                reviewRepository
                        .findByUserIdAndProductId(
                                review.getUserId(),
                                review.getProductId()
                        );

        if(existingReview != null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You have already reviewed this product."
            );
        }

        Review savedReview =
                reviewRepository.save(review);

        List<Review> reviews =
                reviewRepository.findByProductId(
                        review.getProductId()
                );

        double average =
                reviews.stream()
                        .mapToDouble(
                                Review::getRating
                        )
                        .average()
                        .orElse(0);

        Product product =
                productRepository.findById(
                        review.getProductId()
                ).orElse(null);

        if(product != null) {

            product.setRating(
                    average
            );

            product.setTotalReviews(
                    reviews.size()
            );

            productRepository.save(product);
        }


        return savedReview;
    }
}