package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.WishlistRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    // GET ALL PRODUCTS
    @GetMapping
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // GET PRODUCT BY ID
    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable Long id
    ) {
        return repo.findById(id)
                .orElse(null);
    }

    // ADD PRODUCT
    @PostMapping
    public Product addProduct(
            @RequestBody Product product
    ) {
        return repo.save(product);
    }

    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct
    ) {

        Product product =
                repo.findById(id)
                        .orElse(null);

        if(product != null) {

            product.setName(
                    updatedProduct.getName()
            );

            product.setDescription(
                    updatedProduct.getDescription()
            );

            product.setCategory(
                    updatedProduct.getCategory()
            );

            product.setPrice(
                    updatedProduct.getPrice()
            );

            product.setDiscount(
                    updatedProduct.getDiscount()
            );

            product.setDiscountType(
                    updatedProduct.getDiscountType()
            );

            product.setImages(
                    updatedProduct.getImages()
            );

            product.setSizes(
                    updatedProduct.getSizes()
            );

            product.setColours(
                    updatedProduct.getColours()
            );

            // NEW FIELDS

            product.setBrand(
                    updatedProduct.getBrand()
            );

            product.setStockQuantity(
                    updatedProduct.getStockQuantity()
            );

            product.setRating(
                    updatedProduct.getRating()
            );

            product.setTotalReviews(
                    updatedProduct.getTotalReviews()
            );

            product.setSku(
                    updatedProduct.getSku()
            );

            product.setSpecifications(
                    updatedProduct.getSpecifications()
            );

            product.setWarranty(
                    updatedProduct.getWarranty()
            );

            product.setSeller(
                    updatedProduct.getSeller()
            );

            product.setSalesCount(
                    updatedProduct.getSalesCount()
            );

            product.setSubCategory(
                    updatedProduct.getSubCategory()
            );

            return repo.save(product);
        }

        return null;
    }

    // DELETE PRODUCT
    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable Long id
    ) {
        repo.deleteById(id);
    }

    // BULK DISCOUNT API
    @PutMapping("/bulk-discount")
    public List<Product> applyBulkDiscount(
            @RequestBody Map<String, Object> payload
    ) {

        List<?> ids =
                (List<?>) payload.get("productIds");

        Double discount =
                Double.valueOf(
                        payload.get("discount")
                                .toString()
                );

        String discountType =
                payload.get("discountType")
                        .toString();

        List<Long> productIds =
                ids.stream()
                        .map(id ->
                                Long.valueOf(
                                        id.toString()
                                )
                        )
                        .toList();

        List<Product> products =
                repo.findAllById(productIds);

        for(Product product : products) {

            product.setDiscount(
                    discount
            );

            product.setDiscountType(
                    discountType
            );
        }

        return repo.saveAll(products);
    }

    // FILTER PRODUCTS
    @GetMapping("/filter")
    public List<Product> filterProducts(

            @RequestParam(required = false)
            String category,

            @RequestParam(required = false)
            String colour,

            @RequestParam(required = false)
            String size,

            @RequestParam(required = false)
            Double minPrice,

            @RequestParam(required = false)
            Double maxPrice
    ) {

        List<Product> products =
                repo.findAll();

        return products.stream()

                .filter(product -> {

                    boolean matches = true;

                    if(category != null &&
                            !category.isEmpty()) {

                        matches =
                                matches &&
                                        product.getCategory()
                                                .equalsIgnoreCase(category);
                    }

                    if(colour != null &&
                            !colour.isEmpty() &&
                            product.getColours() != null) {

                        matches =
                                matches &&
                                        product.getColours()
                                                .toLowerCase()
                                                .contains(
                                                        colour.toLowerCase()
                                                );
                    }

                    if(size != null &&
                            !size.isEmpty() &&
                            product.getSizes() != null) {

                        matches =
                                matches &&
                                        product.getSizes()
                                                .toLowerCase()
                                                .contains(
                                                        size.toLowerCase()
                                                );
                    }

                    if(minPrice != null) {

                        matches =
                                matches &&
                                        product.getPrice()
                                                >= minPrice;
                    }

                    if(maxPrice != null) {

                        matches =
                                matches &&
                                        product.getPrice()
                                                <= maxPrice;
                    }

                    return matches;
                })

                .toList();
    }

    // SEARCH PRODUCTS
    @GetMapping("/search")
    public List<Product> searchProducts(

            @RequestParam String query

    ) {

        List<Product> products =
                repo.findAll();

        return products.stream()

                .filter(product ->

                        product.getName()
                                .toLowerCase()
                                .contains(
                                        query.toLowerCase()
                                )

                                ||

                                product.getCategory()
                                        .toLowerCase()
                                        .contains(
                                                query.toLowerCase()
                                        )

                                ||

                                product.getDescription()
                                        .toLowerCase()
                                        .contains(
                                                query.toLowerCase()
                                        )
                )

                .toList();
    }

    // SORT PRODUCTS
    @GetMapping("/sort")
    public List<Product> sortProducts(

            @RequestParam String sortBy

    ) {

        List<Product> products =
                repo.findAll();

        switch (sortBy) {

            case "priceLowToHigh":

                return products.stream()

                        .sorted(
                                Comparator.comparingDouble(
                                        Product::getPrice
                                )
                        )

                        .toList();

            case "priceHighToLow":

                return products.stream()

                        .sorted(
                                Comparator.comparingDouble(
                                        Product::getPrice
                                ).reversed()
                        )

                        .toList();

            case "discounted":

                return products.stream()

                        .filter(
                                product ->
                                        product.getDiscount() != null
                                                &&
                                                product.getDiscount() > 0
                        )

                        .toList();

            case "recommended":
            default:

                return products;
        }
    }

    // UPDATE STOCK ONLY
    @PutMapping("/{id}/stock")
    public Product updateStock(
            @PathVariable Long id,
            @RequestBody Map<String,Integer> payload
    ) {

        Product product =
                repo.findById(id)
                        .orElse(null);

        if(product == null) {
            return null;
        }

        product.setStockQuantity(
                payload.get("stockQuantity")
        );



        return repo.save(product);
    }

    @GetMapping("/related/{id}")
    public List<Product> getRelatedProducts(
            @PathVariable Long id
    ) {

        Product product =
                repo.findById(id)
                        .orElse(null);

        if(product == null)
            return List.of();

        return repo.findAll()
                .stream()
                .filter(p ->
                        !p.getId().equals(id)
                )
                .filter(p ->
                        p.getCategory() != null
                                &&
                                p.getCategory()
                                        .equalsIgnoreCase(
                                                product.getCategory()
                                        )
                )
                .filter(p ->
                        p.getSubCategory() != null
                                &&
                                p.getSubCategory()
                                        .equalsIgnoreCase(
                                                product.getSubCategory()
                                        )
                )
                .limit(8)
                .toList();
    }

    @GetMapping("/recommended/{userId}")
    public List<Product> getRecommendedProducts(
            @PathVariable Long userId
    ) {

        List<Order> orders =
                orderRepository.findByUserId(userId);

        if(orders.isEmpty()) {

            return repo.findAll()
                    .stream()
                    .limit(8)
                    .toList();
        }

        Map<String, Integer> categoryCount =
                new java.util.HashMap<>();

        for(Order order : orders) {

            for(OrderItem item :
                    order.getItems()) {

                Product product =
                        repo.findById(
                                item.getProductId()
                        ).orElse(null);

                if(product != null) {

                    String category =
                            product.getCategory();

                    categoryCount.put(
                            category,
                            categoryCount.getOrDefault(
                                    category,
                                    0
                            ) + 1
                    );
                }
            }
        }

        String favouriteCategory =
                categoryCount.entrySet()
                        .stream()
                        .max(
                                Map.Entry.comparingByValue()
                        )
                        .map(
                                Map.Entry::getKey
                        )
                        .orElse(null);

        if(favouriteCategory == null) {

            return repo.findAll()
                    .stream()
                    .limit(8)
                    .toList();
        }

        return repo.findAll()
                .stream()
                .filter(product ->

                        product.getCategory() != null

                                &&

                                product.getCategory()
                                        .equalsIgnoreCase(
                                                favouriteCategory
                                        )
                )
                .limit(8)
                .toList();
    }

    @GetMapping("/recommendations/wishlist/{userId}")
    public List<Product> getWishlistRecommendations(
            @PathVariable Long userId
    ) {

        List<Wishlist> wishlistItems =
                wishlistRepository.findByUserId(userId);

        if(wishlistItems.isEmpty()) {

            return repo.findAll()
                    .stream()
                    .limit(8)
                    .toList();
        }

        Set<Long> wishlistProductIds =
                new HashSet<>();

        Set<String> categories =
                new HashSet<>();

        Set<String> brands =
                new HashSet<>();

        for(Wishlist item : wishlistItems) {

            wishlistProductIds.add(
                    item.getProductId()
            );

            Product product =
                    repo.findById(
                            item.getProductId()
                    ).orElse(null);

            if(product != null) {

                if(product.getCategory() != null) {

                    categories.add(
                            product.getCategory()
                    );
                }

                if(product.getBrand() != null) {

                    brands.add(
                            product.getBrand()
                    );
                }
            }
        }

        return repo.findAll()
                .stream()

                // Don't recommend already wishlisted items
                .filter(product ->
                        !wishlistProductIds.contains(
                                product.getId()
                        )
                )

                // Match category OR brand
                .filter(product ->

                        categories.contains(
                                product.getCategory()
                        )

                                ||

                                brands.contains(
                                        product.getBrand()
                                )
                )

                .limit(8)

                .toList();
    }
}