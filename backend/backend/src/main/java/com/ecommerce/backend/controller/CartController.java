package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.repository.CartRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartRepository repo;

    // GET USER CART
    @GetMapping("/{userId}")
    public List<Cart> getCart(
            @PathVariable Long userId
    ) {

        return repo.findByUserId(userId);
    }

    // ADD TO CART
    @PostMapping
    public Cart addToCart(
            @RequestBody Cart cart
    ) {

        return repo.save(cart);
    }

    // REMOVE ITEM
    @DeleteMapping("/{id}")
    public void removeItem(
            @PathVariable Long id
    ) {

        repo.deleteById(id);
    }

    // CLEAR USER CART
    @DeleteMapping("/clear/{userId}")
    public void clearCart(
            @PathVariable Long userId
    ) {

        List<Cart> items =
                repo.findByUserId(userId);

        repo.deleteAll(items);
    }
}