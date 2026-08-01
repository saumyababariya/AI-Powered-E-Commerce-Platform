package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.repository.WishlistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    @Autowired
    private WishlistRepository repo;

    // GET USER WISHLIST
    @GetMapping("/{userId}")
    public List<Wishlist> getWishlist(
            @PathVariable Long userId
    ) {

        return repo.findByUserId(userId);
    }

    // ADD TO WISHLIST
    @PostMapping
    public Wishlist addToWishlist(
            @RequestBody Wishlist wishlist
    ) {

        return repo.save(wishlist);
    }

    // REMOVE ITEM
    @DeleteMapping("/{id}")
    public void removeItem(
            @PathVariable Long id
    ) {

        repo.deleteById(id);
    }
}